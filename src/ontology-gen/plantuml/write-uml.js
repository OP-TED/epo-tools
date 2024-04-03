import { writeFileSync } from 'fs'
import { UNDER_REVIEW } from '../../config.js'
import { extract } from '../extractFromEA.js'
import { exportSomeEpo } from '../filter-epo.js'
import { addEdgeWarnings, addNodeWarnings } from '../validate.js'
import { getPlantUML } from './plantuml-template.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const jsonExport = extract({ databasePath })

// const filter = ['epo:Notice',  'epo:Document']
const filter = ['epo:Notice', 'epo:Document', 'epo:Procedure', "epo:ProcurementObject", "epo:Purpose"]

const options = {
  onlyClassesOf: new Set(filter), includeIncoming: false,
}
const { nodes, edges } = exportSomeEpo(jsonExport, options)

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

const epoOntology = {
  nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
  edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
}

const plantUML = getPlantUML(epoOntology)
const plantumlPath = `assets/epo.plantuml`
writeFileSync(plantumlPath, plantUML)
console.log('wrote', plantumlPath)
