const hasPrefix = (name) => name ? name.split(':').length === 2 : false

const getPrefix = (name) => hasPrefix(name) ? name.split(':')[0] : undefined

function getAllPrefixes ({ nodes, edges }) {
  return noDuplicates(nodes.map(x => x.name).filter(hasPrefix).map(getPrefix))
}

const noDuplicates = (arr) => [...new Set(arr)]

export { hasPrefix, getPrefix, getAllPrefixes }
