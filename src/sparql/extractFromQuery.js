import { Parser } from 'sparqljs'

const prefixedTerm = prefixes => term => {
  const prefixMatch = Object.entries(prefixes).
    find(([prefix, uri]) => term.value.startsWith(uri))
  if (prefixMatch) {
    const [prefix, uri] = prefixMatch
    return `${prefix}:${term.value.substring(uri.length)}`
  } else {
    // console.log(`I don't know ${term.value}`)
  }
}

const isNamed = term => term && term.termType === 'NamedNode'

function flatQuery (parsedQuery) {
  const getPrefixedTerm = prefixedTerm(parsedQuery.prefixes)
  const { where } = parsedQuery
  return where.filter(x => x.type === 'bgp').
    flatMap(x => x.triples).
    flatMap(({ subject, predicate, object }) => [subject, predicate, object]).
    filter(isNamed).
    map(getPrefixedTerm).
    filter(x => x)
}

function termsFromQuery ({ queryStr }) {
  const parser = new Parser()
  try {
    const parsedQuery = parser.parse(queryStr)
    return { terms: flatQuery(parsedQuery) }
  } catch (error) {
    return { error }
  }
}

export { termsFromQuery }
