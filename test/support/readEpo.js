import { readFileSync } from 'fs'
import { UNDER_REVIEW } from '../../src/config.js'
import { bufferToJson } from '../../src/ontology/ea/ea-to-json.js'
import { narrowToEpo } from '../../src/ontology/views/epo-views.js'

function getEpoJson () {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

  const buffer = readFileSync(databasePath)
  const json = bufferToJson({ buffer })
  return narrowToEpo(json)

}

export { getEpoJson }
