import marimo

__generated_with = "0.13.15"
app = marimo.App(width="full", app_title="Metadata display")


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
    from epo_tools.widgets import pretty_query, pretty_query_table
    return pretty_query, pretty_query_table


@app.cell
def _():
    version = "5.2.0"
    return (version,)


@app.cell
def _(mo, version):
    mo.md(
        rf"""
    # ePO Metadata v{version}

    ## Minimal Quality checks

    Corresponds to a list of scripts that check for regressions
    """
    )
    return


@app.cell
def _():
    files_pattern = "assets/release/5.2.0/implementation/**/*.ttl"
    # files_pattern = "assets/debug/**/*.ttl"
    return (files_pattern,)


@app.cell
def _(files_pattern, glob_lib):
    files = glob_lib.glob(files_pattern, recursive=True)
    files
    return (files,)


@app.cell
def _(Graph, files):
    g = Graph()

    for path in files:
        g.parse(path, format="turtle")
    return (g,)


@app.cell
def _(g, metadata_summary, mo):
    mo.md(
        rf"""
    ## Summary of the current metadata

    {metadata_summary}

    - Results: {len(metadata_summary.data)}
    - Total triple count {len(g)}
    """
    )
    return


@app.cell
def _(g, pretty_query_table):
    metadata_summary = pretty_query_table(
        """    
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
        ?modified
        ?license
        ?rights
        ?preferredNamespaceUri
        ?preferredNamespacePrefix
        (GROUP_CONCAT(DISTINCT ?import; separator=", ") as ?imports)
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
        OPTIONAL { ?ontology dcterms:modified ?modified }
        OPTIONAL { ?ontology dcterms:license ?license }
        OPTIONAL { ?ontology dcterms:rights ?rights }
        OPTIONAL { ?ontology vann:preferredNamespaceUri ?preferredNamespaceUri }
        OPTIONAL { ?ontology vann:preferredNamespacePrefix ?preferredNamespacePrefix }
        OPTIONAL { ?ontology owl:imports ?import }
        OPTIONAL { ?ontology rdfs:comment ?comment }
    }
    GROUP BY ?ontology ?title ?label ?versionInfo ?versionIRI ?description 
             ?issued ?created ?modified ?license ?rights ?preferredNamespaceUri 
             ?preferredNamespacePrefix ?comment
            """,
        graph=g,
    )
    return (metadata_summary,)


@app.cell
def _(g, pretty_query):
    pretty_query(
        {
            "title": """## All also links        
            """,
            "query": """

    SELECT DISTINCT ?seeAlso
    WHERE {
        ?ontology a owl:Ontology .
        ?ontology rdfs:seeAlso ?seeAlso .
    }

            """,
        },
        graph=g,
    )
    return


@app.cell
def _(g, pretty_query):
    pretty_query(
        {
            "title": """## All Imports

            SHACL 

            """,
            "query": """

    SELECT DISTINCT ?ontology ?import
    WHERE {
        ?ontology a owl:Ontology .
        ?ontology owl:imports ?import .
    }

            """,
        },
        graph=g,
    )
    return


if __name__ == "__main__":
    app.run()
