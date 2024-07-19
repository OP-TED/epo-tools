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

  const relationTemplates = {
    [INHERITANCE]: subClassOf,
    [ATTRIBUTE]: dataPropertyDefinition,
    [RELATIONSHIP]: objectPropertyDefinition,
    [INSTANCE_OF]: objectPropertyDefinition,
    [DEPENDENCY]: objectPropertyDefinition,
  }

  const qEdges = edges.filter(
    edge => edge.type === RELATIONSHIP || edge.type === ATTRIBUTE)

  const domainRange = []
  for (const predicate of [...new Set(qEdges.map(edge => edge.predicate))]) {
    const e = edges.filter(edge => edge.predicate === predicate)
    const sources = [...new Set(e.map(x => x.source))]
    const targets = [...new Set(e.map(x => x.target))]
    domainRange.push(domainAndRange(sources, predicate, targets))
  }

  const quantifiers = qEdges.map(quantifiersTemplate)

  const output = [
    ...nodes.map(classTemplate),
    ...edges.map(edge => {
      const template = relationTemplates[edge.type]
      return template(edge)
    }),
    ...domainRange,
    ...quantifiers,
  ]

  const prefix = turtlePrefixes(namespaces)
  return `${prefix} ${output.join('\n')}`
}

function isValidTarget (target) {
  return target && hasPrefix(target) && aliases[getPrefix(target)] !== UNKNOWN
}

function domainAndRange (sources, predicate, targets) {
  function maybeMultiple (arr) {
    if (arr.length === 1) {
      return arr[0]
    }
    return `
    [ 
      rdf:type owl:Class ;
	    owl:unionOf (
        ${arr.join('\n')}
	    ) ;
	  ]
    `
  }

  return `  
    ${predicate} rdfs:domain ${maybeMultiple(sources)} .
    ${predicate} rdfs:range ${maybeMultiple(targets)} .            
  `
}

function classTemplate (node) {
  const { name, description } = node
  return `
      ${name} ${rdfsLabel(name)}       
        ${rdfsComment(description)}
        a owl:Class .
`
}

function dataPropertyDefinition (edge) {
  const {
    source, predicate, target, description, quantifiers,
  } = edge

  return `
    ${predicate} ${rdfsComment(description)}
         ${rdfsLabel(predicate)}
         a owl:DatatypeProperty .
    `
}

function objectPropertyDefinition (edge) {
  const { source, predicate, target, description, quantifiers, type } = edge
  return `
    ${predicate} ${rdfsComment(description)}
         ${rdfsLabel(predicate)}
         a owl:ObjectProperty .
    `
}

function subClassOf (edge) {
  const { source, predicate, target } = edge
  return `
    ${source} ${predicate ?? 'rdfs:subClassOf'} ${target} .
    `
}

function rdfsLabel (prefixedName) {
  return prefixedName ? `rdfs:label "${toSpaced(
    stripPrefix(prefixedName))}"@en ;` : ''
}

function rdfsComment (def) {
  return def ? `rdfs:comment "${(def.split(/\s+/).
    map(x => x.trim()).
    join(' ')).replaceAll('"', '')}" ;` : ''
}

function quantifiersTemplate (edge) {
  const { source, predicate, target, quantifiers, type } = edge
  const { min, max, quantifiersDeclared } = quantifiers

  if (quantifiersDeclared) {

    if (isValidTarget(target)) {
      return `
    ${source} rdfs:subClassOf [
        a owl:Restriction ;
        ${max ? `owl:minQualifiedCardinality ${min} ;` : ''}
        ${max ? `owl:maxQualifiedCardinality ${max} ;` : ''}
        owl:onProperty ${predicate} ;
        ${type === ATTRIBUTE ? 'owl:onDataRange' : 'owl:onClass'} ${target}
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
