import { filterBy } from './filter.js'
import { getAllPrefixes } from './prefix.js'

function narrowToEpo ({ nodes, edges }) {
  const allPrefixes = getAllPrefixes({ nodes, edges })
  const filter = allPrefixes.filter(x => x.startsWith('epo')).map(x => `${x}:`)
  return filterBy({ nodes, edges }, filter)
}

export {
  narrowToEpo,
}
