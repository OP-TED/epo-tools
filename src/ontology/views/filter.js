const startsWith = (value, arr) => arr.some(x => value?.startsWith(x))

function filterBy ({ nodes, edges }, { filter, includeIncoming = true }) {
  return {
    nodes: nodes.filter(x => startsWith(x.name, filter)),
    edges: edges.filter(
      x => startsWith(x.source, filter) || startsWith(x.predicate, filter) ||
        (includeIncoming && startsWith(x.target, filter))),
  }
}

export {
  filterBy,
}
