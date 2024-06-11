import { writeFileSync } from 'fs'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { inspectEdge, inspectNode } from '../conceptualModel/issues.js'
import { prettyPrintTurtle } from '../io/serialization.js'
import { toTurtle } from './shaclTemplate.js'

async function parseUgly (uglyTurtle) {
  const dataset = await rdf.dataset().
    addAll([...new Parser().parse(uglyTurtle)])
  const turtle = await prettyPrintTurtle({ dataset })
  return { dataset, turtle }
}

async function toShacl ({ nodes, edges }) {
  const hasErrors = x => x.some(x => x.severity === 'error')

  const uglyTurtle = toTurtle({
    nodes: nodes.filter(x => !hasErrors(inspectNode(x))),
    edges: edges.filter(x => !hasErrors(inspectEdge(x))),
  })

  const path = `assets/ugly.shacl.ttl`
  writeFileSync(path, uglyTurtle)


  return {
    ...(await parseUgly(uglyTurtle)), errors: {
      nodes: nodes.filter(x => hasErrors(inspectNode(x))).
        map(x => ({ ...x, errors: inspectNode(x) })),
      edges: edges.filter(x => hasErrors(inspectEdge(x))).
        map(x => ({ ...x, errors: inspectEdge(x) })),
    },
  }
}

export { toShacl }
