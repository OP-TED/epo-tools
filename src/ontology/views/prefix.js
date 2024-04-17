const hasPrefix = (name) => name ? name.split(':').length === 2 : false

const getPrefix = (name) => hasPrefix(name) ? name.split(':')[0] : undefined

const stripPrefix = (str) => str.split(':').slice(1).join(':') || str

function getAllPrefixes ({ nodes, edges }) {
  return noDuplicates(nodes.map(x => x.name).filter(hasPrefix).map(getPrefix))
}

const noDuplicates = (arr) => [...new Set(arr)]

// modified from: https://www.30secondsofcode.org/js/s/string-case-conversion/
const toSpaced = str => str && str.match(
  /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).
  // map(x => str.toUpperCase() === str ? x : x.toLowerCase()).
  map(x => x.toLowerCase()).
  join(' ')

export { hasPrefix, getPrefix, stripPrefix, getAllPrefixes, toSpaced }
