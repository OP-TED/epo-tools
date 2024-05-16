import { startsWith } from '../conceptualModel/filter.js'
import { getAllPrefixes } from '../prefix/prefix.js'
import { toPlantuml } from './plantumlTemplate.js'

function getComparisonChunks (g1, g2) {
  const allPrefixes = [
    ...new Set([...getAllPrefixes(g1), ...getAllPrefixes(g2)])]
  return allPrefixes.map(prefix => {

    const opts = { shrink: true, sorted: true }
    const prev = toPlantuml(startsWith(g1, `${prefix}:`), opts)
    const current = toPlantuml(startsWith(g2, `${prefix}:`), opts)
    return {
      title: prefix,
      prev,
      current,
    }
  })
}

export { getComparisonChunks }
