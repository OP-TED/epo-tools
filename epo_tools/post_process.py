from typing import Tuple
from rdflib import Graph, BNode, Namespace, URIRef, Literal
from rdflib.namespace import RDF, RDFS, OWL
import re

def filter_dataset(dataset: Graph) -> Tuple[Graph, Graph]:
    """
    Split a dataset into wanted and unwanted parts based on redefined triples.

    Args:
        dataset: Original dataset to be filtered

    Returns:
        Tuple of (wanted, unwanted) graphs
    """
    # Create new graphs for results
    unwanted = Graph()
    wanted = Graph()

    # Get redefined triples
    query = """
    CONSTRUCT {?s ?p ?o}
    WHERE {
        ?s ?p ?o
        FILTER (isURI(?s) && (!STRSTARTS(str(?s), str("http://data.europa.eu/a4g/ontology#"))))
    }
    """
    redefined = dataset.query(query).graph

    # Get all subjects from redefined graph
    subjects = set(redefined.subjects())

    def should_traverse(subject):
        # Don't follow subjects starting with a4g: unless they're blank nodes
        if isinstance(subject, BNode):
            return True
        if isinstance(subject, URIRef):
            return not str(subject).startswith("http://data.europa.eu/a4g/ontology#")
        return False

    # Helper function to recursively collect unwanted triples
    def collect_unwanted(subject):
        for s, p, o in dataset.triples((subject, None, None)):
            unwanted.add((s, p, o))
            if should_traverse(o):
                collect_unwanted(o)

    # Process each subject from redefined graph
    for subject in subjects:
        collect_unwanted(subject)

    # Wanted is everything in dataset that's not in unwanted
    for triple in dataset:
        if triple not in unwanted:
            wanted.add(triple)

    return wanted, unwanted

def add_node_iri(graph):
    """
    Returns a copy of the graph where all PropertyShapes that have sh:class
    also explicitly include sh:nodeKind sh:IRI, if not already present.

    Parameters:
    - graph (rdflib.Graph): Input SHACL graph

    Returns:
    - rdflib.Graph: Postprocessed graph with added sh:nodeKind sh:IRI where needed
    """
    SH = Namespace("http://www.w3.org/ns/shacl#")

    # Create a new graph and copy all original triples
    new_graph = Graph()
    for triple in graph:
        new_graph.add(triple)

    # Query shapes missing nodeKind
    query = """
    PREFIX sh: <http://www.w3.org/ns/shacl#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:PropertyShape ;
               sh:class ?class .
        FILTER NOT EXISTS { ?shape sh:nodeKind sh:IRI }
    }
    """

    results = graph.query(query)
    for row in results:
        shape = row["shape"]
        new_graph.add((shape, SH.nodeKind, SH.IRI))

    return new_graph


def add_isDefinedBy(graph):
    """
    Returns a copy of the graph where all PropertyShapes missing rdfs:isDefinedBy
    get it set to the ontology IRI found in the graph.

    Assumes exactly one ontology IRI declared with a triple like:
    <ontologyIRI> a owl:Ontology .

    Parameters:
    - graph (rdflib.Graph): Input RDF graph

    Returns:
    - rdflib.Graph: Graph with added rdfs:isDefinedBy where missing
    """
    SH = Namespace("http://www.w3.org/ns/shacl#")

    # Find ontology IRI in the graph
    ontology_iris = list(graph.subjects(RDF.type, OWL.Ontology))
    if not ontology_iris:
        raise ValueError("No owl:Ontology IRI found in the graph.")
    # Take the first one (assuming exactly one)
    ontology_iri = ontology_iris[0]

    new_graph = Graph()
    for triple in graph:
        new_graph.add(triple)

    query = """
    PREFIX sh: <http://www.w3.org/ns/shacl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:PropertyShape .
        FILTER NOT EXISTS { ?shape rdfs:isDefinedBy ?def }
    }
    """

    results = graph.query(query)
    for row in results:
        shape = row["shape"]
        new_graph.add((shape, RDFS.isDefinedBy, ontology_iri))

    return new_graph

def fix_shape_names(graph):
    """
    Returns a new graph where sh:NodeShape IRIs are renamed to ensure
    their local name ends with 'Shape'.

    For example:
    http://example.org#MyNode  ->  http://example.org#MyNodeShape

    Parameters:
    - graph (rdflib.Graph): Input RDF graph

    Returns:
    - rdflib.Graph: Graph with renamed shapes
    """
    SH = Namespace("http://www.w3.org/ns/shacl#")

    new_graph = Graph()

    # Find all NodeShapes with '#' in their IRI
    query = """
    PREFIX sh: <http://www.w3.org/ns/shacl#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:NodeShape .
        FILTER(CONTAINS(STR(?shape), "#"))
    }
    """

    rename_map = {}
    for row in graph.query(query):
        shape_iri = row["shape"]
        shape_str = str(shape_iri)
        local_name = shape_str.split("#")[-1]
        if not local_name.endswith("Shape"):
            new_local_name = local_name + "Shape"
            new_iri = URIRef(shape_str.rsplit("#", 1)[0] + "#" + new_local_name)
            rename_map[shape_iri] = new_iri

    # Now copy all triples, replacing old IRIs with new IRIs where applicable
    for s, p, o in graph:
        s_new = rename_map.get(s, s)
        if isinstance(o, URIRef):
            o_new = rename_map.get(o, o)
        else:
            o_new = o
        new_graph.add((s_new, p, o_new))

    return new_graph


def fix_propertyshape_names(graph):
    SH = Namespace("http://www.w3.org/ns/shacl#")
    new_graph = Graph()

    # Copy all triples first
    for s, p, o in graph:
        new_graph.add((s, p, o))

    # Regex to split camel case but keep acronyms together
    camel_split_regex = re.compile(r'''
        ([A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|[0-9]+)
    ''', re.VERBOSE)

    for shape in graph.subjects(RDF.type, SH.PropertyShape):
        for name_literal in graph.objects(shape, SH.name):
            if not isinstance(name_literal, Literal):
                continue
            old_name = str(name_literal)

            # Split into tokens preserving acronyms
            tokens = camel_split_regex.findall(old_name)
            # Process tokens: keep acronyms uppercase, lowercase others
            processed_tokens = [
                t if t.isupper() else t.lower()
                for t in tokens
            ]

            # Join with space
            spaced = " ".join(processed_tokens)
            # Capitalize first letter of whole string
            proper_name = spaced[:1].upper() + spaced[1:] if spaced else spaced

            if proper_name != old_name:
                new_graph.remove((shape, SH.name, name_literal))
                new_graph.add((shape, SH.name, Literal(proper_name)))

    return new_graph

def fix_metadata_imports(g, metadata_nodes):
    """
    Add owl:imports to each ontology metadata node for all other ontology IRIs
    found in the graph, excluding itself.

    Parameters:
    - g (rdflib.Graph): input graph (will be modified in place)

    Returns:
    - rdflib.Graph: same graph after modification
    """
    # Find all ontology nodes
    ontology_nodes = list(g.subjects(RDF.type, OWL.Ontology))

    for ontology_node in ontology_nodes:
        # Collect all other ontology nodes except itself
        other_ontologies = [o for o in metadata_nodes if o != ontology_node]

        # Remove any existing owl:imports triples on this node (optional, to avoid duplicates)
        g.remove((ontology_node, OWL.imports, None))

        # Add owl:imports triples for all others
        for other in other_ontologies:
            g.add((ontology_node, OWL.imports, other))

    return g
