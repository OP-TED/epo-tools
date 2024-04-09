import { readFileSync, writeFileSync } from 'fs'
import { UNDER_REVIEW } from '../config.js'
import { addEdgeWarnings, addNodeWarnings } from './ea/add-warnings.js'
import { bufferToJson } from './ea/ea-to-json.js'
import { toPlantuml } from './templates/plantuml-template.js'
import { narrowToEpoClasses } from './views/epo-views.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

const buffer = readFileSync(databasePath)
const eaJson = bufferToJson({ buffer })

const classes = [
  'epo:Notice', 'epo:Document', // 'epo:Procedure',
  // 'epo:Lot',
  // 'epo:LotAwardOutcome',
  // 'epo:AwardOutcome',
  // 'epo:MonetaryValue',
  // 'epo:ProcurementObject',
  // 'epo:ProcurementElement',
  // 'epo:Purpose'
]

const options = {
  onlyClassesOf: new Set(classes), includeIncoming: false,
}

const { nodes, edges } = narrowToEpoClasses(eaJson, options)
// const {nodes, edges} = exportEpo(jsonExport) // All, do not try at home

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

const epoOntology = {
  nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
  edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
}

const plantUML = toPlantuml(epoOntology)
const plantumlPath = `assets/epo.plantuml`
writeFileSync(plantumlPath, plantUML)
console.log('wrote', plantumlPath)
