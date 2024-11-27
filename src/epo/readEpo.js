import { readFileSync } from 'fs'
import { eapToJson } from '../conceptualModel/eap-to-json.js'
import { qeaToJson } from '../conceptualModel/qea-to-json.js'

function getJsonFromEap ({ databasePath }) {
  const buffer = readFileSync(databasePath)
  return eapToJson({ buffer })
}

function getJsonFromQea ({ databasePath }) {
  return qeaToJson({ databasePath })
}

function getJson ({ databasePath }) {
  if (databasePath.endsWith('.eap')) {
    return getJsonFromEap({ databasePath })
  }
  if (databasePath.endsWith('.qea')) {
    return getJsonFromQea({ databasePath })
  }
  throw Error(`I don't know how to parse ${name}`)
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

export { getJsonFromEap, getJsonFromQea, getJson, filterByModule, getEpoJson }
