const priorVersion = `4.0.2`
const currentVersion = `4.1.0`
const dateIssued = `2024-03-21`

const shaclMetadata = (id) => `
${id}-shape:${id}-shape a owl:Ontology ;
    rdfs:label "eProcurement Ontology ${id} - SHACL shapes"@en ;
    dcterms:created "2021-06-01"^^xsd:date ;
    dcterms:description "The eProcurement Ontology ${id} SHACL shapes provides the datashape specifications for the eProcurement Ontology ${id} module."@en ;
    dcterms:issued "${dateIssued}"^^xsd:date ;
    dcterms:license "© European Union, 2014. Unless otherwise noted, the reuse of the Ontology is authorised under the European Union Public Licence v1.2 (https://eupl.eu/)." ;
    dcterms:publisher "http://publications.europa.eu/resource/authority/corporate-body/PUBL" ;
    dcterms:title "eProcurement Ontology ${id} - SHACL shapes"@en ;
    vann:preferredNamespacePrefix "epo" ;
    vann:preferredNamespaceUri "http://data.europa.eu/a4g/ontology#" ;
    rdfs:seeAlso <https://docs.ted.europa.eu/home/index.html>,
        <https://github.com/OP-TED/ePO/releases>,
        <https://joinup.ec.europa.eu/collection/eprocurement/solution/eprocurement-ontology/about>,
        <https://op.europa.eu/en/web/eu-vocabularies/e-procurement> ;
    owl:imports 
        eli:,
        cccev:,
        dcterms:,
        vann:,
        <http://www.w3.org/2004/02/skos/core>,
        <http://www.w3.org/2006/time>,
        <http://www.w3.org/ns/adms>,
        <http://www.w3.org/ns/locn>,
        org:,
        <http://www.w3.org/ns/person>,
        foaf: ;
    owl:incompatibleWith "3.1.0" ;
    owl:priorVersion "http://data.europa.eu/a4g/data-shape#${id}-shape-${priorVersion}" ;
    owl:versionIRI ${id}-shape:${id}-shape-${currentVersion} ;
    owl:versionInfo "${currentVersion}" .
`

export { shaclMetadata }
