import marimo

__generated_with = "0.13.15"
app = marimo.App(
    width="full",
    app_title="Postprocess",
    css_file="../marimo-custom.css",
)


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _():
    import os
    import json
    import glob as glob_lib
    from typing import Tuple
    import zipfile
    from rdflib.namespace import RDF, RDFS, OWL
    from datetime import datetime
    from rdflib import Graph, BNode, Namespace, URIRef, Literal
    import re
    return (
        BNode,
        Graph,
        Literal,
        Namespace,
        OWL,
        RDF,
        RDFS,
        Tuple,
        URIRef,
        datetime,
        glob_lib,
        os,
        re,
        zipfile,
    )


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    return


@app.cell
def _(mo):
    mo.md(
        r"""
    # Post-processing script

    What this script does:

    ## OWL

    1. Remove redefinitions of external vocabularies

    ## SHACL 

    1. add node-iri
    2. add isDefinedBy
    3. fix shape names
    4. fix propertyshape names

    ## Packaging

    - Prepare a zip file to send to the Cellar team. Currently Cellar requires the OWL ontology to publish in Cellar-triplestore and in the Vocabulary portal. SHACL is published only in Vocabulary portal.
    """
    )
    return


@app.cell
def _(mo):
    mo.md(r"""# Config""")
    return


@app.cell
def _():
    version = "5.2.0"
    return (version,)


@app.cell
def _(glob_lib, version):
    ontology_files = glob_lib.glob(
        f"assets/release/{version}/implementation/**/owl_ontology/*.ttl",
        recursive=True,
    )
    return (ontology_files,)


@app.cell
def _(glob_lib, version):
    shacl_files = glob_lib.glob(
        f"assets/release/{version}/implementation/**/shacl_shapes/*.ttl",
        recursive=True,
    )
    return (shacl_files,)


@app.cell
def _(mo):
    do_postprocessing = mo.ui.run_button(label="Do postprocessing")
    do_postprocessing
    return (do_postprocessing,)


@app.cell
def _(
    datetime,
    do_postprocessing,
    ontology_graphs_result,
    prepare_patch,
    prepare_zip,
    shacl_graphs_result,
    version,
    write_combined_turtle_file,
):
    if do_postprocessing.value:
        prepare_zip(
            ontology_graphs_result, f"assets/ePO {version} artefacts - owl.zip"
        )
        prepare_patch(ontology_graphs_result)
        prepare_zip(
            shacl_graphs_result, f"assets/ePO {version} artefacts - shacl.zip"
        )
        prepare_patch(shacl_graphs_result)
        write_combined_turtle_file(shacl_graphs_result,f"assets/ePO {version} combined - shacl.ttl")
        this_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"Finished at: {this_date}")
    return


@app.cell
def _(mo, version):
    mo.md(rf"""# ePO SHACL v{version} postprocessing script""")
    return


@app.cell
def _(Namespace):
    def serialize_with_prefixes(g, format="turtle"):
        g.bind("epo", Namespace("http://data.europa.eu/a4g/ontology#"))
        g.bind("epo-shape", Namespace("http://data.europa.eu/a4g/data-shape#"))
        g.bind("adms", Namespace("http://www.w3.org/ns/adms#"))
        g.bind("xsd", Namespace("http://www.w3.org/2001/XMLSchema#"))
        return g.serialize(format=format)
    return (serialize_with_prefixes,)


@app.cell
def _(mo, shacl_files):
    mo.md(
        rf"""
    ## Current SHACL files

    {mo.ui.data_editor(shacl_files)}
    """
    )
    return


@app.cell
def _(load_graphs, shacl_files):
    shacl_graphs = load_graphs(shacl_files)
    return (shacl_graphs,)


@app.cell
def _(OWL, RDF):
    def get_ontology_metadata_iris(graphs):
        ontology_iris = []
        for g in graphs:
            for ontology_node in g.subjects(RDF.type, OWL.Ontology):
                ontology_iris.append(ontology_node)
        return ontology_iris
    return (get_ontology_metadata_iris,)


@app.cell
def _(get_ontology_metadata_iris, shacl_graphs):
    metadata_nodes = get_ontology_metadata_iris(
        [item["graph"] for item in shacl_graphs]
    )
    return (metadata_nodes,)


@app.cell
def _(
    add_isDefinedBy,
    add_node_iri,
    fix_metadata_imports,
    fix_propertyshape_names,
    fix_shape_names,
    pipe,
):
    def process_shacl(graph, metadata_nodes):
        return pipe(
            graph,
            add_node_iri,
            add_isDefinedBy,
            fix_shape_names,
            fix_propertyshape_names,
            lambda g: fix_metadata_imports(g, metadata_nodes),
        )
    return (process_shacl,)


@app.cell
def _(metadata_nodes, process_shacl, shacl_graphs):
    shacl_graphs_result = [
        {
            "path": item["path"],
            "graph": process_shacl(item["graph"], metadata_nodes),
        }
        for item in shacl_graphs
    ]
    return (shacl_graphs_result,)


@app.cell
def _(mo):
    mo.md(r"""# ePO OWL v5.0.0-RC1 postprocessing script""")
    return


@app.cell
def _(mo, ontology_files):
    mo.md(
        rf"""
    ## Current OWL files

    {mo.ui.data_editor(ontology_files)}
    """
    )
    return


