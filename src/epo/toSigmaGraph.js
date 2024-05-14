import { appendIssues } from '../conceptualModel/issues.js'

const knownLiterals = ['rdf:PlainLiteral']

function toSigmaGraph (graph) {

  const g = appendIssues(graph)

  const nodes = g.nodes.filter(x => !knownLiterals.includes(x.name)).map(x => {
    const name = x.name ?? 'UNNAMED'
    return {
      key: x.name,
      attributes: {
        label: name,
        size: name?.startsWith('epo') ? 10 : 5,
        color: x.issues?.length ? 'red' : 'blue',
      },
    }
  })

  const allNodes = new Set(nodes.map(x => x.key))

  const edges = g.edges.map(x => {

    if (allNodes.has(x.target)) {
      return {
        source: x.source,
        target: x.target,
        attributes: {
          label: `${x.predicate ?? 'NO_NAME'} ${x.quantifiers?.raw ?? ''}`,
          type: 'arrow',
          color: x.predicate ? 'gray' : 'red',
        },
      }
    } else {

    }

  })

  return {
    nodes,
    edges,
  }
}

export { toSigmaGraph }
