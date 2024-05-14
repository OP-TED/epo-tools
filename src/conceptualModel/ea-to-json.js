import MDBReader from 'mdb-reader'
import { ATTRIBUTE, INHERITANCE, RELATIONSHIP, INSTANCE_OF } from './const.js'

function bufferToJson ({ buffer }) {
  const reader = new MDBReader(buffer)
  const objects = reader.getTable('t_object').getData()
  const attributes = reader.getTable('t_attribute').getData()
  const connectors = reader.getTable('t_connector').getData()
  return toJson({ objects, attributes, connectors })
}

function toJson ({ objects, attributes, connectors }) {

  const nodeIndex = {}
  for (const { Object_ID, Name } of objects) {
    nodeIndex[Object_ID] = Name
  }
  const toExclude =  ['Package', 'ProxyConnector', 'Note', 'Text', 'Datatype']

  // const toInclude = ['Class', 'Enumeration', 'Object']

  const nodes = objects
    .filter(x => !toExclude.includes(x.Object_Type))
    .map(({ Object_ID, Note, Object_Type, Classifier }) => {

      const result = {
        name: nodeIndex[Object_ID], description: Note, type: Object_Type,
      }
      // Objects might come with a Classifier,
      // i.e. (EU) 2015/1986 instance of at-voc:legal-basis
      if (Object_Type === 'Object') {
        result.instanceOf = nodeIndex[Classifier]
      }

      return result
    })

  const edges = [

    ...attributes
      // .filter(({ ObjectId }) => nodeIndex[ObjectId])
      .map(toLiteralRelation(nodeIndex)),
    ...connectors
      // .filter(({ Start_Object_ID }) => nodeIndex[Start_Object_ID])
      .map(toObjectRelation(nodeIndex))]
  return { nodes, edges }
}

const toLiteralRelation = nodeIndex => x => {
  const { Object_ID, Name, Type, LowerBound, UpperBound, Notes } = x
  return {
    type: ATTRIBUTE,
    source: nodeIndex[Object_ID],
    predicate: Name,
    target: Type,
    quantifiers: getQuantifierFromBounds({ LowerBound, UpperBound }),
    description: Notes,
  }
}

const toObjectRelation = nodeIndex => x => {
  const {
    DestRole,
    Start_Object_ID,
    End_Object_ID,
    Connector_Type,
    Direction,
    DestCard,
    Notes,
  } = x

  const source = nodeIndex[Start_Object_ID]

  const type = Connector_Type

  const knownPredicates = {
    [INSTANCE_OF]: 'skos:inScheme', [INHERITANCE]: 'rdfs:subClassOf',
  }

  const predicate = DestRole || knownPredicates[type]

  const target = nodeIndex[End_Object_ID]

  if (Direction !== 'Source -> Destination') { // Apparently this is not taken into account
    // console.log(domain, predicate, range)
  }
  if (Direction !== 'Bi-Directional') { // Apparently this is not taken into account
    // console.log('Bidirectional',domain, predicate, range)
    // If we find some instance of this, apply inverses.
    // :relatesTo owl:inverseOf :isRelatedTo .
  }

  return {
    type,
    source,
    predicate,
    target,
    quantifiers: getQuantifierFromString(DestCard),
    description: Notes,
  }
}

function getQuantifierFromBounds ({ LowerBound, UpperBound }) {

  return !(LowerBound || UpperBound) ? {
    quantifiersDeclared: false,
  } : {
    min: LowerBound,
    max: UpperBound === '*' ? undefined : UpperBound,
    quantifiersDeclared: true,
  }
}

function getQuantifierFromString (str) {
  const raw = { quantifiersDeclared: true, raw: str }
  if (str === '0..1') {
    return { min: 0, max: 1, ...raw }
  } else if (str === '1') {
    return { min: 1, max: 1, ...raw }
  } else if (str === '1..*') {
    return { min: 1, ...raw }
  } else if (str === '0..*') {
    return raw
  } else return {
    quantifiersDeclared: false,
  }
}

export { bufferToJson }
