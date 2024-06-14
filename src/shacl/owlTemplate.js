import {
  ATTRIBUTE, INHERITANCE, INSTANCE_OF, RELATIONSHIP, DEPENDENCY,
} from '../conceptualModel/const.js'
import { ns, aliases, UNKNOWN } from '../namespaces.js'
import {
  getPrefix,
  hasPrefix,
  stripPrefix,
  toSpaced,
  turtlePrefixes,
} from '../prefix/prefix.js'

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
         ${domainRangeTemplate(edge)}
    ${quantifiersTemplate(edge)}     
                  
    `
}

function isValidTarget (target) {
  return target && hasPrefix(target) && aliases[getPrefix(target)] !== UNKNOWN
}

function domainRangeTemplate (edge) {
  const { source, target } = edge
  if (isValidTarget(target)) {
    return `
     rdfs:domain  ${source} ;
     rdfs:range  ${target} .
    `
  } else {
    return `
    rdfs:domain  ${source} .
    `
  }

}

const objectTemplate = (edge) => {
  const { source, predicate, target, description, quantifiers, type } = edge
  return `
    ${predicate} a owl:ObjectProperty ;
         ${rdfsLabel(predicate)}
         ${rdfsCommentTemplate(description)}
         ${domainRangeTemplate(edge)}
    ${quantifiersTemplate(edge)}
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

const quantifiersTemplate = (edge) => {
  const { source, predicate, target, quantifiers } = edge
  const { min, max, quantifiersDeclared } = quantifiers

  if (quantifiersDeclared) {

    if (isValidTarget(target)) {
      return `
    ${source} rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty ${predicate} ;
        ${max ? `owl:minQualifiedCardinality ${min} ;` : ''}
        ${max ? `owl:maxQualifiedCardinality ${max} ;` : ''}    
        owl:onClass ${target}    
    ] .
    `
    } else {
      return `
    ${source} rdfs:subClassOf [
        a owl:Restriction ;
        ${max ? `owl:minCardinality ${min} ;` : ''}
        ${max ? `owl:maxCardinality ${max} ;` : ''}    
        owl:onProperty ${predicate} 
    ] .
    `
    }
  }
  return ''

}

export { toTurtle }
