import { appendIssues } from '../conceptualModel/issues.js'

function toSigmaGraph (graph) {

  const g = appendIssues(graph)

  const nodes = g.nodes.map(x => {
    return {
      key: x.name,
      attributes: {
        label: x.name,
        size: x.name.startsWith('epo') ? 10 : 5,
        color: x.issues.length ? 'red' : 'blue',
      },
    }
  })

  const allNodes = new Set(nodes.map(x => x.key))

  const edges = g.edges.filter(x => allNodes.has(x.target)).map(x => {

    return {
      source: x.source,
      target: x.target,
      attributes: {
        label: `${x.predicate ?? 'NO_NAME'} ${x.quantifiers.raw ?? ''}`,
        type: 'arrow',
        color: x.predicate ? 'gray' : 'red',
      },
    }
  })

  return {
    nodes,
    edges,
  }
}

export { toSigmaGraph }
