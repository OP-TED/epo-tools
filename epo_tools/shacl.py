from rdflib import Graph, RDF, URIRef, RDFS
from rdflib.namespace import SH

def get_local_name(uri):
    """Extract the local name from a URI."""
    if not uri:
        return ""
    uri_str = str(uri)
    return uri_str.split('#')[-1] if '#' in uri_str else uri_str.split('/')[-1]

def extract_shacl_shapes(graph: Graph):
    """
    Extract SHACL shapes from an RDF graph into simple dictionary structures.

    Args:
        graph: RDF graph containing SHACL shapes

    Returns:
        List of dictionaries representing SHACL shapes
    """
    shapes = []

    # Get all node shapes
    for shape_node in graph.subjects(RDF.type, SH.NodeShape):
        properties = []

        # Process each property of the shape
        for prop in graph.objects(shape_node, SH.property):
            property_attrs = {}

            # Collect all property attributes
            for pred, obj in graph.predicate_objects(prop):
                property_attrs[pred] = obj

            path = property_attrs.get(SH.path)

            # Basic property info
            property_dict = {
                'path': str(path),
                'name': get_local_name(path)
            }

            # Add optional attributes only if they exist
            if SH.datatype in property_attrs:
                property_dict['datatype'] = str(property_attrs[SH.datatype])
            if SH['class'] in property_attrs:
                property_dict['target'] = str(property_attrs[SH['class']])
            if SH.minCount in property_attrs:
                property_dict['min_count'] = int(property_attrs[SH.minCount].value)
            if SH.maxCount in property_attrs:
                property_dict['max_count'] = int(property_attrs[SH.maxCount].value)
            if SH.pattern in property_attrs:
                property_dict['pattern'] = str(property_attrs[SH.pattern])
            if SH.description in property_attrs:
                property_dict['description'] = str(property_attrs[SH.description])

            properties.append(property_dict)

        # Create the shape dictionary
        shape_dict = {
            'uri': str(shape_node),
            'name': get_local_name(shape_node),
            'properties': properties
        }

        # Add shape target class if it exists
        target_class = next((str(obj) for obj in graph.objects(shape_node, SH.targetClass)), None)
        if target_class:
            shape_dict['source'] = target_class

        # Add shape class if it exists
        shape_class = next((str(obj) for obj in graph.objects(shape_node, SH['class'])), None)
        if shape_class:
            shape_dict['class'] = shape_class

        # Add shape description if it exists
        description = next((str(obj) for obj in graph.objects(shape_node, SH.description)), None)
        if description:
            shape_dict['description'] = description

        shapes.append(shape_dict)

    return shapes
