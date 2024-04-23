import { anyMatch } from '../conceptualModel/filter.js'
import { termsFromQuery } from './extractFromQuery.js'

function validateAgainstGraph (graph, { queryStr }) {
  const { terms, error } = termsFromQuery({ queryStr })
  return error ? { error } : {
    terms: terms.map(x => ({
      term: x, isPresent: anyMatch(graph, { filter: [x] }),
    })),
  }
}

export { validateAgainstGraph }
