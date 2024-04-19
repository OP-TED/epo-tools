import { readFileSync, writeFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'
import { filterByPrefix } from '../conceptualModel/filter.js'
import { EPO_3_1_0, EPO_LATEST } from '../config.js'
import { getAllPrefixes } from '../prefix/prefix.js'
import { toPlantuml } from './plantumlTemplate.js'

function getCM (REPO) {
  const assetsPath = REPO.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

function writeModules (g, pathFn) {
  for (const prefix of getAllPrefixes(g).filter(x => x.startsWith('epo'))) {
    const module = filterByPrefix(g, { prefix })
    const plantUML = toPlantuml(module,
      { includeRelationships: false, sorted: true })
    const plantumlPath = pathFn(prefix)
    writeFileSync(plantumlPath, plantUML)
    console.log('wrote', plantumlPath)
  }
}

const previous = getCM(EPO_3_1_0)
writeModules(previous, (prefix) => `assets/${prefix}_3.1.0.plantuml`)

const actual = getCM(EPO_LATEST)
writeModules(actual, (prefix) => `assets/${prefix}_latest.plantuml`)

