import {
  ATTRIBUTE, INHERITANCE, INSTANCE_OF, RELATIONSHIP, DEPENDENCY,
} from '../conceptualModel/const.js'
import { ns, aliases } from '../namespaces.js'
import { stripPrefix, toSpaced, turtlePrefixes } from '../prefix/prefix.js'

const toTurtle = (
  { nodes, edges }, { namespaces = { ...ns, ...aliases } } = {}) => {
  const output = [
    ...nodes.map(nodeTemplate), ...edges.map(edge => {
      const template = templates[edge.type]
      return template(edge)
    })]
  const prefix = turtlePrefixes(namespaces)
  return prefix + output.join('\n')
}

function shapeIRI (edge) {
  const { source } = edge
  return `a4g_shape:${stripPrefix(source)}Shape`
}

const subclassTemplate = (edge) => {
  const { source, predicate, target } = edge
  return `
    ${source} ${predicate ?? 'rdfs:subClassOf'} ${target} .
    `
}

function propertyIRI (edge) {
  const { source, predicate, target } = edge
  // The following URI structure will be used to identify SHACL shapes:
  //   http://data.europa.eu/a4g/shape/[target]-[path]
  //     where the target may be a node identified as an implicit or explicit target defined by sh:targetClass (e.g., ProcurementObject).
  //     For example, a shape that checks the property epo:isUsingEUFunds when applied to epo:ProcurementObject will be identified as follows:
  //   http://data.europa.eu/a4g/shape/ProcurementObject-isUsingEUFunds
  return `a4g_shape:${stripPrefix(target)}-${stripPrefix(predicate)}`

}

const literalTemplate = (edge) => {
  const {
    source, predicate, target, description, quantifiers,
  } = edge

  function getDatatype (target) {
    if (target === 'rdf:PlainLiteral') {
      return `${propertyIRI(edge)}  sh:node a4g_shape:PlainLiteral .
      a4g_shape:PlainLiteral a sh:NodeShape ;
          sh:or (
              [ sh:datatype xsd:string ]
              [ sh:datatype rdf:langString ]
          ) .
    `
    } else {
      return `${propertyIRI(edge)} sh:datatype ${target} .`
    }
  }

  // Using propertyIRI in this one could be dangerous. But the pattern needs to be tested.
  // Probably the SHACL needs to be validated against the SHACL's SHACL

  return `
    # ${predicate} a owl:DatatypeProperty ;
    #     ${skosDefinitionTemplate(description)}
    #     rdfs:domain  ${source} ;
    #     rdfs:range  ${target} .

    ${shapeIRI(edge)} a sh:NodeShape ;
      sh:targetClass ${source} ;
      sh:property ${propertyIRI(edge)} .
       
      ${propertyIRI(edge)} a sh:PropertyShape ;
         sh:path ${predicate} ;
         ${shaclName(predicate)} ;
         ${quantifiersTemplate(quantifiers)} .
         
       ${getDatatype(target)}
    `
}

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

const objectTemplate = (edge) => {
  const { source, predicate, target, description, quantifiers, type } = edge

  return `
    # ${predicate} a owl:ObjectProperty ;
    #     ${skosDefinitionTemplate(description)}
    #     rdfs:domain  ${source} ;
    #     rdfs:range  ${target} .

    ${shapeIRI(edge)} a sh:NodeShape ;
      sh:targetClass ${source} ;
      sh:property ${propertyIRI(edge)} .
       
    ${propertyIRI(edge)} a sh:PropertyShape ;
        sh:path ${predicate} ;
        sh:nodeKind sh:IRI ;
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

const nodeTemplate = (node) => {
  const { name, description } = node
  return `
      # ${name}
      #  ${skosDefinitionTemplate(description)}
      #  a owl:Class .
`
}

function shaclName (predicate) {
  return predicate ? `sh:name "${toSpaced(stripPrefix(predicate))}"@en ;` : ''
}

const quantifiersTemplate = (quantifiers) => {
  const { min, max, quantifiersDeclared } = quantifiers
  return `
${quantifiersDeclared && max ? `sh:minCount ${min} ;` : ''}
${quantifiersDeclared && max ? `sh:maxCount ${max} ;` : ''}
`
}

function skosDefinitionTemplate (def) {
  // return def ? `skos:definition """${def}"""" ;` : ''
  return def ? `skos:definition "${(def.split(/\s+/).
    map(x => x.trim()).
    join(' ')).replaceAll('"', '')}" ;` : ''
}

export { toTurtle }
