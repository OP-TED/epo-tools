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
    from typing import Tuple
    import zipfile
    from rdflib import Graph, BNode, Namespace, URIRef
    from rdflib.namespace import RDF, RDFS, OWL
    return Graph, OWL, RDF, glob_lib, os, zipfile


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    from epo_tools.post_process import (
        filter_dataset,
        add_node_iri,
        add_isDefinedBy,
        fix_shape_names,
        fix_propertyshape_names,
        fix_metadata_imports,
    )
    return (
        add_isDefinedBy,
        add_node_iri,
        filter_dataset,
        fix_metadata_imports,
        fix_propertyshape_names,
        fix_shape_names,
    )


@app.cell
def _(mo):
    mo.md(rf"""# ePO SHACL v5.0.0-RC1 postprocessing script""")
    return


@app.cell
def _(glob_lib):
    shacl_files = glob_lib.glob(
        "assets/release/5.0.0/implementation/**/shacl_shapes/*.ttl", recursive=True
    )
    shacl_files
    return (shacl_files,)


@app.cell
def _(load_graphs, shacl_files):
    shacl_graphs = load_graphs(shacl_files)
    return (shacl_graphs,)


@app.cell
def _(OWL, RDF):
    def get_ontology_metadata_iris(graphs):
        ontology_iris = []
        for g in graphs:
            for ontology_node in g.subjects(RDF.type, OWL.Ontology):
                ontology_iris.append(ontology_node)
        return ontology_iris
    return (get_ontology_metadata_iris,)


@app.cell
def _(get_ontology_metadata_iris, shacl_graphs):
    metadata_nodes = get_ontology_metadata_iris(
        [item["graph"] for item in shacl_graphs]
    )
    return (metadata_nodes,)


@app.cell
def _(
    add_isDefinedBy,
    add_node_iri,
    fix_metadata_imports,
    fix_propertyshape_names,
    fix_shape_names,
    pipe,
):
    def process_shacl(graph, metadata_nodes):
        return pipe(
            graph,
            add_node_iri,
            add_isDefinedBy,
            fix_shape_names,
            fix_propertyshape_names,
            lambda g: fix_metadata_imports(g, metadata_nodes),
        )
    return (process_shacl,)


@app.cell
def _(metadata_nodes, process_shacl, shacl_graphs):
    shacl_graphs_result = [
        {
            "path": item["path"],
            "graph": process_shacl(item["graph"], metadata_nodes),
        }
        for item in shacl_graphs
    ]
    return (shacl_graphs_result,)


@app.cell
def _(prepare_patch, shacl_graphs_result):
    prepare_patch(shacl_graphs_result)
    return


@app.cell
def _(prepare_zip, shacl_graphs_result):
    prepare_zip(shacl_graphs_result, "assets/ePO 5.0.0 artefacts - shacl.zip")
    return


@app.cell
def _(mo):
    mo.md(r"""# ePO OWL v5.0.0-RC1 postprocessing script""")
    return


@app.cell
def _(glob_lib):
    ontology_files = glob_lib.glob(
        "assets/release/5.0.0/implementation/**/owl_ontology/*.ttl", recursive=True
    )
    return (ontology_files,)


@app.cell
def _(ontology_files):
    ontology_files
    return


@app.cell
def _(load_graphs, ontology_files):
    ontology_graphs = load_graphs(ontology_files)
    return (ontology_graphs,)


@app.cell
def _(filter_dataset):
    def process_ontology(graph):
        wanted, unwanted = filter_dataset(graph)
        return wanted
    return (process_ontology,)


@app.cell
def _(ontology_graphs, process_ontology):
    ontology_graphs_result = [
        {
            "path": item["path"],
            "graph": process_ontology(item["graph"]),
        }
        for item in ontology_graphs
    ]
    return (ontology_graphs_result,)


@app.cell
def _(ontology_graphs_result, prepare_patch):
    prepare_patch(ontology_graphs_result)
    return


@app.cell
def _(ontology_graphs_result, prepare_zip):
    prepare_zip(ontology_graphs_result, "assets/ePO 5.0.0 artefacts - owl.zip")
    return


@app.cell
def _(mo):
    mo.md(r"""# Notebook implementation""")
    return


@app.cell
def _(os, zipfile):
    def prepare_zip(results, output_zip_path):
        with zipfile.ZipFile(output_zip_path, "w") as zipf:
            for current in results:
                try:
                    g = current["graph"]
                    file_path = current["path"]
                    base_name = os.path.basename(file_path)
                    rdf_name = os.path.splitext(base_name)[0] + ".rdf"
                    rdf_data = g.serialize(format="xml")
                    zipf.writestr(rdf_name, rdf_data)
                    print(f"✔ Converted and added: {rdf_name}")
                except Exception as e:
                    print(f"✖ Failed to process {file_path}: {e}")
            print(f"✔ Wrote: {output_zip_path}")
    return (prepare_zip,)


@app.cell
def _(os):
    def prepare_patch(
        results,
        transform_path=lambda path: path.replace(
            "assets/release", "assets/patch", 1
        ),
    ):
        for current in results:
            try:
                g = current["graph"]
                file_path = current["path"]

                if not file_path.startswith("assets/release"):
                    print(f"✖ Unexpected file path structure: {file_path}")
                    continue

                patch_path = transform_path(file_path)
                os.makedirs(os.path.dirname(patch_path), exist_ok=True)

                base_name = os.path.basename(file_path)
                name_no_ext = os.path.splitext(base_name)[0]

                ttl_path = os.path.join(
                    os.path.dirname(patch_path), name_no_ext + ".ttl"
                )
                rdf_path = os.path.join(
                    os.path.dirname(patch_path), name_no_ext + ".rdf"
                )

                with open(ttl_path, "w", encoding="utf-8") as f:
                    f.write(g.serialize(format="turtle"))
                print(f"✔ Written Turtle file: {ttl_path}")

                with open(rdf_path, "w", encoding="utf-8") as f:
                    f.write(g.serialize(format="xml"))
                print(f"✔ Written RDF/XML file: {rdf_path}")

            except Exception as e:
                print(f"✖ Failed to process {file_path}: {e}")
    return (prepare_patch,)


@app.cell
def _(filter_dataset, mo):
    def display_unwanted(ontology_graphs):
        result = [
            mo.md(
                "# The following elements were found and need to be filtered out since they redefine external vocabs"
            )
        ]
        for current in ontology_graphs:
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
                result.append(current)
        return mo.vstack(result)
    return


@app.cell
def _(Graph):
    def load_graph(path):
        g = Graph()
        g.parse(path, format="turtle")
        return {"path": path, "graph": g}


    def load_graphs(paths):
        return [load_graph(path) for path in paths]
    return (load_graphs,)


@app.cell
def _():
    from functools import reduce


    def pipe(value, *functions):
        return reduce(lambda v, f: f(v), functions, value)
    return (pipe,)


if __name__ == "__main__":
    app.run()
