import wcmatch from 'wildcard-match'
import { ATTRIBUTE } from './const.js'

// Returns true is there are matches in the ontology
function anyMatch ({ nodes, edges }, { filter }) {
  const { f, nf } = getMatcher(filter)
  for (const { source, predicate, object } of edges) {
    if (f(source) || f(predicate) || f(object)) {
      return true
    }
  }
  return false
}

function filterByPrefix (g, { prefix }) {
  const byPrefix = (value) => value?.startsWith(`${prefix}:`)
  const { nodes, edges, ...tail } = g
  return {
    nodes: nodes.filter(x => byPrefix(x.name)),
    edges: edges.filter(
      x => byPrefix(x.source) || byPrefix(x.predicate)), ...tail,
  }
}

// This is becoming slow, at some point I could use an in-memory database
function filterBy ({ nodes, edges }, { filter, includeIncoming }) {
  const { f, nf } = getMatcher(filter)

  // Assumption
  // If the user searches a node she is interested in inspecting their attributes and predicates
  // If the user searches by predicates, is interested in how the entities connect.

  // Behavior
  // Marches per node return all attributes.
  // Matches per predicate might or not return all attributes
  // if there are two nodes connected somehow in the view, then show the connection

  const selectedNodes = new Set(nodes.map(x => x.name).filter(f))
  const selectedPredicates = new Set(edges.map(x => x.predicate).filter(f))
  const selectedAttributes = new Set(
    edges.filter(x => x.type === ATTRIBUTE).map(x => x.target).filter(f))

  const allowedEdge = ({ source, predicate, target }) => selectedNodes.has(
      source) || selectedPredicates.has(predicate) ||
    selectedAttributes.has(target) ||
    (includeIncoming && selectedNodes.has(target))

  const noNegatives = ({ source, predicate, target }) => !nf(source) &&
    !nf(predicate) && !nf(target)

  const nodesToDisplay = new Set(edges.filter(allowedEdge).
    filter(noNegatives).
    flatMap(({ source, target, type }) => type === ATTRIBUTE ? [source] : [
      source, target]).
    filter(x => x))

  const filteredEdges = edges.filter(edge => allowedEdge(edge) ||
    (nodesToDisplay.has(edge.source) && nodesToDisplay.has(edge.target))).
    filter(noNegatives)

  return {
    nodes: nodes.filter(x => nodesToDisplay.has(x.name)), edges: filteredEdges,
  }
}

function suggestNodes ({ nodes, edges }, { filter }) {

  const candidates = edges.filter(x => x.type !== ATTRIBUTE).
    flatMap(({ source, target }) => [source, target])

  const { f, nf } = getMatcher(filter)
  const selectedAlready = x => !nf(x) && f(x)
  return [...new Set(candidates)].filter(x => !selectedAlready(x))
}

const isNegation = (x) => x.startsWith('!') | x.startsWith('-')

const getMatcher = (filter) => ({
  f: matchHasPositives(filter), nf: matchHasNegatives(filter),
})
const apply = value => f => value ? f(value) : false

const matchHasPositives = arr => value => arr.filter(x => !isNegation(x)).
  map(x => wcmatch(x)).
  some(apply(value))

const matchHasNegatives = arr => value => arr.filter(isNegation).
  map(x => wcmatch(x.slice(1))).
  some(apply(value))

export {
  filterBy, filterByPrefix, anyMatch, suggestNodes, getMatcher
}