@app.cell
def _(load_graphs, ontology_files):
    ontology_graphs = load_graphs(ontology_files)
    return (ontology_graphs,)


@app.cell
def _(filter_dataset):
    def process_ontology(graph):
        wanted, unwanted = filter_dataset(graph)
        return wanted
    return (process_ontology,)


@app.cell
def _(ontology_graphs, process_ontology):
    ontology_graphs_result = [
        {
            "path": item["path"],
            "graph": process_ontology(item["graph"]),
        }
        for item in ontology_graphs
    ]
    return (ontology_graphs_result,)


@app.cell
def _(mo):
    mo.md(r"""# Notebook implementation""")
    return


@app.cell
def _(os, serialize_with_prefixes, zipfile):
    def prepare_zip(results, output_zip_path):
        with zipfile.ZipFile(output_zip_path, "w") as zipf:
            for current in results:
                try:
                    g = current["graph"]
                    file_path = current["path"]
                    base_name = os.path.basename(file_path)
                    rdf_name = os.path.splitext(base_name)[0] + ".rdf"
                    rdf_data = serialize_with_prefixes(g, format="xml")
                    zipf.writestr(rdf_name, rdf_data)
                    print(f"✔ Converted and added: {rdf_name}")
                except Exception as e:
                    print(f"✖ Failed to process {file_path}: {e}")
            print(f"✔ Wrote: {output_zip_path}")
    return (prepare_zip,)


@app.cell
def _(Graph, os, serialize_with_prefixes):
    def write_combined_turtle_file(results, output_ttl_path):
        combined_graph = Graph()

        for current in results:
            try:
                g = current["graph"]
                file_path = current["path"]

                if not file_path.startswith("assets/release"):
                    print(f"✖ Unexpected file path structure: {file_path}")
                    continue

                combined_graph += g
                print(f"✔ Added graph from: {file_path}")

            except Exception as e:
                print(f"✖ Failed to process {file_path}: {e}")

        try:
            os.makedirs(os.path.dirname(output_ttl_path), exist_ok=True)

            with open(output_ttl_path, "w", encoding="utf-8") as f:
                f.write(serialize_with_prefixes(combined_graph, format="turtle"))

            print(f"✔ Written combined Turtle file: {output_ttl_path}")
        except Exception as e:
            print(f"✖ Failed to write combined Turtle file: {e}")
    return (write_combined_turtle_file,)


@app.cell
def _(os, serialize_with_prefixes):
    def prepare_patch(
        results,
        transform_path=lambda path: path.replace(
            "assets/release", "assets/patch", 1
        ),
    ):
        for current in results:
            try:
                g = current["graph"]
                file_path = current["path"]

                if not file_path.startswith("assets/release"):
                    print(f"✖ Unexpected file path structure: {file_path}")
                    continue

                patch_path = transform_path(file_path)
                os.makedirs(os.path.dirname(patch_path), exist_ok=True)

                base_name = os.path.basename(file_path)
                name_no_ext = os.path.splitext(base_name)[0]

                ttl_path = os.path.join(
                    os.path.dirname(patch_path), name_no_ext + ".ttl"
                )
                rdf_path = os.path.join(
                    os.path.dirname(patch_path), name_no_ext + ".rdf"
                )

                with open(ttl_path, "w", encoding="utf-8") as f:
                    f.write(serialize_with_prefixes(g, format="turtle"))
                print(f"✔ Written Turtle file: {ttl_path}")

                with open(rdf_path, "w", encoding="utf-8") as f:
                    f.write(serialize_with_prefixes(g, format="xml"))
                print(f"✔ Written RDF/XML file: {rdf_path}")

            except Exception as e:
                print(f"✖ Failed to process {file_path}: {e}")
    return (prepare_patch,)


@app.cell
def _(filter_dataset, mo):
    def display_unwanted(ontology_graphs):
        result = [
            mo.md(
                "# The following elements were found and need to be filtered out since they redefine external vocabs"
            )
        ]
        for current in ontology_graphs:
            wanted, unwanted = filter_dataset(current["graph"])
            # print(len(wanted), len(unwanted))
            if len(unwanted):
                current = mo.md(f"""
    ## File path: {current["path"]}

    Elements to be filtered out

    ```turtle
    {unwanted.serialize()}
    ```

        """)
                result.append(current)
        return mo.vstack(result)
    return


@app.cell
def _(Graph):
    def load_graph(path):
        g = Graph()
        g.parse(path, format="turtle")
        return {"path": path, "graph": g}


    def load_graphs(paths):
        return [load_graph(path) for path in paths]
    return (load_graphs,)


@app.cell
def _():
    from functools import reduce


    def pipe(value, *functions):
        return reduce(lambda v, f: f(v), functions, value)
    return (pipe,)


@app.cell
def _(BNode, Graph, Tuple, URIRef):
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
    return (filter_dataset,)


@app.cell
def _(Graph, Namespace):
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
    return (add_node_iri,)


@app.cell
def _(Graph, Namespace, OWL, RDF, RDFS):
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
    return (add_isDefinedBy,)


@app.cell
def _(Graph, Namespace, URIRef):
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
    return (fix_shape_names,)


@app.cell
def _(Graph, Literal, Namespace, RDF, re):
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
    return (fix_propertyshape_names,)


@app.cell
def _(OWL, RDF):
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

    return (fix_metadata_imports,)


if __name__ == "__main__":
    app.run()
