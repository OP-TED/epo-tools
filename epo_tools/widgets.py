
from rdflib.plugins.sparql import parser
from rdflib.plugins.sparql import algebra
import marimo as mo

def validate_sparql_query(query_str):
    try:
        parsed_query = parser.parseQuery(query_str)
        algebra.translateQuery(parsed_query)
        return True, None
    except Exception as e:
        return False, str(e)

def pretty_query(q, graph):
    sparql_query = q['query']

    is_valid, error = validate_sparql_query(sparql_query)
    if not is_valid:
        return mo.md(f"""### SPARQL error
```
{error}
```""")
    try:
        results = graph.query(sparql_query)
        rows = [{str(var): str(row[var]) for var in row.labels} for row in results]

        return mo.vstack([
            mo.md(f"""{q['title']}
- results: {len(results)}
- total triples: {len(graph)}
"""),
            mo.ui.table(data=rows, page_size=100),
        ])
    except Exception as e:
        return mo.md(f"""
## Error
```
{str(e)}
```
""")
