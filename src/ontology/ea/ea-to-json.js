import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'
import { ATTRIBUTE, INHERITANCE, RELATIONSHIP } from '../const.js'

function toJson ({ databasePath }) {

  const buffer = readFileSync(databasePath)
  const reader = new MDBReader(buffer)

  const objectTable = reader.getTable('t_object').getData()

  const nodeIndex = {}
  for (const { Object_ID, Name } of objectTable) {
    nodeIndex[Object_ID] = Name
  }

  const nodes = objectTable.
    map(x => ({
      name: nodeIndex[x.Object_ID], description: x.Note,
    }))

  const literals = reader.getTable('t_attribute').
    getData().
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

  const relations = reader.getTable('t_connector').
    getData().
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
  if (str === '0..1') {
    return { min: 0, max: 1, quantifiersDeclared: true }
  } else if (str === '1') {
    return { min: 1, max: 1, quantifiersDeclared: true }
  } else if (str === '1..*') {
    return { min: 1, quantifiersDeclared: true }
  } else if (str === '0..*') {
    return { quantifiersDeclared: true }
  } else return {
    quantifiersDeclared: false,
  }
}

export { toJson }
