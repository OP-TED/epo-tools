import { UNDER_REVIEW } from '../src/config.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { readFileSync, writeFileSync } from 'fs'

const load = x => JSON.parse(readFileSync(x, 'utf8'))

const { databasePath, tag } = UNDER_REVIEW
const current = getEpoJson({ databasePath })

const trace = {
  'ePO_CM_v4.0.0': load('public/models/ePO_CM_v4.0.0.json'),
  'ePO_CM_v4.0.2': load('public/models/ePO_CM_v4.0.2.json'),
  'ePO_CM_current': current,
}

// Needs deprecate

const needsDeprecate = x => x.elements.at(-1) === undefined

// Nodes

const allNodeIds = [
  ...new Set(
    Object.values(trace).
      flatMap(({ nodes }) => nodes.map(x => x.eaId)))].sort()

const nodeTrace = allNodeIds.map(id => ({
  id,
  elements: Object.keys(trace).
    map(key => trace[key].nodes.find(x => x.eaId === id)),
}))

const isEpoNode = x => x.elements.find(x => x?.name.startsWith('epo'))

const toNodeRow = x => `| ${x.id} | ${x.elements.map(x => x?.name).join('|')} |`

// Edges

const allEdgeIds = [
  ...new Set(
    Object.values(trace).
      flatMap(({ edges }) => edges.map(x => x.eaId)))].sort()

const edgeTrace = allEdgeIds.map(id => ({
  id,
  elements: Object.keys(trace).
    map(key => trace[key].edges.find(x => x.eaId === id)),
}))

const isEpoEdge = x => x.elements.find(x => x?.predicate.startsWith('epo'))

const toEdgeRow = x => `| ${x.id} | ${x.elements.map(x => x?.predicate).
  join('|')} |`

// Needs deprecation

// Markdown

console.log('processed', nodeTrace.length, 'class rows')
console.log('processed', edgeTrace.length, 'edge rows')

const allEapElements = `
# All EPO elements from v4.0.0 to Develop

## Classes requiring deprecation

(might be repeated)

| eapID | v4.0.0 | v4.0.2 | Current |
|-------|--------|--------|---------|
${nodeTrace.filter(isEpoNode).filter(needsDeprecate).map(toNodeRow).join('\n')}

## Properties requiring deprecation 

(might be repeated)

| eapID | v4.0.0 | v4.0.2 | Current |
|-------|--------|--------|---------|
${edgeTrace.filter(isEpoEdge).filter(needsDeprecate).map(toEdgeRow).join('\n')}

## All Classes

(might be repeated)

| eapID | v4.0.0 | v4.0.2 | Current |
|-------|--------|--------|---------|
${nodeTrace.filter(isEpoNode).map(toNodeRow).join('\n')}

## All Properties

(might be repeated)

| eapID | v4.0.0 | v4.0.2 | Current |
|-------|--------|--------|---------|
${edgeTrace.filter(isEpoEdge).map(toEdgeRow).join('\n')}


[source](../writeDeprecated.js) ${new Date().toISOString()}
`

writeFileSync('outputs/deprecated/allEapElements.md', allEapElements)


