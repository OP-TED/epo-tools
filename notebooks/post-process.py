import marimo

__generated_with = "0.13.9"
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
    from rdflib import Graph, BNode, URIRef
    from typing import Tuple
    return BNode, Graph, Tuple, URIRef, glob_lib


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    return


@app.cell
def _(mo):
    mo.md(r"""# ePO OWL v5.0.0-RC1 postprocessing script""")
    return


@app.cell
def _(glob_lib):
    ontology_files = glob_lib.glob("assets/release/5.0.0/implementation/**/owl_ontology/*.ttl", recursive=True)
    return (ontology_files,)


@app.cell
def _(Graph):
    def load_graph(path):
        g = Graph()
        g.parse(path, format="turtle")
        return {
                'path':path,
                'graph':g
        }
    return (load_graph,)


@app.cell
def _(load_graph, ontology_files):
    results = [load_graph(path) for path in ontology_files]
    return (results,)


@app.cell
def _(results):
    results
    return


@app.cell
def _(filter_dataset, mo, results):
    unwanted_display = [
        mo.md("# The following elements were found and are to be filtered out since they redefine external vocabs")
    ]
    for current in results:
        wanted, unwanted = filter_dataset(current['graph'])
        #print(len(wanted), len(unwanted))
        if(len(unwanted)):
            current = mo.md(f"""
    ## File path: {current['path']}

    Elements to be filtered out

    ```turtle
    {unwanted.serialize()}
    ```

    """)
            unwanted_display.append(current)

    mo.vstack(unwanted_display)
    return


@app.cell
def _():
    return


@app.cell
def _(mo):
    mo.md(r"""# Notebook implementation""")
    return


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


if __name__ == "__main__":
    app.run()
