import wcmatch from 'wildcard-match'
import { ATTRIBUTE } from './const.js'

// Returns true is there are matches in the ontology
function anyMatch ({ nodes, edges }, { filter }) {

  const f = matchHasPositives(filter)
  for (const { source, predicate, object } of edges) {
    if (f(source)
      || f(predicate)
      || f(object)) {
      return true
    }
  }
  return false
}

function startsWith (g, start) {
  const f = (value) => value?.startsWith(start)
  const { nodes, edges, ...tail } = g

  const matchedNodes = nodes.filter(x => f(x.name))
  const allNodes = new Set(matchedNodes.map(x => x.name))
  const matchedEdges = edges.filter(x => allNodes.has(x.source))

  return {
    nodes: matchedNodes,
    edges: matchedEdges, ...tail,
  }
}

// This is becoming slow, at some point I could use an in-memory database
function filterBy ({ nodes, edges }, { filter, includeIncoming }) {
  const f = matchHasPositives(filter)

  // Assumption
  // If the user searches a node she is interested in inspecting their attributes and predicates
  // If the user searches by predicates, is interested in how the entities connect.

  // Behavior
  // Matches per node return all attributes.
  // Matches per predicate might or not return all attributes
  // if there are two nodes connected somehow in the view, then show the connection

  const matchByNodeName = new Set(nodes.map(x => x.name).filter(f))
  const matchByPredicate = new Set(edges.map(x => x.predicate).filter(f))
  const matchAttributesByTarget = new Set(
    edges.filter(x => x.type === ATTRIBUTE).map(x => x.target).filter(f))

  const edgesToDisplay = ({ source, predicate, target }) => matchByNodeName.has(
      source) || matchByPredicate.has(predicate) ||
    matchAttributesByTarget.has(target) ||
    (includeIncoming && matchByNodeName.has(target))

  const nodesMatchedByEdge = edges.filter(edgesToDisplay).
    flatMap(({ source, target, type }) => type === ATTRIBUTE ? [source] : [
      source, target]).
    filter(x => x)

  const nodesToDisplay = new Set(
    [...nodesMatchedByEdge, ...matchByNodeName])

  const filteredEdges = edges.filter(edge => edgesToDisplay(edge) ||
    (nodesToDisplay.has(edge.source) && nodesToDisplay.has(edge.target)))

  return {
    nodes: nodes.filter(x => nodesToDisplay.has(x.name)), edges: filteredEdges,
  }
}

function suggestNodes ({ nodes, edges }, { filter }) {
  const f = matchHasPositives(filter)
  const candidates = edges.filter(x => x.type !== ATTRIBUTE).
    flatMap(({ source, target }) => [source, target])
  return [...new Set(candidates)].filter(x => !f(x))
}

const apply = value => f => value ? f(value) : false

const matchHasPositives = filterArr => value => filterArr.
  map(x => wcmatch(x)).
  some(apply(value))

export {
  filterBy, startsWith, anyMatch, suggestNodes, matchHasPositives,
}
