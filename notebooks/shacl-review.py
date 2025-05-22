import marimo

__generated_with = "0.13.9"
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
    from rdflib import Graph, URIRef, BNode
    return Graph, glob_lib


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    from epo_tools.shacl import pretty_node
    return pretty_node, pretty_query


@app.cell(hide_code=True)
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
def _():
    shacl_files_pattern = (
        "assets/release/5.0.0/implementation/**/shacl_shapes/*.ttl"
    )
    # shacl_files_pattern = "assets/debug/**/*.ttl"
    return (shacl_files_pattern,)


@app.cell
def _(glob_lib, shacl_files_pattern):
    shacl_files = glob_lib.glob(
        shacl_files_pattern, recursive=True
    )
    return (shacl_files,)


@app.cell
def _(Graph, shacl_files):
    g = Graph()

    for path in shacl_files:
        g.parse(path, format="turtle")
    return (g,)


@app.cell
def _(g, pretty_query):
    pretty_query(
        {
            "title": """## Missing sh:nodeKind sh:IRI

            Some sh:nodeKind sh:IRI are missing in properties that point to a class
            """,
            "query": """

    PREFIX sh: <http://www.w3.org/ns/shacl#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:PropertyShape ;
               sh:class ?class .
        FILTER NOT EXISTS { ?shape sh:nodeKind sh:IRI }
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
            "title": """## More than one value


            """,
            "query": """

    SELECT ?subject ?property
           (COUNT(?object) AS ?objectCount)
           (SAMPLE(?object) AS ?sample1)
    WHERE {
      ?subject ?property ?object .

      FILTER NOT EXISTS {
        VALUES ?excludedProperty {
          <http://www.w3.org/ns/shacl#property>
          <http://www.w3.org/2002/07/owl#imports>
          <http://www.w3.org/2000/01/rdf-schema#seeAlso>
        }
        FILTER(?property = ?excludedProperty)
      }
    }
    GROUP BY ?subject ?property
    HAVING (COUNT(?object) > 1)

            """,
        },
        graph=g,
    )
    return


@app.cell
def _(g, pretty_query):
    pretty_query(
        {
            "title": """## Missing rdfs:isDefinedBy

        Some SHACL properties miss `rdfs:isDefinedBy` to specify to their corresponding metadata

        """,
            "query": """

    PREFIX sh: <http://www.w3.org/ns/shacl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?shape
    WHERE {
        ?shape a sh:PropertyShape .
        FILTER NOT EXISTS { ?shape rdfs:isDefinedBy ?def }
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
            "title": """## SHACL Node naming

            This one is optional, but by convention Shapes are postfixed 'Shape'


            """,
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


            """,
        },
        graph=g,
    )
    return


@app.cell
def _(g, pretty_query):
    pretty_query(
        {
            "title": """## SHACL property sh:name

            This one is optional (suggest: Initial capital, space-separated, subsequent words lowercase)


            """,
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


            """,
        },
        graph=g,
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
    ## Inspection of Ranges

    The current property shapes do not specify what skos:Concept is expected. Is this by design?

    Below 3 examples
    """
    )
    return


@app.cell
def _(g, pretty_node):
    pretty_node(
        {
            "message": "It is not clear what is expected as range. Are these countries from a official vocabulary?",
            "uri": "http://data.europa.eu/a4g/data-shape#epo-req-RequestForOffer-epo-hasDestinationCountryCode",
        },
        g,
    )
    return


@app.cell
def _(g, pretty_node):
    pretty_node(
        {
            "message": "It is not clear what is expected as range. Is it a Language from official vocabularies?",
            "uri": "http://data.europa.eu/a4g/data-shape#epo-AccessTerm-epo-providesProcurementDocumentsInOfficialLanguage",
        },
        g,
    )
    return


@app.cell
def _(g, pretty_node):
    pretty_node(
        {
            "message": "Same",
            "uri": "http://data.europa.eu/a4g/data-shape#epo-Document-epo-hasDocumentType",
        },
        g,
    )
    return


@app.cell
def _(g, pretty_node):
    pretty_node(
        {
            "message": """## Minor

        This one declares the sh:sparql two times. This is a detail that could be fixed""",
            "uri": "http://data.europa.eu/a4g/data-shape#epo-sub-ESPD-epo-sub-relatesToESPDRequest",
        },
        g,
    )
    return


@app.cell
def _(g, pretty_node):



    pretty_node(
        {
            "message": """## Minor

        This one declares the sh:sparql two times. This is a detail that could be fixed""",
            "uri": "epo-shape:cccev-InformationRequirement-epo-concernsProcedure",
        },
        g,
    )
    return


@app.cell
def _(mo):
    mo.md(r"""# Search utilities""")
    return


@app.cell
def _(mo):
    search_term = mo.ui.text(
        "ProcurementDocumentsInOfficialLanguage", full_width=True
    )
    return (search_term,)


@app.cell
def _(g, mo, pretty_query, search_term):
    mo.vstack(
        [
            search_term,
            pretty_query(
                {
                    "title": "## Search URIs by name",
                    "query": f"""
    SELECT DISTINCT ?uri
    WHERE {{
      ?uri ?p ?o .
      FILTER(CONTAINS(STR(?uri), "{search_term.value}"))
    }}
            """,
                },
                graph=g,
            ),
        ]
    )
    return


if __name__ == "__main__":
    app.run()
