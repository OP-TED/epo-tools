import { getAllPrefixes, getPrefix, stripPrefix } from '../prefix/prefix.js'

function getKnownEntities ({ nodes, edges }) {
  const allPrefixes = getAllPrefixes({ nodes, edges })
  const epoPrefixes = new Set(allPrefixes.filter(x => x.startsWith('epo')))
  const expandPrefix = (set, x) => {
    if (epoPrefixes.has(getPrefix(x))) {
      set.add(`http://data.europa.eu/a4g/ontology#${stripPrefix(x)}`)
    }
    return set
  }
  const knownClasses = edges.map(x => x.source).reduce(expandPrefix, new Set())
  const knownProperties = edges.map(x => x.predicate).
    reduce(expandPrefix, new Set())
  return { knownClasses, knownProperties }
}

export { getKnownEntities }
