import { readFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'
import { startsWith } from '../conceptualModel/filter.js'

function getJson ({ databasePath }) {
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

const narrowToEpo = (g) => startsWith(g, 'epo')

function getEpoJson ({ databasePath }) {
  const json = getJson({ databasePath })
  return narrowToEpo(json)
}

function noObjectNodes (g) {
  const toFilter = new Set(
    g.nodes.filter(x => x.type === 'Object').map(x => x.name))
  return {
    nodes: g.nodes.filter(x => !toFilter.has(x.name)),
    edges: g.edges.filter(
      x => !(toFilter.has(x.source) || toFilter.has(x.target))),
  }
}

function noTemporaryVocab (g) {
  const toFilter = new Set(
    g.nodes.filter(x => x.name.startsWith('at-voc-new')).map(x => x.name))
  return {
    nodes: g.nodes.filter(x => !toFilter.has(x.name)),
    edges: g.edges.filter(
      x => !(toFilter.has(x.source) || toFilter.has(x.target))),
  }
}


export { getJson, getEpoJson, noObjectNodes, noTemporaryVocab }
