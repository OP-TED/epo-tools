import { ATTRIBUTE, INHERITANCE, RELATIONSHIP } from '../const.js'

const nodeTemplate = ({ name, description }) => `
      # ${name}
      #  ${skosDefinitionTemplate(description)}
      #  a owl:Class .
        `

const literalTemplate = ({
  source, predicate, target, description, quantifiers,
}) => `
    # ${predicate} a owl:DatatypeProperty ;
    #     ${skosDefinitionTemplate(description)}
    #     rdfs:domain  ${source} ;
    #     rdfs:range  ${target} .

    ${shapeIRI({ source, predicate, target })} a sh:NodeShape ;
      sh:targetClass ${source} ;
      sh:property [
        sh:path ${predicate} ;
        sh:datatype ${target} ;
        ${quantifiersTemplate(quantifiers)}
      ] .
    `

const objectTemplate = ({
  source, predicate, target, description, quantifiers,
}) => `
    # ${predicate} a owl:ObjectProperty ;
    #     ${skosDefinitionTemplate(description)}
    #     rdfs:domain  ${source} ;
    #     rdfs:range  ${target} .

    ${shapeIRI({ source, predicate, target })} a sh:NodeShape ;
      sh:targetClass ${source} ;
      sh:property [
        sh:path ${predicate} ;
        sh:nodeKind sh:IRI ;
        ${quantifiersTemplate(quantifiers)}
         sh:targetClass ${target} ;
      ] .
    `

const subclassTemplate = ({ source, predicate, target }) => `
    ${source} rdfs:subClassOf ${target} .
    `

function toTurtle ({ nodes, edges }) {
  const classDefinitions = nodes.map(nodeTemplate)

  const relations = edges.map(edge => {

    if (edge.type === INHERITANCE) {
      return subclassTemplate(edge)
    } else if (edge.type === ATTRIBUTE) {
      return literalTemplate(edge)
    } else if (edge.type === RELATIONSHIP) {
      return objectTemplate(edge)
    } else {
      throw Error(`type '${edge.type}' not implemented`)
    }

  })

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

const quantifiersTemplate = ({
  min, max, quantifiersDeclared,
}) => `
${quantifiersDeclared && max ? `sh:minCount ${min} ;` : ''}
${quantifiersDeclared && max ? `sh:maxCount ${max} ;` : ''}
`

function skosDefinitionTemplate (def) {
  // return def ? `skos:definition """${def}"""" ;` : ''
  return def ? `skos:definition "${(def.split(/\s+/).
    map(x => x.trim()).
    join(' ')).replaceAll('"', '')}" ;` : ''
}

export { toTurtle }
