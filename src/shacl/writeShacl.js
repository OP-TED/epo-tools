import { readFileSync, writeFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'
import { filterBy } from '../conceptualModel/filter.js'
import { UNDER_REVIEW } from '../config.js'
import { toShacl } from './model2Shacl.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const buffer = readFileSync(databasePath)
const eaJson = bufferToJson({ buffer })

const narrowToEpo = (g) => filterBy(g, { filter: ['epo*'] })

const onlyEPO = narrowToEpo(eaJson)
const { dataset, turtle, errors } = await toShacl(onlyEPO)

const path = `assets/epo.shacl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)
console.log('ommited', errors.edges.length, 'edges with errors')
