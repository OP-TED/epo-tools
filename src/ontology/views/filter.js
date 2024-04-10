const startsWith = (value, arr) => arr.some(x => value?.startsWith(x))

function filterBy ({ nodes, edges }, prefixArr) {
  return {
    nodes: nodes.filter(x => startsWith(x.name, prefixArr)),
    edges: edges.filter(x => startsWith(x.source, prefixArr) ||
      startsWith(x.predicate, prefixArr) || startsWith(x.target, prefixArr)),
  }
}

export {
  filterBy,
}
