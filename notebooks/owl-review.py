import marimo

__generated_with = "0.12.10"
app = marimo.App(width="full", app_title="OWL Review", auto_download=["html"])


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
    return Graph, glob_lib, json, os


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    return (pretty_query,)


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
    ontology_files_pattern = mo.ui.text("assets/release/5.0.0/implementation/**/owl_ontology/*.ttl", full_width=True)
    return (ontology_files_pattern,)


@app.cell
def _(glob_lib, mo, ontology_files_pattern):
    release_files = glob_lib.glob(ontology_files_pattern.value, recursive=True)
    table = mo.ui.table(
        data=release_files, 
        pagination=True, 
    )
    mo.vstack([
        ontology_files_pattern, 
        table
    ])
    return release_files, table


@app.cell
def _(mo):
    mo.md(
        r"""
        # List of redefined external vocabularies

        Compromised files

        - assets/release/5.0.0/implementation/eCatalogue/owl_ontology/eCatalogue_restrictions.ttl
        - assets/release/5.0.0/implementation/eAccess/owl_ontology/eAccess_restrictions.ttl
        - assets/release/5.0.0/implementation/ePO_core/owl_ontology/ePO_core_restrictions.ttl


        """
    )
    return


@app.cell
def _(Graph, mo, pretty_query, table):


    results = []

    for path in table.value:
        g = Graph()
        g.parse(path, format="turtle")
        current = pretty_query({
            "title": f"""### {path}    
            """,
            "query": """PREFIX a4g: <http://data.europa.eu/a4g/ontology#>

               SELECT ?s ?p ?o
                WHERE {
                    ?s ?p ?o
                    FILTER (isURI(?s) && (!STRSTARTS(str(?s), str(a4g:))))
                }
            """
        }, graph=g)
        results.append(current)
    mo.vstack(results)
    return current, g, path, results


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
