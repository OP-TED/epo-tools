import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

function extract ({ databasePath }) {

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
    map(x => ({
      source: nodeIndex[x.Object_ID],
      predicate: x.Name,
      target: x.Type,
      min: x.LowerBound,
      max: x.UpperBound === '*' ? undefined : x.UpperBound,
      noQuantifiers: !(x.LowerBound || x.UpperBound),
      description: x.Notes,
      type: ATTRIBUTE,
    }))

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
        source,
        predicate,
        target, ...parseQuantifierString(DestCard),
        description: Notes,
        type,
      }
    })
  const edges = [...literals, ...relations]

  return { nodes, edges }
}

function parseQuantifierString (str) {
  if (str === '0..1') {
    return { min: 0, max: 1 }
  } else if (str === '1') {
    return { min: 1, max: 1 }
  } else if (str === '1..*') {
    return { min: 1 }
  } else if (str === '0..*') {
    return {}
  } else return {
    noQuantifiers: true,
  }
}

const ATTRIBUTE = 'attribute'
const INHERITANCE = 'inheritance-relationship'
const RELATIONSHIP = 'relationship'
export { extract, ATTRIBUTE, INHERITANCE, RELATIONSHIP }
