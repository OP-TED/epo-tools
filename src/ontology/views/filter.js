import wcmatch from 'wildcard-match'
import { ATTRIBUTE } from '../const.js'

function filterBy ({ nodes, edges }, options) {
  const { nodeFilter, edgeFilter } = createFilters(options)
  return {
    nodes: nodes.filter(nodeFilter), edges: edges.filter(edgeFilter),
  }
}

function suggestNodes ({ nodes, edges }, options) {
  const { nodeFilter } = createFilters(options)
  const candidates = edges.filter(x => x.type !== ATTRIBUTE).
    flatMap(x => [x.source, x.target])
  const candidatesAsNodes = [...new Set(candidates)].map(x => ({ name: x }))
  return candidatesAsNodes.filter(x => !nodeFilter(x))
}

const isNegation = (x) => x.startsWith('!') | x.startsWith('-')

const apply = value => f => value ? f(value) : false

const matchHasPositives = arr => value => arr.filter(x => !isNegation(x)).
  map(x => wcmatch(x)).
  some(apply(value))

const matchHasNegatives = arr => value => arr.filter(isNegation).
  map(x => wcmatch(x.slice(1))).
  some(apply(value))

function createFilters ({ filter, includeIncoming = true }) {
  const f = matchHasPositives(filter)
  const nf = matchHasNegatives(filter)
  const nodeFilter = x => f(x.name)
  const edgeFilter = x => !(nf(x.source) || nf(x.predicate) || nf(x.target)) &&
    (f(x.source) || f(x.predicate) || includeIncoming && f(x.target))
  return { nodeFilter, edgeFilter }
}

export {
  filterBy, suggestNodes,
}
