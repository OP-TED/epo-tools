import { UNDER_REVIEW } from '../../config.js'
import { addEdgeWarnings, addNodeWarnings, extract } from '../extractFromEA.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

const withWarnings = x => x.warnings.length > 0

const jsonExport = extract({ databasePath })

const allNodes = jsonExport.nodes.map(addNodeWarnings).filter(withWarnings)
const allEdges = jsonExport.edges.map(addEdgeWarnings).filter(withWarnings)
console.log('--- Nodes')
console.log(allNodes)
console.log('--- Relations')
console.log(allEdges)
