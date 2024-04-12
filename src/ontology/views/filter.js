import wcmatch from 'wildcard-match'

const isNegation = (x) => x.startsWith('!') | x.startsWith('-')
const apply = value => f => value ? f(value) : false
const matchHasPositives = arr => value => arr.filter(x => !isNegation(x)).
  map(x => wcmatch(x)).
  some(apply(value))

const matchHasNegatives = arr => value => arr.filter(isNegation).
  map(x => wcmatch(x.slice(1))).
  some(apply(value))

function filterBy ({ nodes, edges }, { filter, includeIncoming = true }) {

  const f = matchHasPositives(filter)
  const nf = matchHasNegatives(filter)

  return {
    nodes: nodes.filter(x => f(x.name)),
    edges: edges.filter(
      x => !(nf(x.source) || nf(x.predicate) || nf(x.target)) &&
        (f(x.source) || f(x.predicate) || includeIncoming && f(x.target))),
  }
}

export {
  filterBy,
}
