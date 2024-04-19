import MDBReader from 'mdb-reader'
import { ATTRIBUTE, INHERITANCE, RELATIONSHIP } from './const.js'

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

  const nodes = objects.
    map(x => ({
      name: nodeIndex[x.Object_ID], description: x.Note,
    }))

  const literals = attributes.
    map(x => {
      const { Object_ID, Name, Type, LowerBound, UpperBound, Notes } = x
      return {
        type: ATTRIBUTE,
        source: nodeIndex[Object_ID],
        predicate: Name,
        target: Type,
        quantifiers: getQuantifierFromBounds({ LowerBound, UpperBound }),
        description: Notes,
      }
    })

  const relations = connectors.
    map(x => {
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

      const type = Connector_Type === 'Generalization'
        ? INHERITANCE
        : RELATIONSHIP
      const predicate = DestRole
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
    })
  const edges = [...literals, ...relations]

  return { nodes, edges }
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
