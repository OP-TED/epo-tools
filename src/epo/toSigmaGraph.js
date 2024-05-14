import { appendIssues } from '../conceptualModel/issues.js'

function toSigmaGraph (graph) {

  const g = appendIssues(graph)
  const toKey = (name) => name ?? 'NO_NAME'
  const nodes = g.nodes.map(x => {
    const name = toKey(x.name)
    return {
      key: name,
      attributes: {
        label: name,
        size: name?.startsWith('epo') ? 10 : 5,
        color: x.issues?.length ? 'red' : 'blue',
      },
    }
  })

  const allNodes = new Set(nodes.map(x => x.key))

  const edges = g.edges.map(x => {

    const source = toKey(x.source)
    const target = toKey(x.target)
    const predicate = toKey(x.predicate)

    if (!allNodes.has(target)) {
      nodes.push({
        key: target,
        attributes: {
          label: target,
          size: 3,
          color: 'red',
        },
      })
      allNodes.add(target)
    }

    return {
      source,
      target,
      attributes: {
        label: `${predicate} ${x.quantifiers?.raw ?? ''}`,
        type: 'arrow',
        color: predicate ? 'gray' : 'red',
      },
    }
  })

  return {
    nodes,
    edges,
  }
}

export { toSigmaGraph }
