import { getPrefix } from '../util.js'

function addTags ({ nodes, edges }) {
  return {
    nodes: nodes.map(addNodeTags), edges: edges.map(addEdgeTags),
  }
}

const addNodeTags = (x) => ({
  ...x, tags: prefixSet([x.name]),
})

const addEdgeTags = (x) => ({
  ...x, tags: prefixSet([x.source, x.predicate, x.object]),
})

function getAllTags ({ nodes, edges }) {
  return prefixSet(nodes.map(x => x.name))
}

const prefixSet = (arr) => new Set(arr.map(getPrefix).filter(x => x))

function filterByTags ({ nodes, edges }, tagSet) {
  const intersects = (set1, set2) => [...set1].some(item => set2.has(item))
  return {
    nodes: nodes.filter(x => intersects(x.tags, tagSet)),
    edges: edges.filter(x => intersects(x.tags, tagSet)),
  }
}

export {
  addTags, getAllTags, filterByTags,
}

