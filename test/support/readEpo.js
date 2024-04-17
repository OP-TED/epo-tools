import { readFileSync } from 'fs'
import { UNDER_REVIEW } from '../../src/config.js'
import { bufferToJson } from '../../src/ontology/ea/ea-to-json.js'
import { narrowToEpo } from '../../src/ontology/views/epo-views.js'

function getJson () {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

function getEpoJson () {
  return narrowToEpo(getJson())

}

export { getJson, getEpoJson }
