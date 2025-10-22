import marimo

__generated_with = "0.13.15"
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
    return (glob_lib,)


@app.cell
def _():
    from typing import Tuple
    from rdflib import Graph, BNode, Namespace, URIRef, Literal
    from rdflib.namespace import RDF, RDFS, OWL
    import re
    return BNode, Graph, Tuple, URIRef


@app.cell
def _():
    from epo_tools.widgets import pretty_query
    return (pretty_query,)


@app.cell
def _():
    version = "5.2.0"
    return (version,)


@app.cell
def _(mo, version):
    mo.md(
        rf"""
    # ePO OWL v{version}-RC1

    ## Minimal Quality checks

    Corresponds to a list of scripts that check for regressions
    """
    )
    return


@app.cell
def _(mo, version):
    ontology_files_pattern = mo.ui.text(
        f"assets/release/{version}/implementation/**/owl_ontology/*.ttl",
        full_width=True,
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


@app.cell(hide_code=True)
def _():
    complete_stats = """
    PREFIX owl:  <http://www.w3.org/2002/07/owl#>
    PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?Variable ?Value
    WHERE {

      # ===== Entities =====
      { SELECT ("NoC" AS ?Variable) (COUNT(DISTINCT ?c) AS ?Value) WHERE {
          { ?c a owl:Class } UNION { ?c a rdfs:Class }
          FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology"))
      } }

      # ===== All properties (robust, no inference needed) =====
      UNION
      { SELECT ("NoAllProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          { ?p a rdf:Property }
          UNION { ?p a owl:ObjectProperty }
          UNION { ?p a owl:DatatypeProperty }
          UNION { ?p a owl:AnnotationProperty }
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }

      # ===== Property type breakdown (overlapping) =====
      UNION
      { SELECT ("NoOP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:ObjectProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }
      UNION
      { SELECT ("NoDP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:DatatypeProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }
      UNION
      { SELECT ("NoAP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:AnnotationProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }

      # ===== Disjoint partition (these 4 sum to NoAllProp) =====
      UNION
      { SELECT ("NoPlainProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a rdf:Property .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          FILTER NOT EXISTS { ?p a owl:ObjectProperty }
          FILTER NOT EXISTS { ?p a owl:DatatypeProperty }
          FILTER NOT EXISTS { ?p a owl:AnnotationProperty }
      } }
      UNION
      { SELECT ("NoOP_only" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:ObjectProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          FILTER NOT EXISTS { ?p a owl:DatatypeProperty }
          FILTER NOT EXISTS { ?p a owl:AnnotationProperty }
      } }
      UNION
      { SELECT ("NoDP_only" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:DatatypeProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          FILTER NOT EXISTS { ?p a owl:ObjectProperty }
          FILTER NOT EXISTS { ?p a owl:AnnotationProperty }
      } }
      UNION
      { SELECT ("NoAP_only" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:AnnotationProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          FILTER NOT EXISTS { ?p a owl:ObjectProperty }
          FILTER NOT EXISTS { ?p a owl:DatatypeProperty }
      } }

      # ===== Overlap diagnostics (not part of the disjoint sum) =====
      UNION
      { SELECT ("NoOP_and_DP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:ObjectProperty , owl:DatatypeProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }
      UNION
      { SELECT ("NoOP_and_AP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:ObjectProperty , owl:AnnotationProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }
      UNION
      { SELECT ("NoDP_and_AP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:DatatypeProperty , owl:AnnotationProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }
      UNION
      { SELECT ("NoOP_and_DP_and_AP" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE {
          ?p a owl:ObjectProperty , owl:DatatypeProperty , owl:AnnotationProperty .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
      } }

      # ===== Class axioms =====
      UNION
      { SELECT ("NoSubClassAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?c rdfs:subClassOf ?sup .
          FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology"))
          BIND(CONCAT(STR(?c)," ",STR(?sup)) AS ?pair)
      } }
      UNION
      { SELECT ("NoEqClassAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?c owl:equivalentClass ?d .
          FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology"))
          BIND(IF(STR(?c)<STR(?d), CONCAT(STR(?c),"=",STR(?d)), CONCAT(STR(?d),"=",STR(?c))) AS ?pair)
      } }
      UNION
      { SELECT ("NoDisjClassAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?c owl:disjointWith ?d .
          FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology"))
          BIND(IF(STR(?c)<STR(?d), CONCAT(STR(?c),"!=",STR(?d)), CONCAT(STR(?d),"!=",STR(?c))) AS ?pair)
      } }

      # ===== Property axioms =====
      UNION
      { SELECT ("NoSubPropAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?p rdfs:subPropertyOf ?q .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          BIND(CONCAT(STR(?p)," ",STR(?q)) AS ?pair)
      } }
      UNION
      { SELECT ("NoEqPropAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?p owl:equivalentProperty ?q .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          BIND(IF(STR(?p)<STR(?q), CONCAT(STR(?p),"=",STR(?q)), CONCAT(STR(?q),"=",STR(?p))) AS ?pair)
      } }
      UNION
      { SELECT ("NoDisjPropAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?p owl:propertyDisjointWith ?q .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          BIND(IF(STR(?p)<STR(?q), CONCAT(STR(?p),"!=",STR(?q)), CONCAT(STR(?q),"!=",STR(?p))) AS ?pair)
      } }
      UNION
      { SELECT ("NoInvOfAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?p owl:inverseOf ?q .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          BIND(IF(STR(?p)<STR(?q), CONCAT(STR(?p),"<->",STR(?q)), CONCAT(STR(?q),"<->",STR(?p))) AS ?pair)
      } }

      # ===== Domain / Range =====
      UNION
      { SELECT ("NoDomainAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?p rdfs:domain ?d .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          BIND(CONCAT(STR(?p)," ",STR(?d)) AS ?pair)
      } }
      UNION
      { SELECT ("NoRangeAx" AS ?Variable) (COUNT(DISTINCT ?pair) AS ?Value) WHERE {
          ?p rdfs:range ?r .
          FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology"))
          BIND(CONCAT(STR(?p)," ",STR(?r)) AS ?pair)
      } }

      # ===== Property characteristics =====
      UNION { SELECT ("NoFuncProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:FunctionalProperty .        FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }
      UNION { SELECT ("NoInvFuncProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:InverseFunctionalProperty .FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }
      UNION { SELECT ("NoTransProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:TransitiveProperty .       FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }
      UNION { SELECT ("NoSymProp"  AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:SymmetricProperty .         FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }
      UNION { SELECT ("NoAsymProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:AsymmetricProperty .        FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }
      UNION { SELECT ("NoReflexiveProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:ReflexiveProperty .    FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }
      UNION { SELECT ("NoIrreflexiveProp" AS ?Variable) (COUNT(DISTINCT ?p) AS ?Value) WHERE { ?p a owl:IrreflexiveProperty .FILTER(STRSTARTS(STR(?p), "http://data.europa.eu/a4g/ontology")) } }

      # ===== Restrictions =====
      UNION { SELECT ("NoRestr" AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction } }
      UNION { SELECT ("NoSomeValuesFrom" AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction ; owl:someValuesFrom ?x } }
      UNION { SELECT ("NoAllValuesFrom"  AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction ; owl:allValuesFrom ?x } }
      UNION { SELECT ("NoHasValue"       AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction ; owl:hasValue ?x } }
      UNION { SELECT ("NoCard"           AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction ; owl:cardinality ?n } }
      UNION { SELECT ("NoMinCard"        AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction ; owl:minCardinality ?n } }
      UNION { SELECT ("NoMaxCard"        AS ?Variable) (COUNT(DISTINCT ?r) AS ?Value) WHERE { ?c rdfs:subClassOf ?r . FILTER(STRSTARTS(STR(?c), "http://data.europa.eu/a4g/ontology")) ?r a owl:Restriction ; owl:maxCardinality ?n } }

    }
    ORDER BY DESC(?Value)
    """
    return (complete_stats,)


@app.cell(hide_code=True)
def _():
    minimal_stats = """
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?category (COUNT(DISTINCT ?entity) AS ?count)
    WHERE {
      {
        ?entity a owl:Class .
        BIND("Classes" AS ?category)
      }
      UNION
      {
        ?entity a owl:ObjectProperty .
        BIND("Object Properties" AS ?category)
      }
      UNION
      {
        ?entity a owl:DatatypeProperty .
        BIND("Datatype Properties" AS ?category)
      }
      UNION
      {
        ?entity a owl:AnnotationProperty .
        BIND("Annotation Properties" AS ?category)
      }
      UNION
      {
        ?entity a owl:NamedIndividual .
        BIND("Individuals" AS ?category)
      }
      UNION
      {
        ?entity a rdf:Property .
        FILTER NOT EXISTS { ?entity a owl:ObjectProperty }
        FILTER NOT EXISTS { ?entity a owl:DatatypeProperty }
        FILTER NOT EXISTS { ?entity a owl:AnnotationProperty }
        BIND("Other RDF Properties" AS ?category)
      }
    }
    GROUP BY ?category
    ORDER BY ?category
    """
    return


@app.cell
def _(all_graphs, complete_stats, pretty_query):
    pretty_query(
        {
            "title": f"""## Stats""",
            "query": complete_stats
        },
        graph=all_graphs,
    )
    return


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
