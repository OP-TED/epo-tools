import { filterByPrefix } from '../conceptualModel/filter.js'
import { toPlantuml } from './plantumlTemplate.js'
import { getAllPrefixes } from '../prefix/prefix.js'

function getComparisonChunks (g1, g2) {
  const allPrefixes = [
    ...new Set([...getAllPrefixes(g1), ...getAllPrefixes(g2)])]
  return allPrefixes.map(prefix => {

    const prev = toPlantuml(filterByPrefix(g1, { prefix }),
      { includeRelationships: false, sorted: true })
    const current = toPlantuml(filterByPrefix(g2, { prefix }),
      { includeRelationships: false, sorted: true })
    return {
      title: prefix,
      prev,
      current,
    }
  })
}

export { getComparisonChunks }
