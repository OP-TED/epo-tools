import marimo

__generated_with = "0.13.9"
app = marimo.App(width="full", app_title="OWL Review")


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _():
    import os
    import json
    import glob as glob_lib
    from rdflib import Graph
    return Graph, glob_lib


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    from epo_tools.post_process import filter_dataset
    return filter_dataset, pretty_query


@app.cell
def _(mo):
    mo.md(
        r"""
    # ePO OWL v5.0.0-RC1

    ## Minimal Quality checks

    Corresponds to a list of scripts that check for regressions
    """
    )
    return


@app.cell
def _(mo):
    ontology_files_pattern = mo.ui.text(
        "assets/release/5.0.0/implementation/**/owl_ontology/*.ttl", full_width=True
    )
    return (ontology_files_pattern,)


@app.cell
def _(glob_lib, mo, ontology_files_pattern):
    release_files = glob_lib.glob(ontology_files_pattern.value, recursive=True)
    table = mo.ui.table(
        data=release_files,
        pagination=True,
    )
    mo.vstack([ontology_files_pattern, table])
    return (table,)


@app.cell
def _(Graph, table):
    def load_graph(path):
        g = Graph()
        g.parse(path, format="turtle")
        return {"path": path, "graph": g}


    results = [load_graph(path) for path in table.value]
    return (results,)


@app.cell
def _(Graph, results):
    all_graphs = Graph()
    for _ in results:
        all_graphs = all_graphs + _["graph"]
    return (all_graphs,)


@app.cell
def _(filter_dataset, mo, results):
    unwanted_display = [
        mo.md(
            "# The following elements were found and need to be filtered out since they redefine external vocabs"
        )
    ]
    for current in results:
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
            unwanted_display.append(current)

    mo.vstack(unwanted_display)
    return


@app.cell
def _(all_graphs, pretty_query):
    pretty_query(
        {
            "title": f"""## Missing isDefinedBy

                """,
            "query": """
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?entity
    WHERE {
      {
        ?entity a owl:Class .
      }
      UNION
      {
        ?entity a owl:ObjectProperty .
      }
      FILTER NOT EXISTS { ?entity rdfs:isDefinedBy ?def }
      FILTER isIRI(?entity)
    }

    """,
        },
        graph=all_graphs,
    )
    return


if __name__ == "__main__":
    app.run()
