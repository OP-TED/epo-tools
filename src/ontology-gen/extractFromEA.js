import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

const defaultExport = name => name && name.startsWith('epo')

function extract ({ databasePath, filter }) {
  const toExport = filter ?? defaultExport

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
    })).filter(x => toExport(x.name))

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
      isLiteral: true,
    })).
    filter(
      x => toExport(x.source) || toExport(x.predicate) || toExport(x.target))

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
      const predicate = Connector_Type === 'Generalization'
        ? 'rdfs:subClassOf'
        : DestRole
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
        isLiteral: false,
      }
    }).
    filter(
      x => toExport(x.source) || toExport(x.predicate) || toExport(x.target))
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

function hasCurie (name) {
  if (name.split(':').length === 2) {
    return true
  }
}

function addNodeWarnings (node) {
  const warnings = hasCurie(node.name) ? [] : [
    {
      severity: 'error', desc: `no prefix for ${node.name}`,
    }]
  return { ...node, warnings }
}

function addEdgeWarnings (edge) {
  const {
    source, predicate, target, isLiteral, noQuantifiers,
  } = edge
  const warnings = []
  const requiresQuantifiers = predicate !== 'rdfs:subClassOf'
  const requiresTargetPrefix = !isLiteral

  if (noQuantifiers && requiresQuantifiers) {
    warnings.push({
      severity: 'error', desc: `No quantifiers defined`,
    })
  }
  if (!source) {
    warnings.push({
      severity: 'error', desc: `No source defined`,
    })
  } else if (!hasCurie(source)) {
    warnings.push({
      severity: 'error', desc: `No prefix for source [${source}]`,
    })
  }
  if (!predicate) {
    warnings.push({
      severity: 'error', desc: `No predicate defined`,
    })
  } else if (!hasCurie(predicate)) {
    warnings.push({
      severity: 'error', desc: `No prefix for predicate [${predicate}]`,
    })
  }
  if (!target) {
    warnings.push({
      severity: 'error', desc: `No target defined`,
    })
  } else if (requiresTargetPrefix && !hasCurie(target)) {
    warnings.push({
      severity: 'error', desc: `No prefix for target [${target}]`,
    })
  }

  return { ...edge, warnings }
}

export { extract, addEdgeWarnings, addNodeWarnings }