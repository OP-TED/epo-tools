import { readFileSync } from 'fs'
import { bufferToJson } from '../../src/conceptualModel/ea-to-json.js'
import { filterBy } from '../../src/conceptualModel/filter.js'
import { UNDER_REVIEW } from '../../src/config.js'

function getJson () {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

const narrowToEpo = (g) => filterBy(g, { filter: ['epo*'] })

function getEpoJson () {
  return narrowToEpo(getJson())
}

export { getJson, getEpoJson }
