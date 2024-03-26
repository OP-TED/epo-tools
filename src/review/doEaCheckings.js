import { UNDER_REVIEW } from '../config.js'
import { extract } from './extractFromEA.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const { nodes, relations } = extract({ databasePath })

const withWarnings = x => x.warnings.length > 0

console.log('--- Nodes')
console.log(nodes.filter(withWarnings))
console.log('--- Relations')
console.log(relations.filter(withWarnings))

