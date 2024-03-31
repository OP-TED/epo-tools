import fs from 'fs'
import { UNDER_REVIEW } from '../../config.js'
import { extract } from '../extractFromEA.js'
import { exportEpo } from '../filter.js'
import { addEdgeWarnings, addNodeWarnings } from '../validate.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

const withWarnings = x => x.warnings.length > 0

const jsonExport = extract({ databasePath })
const epoJson = exportEpo(jsonExport)

const modulePath = `assets/ea-checks-with-warnings.json`
fs.writeFileSync(modulePath, JSON.stringify({
  nodes: epoJson.nodes.map(addNodeWarnings),
  edges: epoJson.edges.map(addEdgeWarnings),
}, null, 2))
console.log('wrote report at', modulePath)
