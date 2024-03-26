import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

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
  } else return {
    noQuantifier: true,
  }
}

function hasCurie (name) {
  if (name.split(':').length === 2) {
    return true
  }
}

// Code smell
function getWarnings ({ source, predicate, target, isLiteral }, noQuantifiers) {

  const warnings = []

  const requiresQuantifiers = predicate !== 'rdfs:subClassOf'
  const requiresTargetPrefix = !isLiteral

  if (noQuantifiers && requiresQuantifiers) {
    warnings.push(`No quantifiers defined`)
  }
  if (!source) {
    warnings.push(`No source defined`)
  } else if (!hasCurie(source)) {
    warnings.push(`No prefix for source [${source}]`)
  }

  if (!predicate) {
    warnings.push(`No predicate defined`)
  } else if (!hasCurie(predicate)) {
    warnings.push(`No prefix for predicate [${predicate}]`)
  }
  if (!target) {
    warnings.push(`No target defined`)
  } else if (requiresTargetPrefix && !hasCurie(target)) {
    warnings.push(`No prefix for target [${target}]`)
  }

  return warnings
}

function extract ({ databasePath }) {
  console.log('reading database', databasePath)

  const buffer = readFileSync(databasePath)
  const reader = new MDBReader(buffer)

  const nodes = []
  const relations = []

  const objectIndex = {}
  for (const { Object_ID, Name, Note } of reader.getTable('t_object').
    getData()) {
    if (Name) {
      objectIndex[Object_ID] = Name

      const warnings = hasCurie(Name) ? [] : [`no prefix for ${Name}`]

      if (toExport(Name)) {
        nodes.push({
          name: Name, description: Note, warnings,
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

        const result = {
          source: domain,
          predicate: Name,
          target: Type,
          min,
          max,
          description: Notes,
          isLiteral: true,
        }

        const noQuantifiers = !(LowerBound || UpperBound)
        result.warnings = getWarnings(result, noQuantifiers)
        relations.push(result)
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

      const { min, max, noQuantifier } = getQuantifier(DestCard)
      const result = {
        source: domain,
        predicate,
        target: range,
        description: Notes,
        min,
        max,
        isLiteral: false,
      }

      result.warnings = getWarnings(result, noQuantifier)
      relations.push(result)

    }
  }

  return { nodes, relations }
}

export { extract }
