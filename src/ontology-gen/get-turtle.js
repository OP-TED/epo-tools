function getTurtle ({ nodes, edges }) {
  const classDefinitions = nodes.map(x => `${x.name}
        ${skosDefinition(x.description)}
        a owl:Class .
        `)
  const relations = []
  for (const {
    source, predicate, target, min, max, description, isLiteral,
  } of edges) {

    if (predicate === 'rdfs:subClassOf') {
      relations.push(`
    ${source} ${predicate} ${target} .
    `)
    } else if (isLiteral) {
      relations.push(`
    ${predicate} a owl:DatatypeProperty ;
        ${skosDefinition(description)}
        rdfs:domain  ${source} ;
        rdfs:range  ${target} .

    ${shapeIRI({ source, predicate, target })} a sh:NodeShape ;
      sh:targetClass ${source} ;
      sh:property [
        sh:path ${predicate} ;
        sh:datatype ${target} ;
        ${min ? `sh:minCount ${min} ;` : ''}
        ${max ? `sh:maxCount ${max} ;` : ''}
      ] .
    `)
    } else {
      relations.push(`
    ${predicate} a owl:ObjectProperty ;
        ${skosDefinition(description)}
        rdfs:domain  ${source} ;
        rdfs:range  ${target} .

    ${shapeIRI({ source, predicate, target })} a sh:NodeShape ;
      sh:targetClass ${source} ;
      sh:property [
        sh:path ${predicate} ;
        sh:nodeKind sh:IRI ;
        ${min ? `sh:minCount ${min} ;` : ''}
        ${max ? `sh:maxCount ${max} ;` : ''}
         sh:targetClass ${target} ;
      ] .
    `)
    }
  }

  return `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix dct: <http://purl.org/dc/terms/> . # Armonize this!
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

@prefix epo: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-ord: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-ful: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-con: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-cat: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-not: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-acc: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-sub: <http://data.europa.eu/a4g/ontology#> .
@prefix locn: <http://www.w3.org/ns/locn#> .
@prefix cccev: <http://data.europa.eu/m8g/> .
@prefix cv: <http://data.europa.eu/m8g/> . # Armonize this!
@prefix time: <http://www.w3.org/2006/time#> .
@prefix org: <http://www.w3.org/ns/org#> .
@prefix eli: <http://data.europa.eu/eli/ontology#> .
@prefix person: <http://www.w3.org/ns/person#> .
@prefix adms: <http://www.w3.org/ns/adms#> .
@prefix a4g_shape: <http://data.europa.eu/a4g/data-shape#> .

@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix a4g_shape: <http://data.europa.eu/a4g/data-shape#> .
@prefix cpov: <http://data.europa.eu/m8g/cpov> . # Is this true?
@prefix at-voc: <http://publications.europa.eu/resource/authority/> . # Authority tables
@prefix at-voc-new: <http://unknown/> . # Authority tables


  ${[...classDefinitions, ...relations].join('\n')}
`
}

function shapeIRI ({ source, predicate, target }) {
  return `${source}Shape`
}

function skosDefinition (def) {
  // return def ? `skos:definition """${def}"""" ;` : ''
  return def ? `skos:definition "${(def.split(/\s+/).
    map(x => x.trim()).
    join(' ')).replaceAll('"', '')}" ;` : ''
}

export { getTurtle }
