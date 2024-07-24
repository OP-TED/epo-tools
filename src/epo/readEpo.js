import { readFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'

function getJson ({ databasePath }) {
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

function getEpoJson ({ databasePath }) {
  const g = getJson({ databasePath })
  return filterByModule(g, 'epo')
}

// For a module
// Include all edges that have prefix as s or p
// Include all s of such edges
function filterByModule (g, prefix) {
  const edges = g.edges.filter(
    ({ source, predicate }) => source.startsWith(prefix) ||
      predicate.startsWith(prefix))
  const allNodes = new Set(edges.map(x => x.source))
  const nodes = g.nodes.filter(x => allNodes.has(x.name))
  return { edges, nodes }
}

export { getJson, getEpoJson, filterByModule }
