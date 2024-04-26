import { anyMatch, getMatcher } from '../conceptualModel/filter.js'
import { termsFromQuery } from './extractFromQuery.js'

function validateAgainstGraph (graph, { queryStr, filter }) {

  const { terms, error } = termsFromQuery({ queryStr })

  return error ? { error } : {
    terms: terms.filter(getMatcher(filter).f).map(x => ({
      term: x, isPresent: anyMatch(graph, { filter: [x] }),
    })),
  }
}

export { validateAgainstGraph }
