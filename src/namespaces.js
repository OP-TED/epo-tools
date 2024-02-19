import rdf from 'rdf-ext'

const ns = {
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: rdf.namespace('http://schema.org/'),
  xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#'),
  rdfs: rdf.namespace('http://www.w3.org/2000/01/rdf-schema#'),
  owl: rdf.namespace('http://www.w3.org/2002/07/owl#'),
  skos: rdf.namespace('http://www.w3.org/2004/02/skos/'),
  dcterms: rdf.namespace('http://purl.org/dc/terms/'),
  a4g: rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  rml: rdf.namespace('http://semweb.mmlab.be/ns/rml#'),
  r2rml: rdf.namespace('http://www.w3.org/ns/r2rml#'),
  sfrml: rdf.namespace('http://data.europa.eu/a4g/mapping/sf-rml/'),
  m8g: rdf.namespace('http://data.europa.eu/m8g/'),
  locn: rdf.namespace('http://www.w3.org/ns/locn#'),
  ex: rdf.namespace('http://example.org/'),
}

export {
  ns,
}
