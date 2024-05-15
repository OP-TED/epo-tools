import { ATTRIBUTE } from '../conceptualModel/const.js'
import { appendIssues } from '../conceptualModel/issues.js'
import chroma from 'chroma-js'
import { getAllPrefixes, getPrefix } from '../prefix/prefix.js'

function toSigmaGraph (graph) {

  const prefixes = getAllPrefixes(graph).map(prefix => ({
    prefix,
    color: chroma.random().hex(),
  }))

  const g = appendIssues(graph)
  const toKey = (name) => name ?? 'NO_NAME'
  const nodes = g.nodes.map(x => {
    const name = toKey(x.name)

    const prefix = getPrefix(name)
    const color = prefixes.find(x=> x.prefix === prefix)?.color || 'red'

    return {
      key: name,
      attributes: {
        label: name,
        size: name?.startsWith('epo') ? 10 : 5,
        color,
        borderColor: x.issues?.length ? 'red' : 'black',

      },
    }
  })

  const allNodes = new Set(nodes.map(x => x.key))

  const edges = g.edges.filter(x => x.type !== ATTRIBUTE).map(x => {

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
