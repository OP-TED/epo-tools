import { anyMatch, matchHasPositives } from '../conceptualModel/filter.js'
import { termsFromQuery } from './extractFromQuery.js'

function validateAgainstGraph (graph, { queryStr, filter }) {

  const { terms, error } = termsFromQuery({ queryStr })

  const f = matchHasPositives(filter)
  return error ? { error } : {
    terms: terms.filter(f).map(x => ({
      term: x, isPresent: anyMatch(graph, { filter: [x] }),
    })),
  }
}

export { validateAgainstGraph }
