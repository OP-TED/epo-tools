import { readFileSync } from 'fs'
import { UNDER_REVIEW } from '../config.js'
import { writePrettyTurtle } from '../io/assets.js'
import { addEdgeWarnings, addNodeWarnings } from './ea/add-warnings.js'
import { bufferToJson } from './ea/ea-to-json.js'
import { toTurtle } from './templates/turtle-template.js'
import { narrowToEpo } from './views/epo-views.js'
import { addTags, filterByTags, getAllTags } from './views/tags.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const buffer = readFileSync(databasePath)
const eaJson = bufferToJson({ buffer })

const { nodes, edges } = narrowToEpo(eaJson)
const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')
const epoOntology = {
  nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
  edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
}
const allModules = [...getAllTags(epoOntology)]
const taggedEpo = addTags(epoOntology)
for (const module of allModules) {
  const epoModule = filterByTags(taggedEpo, new Set([module]))
  await writePrettyTurtle(toTurtle(epoModule), `assets/${module}.ttl`)
}





