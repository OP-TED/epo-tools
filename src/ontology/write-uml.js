import { readFileSync, writeFileSync } from 'fs'
import { UNDER_REVIEW } from '../config.js'
import { bufferToJson } from './ea/ea-to-json.js'
import { toPlantuml } from './templates/plantuml-template.js'
import { filterBy } from './views/filter.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

const buffer = readFileSync(databasePath)
const eaJson = bufferToJson({ buffer })

const filter = ['epo:Notice']
const epoOntology = filterBy(eaJson, { filter })

const plantUML = toPlantuml(epoOntology)
const plantumlPath = `assets/epo.plantuml`
writeFileSync(plantumlPath, plantUML)
console.log('wrote', plantumlPath)
