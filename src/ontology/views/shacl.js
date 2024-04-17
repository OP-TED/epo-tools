import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { prettyPrintTurtle } from '../../io/serialization.js'
import { validateEdge, validateNode } from '../ea/validate.js'
import { toTurtle } from '../templates/turtle-template.js'

async function parseUgly (uglyTurtle) {
  const dataset = await rdf.dataset().
    addAll([...new Parser().parse(uglyTurtle)])
  const turtle = await prettyPrintTurtle({ dataset })
  return { dataset, turtle }
}

async function toShacl (
  { nodes, edges }, { inference } = { inference: false }) {
  const hasErrors = x => x.some(x => x.severity === 'error')

  const uglyTurtle = toTurtle({
    nodes: nodes.filter(x => !hasErrors(validateNode(x))),
    edges: edges.filter(x => !hasErrors(validateEdge(x))),
  })

  return {
    ...(await parseUgly(uglyTurtle)), errors: {
      nodes: nodes.filter(x => hasErrors(validateNode(x))).
        map(x => ({ ...x, errors: validateNode(x) })),
      edges: edges.filter(x => hasErrors(validateEdge(x))).
        map(x => ({ ...x, errors: validateEdge(x) })),
    },
  }
}

export { toShacl }
