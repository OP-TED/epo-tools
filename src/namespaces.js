import rdf from 'rdf-ext'

const UNKNOWN = rdf.namespace('http://unknown.org/')

const ns = {
  schema: rdf.namespace('http://schema.org/'),
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#'),
  rdfs: rdf.namespace('http://www.w3.org/2000/01/rdf-schema#'),
  owl: rdf.namespace('http://www.w3.org/2002/07/owl#'),
  skos: rdf.namespace('http://www.w3.org/2004/02/skos/core#'),
  dcterms: rdf.namespace('http://purl.org/dc/terms/'),

  foaf: rdf.namespace('http://xmlns.com/foaf/0.1/'),
  cpov: rdf.namespace('http://data.europa.eu/m8g/'),
  a4g: rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  sfrml: rdf.namespace('http://data.europa.eu/a4g/mapping/sf-rml/'),
  a4g_shape: rdf.namespace('http://data.europa.eu/a4g/data-shape#'),
  eli: rdf.namespace('http://data.europa.eu/eli/ontology#'),
  m8g: rdf.namespace('http://data.europa.eu/m8g/'),
  time: rdf.namespace('http://www.w3.org/2006/time#'),
  person: rdf.namespace('http://data.europa.eu/person#'),
  locn: rdf.namespace('http://www.w3.org/ns/locn#'),
  shacl: rdf.namespace('http://www.w3.org/ns/shacl#'),
  org: rdf.namespace('http://www.w3.org/ns/org#'),
  adms: rdf.namespace('http://www.w3.org/ns/adms#'),
  rml: rdf.namespace('http://semweb.mmlab.be/ns/rml#'),
  r2rml: rdf.namespace('http://www.w3.org/ns/r2rml#'),
}

const aliases = {
  dct: rdf.namespace('http://purl.org/dc/terms/'),
  epo: rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-ord': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-ful': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-con': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-cat': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-not': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-acc': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  'epo-sub': rdf.namespace('http://data.europa.eu/a4g/ontology#'),
  cccev: rdf.namespace('http://data.europa.eu/m8g/'),
  cv: rdf.namespace('http://data.europa.eu/m8g/'),
  sh: rdf.namespace('http://www.w3.org/ns/shacl#'),
  'at-voc': rdf.namespace('http://publications.europa.eu/resource/authority/'),
  'at-voc-new': UNKNOWN,
}

export {
  ns, aliases, UNKNOWN,
}
