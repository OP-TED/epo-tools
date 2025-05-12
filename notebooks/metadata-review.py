

import marimo

__generated_with = "0.12.10"
app = marimo.App(width="full", app_title="SHACL review")


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
        # ePO Metadata v5.0.0-RC1

        ## Minimal Quality checks

        Corresponds to a list of scripts that check for regressions
        """
    )
    return


@app.cell
def _(mo):
    shacl_files_pattern = mo.ui.text("assets/release/5.0.0/implementation/**/*.ttl", full_width=True)
    return (shacl_files_pattern,)


@app.cell
def _(glob_lib, mo, shacl_files_pattern):
    shacl_files = glob_lib.glob(shacl_files_pattern.value, recursive=True)
    table = mo.ui.table(
        data=shacl_files, 
        pagination=True, 
    )
    mo.vstack([
        shacl_files_pattern,
        table
    ])
    return shacl_files, table


@app.cell
def _(table):
    table.value
    return


@app.cell
def _(Graph, table):
    g = Graph()

    for path in table.value:
        g.parse(path, format="turtle")
    return g, path


@app.cell
def _(g, pretty_query):
    pretty_query({
            "title": "## Metadata",
            "query": """

    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX vann: <http://purl.org/vocab/vann/>

    SELECT DISTINCT 
        ?ontology 
        ?title 
        ?label 
        ?versionInfo 
        ?versionIRI
        ?description 
        ?issued 
        ?created
        ?license
        ?rights
        ?preferredNamespaceUri
        ?preferredNamespacePrefix
        (GROUP_CONCAT(DISTINCT ?import; separator=", ") as ?imports)
        (GROUP_CONCAT(DISTINCT ?seeAlso; separator=", ") as ?documentation)
        ?comment
    WHERE {
        ?ontology a owl:Ontology .

        OPTIONAL { ?ontology dcterms:title ?title }
        OPTIONAL { ?ontology rdfs:label ?label }
        OPTIONAL { ?ontology owl:versionInfo ?versionInfo }
        OPTIONAL { ?ontology owl:versionIRI ?versionIRI }
        OPTIONAL { ?ontology dcterms:description ?description }
        OPTIONAL { ?ontology dcterms:issued ?issued }
        OPTIONAL { ?ontology dcterms:created ?created }
        OPTIONAL { ?ontology dcterms:license ?license }
        OPTIONAL { ?ontology dcterms:rights ?rights }
        OPTIONAL { ?ontology vann:preferredNamespaceUri ?preferredNamespaceUri }
        OPTIONAL { ?ontology vann:preferredNamespacePrefix ?preferredNamespacePrefix }
        OPTIONAL { ?ontology owl:imports ?import }
        OPTIONAL { ?ontology rdfs:seeAlso ?seeAlso }
        OPTIONAL { ?ontology rdfs:comment ?comment }
    }
    GROUP BY ?ontology ?title ?label ?versionInfo ?versionIRI ?description 
             ?issued ?created ?license ?rights ?preferredNamespaceUri 
             ?preferredNamespacePrefix ?comment

            """
        }, graph=g)
    return


if __name__ == "__main__":
    app.run()
