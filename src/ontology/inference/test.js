import { readFileSync } from 'fs'
import { UNDER_REVIEW } from '../../config.js'
import { bufferToJson } from '../ea/ea-to-json.js'
import { narrowToEpo } from '../views/epo-views.js'
import { filterBy } from '../views/filter.js'
import { toShacl } from '../views/shacl.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const buffer = readFileSync(databasePath)
const eaJson = bufferToJson({ buffer })

const epoJson = narrowToEpo(eaJson)

const filter = ['epo:Buyer', 'epo:AwardDecision', 'epo:AwardOutcome']
const narrow = filterBy(epoJson, { filter, includeIncoming: false })

const { dataset, turtle, errors } = await toShacl(narrow, { inference: true })

console.log(turtle)
