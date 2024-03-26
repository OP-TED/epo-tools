import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

// const toExport = name => name.startsWith('epo-acc')
// const toExport = name => name.startsWith('epo-sub')
// const toExport = name => name.startsWith('epo-acc') ||
//   name.startsWith('epo-sub')
const toExport = name => name.startsWith('epo')

function getQuantifier (value) {
  if (value === '0..1') {
    return { min: 0, max: 1 }
  } else if (value === '1') {
    return { min: 1, max: 1 }
  } else if (value === '1..*') {
    return { min: 1 }
  } else if (value === '0..*') {
    return {}
  } else {
    return {
      noQuantifier: `cannot recognize ${value}`,
    } // Note that undefined != null
  }
}

function extract ({ databasePath }) {
  console.log('reading database', databasePath)

  const buffer = readFileSync(databasePath)
  const reader = new MDBReader(buffer)

  const classes = []
  const attributes = []
  const predicates = []

  const objectIndex = {}
  for (const { Object_ID, Name, Note } of reader.getTable('t_object').
    getData()) {
    if (Name) {
      objectIndex[Object_ID] = Name
      if (toExport(Name)) {
        classes.push({
          name: Name, description: Note,
        })
      }

    }
  }
  for (const {
    Object_ID, Name, Notes, LowerBound, UpperBound, Type
  } of reader.getTable('t_attribute').getData()) {
    const domain = objectIndex[Object_ID]
    if ((domain && toExport(domain)) || (Name && toExport(Name))) {

      if (domain && Name && Type) {

        const min = LowerBound
        const max = UpperBound === '*' ? undefined : UpperBound

        attributes.push({
          source: domain,
          predicate: Name,
          target: Type,
          min,
          max,
          noQuantifier: !(LowerBound || UpperBound),
          description: Notes,
        })
      } else {
        console.error(domain, Name, Type)
      }
    }
  }
  for (const current of reader.getTable('t_connector').getData()) {

    const {
      Direction,
      Notes,
      DestCard,
      SourceRole,
      DestRole,
      Start_Object_ID,
      End_Object_ID,
      Connector_Type,
    } = current

    const domain = objectIndex[Start_Object_ID]
    const range = objectIndex[End_Object_ID]

    if ((SourceRole && toExport(SourceRole)) ||
      (DestRole && toExport(DestRole)) || (domain && toExport(domain)) ||
      (range && toExport(range))) {

      const predicate = Connector_Type === 'Generalization'
        ? 'rdfs:subClassOf'
        : DestRole

      if (Direction !== 'Source -> Destination') { // Apparently this is not taken into account
        // console.log(domain, predicate, range)
      }
      if (Direction !== 'Bi-Directional') { // Apparently this is not taken into account
        // console.log('Bidirectional',domain, predicate, range)
      }

      if (domain && predicate && range) {
        predicates.push({
          source: domain, predicate, target: range, ...getQuantifier(DestCard), description: Notes,
        })
      } else {
        // console.error(domain, predicate, range)
      }

    }
  }

  return { classes, predicates, attributes }
}

export { extract }
