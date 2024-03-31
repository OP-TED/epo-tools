const epoExport = name => name && name.startsWith('epo')

function exportEpo ({ nodes, edges }) {
  return {
    nodes: nodes.filter(x => epoExport(x.name)),
    edges: edges.filter(x => epoExport(x.source) || epoExport(x.predicate) ||
      epoExport(x.target)),
  }
}

export { exportEpo }
