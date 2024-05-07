import { anyMatch, getMatcher } from '../conceptualModel/filter.js'
import { termsFromQuery } from './extractFromQuery.js'

function validateAgainstGraph (graph, { queryStr, filter }) {

  const { terms, error } = termsFromQuery({ queryStr })

  const { f, nf } = getMatcher(filter)
  return error ? { error } : {
    terms: terms.filter(f).filter(x => !nf(x)).map(x => ({
      term: x, isPresent: anyMatch(graph, { filter: [x] }),
    })),
  }
}

export { validateAgainstGraph }
