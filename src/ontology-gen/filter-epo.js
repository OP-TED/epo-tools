const startsWithEpo = name => name && name.startsWith('epo')

function exportEpo ({ nodes, edges }) {
  const toExport = startsWithEpo
  return {
    nodes: nodes.filter(x => toExport(x.name)),
    edges: edges.filter(
      x => toExport(x.source) || toExport(x.predicate) || toExport(x.target)),
  }
}

function exportSomeEpo ({ nodes, edges }, { onlyClassesOf, includeIncoming }) {

  const toExport = (x) => startsWithEpo(x) && onlyClassesOf.has(x)

  const edgesToExport = edges.filter(
    x => toExport(x.source) || (includeIncoming && toExport(x.target)))

  const exportedSources = new Set(edgesToExport.map(x => x.source))

  const nodesToExport = nodes.filter(
    x => startsWithEpo(x.name) && exportedSources.has(x.name))

  return {
    nodes: nodesToExport, edges: edgesToExport,
  }
}

export { exportEpo, exportSomeEpo }
