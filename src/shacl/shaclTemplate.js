import {
  ATTRIBUTE, INHERITANCE, INSTANCE_OF, RELATIONSHIP, DEPENDENCY,
} from '../conceptualModel/const.js'
import { ns, aliases } from '../namespaces.js'
import {
  stripPrefix,
  toOneLine,
  toSpaced,
  turtlePrefixes,
} from '../prefix/prefix.js'
import {
  defaultSHACLShapeIRI,
  defaultSHACLPropertyIRI,
} from './defaultIRIPatterns.js'

const toTurtle = (
  { nodes, edges }, {
    propertyIRI = defaultSHACLPropertyIRI,
    shapeIRI = defaultSHACLShapeIRI,
    definedBy = undefined, // Attach metadata
    namespaces = { ...ns, ...aliases },

  } = {}) => {

  const values = {}
  for (const { name, description } of nodes) {
    values[name] = description
  }

  const common = `
      <http://data.europa.eu/a4g/data-shape#PlainLiteral> a sh:NodeShape ;
          sh:or (
              [ sh:datatype xsd:string ]
              [ sh:datatype rdf:langString ]
          ) .
          `

  function subclassTemplate (edge) {
    const { source, predicate, target } = edge
    return `
    ${source} ${predicate ?? 'rdfs:subClassOf'} ${target} .
    `
  }

  function literalTemplate (edge) {
    const {
      source, predicate, target, description, quantifiers,
    } = edge

    function getDatatype (target) {
      if (target === 'rdf:PlainLiteral') {
        return `${propertyIRI(edge)}  sh:node <http://data.europa.eu/a4g/data-shape#PlainLiteral> .
    `
      } else {
        return `${propertyIRI(edge)} sh:datatype ${target} .`
      }
    }

    // Using propertyIRI in this one could be dangerous. But the pattern needs to be tested.
    // Probably the SHACL needs to be validated against the SHACL's SHACL

    return `
    ${shapeIRI(edge)} a sh:NodeShape ;
      sh:targetClass ${source} ;
      ${rdfsDefinedBy(definedBy)}
      ${rdfsComment(values[source])}
      sh:property ${propertyIRI(edge)} .
       
      ${propertyIRI(edge)} a sh:PropertyShape ;
         sh:path ${predicate} ;
         ${rdfsDefinedBy(definedBy)}
         ${shDescription(description)}
         ${shaclName(predicate)} ;
         ${quantifiersTemplate(quantifiers)} .
         
       ${getDatatype(target)}
    `
  }

  function objectTemplate (edge) {
    const { source, predicate, target, description, quantifiers, type } = edge

    return `
    ${shapeIRI(edge)} a sh:NodeShape ;
      sh:targetClass ${source} ;
      ${rdfsDefinedBy(definedBy)}
      ${rdfsComment(values[source])}
      sh:property ${propertyIRI(edge)} .
       
    ${propertyIRI(edge)} a sh:PropertyShape ;
        sh:path ${predicate} ;
        sh:nodeKind sh:IRI ;
        ${rdfsDefinedBy(definedBy)}
        ${shDescription(description)}
        ${shaclName(predicate)}
        ${quantifiersTemplate(quantifiers)} .
       
     ${getObjectTarget(edge)}
    `
  }

  const templates = {
    [INHERITANCE]: subclassTemplate,
    [ATTRIBUTE]: literalTemplate,
    [RELATIONSHIP]: objectTemplate,
    [INSTANCE_OF]: objectTemplate,
    [DEPENDENCY]: objectTemplate,
  }

  const output = edges.map(edge => {
    const template = templates[edge.type]
    return template(edge)
  })
  const prefix = turtlePrefixes(namespaces)

  function getObjectTarget (edge) {
    const { source, target, type } = edge

    if (type === 'Dependency') {
      // Note: For enums omit enumeration values for the moment until further clarification
      // sh:targetObjectsOf ?
      // sh:in ( ex:Pink ex:Purple ) ?

      const skosEdge = { source, predicate: 'skos:inScheme', target }

      return `${propertyIRI(edge)} sh:node ${shapeIRI(skosEdge)} . 
     ${shapeIRI(skosEdge)} a sh:NodeShape ;
        sh:property ${propertyIRI(skosEdge)} .
         
     ${propertyIRI(skosEdge)} a sh:PropertyShape ;
        a sh:PropertyShape ;
        sh:path skos:inScheme ;
        sh:hasValue ${target} .
`
    } else {
      return `${propertyIRI(edge)} sh:targetClass ${target} .`
    }
  }

  return [prefix, common, ...output].join('\n')
}

function rdfsDefinedBy (definedBy) {
  return definedBy ? `rdfs:isDefinedBy ${definedBy} ;` : ''
}

function rdfsComment (description) {
  return description ? `rdfs:comment """${toOneLine(description)}""" ;` : ''
}

function shDescription (description) {
  return description ? `sh:description """${toOneLine(description)}""" ;` : ''
}

function shaclName (predicate) {
  return predicate ? `sh:name "${toSpaced(stripPrefix(predicate))}"@en ;` : ''
}

const quantifiersTemplate = (quantifiers) => {
  const { min, max, quantifiersDeclared } = quantifiers
  return `
${quantifiersDeclared && min ? `sh:minCount ${min} ;` : ''}
${quantifiersDeclared && max ? `sh:maxCount ${max} ;` : ''}
`
}

export { toTurtle }
