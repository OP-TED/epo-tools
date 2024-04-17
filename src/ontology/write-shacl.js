import { readFileSync } from 'fs'
import { UNDER_REVIEW } from '../config.js'
import { bufferToJson } from './ea/ea-to-json.js'
import { narrowToEpo } from './views/epo-views.js'
import { toShacl } from './views/shacl.js'
import {writeFileSync} from 'fs'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const buffer = readFileSync(databasePath)
const eaJson = bufferToJson({ buffer })

const onlyEPO = narrowToEpo(eaJson)
const { dataset, turtle, errors } = await toShacl(onlyEPO)

const path = `assets/epo.shacl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)
console.log(errors)
