import { UNDER_REVIEW } from '../src/config.js'
import { getEpoJson, getJson } from '../src/epo/readEpo.js'
import { readFileSync, writeFileSync } from 'fs'

function getTraces (trace) {
  const allNodeIds = [
    ...new Set(
      Object.values(trace).
        flatMap(({ nodes }) => nodes.map(x => x.eaId)))].sort()

  const nodeTrace = allNodeIds.map(id => ({
    id,
    elements: Object.keys(trace).
      map(key => trace[key].nodes.find(x => x.eaId === id)),
  }))

  // Traces for edges cannot be computed from Ids, since the eAP contains elements that are not referenced by any class.
  const allEdgeIds = [
    ...new Set(
      Object.values(trace).
        flatMap(({ edges }) => edges.map(x => x.eaId)))].sort()

  const edgeTrace = allEdgeIds.map(id => ({
    id,
    elements: Object.keys(trace).
      map(key => trace[key].edges.find(x => x.eaId === id)),
  }))

  return { nodeTrace, edgeTrace }
}

// Needs deprecate

const needsDeprecate = x => x.elements.at(-1) === undefined

const isEpoNode = x => x.elements.find(x => x?.name.startsWith('epo'))
const toNodeRow = x => `| ${x.id} | ${x.elements.map(x => x?.name).join('|')} |`

const isEpoEdge = x => x.elements.find(x => x?.predicate.startsWith('epo'))
const toEdgeRow = x => `| ${x.id} | ${x.elements.map(x => x?.predicate).
  join('|')} |`

function toMarkdown (trace) {

  const { nodeTrace, edgeTrace } = getTraces(trace)

  console.log('processed', nodeTrace.length, 'class rows')
  console.log('processed', edgeTrace.length, 'edge rows')

  const tableHeader = `eapId | ${Object.keys(trace).join('|')}`
  const tableHeader2 = `--- | ${Object.keys(trace).map(x=>'---').join('|')}`

  return `
# Models: ${Object.keys(trace).at(0)} to ${Object.keys(trace).at(-1)}

[source](../writeEapElementsGrid.js) ${new Date().toISOString()}

## Classes requiring deprecation

(might be repeated)

| ${tableHeader}  |
| ${tableHeader2} |
${nodeTrace.filter(isEpoNode).filter(needsDeprecate).map(toNodeRow).join('\n')}

## Properties requiring deprecation 

(might be repeated)

| ${tableHeader}  |
| ${tableHeader2} |
${edgeTrace.filter(isEpoEdge).filter(needsDeprecate).map(toEdgeRow).join('\n')}

## All Classes

(might be repeated)

| ${tableHeader}  |
| ${tableHeader2} |
${nodeTrace.filter(isEpoNode).map(toNodeRow).join('\n')}

## All Properties

(might be repeated)

| ${tableHeader}  |
| ${tableHeader2} |
${edgeTrace.filter(isEpoEdge).map(toEdgeRow).join('\n')}

`
}

const load = x => JSON.parse(readFileSync(x, 'utf8'))

const { databasePath, tag } = UNDER_REVIEW
const current = getJson({ databasePath })

const traceV4 = {
  'ePO_CM_v4.0.0': load('public/models/ePO_CM_v4.0.0.json'),
  'ePO_CM_v4.0.2': load('public/models/ePO_CM_v4.0.2.json'),
  'ePO_CM_current': current,
}

writeFileSync('outputs/deprecated/needs_deprecate_v4.md', toMarkdown(traceV4))

const traceV3 = {
  'ePO_CM_v3.0.0': load('public/models/ePO_CM_v3.0.0.json'),
  'ePO_CM_v3.0.1': load('public/models/ePO_CM_v3.0.1.json'),
  'ePO_CM_v3.1.0': load('public/models/ePO_CM_v3.1.0.json'),
}
writeFileSync('outputs/deprecated/needs_deprecate_v3.md', toMarkdown(traceV3))

// const traceV3V4 = {
//   'ePO_CM_v3.0.0': load('public/models/ePO_CM_v3.0.0.json'),
//   'ePO_CM_v3.0.1': load('public/models/ePO_CM_v3.0.1.json'),
//   'ePO_CM_v3.1.0': load('public/models/ePO_CM_v3.1.0.json'),
//   'ePO_CM_v4.0.0': load('public/models/ePO_CM_v4.0.0.json'),
//   'ePO_CM_v4.0.2': load('public/models/ePO_CM_v4.0.2.json'),
//   'ePO_CM_current': current,
// }
// writeFileSync('outputs/deprecated/V3-V4_overview.md', toMarkdown(traceV3V4))
