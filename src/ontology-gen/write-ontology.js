import fs from 'fs'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { UNDER_REVIEW } from '../config.js'
import { prettyPrintTurtle } from '../io/serialization.js'
import { extract } from './extractFromEA.js'
import { exportEpo } from './filter.js'
import { getTurtle } from './get-turtle.js'
import { addEdgeWarnings, addNodeWarnings } from './validate.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const jsonExport = extract({ databasePath })
const epoJson = exportEpo(jsonExport)

const jsonDebugPath = `assets/debug.json`
fs.writeFileSync(jsonDebugPath, JSON.stringify(epoJson, null, 2))
console.log('wrote debug at', jsonDebugPath)

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

const allNodes = epoJson.nodes.map(addNodeWarnings).filter(hasNoErrors)
const allEdges = epoJson.edges.map(addEdgeWarnings).filter(hasNoErrors)

for (const module of new Set(allNodes.map(x => x.name.split(':')[0]))) {

  const nodes = allNodes.filter(x => x.name.startsWith(`${module}:`))
  const edges = allEdges.filter(x => x.source.startsWith(`${module}:`) |
    x.predicate.startsWith(`${module}:`))

  const turtle = getTurtle({ nodes, edges })
  const dataset = rdf.dataset().addAll([...new Parser().parse(turtle)])
  const pretty = await prettyPrintTurtle({ dataset })
  const modulePath = `assets/${module}.ttl`

  fs.writeFileSync(modulePath, pretty)
  console.log('wrote', dataset.size, 'quads at', modulePath)

}

const turtle = getTurtle({ nodes: allNodes, edges: allEdges })
const dataset = rdf.dataset().addAll([...new Parser().parse(turtle)])
const pretty = await prettyPrintTurtle({ dataset })
const allPath = `assets/epo-all.ttl`
fs.writeFileSync(`assets/epo-all.ttl`, pretty)
console.log('wrote', dataset.size, 'quads at', allPath)
