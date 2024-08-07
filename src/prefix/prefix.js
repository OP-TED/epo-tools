import { aliases, ns } from '../namespaces.js'

const hasPrefix = (name) => name ? name.split(':').length === 2 : false

const getPrefix = (name) => hasPrefix(name) ? name.split(':')[0] : undefined

const stripPrefix = (str) => str.split(':').slice(1).join(':') || str

const noDuplicates = (arr) => [...new Set(arr)]

function getAllPrefixes ({ nodes, edges }) {
  return noDuplicates(nodes.map(x => x.name).filter(hasPrefix).map(getPrefix))
}

function capitalizeFirst (phrase) {
  return phrase.length === 0 ? '' : phrase.charAt(0).toUpperCase() +
    phrase.slice(1)
}

// modified from: https://www.30secondsofcode.org/js/s/string-case-conversion/
const toSpaced = str => str && str.match(
  /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).
  // map(x => str.toUpperCase() === str ? x : x.toLowerCase()).
  map(x => x.toLowerCase()).
  join(' ')

const toOneLine = (def) => (def.split(/\s+/).
  map(x => x.trim()).
  join(' ')).replaceAll('"', '')

const allPrefixes = { ...ns, ...aliases }

function toTerm (value) {
  if (!hasPrefix(value)) {
    throw Error(`${value} has no prefix`)
  }
  const prefix = getPrefix(value)
  if (!allPrefixes[prefix]) {
    throw Error(`${prefix} not known (${value})`)
  }
  return allPrefixes[prefix](stripPrefix(value))
}

function turtlePrefixes (namespaces) {
  const prefixes = []
  for (const a in namespaces) {
    prefixes.push(`@prefix ${a}: <${namespaces[a]()}> .`)
  }
  return prefixes.join('\n')
}

export {
  hasPrefix,
  getPrefix,
  stripPrefix,
  getAllPrefixes,
  capitalizeFirst,
  toSpaced,
  toTerm,
  turtlePrefixes,
  toOneLine,
}
