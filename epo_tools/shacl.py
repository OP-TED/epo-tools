from rdflib import Graph, RDF, URIRef, RDFS
from rdflib.namespace import SH
from rdflib import Graph, URIRef, BNode, RDF, Namespace
import marimo as mo

SH = Namespace("http://www.w3.org/ns/shacl#")

def extract_subgraph(g: Graph, root) -> Graph:
    """Recursively extracts all SHACL-related triples connected to the given root node."""
    subg = Graph()
    visited = set()

    def traverse(node):
        if node in visited:
            return
        visited.add(node)

        for p, o in g.predicate_objects(subject=node):
            subg.add((node, p, o))

            # Recurse into blank nodes
            if isinstance(o, BNode):
                traverse(o)

            # Optionally recurse into shapes pointed to by sh:node, sh:property, etc.
            # even if they are URIRefs (you can adjust this based on your data model)
            if p in {
                SH.property, SH.node, SH.or_, SH.and_, SH.not_, SH.xone, SH.qualifiedValueShape
            }:
                if isinstance(o, (BNode, URIRef)):
                    traverse(o)

    traverse(root)
    return subg

def pretty_node(n, g):
    # Define the shape node to extract
    uri = URIRef(n['uri'])
    message = n['message']
    # Extract and serialize the subgraph
    subg = extract_subgraph(g, uri)
    return mo.md(f"""
## {uri}

{message}

```turtle
{subg.serialize(format="turtle")}
```
""")
