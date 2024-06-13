import {
  ATTRIBUTE, INHERITANCE, INSTANCE_OF, RELATIONSHIP, DEPENDENCY,
} from '../conceptualModel/const.js'
import { ns, aliases } from '../namespaces.js'
import { stripPrefix, toSpaced, turtlePrefixes } from '../prefix/prefix.js'

const toTurtle = (
  { nodes, edges }, { namespaces = { ...ns, ...aliases } } = {}) => {
  const output = [
    ...nodes.map(nodeTemplate), ...edges.map(edge => {
      const template = relationTemplates[edge.type]
      return template(edge)
    })]
  const prefix = turtlePrefixes(namespaces)
  return prefix + output.join('\n')
}

const subclassTemplate = (edge) => {
  const { source, predicate, target } = edge
  return `
    ${source} ${predicate ?? 'rdfs:subClassOf'} ${target} .
    `
}

const datatypePropertyTemplate = (edge) => {
  const {
    source, predicate, target, description, quantifiers,
  } = edge

  return `
    ${predicate} a owl:DatatypeProperty ;
         ${rdfsLabel(predicate)}
         ${rdfsCommentTemplate(description)}
         rdfs:domain  ${source} ;
         rdfs:range  ${target} .         
    `
}

const objectTemplate = (edge) => {
  const { source, predicate, target, description, quantifiers, type } = edge

  return `
    ${predicate} a owl:ObjectProperty ;
         ${rdfsLabel(predicate)}
         ${rdfsCommentTemplate(description)}
         rdfs:domain  ${source} ;
         rdfs:range  ${target} .
    `
}

const relationTemplates = {
  [INHERITANCE]: subclassTemplate,
  [ATTRIBUTE]: datatypePropertyTemplate,
  [RELATIONSHIP]: objectTemplate,
  [INSTANCE_OF]: objectTemplate,
  [DEPENDENCY]: objectTemplate,
}

const nodeTemplate = (node) => {
  const { name, description } = node
  return `
      ${name} a owl:Class ;
        ${rdfsLabel(name)}
        ${rdfsCommentTemplate(description)}
        a owl:Class .
`
}

function rdfsLabel (prefixedName) {
  return prefixedName
    ? `rdfs:label "${toSpaced(stripPrefix(prefixedName))}"@en ;`
    : ''
}

function rdfsCommentTemplate (def) {
  // return def ? `skos:definition """${def}"""" ;` : ''
  return def ? `rdfs:comment "${(def.split(/\s+/).
    map(x => x.trim()).
    join(' ')).replaceAll('"', '')}" ;` : ''
}

/**
 *
 * Omit cardinalities for now
 *
 * Exact cardinality
 *
 * :TwoDogOwner a owl:Class ;
 *     rdfs:subClassOf [
 *         a owl:Restriction ;
 *         owl:onProperty :hasPet ;
 *         owl:qualifiedCardinality "2"^^xsd:nonNegativeInteger ;
 *         owl:onClass :Dog
 *     ] .
 *
 *
 * Minimum cardinality
 *
 * :DogOwner a owl:Class ;
 *     rdfs:subClassOf [
 *         a owl:Restriction ;
 *         owl:onProperty :hasPet ;
 *         owl:minQualifiedCardinality "1"^^xsd:nonNegativeInteger ;
 *         owl:onClass :Dog
 *     ] .
 */

// const quantifiersTemplate = (quantifiers) => {
//   const { min, max, quantifiersDeclared } = quantifiers
//   return `
// ${quantifiersDeclared && max ? `sh:minCount ${min} ;` : ''}
// ${quantifiersDeclared && max ? `sh:maxCount ${max} ;` : ''}
// `
// }

export { toTurtle }
