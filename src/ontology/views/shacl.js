import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { prettyPrintTurtle } from '../../io/serialization.js'
import { addEdgeWarnings, addNodeWarnings } from '../ea/add-warnings.js'
import { toTurtle } from '../templates/turtle-template.js'

async function parseUgly (uglyTurtle) {
  const dataset = await rdf.dataset().
    addAll([...new Parser().parse(uglyTurtle)])
  const turtle = await prettyPrintTurtle({ dataset })
  return { dataset, turtle }
}

async function toShacl (
  { nodes, edges }, { inference } = { inference: false }) {
  const hasErrors = x => x.warnings.some(x => x.severity === 'error')

  const nodesWithWarnings = nodes.map(addNodeWarnings)
  const edgesWithWarnings = edges.map(addEdgeWarnings)

  const uglyTurtle = toTurtle({
    nodes: nodesWithWarnings.filter(x => !hasErrors(x)),
    edges: edgesWithWarnings.filter(x => !hasErrors(x)),
  })

  return {
    ...(await parseUgly(uglyTurtle)), errors: {
      nodes: nodesWithWarnings.filter(x => hasErrors(x)),
      edges: edgesWithWarnings.filter(x => hasErrors(x)),
    },
  }
}

export { toShacl }
