import { UNDER_REVIEW } from '../config.js'
import { writePrettyTurtle } from '../io/assets.js'
import { addEdgeWarnings, addNodeWarnings } from './ea/add-warnings.js'
import { toJson } from './ea/ea-to-json.js'
import { toTurtle } from './templates/turtle-template.js'
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

await writePrettyTurtle(toTurtle(epoOntology), `assets/epo.ttl`)

const allPrefixes = new Set(epoOntology.nodes.map(x => x.name.split(':')[0]))
for (const module of allPrefixes) {
  const epoModule = {
    nodes: epoOntology.nodes.filter(x => x.name.startsWith(`${module}:`)),
    edges: epoOntology.edges.filter(x => x.source.startsWith(`${module}:`) ||
      (x.predicate && x.predicate.startsWith(`${module}:`))),
  }
  await writePrettyTurtle(toTurtle(epoModule), `assets/${module}.ttl`)
}





