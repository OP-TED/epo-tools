

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
        # ePO SHACL v5.0.0-RC1

        ## Minimal Quality checks

        Corresponds to a list of scripts that check for regressions
        """
    )
    return


@app.cell
def _(mo):
    shacl_files_pattern = mo.ui.text("assets/release/5.0.0/implementation/**/shacl_shapes/*.ttl", full_width=True)
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
            "title": "## Missing sh:nodeKind sh:IRI in properties that point to a class",
            "query": """

    PREFIX sh: <http://www.w3.org/ns/shacl#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:PropertyShape ;
               sh:class ?class .
        FILTER NOT EXISTS { ?shape sh:nodeKind sh:IRI }
    }

            """
        }, graph=g)
    return


@app.cell
def _(g, pretty_query):
    pretty_query({
            "title": "## Missing rdfs:isDefinedBy to connect to metadata",
            "query": """

    PREFIX sh: <http://www.w3.org/ns/shacl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:PropertyShape .
        FILTER NOT EXISTS { ?shape rdfs:isDefinedBy ?def }
    }


            """
        }, graph=g)
    return


@app.cell
def _(g, pretty_query):
    pretty_query({
            "title": "## Current node shape naming",
            "query": """

    PREFIX sh: <http://www.w3.org/ns/shacl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?shape 
           (STRAFTER(STR(?shape), "#") AS ?shapeName)
           (IF(STRENDS(?shapeName, "Shape"),
               ?shapeName,
               CONCAT(?shapeName, "Shape")) AS ?shapeProperName)
    WHERE {
        ?shape a sh:NodeShape .
    
        # Filter out shapes that don't have a fragment identifier (#)
        FILTER(CONTAINS(STR(?shape), "#"))
    
        # Alternative if shapes use / instead of #
        # BIND(STRAFTER(STR(?shape), "/") AS ?shapeName)
    }
    ORDER BY ?shapeName


            """
        }, graph=g)
    return


@app.cell
def _(g, pretty_query):
    pretty_query({
            "title": "## Current property naming",
            "query": """

    PREFIX sh: <http://www.w3.org/ns/shacl#>
    PREFIX fn: <http://www.w3.org/2005/xpath-functions#>

    SELECT ?shape ?name (
        CONCAT(
            UCASE(SUBSTR(?transformedName, 1, 1)),
            SUBSTR(?transformedName, 2)
        ) AS ?properName
    )
    WHERE {
        ?shape a sh:PropertyShape ;
               sh:name ?name .
    
        # Split CamelCase into spaces
        BIND(REPLACE(?name, 
            "([a-z])([A-Z])",
            "$1 $2"
        ) AS ?splitCamel)
    
        # Convert to lowercase and clean up
        BIND(LCASE(?splitCamel) AS ?transformedName)
    }


            """
        }, graph=g)
    return


if __name__ == "__main__":
    app.run()
