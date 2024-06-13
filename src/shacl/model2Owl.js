import { applyTemplate } from './applyTemplate.js'
import { toTurtle } from './owlTemplate.js'

async function toOwl ({ nodes, edges }) {
  return applyTemplate({ nodes, edges }, toTurtle)
}

export { toOwl }
