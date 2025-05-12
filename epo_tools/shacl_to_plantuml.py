from rdflib import Graph, RDF, URIRef, Namespace
from rdflib.namespace import SH, XSD

def sanitize(name):
    return str(name).replace(" ", "_").replace("-", "_").replace("(", "_") \
        .replace(")", "_").replace("/", "_").replace(":", "_").replace("#", "_")

def display_quantifiers(prop):
    min_count = prop.get(SH.minCount)
    max_count = prop.get(SH.maxCount)
    raw = prop.get('quantifier_raw')

    if raw:
        return f"[{raw}]"
    elif min_count is not None and max_count is not None:
        return f"[{min_count}..{max_count}]"
    elif min_count is not None:
        return f"[{min_count}..*]"
    elif max_count is not None:
        return f"[0..{max_count}]"
    return ""

def extract_shapes(graph: Graph):
    shapes = []
    for s in graph.subjects(RDF.type, SH.NodeShape):
        shape = {'name': s, 'properties': [], 'type': 'Class'}

        for p in graph.objects(s, SH.property):
            prop = {}
            for pred, obj in graph.predicate_objects(p):
                prop[pred] = obj
            shape['properties'].append(prop)

        shapes.append(shape)
    return shapes

def shacl_to_plantuml(graph: Graph, shrink=False, sorted_output=False):
    shapes = extract_shapes(graph)

    def label(node):
        """Try to shorten URIs or return fragment."""
        if isinstance(node, URIRef):
            return node.split('#')[-1] if '#' in node else node.split('/')[-1]
        return str(node)

    def node_template(shape):
        name = shape['name']
        props = shape['properties']
        if shrink and not props:
            return None

        prop_lines = []
        for prop in props:
            pred = label(prop.get(SH.path, ""))
            target = label(prop.get(SH['class'], "") or prop.get(SH.datatype, ""))
            quant = display_quantifiers(prop)
            if pred:
                prop_lines.append(f"  {pred} : {target} {quant}".strip())

        return f'class "{label(name)}" as {sanitize(name)} {{\n' + "\n".join(prop_lines) + "\n}}"

    def relation_template(shape):
        lines = []
        source = shape['name']
        for prop in shape['properties']:
            target = prop.get(SH['class'])
            pred = label(prop.get(SH.path))
            if target:
                lines.append(f'"{sanitize(source)}" --> "{sanitize(target)}" : {pred}')
        return lines

    class_defs = filter(None, [node_template(shape) for shape in shapes])
    relations = sum([relation_template(shape) for shape in shapes], [])

    if sorted_output:
        class_defs = sorted(class_defs)
        relations = sorted(set(relations))

    return f"""@startuml
skinparam class {{
    BackgroundColor LightYellow
}}
{chr(10).join(class_defs)}

{chr(10).join(relations)}
@enduml
"""

# Example usage:
# g = rdflib.Graph()
# g.parse("your-graph.ttl", format="turtle")
# print(shacl_to_plantuml(g))
