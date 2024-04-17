import { termsFromQuery } from './extract.js'
import { anyMatch } from '../views/filter.js'

function validateAgainstGraph (graph, { queryStr }) {
  const { terms, error } = termsFromQuery({ queryStr })
  return error ? { error } : {
    terms: terms.map(x => ({
      term: x, isPresent: anyMatch(graph, { filter: [x] }),
    })),
  }
}

export { validateAgainstGraph }
