

import marimo

__generated_with = "0.12.10"
app = marimo.App(
    width="full",
    app_title="Metadata display",
    auto_download=["html"],
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
    files_pattern = mo.ui.text("assets/release/5.0.0/implementation/**/*.ttl", full_width=True)
    return (files_pattern,)


@app.cell
def _(files_pattern, glob_lib, mo):
    files = glob_lib.glob(files_pattern.value, recursive=True)
    table = mo.ui.table(
        data=files, 
        pagination=True, 
    )
    mo.vstack([
        files_pattern,
        table
    ])
    return files, table


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


@app.cell(hide_code=True)
def _(g, pretty_query):
    pretty_query({
            "title": "## Summary of the current metadata",
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

            """
        }, graph=g)
    return


@app.cell
def _(mo):
    mo.md(
        r"""
        # Recommended modifications

        ## Dates

        -  dcterms:created "2025-02-15"^^xsd:date means the shape was first created on February 15, 2025
        -  dcterms:modified "2025-05-01"^^xsd:date means the shape was last updated on May 1, 2025. Use this for the Model2Owl generation
        -  dcterms:issued "2025-03-01"^^xsd:date means the shape was officially published on March 1, 2025. Use this to specify publication in Vocabularies

        ## See also links

        Consider revising https://docs.ted.europa.eu/home/index.html that is not related to Owl or SHACL 

        ## SHACL metadata

        - Imports in the SHACL metadata should be the corresponding SHACL modules, now is pointing to OWL.
        - Revisit titles
            - eProcurement Ontology Access - core shapes"
        	- should be: "eProcurement Ontology eAccess - SHACL shapes"

        Example, now is:

        ```turtle
        ord-shape:ord-shape a owl:Ontology ;
            rdfs:label "eProcurement Ontology Ordering - core shapes"@en ;
            dcterms:created "2025-05-07"^^xsd:date ;
            dcterms:description "The eProcurement Ontology Ordering core shapes provides the generic datashape specifications for the eProcurement Ontology Ordering core."@en ;
            dcterms:issued "2025-05-07"^^xsd:date ;
            dcterms:license "© European Union, 2014. Unless otherwise noted, the reuse of the Ontology is authorised under the European Union Public Licence v1.2 (https://eupl.eu/)." ;
            dcterms:publisher "http://publications.europa.eu/resource/authority/corporate-body/PUBL" ;
            dcterms:title "eProcurement Ontology Ordering - core shapes"@en ;
            vann:preferredNamespacePrefix "epo" ;
            vann:preferredNamespaceUri "http://data.europa.eu/a4g/ontology#" ;

        ```

        Proposed changes:

        ```turtle
        ord-shape:ord-shape a owl:Ontology ;
            rdfs:label "eProcurement Ontology Ordering - SHACL shapes"@en ;
            dcterms:created "2021-06-01"^^xsd:date ;
            dcterms:description "The eProcurement Ontology Ordering core shapes provides the SHACL specifications for the eProcurement Ontology Ordering core."@en ;
            dcterms:modified "2025-05-07"^^xsd:date ;
            dcterms:issued "2025-05-12"^^xsd:date ;
            dcterms:license "© European Union, 2014. Unless otherwise noted, the reuse of the Ontology is authorised under the European Union Public Licence v1.2 (https://eupl.eu/)." ;
            dcterms:publisher "http://publications.europa.eu/resource/authority/corporate-body/PUBL" ;
            dcterms:title "eProcurement Ontology Ordering - SHACL shapes"@en ;
            vann:preferredNamespacePrefix "epo-shape" ;
            vann:preferredNamespaceUri "http://data.europa.eu/a4g/data-shape#" ;
        ```
        """
    )
    return


@app.cell
def _(g, pretty_query):
    pretty_query({
            "title": """## All also links        
            """,
            "query": """

    SELECT DISTINCT ?seeAlso
    WHERE {
        ?ontology a owl:Ontology .
        ?ontology rdfs:seeAlso ?seeAlso .
    }

            """
        }, graph=g)
    return


@app.cell
def _(g, pretty_query):
    pretty_query({
            "title": """## All Imports

            SHACL 

            """,
            "query": """

    SELECT DISTINCT ?ontology ?import
    WHERE {
        ?ontology a owl:Ontology .
        ?ontology owl:imports ?import .
    }

            """
        }, graph=g)
    return


if __name__ == "__main__":
    app.run()
