import fs from 'fs'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { UNDER_REVIEW } from '../config.js'
import { prettyPrintTurtle } from '../io/serialization.js'
import { addEdgeWarnings, addNodeWarnings } from './ea/add-warnings.js'
import { toJson } from './ea/ea-to-json.js'
import { getTurtle } from './templates/turtle-template.js'
import { narrowToEpo } from './views/epo-views.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const jsonExport = toJson({ databasePath })
const { nodes, edges } = narrowToEpo(jsonExport)

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

const epoOntology = {
  nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
  edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
}

async function exportToTurtle ({ json, path }) {
  const turtle = getTurtle(json)
  const dataset = rdf.dataset().addAll([...new Parser().parse(turtle)])
  const pretty = await prettyPrintTurtle({ dataset })
  fs.writeFileSync(path, pretty)
  console.log('wrote', dataset.size, 'quads at', path)
}

for (const module of new Set(
  epoOntology.nodes.map(x => x.name.split(':')[0]))) {
  const epoModule = {
    nodes: epoOntology.nodes.filter(x => x.name.startsWith(`${module}:`)),
    edges: epoOntology.edges.filter(x => x.source.startsWith(`${module}:`) ||
      (x.predicate && x.predicate.startsWith(`${module}:`))),
  }
  await exportToTurtle({ json: epoModule, path: `assets/${module}.ttl` })
}

await exportToTurtle({ json: epoOntology, path: `assets/epo-all.ttl` })



