

import marimo

__generated_with = "0.12.10"
app = marimo.App(width="full", app_title="Data exploration")


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


@app.cell(hide_code=True)
def _(glob_lib, mo):
    release_files = glob_lib.glob("assets/release/5.0.0/implementation/**/*.ttl", recursive=True)
    table = mo.ui.table(
        data=release_files, 
        pagination=True, 
    )
    table
    return release_files, table


@app.cell
def _(glob_lib):
    compare_to_files = glob_lib.glob("postprocess/result/implementation/**/*.ttl", recursive=True)
    return (compare_to_files,)


@app.cell
def _(diffs):
    diffs
    return


@app.cell
def _(mo, os):
    def render_rdf_diffs(diffs):
        """
        Render RDF graph differences using Marimo UI tables.
        Each pair is shown with side-by-side tables for missing triples.
        """
        ui_blocks = []

        for diff in diffs:
            path_a, path_b = diff["pair"]

            # Convert RDF triples to JSON-serializable dicts
            data_a = [
                {"Subject": str(s), "Predicate": str(p), "Object": str(o)}
                for (s, p, o) in diff["only_in_a"]
            ]
            data_b = [
                {"Subject": str(s), "Predicate": str(p), "Object": str(o)}
                for (s, p, o) in diff["only_in_b"]
            ]

            table_a = mo.ui.table(
                data=data_a,
                label=f"Only in A: {os.path.basename(path_a)}",
                pagination=True
            )

            table_b = mo.ui.table(
                data=data_b,
                label=f"Only in B: {os.path.basename(path_b)}",
                pagination=True
            )

            ui_blocks.append(
                mo.vstack([
                    mo.md(f"""
    ### 🔍 Diff Between:
    - **A**: `{path_a}`
    - **B**: `{path_b}`
    """),
                    mo.hstack([table_a, table_b])
                ])
            )

        return mo.vstack(ui_blocks)
    return (render_rdf_diffs,)


@app.cell
def _(diffs, render_rdf_diffs):
    render_rdf_diffs(diffs)
    return


@app.cell
def _(compare_to_files, os, table):
    # Access selected rows
    selected_a = table.value  # assuming table is the UI table for table_a
    selected_b = compare_to_files  # full list from glob

    # Create dicts mapping filename → full path
    a_dict = {os.path.basename(path): path for path in selected_a}
    b_dict = {os.path.basename(path): path for path in selected_b}

    # Find common filenames
    common_filenames = set(a_dict.keys()) & set(b_dict.keys())

    # Get tuples of (full_path_from_a, full_path_from_b)
    matched_pairs = [(a_dict[name], b_dict[name]) for name in common_filenames]

    matched_pairs  # this will be displayed in the output
    return (
        a_dict,
        b_dict,
        common_filenames,
        matched_pairs,
        selected_a,
        selected_b,
    )


@app.cell
def _():
    return


@app.cell
def extract(Graph, matched_pairs):
    # Compare RDF graphs and collect differences
    diffs = []

    for path_a, path_b in matched_pairs:
        g1 = Graph()
        g2 = Graph()

        # Load both graphs
        g1.parse(path_a, format="ttl")
        g2.parse(path_b, format="ttl")

        # Find differences
        only_in_a = g1 - g2
        only_in_b = g2 - g1

        diffs.append({
            "pair": (path_a, path_b),
            "only_in_a": only_in_a,
            "only_in_b": only_in_b,
        })
    return diffs, g1, g2, only_in_a, only_in_b, path_a, path_b


@app.cell
def _(g, mo, pretty_query, sparql_queries):
    accordion_items = {
        q["title"]: lambda q=q: pretty_query(q["title"], q["query"], g)
        for q in sparql_queries
    }

    # Display the accordion
    mo.accordion(accordion_items, lazy=True)
    return (accordion_items,)


@app.cell
def _(mo):
    def pretty_query(title, sparql_query, graph):
        results = graph.query(sparql_query)
        rows = [{str(var): str(row[var]) for var in row.labels} for row in results]
        return mo.vstack([

    mo.ui.table(data=rows, page_size=100),
                mo.md(f"""
    ```sparql
    {sparql_query}
    ```
    """),
    ])


    return (pretty_query,)


@app.cell
def _():
    sparql_queries = [
        {
            "title": "Instances",
            "query": """
                SELECT ?s ?type
                WHERE {
                  ?s a ?type
                }

            """
        },
        {
            "title": "Instances per type",
            "query": """
            SELECT ?class (COUNT(?instance) AS ?count)
            WHERE {
              ?instance a ?class .
            }
            GROUP BY ?class
            ORDER BY DESC(?count)
            """
        },
    {
        "title": "Counts per property",
        "query": """
        SELECT ?property (COUNT(*) AS ?count)
        WHERE {
          ?s ?property ?o .
        }
        GROUP BY ?property
        ORDER BY DESC(?count)
        """
    },
         {
            "title": "Single triples",
            "query": """
                SELECT ?s ?p ?o
                WHERE {
                  ?s ?p ?o .
                  FILTER NOT EXISTS {
                    ?s ?p2 ?o2 .
                    FILTER (?p2 != ?p || ?o2 != ?o)
                  }
                }
            """
        }
    ]

    return (sparql_queries,)


if __name__ == "__main__":
    app.run()
