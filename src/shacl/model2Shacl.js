import { applyTemplate } from './applyTemplate.js'
import { toTurtle } from './shaclTemplate.js'

async function toShacl ({ nodes, edges }) {
  return applyTemplate({ nodes, edges }, toTurtle)
}

export { toShacl }
