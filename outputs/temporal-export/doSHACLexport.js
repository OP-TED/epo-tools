import { writeFileSync, mkdirSync } from 'fs'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { inspectEdge, inspectNode } from '../../src/conceptualModel/issues.js'
import { getJson } from '../../src/epo/readEpo.js'
import { prettyPrintTurtle } from '../../src/io/serialization.js'
import { aliases, ns } from '../../src/namespaces.js'
import { getPrefix, hasPrefix, stripPrefix } from '../../src/prefix/prefix.js'
import { toTurtle } from '../../src/shacl/shaclTemplate.js'
import epoModules from './epoModules.json' assert { type: 'json' }
import { shaclMetadata } from './metadata.js'

const { modules } = epoModules

const databasePath = `assets/ePO/feature/4.1.0-rc.3/analysis_and_design/conceptual_model/ePO_CM.eap`

function iriPatterns (id) {
  // Example: sub-shape:epo-sub-CertificateInformation-dct-description.
  // const s = (str) => `${getPrefix(str)}-${stripPrefix(str)}`
  const s = (str) => `${stripPrefix(str)}`

  function shapeIRI (edge) {
    const { source } = edge
    return `${id}-shape:${s(source)}Shape`
  }

  function propertyIRI (edge) {
    const { source, predicate, target } = edge
    return `${id}-shape:${s(source)}-${s(predicate)}-${s(target)}`
  }

  return {
    shapeIRI, propertyIRI,
  }
}

function toShacl (g, { id }) {
  return toTurtle(g,
    {
      ...iriPatterns(id),
      definedBy: `${id}-shape:${id}-shape`,
      namespaces: { ...ns, ...aliases },
    },
  )
}

// For a module
// Include all edges that have prefix as s or p
// Include all s of such edges
function filterByModule (g, prefix) {
  const edges = eaJson.edges.filter(
    ({ source, predicate }) => source.startsWith(prefix) ||
      predicate.startsWith(prefix))
  const allNodes = new Set(edges.map(x => x.source))
  const nodes = eaJson.nodes.filter(x => allNodes.has(x.name))
  return { edges, nodes }
}

const rawJson = getJson({ databasePath })
const hasErrors = x => x.some(x => x.severity === 'error')

const eaJson = {
  nodes: rawJson.nodes.filter(x => !hasErrors(inspectNode(x))),
  edges: rawJson.edges.filter(x => !hasErrors(inspectEdge(x))),
}

async function writeModule (module) {
  const { name, id, prefix } = module
  const targetDir = `outputs/temporal-export/implementation/${name}/shacl_shapes`
  mkdirSync(targetDir, { recursive: true })
  const targetPath = `${targetDir}/${name}_shapes.ttl`
  console.log('writing', targetPath)

  const g = filterByModule(eaJson, prefix)

  const uglyturtle = `
  @prefix ${id}-shape: <http://data.europa.eu/a4g/data-shape#> .

  ${toShacl(g, module)}
  ${shaclMetadata(id)}
  `

  const dataset = await rdf.dataset().
    addAll([...new Parser().parse(uglyturtle)])
  const turtle = await prettyPrintTurtle({ dataset })
  writeFileSync(targetPath, turtle)
  console.log('wrote', dataset.size, 'triples', targetPath)
}

// const access = {
//   'name': 'eAccess',
//   'id': 'acc',
//   'prefix': 'epo-acc:',
// }
// await writeModule(access)

for (const module of modules) {
  await writeModule(module)
}

