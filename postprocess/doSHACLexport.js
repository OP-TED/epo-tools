import { writeFileSync, mkdirSync } from 'fs'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { INHERITANCE } from '../src/conceptualModel/const.js'
import { inspectEdge, inspectNode } from '../src/conceptualModel/issues.js'
import {
  filterByModule,
  getJson,
} from '../src/epo/readEpo.js'
import { prettyPrintTurtle, printRDFXML } from '../src/io/serialization.js'
import { aliases, ns } from '../src/namespaces.js'
import { getPrefix, stripPrefix } from '../src/prefix/prefix.js'
import { toTurtle } from '../src/shacl/shaclTemplate.js'
import epoModules from './epoModules.json' with { type: 'json' }
import { shaclMetadata } from './metadata.js'
import { rewriteTerms } from './temporalFix.js'

import model from './model.json' with { type: 'json' }

const { databasePath } = model

const metadata = shaclMetadata({
  currentVersion: `5.0.0`,
  priorVersion: `4.2.0`,
  dateIssued: `2025-05-08`,
})

const rawJson = getJson({ databasePath })

const hasErrors = x => x.some(x => x.severity === 'error')

const eaJson = {
  nodes: rawJson.nodes.filter(x => !hasErrors(inspectNode(x))),
  edges: rawJson.edges.filter(x => !hasErrors(inspectEdge(x))).
    filter(x => x.type !== INHERITANCE),
}

for (const module of epoModules.modules) {
  await writeModule(module)
}

async function writeModule (module) {
  const { name, id, prefix } = module

  const targetDir = `postprocess/result/implementation/${name}/shacl_shapes`
  mkdirSync(targetDir, { recursive: true })

  const g = filterByModule(eaJson, prefix)
  const shapePrefix = `${id}-shape`
  const shapeNamespace = `http://data.europa.eu/a4g/data-shape/${id}/`
  const namespaces = { ...ns, [shapePrefix]: rdf.namespace(shapeNamespace) }

  const uglyturtle = `
  @prefix ${shapePrefix}: <${shapeNamespace}> .

  ${toShacl(g, module)}
  ${metadata(id, name)}
  `

  const dataset = await rdf.dataset().
    addAll([...new Parser().parse(uglyturtle)])

  const turtle = await prettyPrintTurtle({
    dataset: rewriteTerms(dataset),
    namespaces,
  })
  const turtlePath = `${targetDir}/${name}_shapes.ttl`
  writeFileSync(turtlePath, turtle)
  console.log('wrote', dataset.size, 'triples', turtlePath)
}

function iriPatterns (id) {
  // Example: sub-shape:epo-sub-CertificateInformation-dct-description.
  const s = (str) => `${getPrefix(str)}-${stripPrefix(str)}`

  // const s = (str) => `${stripPrefix(str)}`

  function shapeIRI (edge) {
    const { source } = edge
    return `${id}-shape:${s(source)}Shape`
  }

  function propertyIRI (edge) {
    const { source, predicate, target } = edge
    // return `${id}-shape:${s(source)}-${s(predicate)}-${s(target)}`
    return `${id}-shape:${s(source)}-${s(predicate)}`

  }

  return {
    shapeIRI, propertyIRI,
  }
}

function toShacl (g, { id }) {
  return toTurtle(g,
    {
      ...iriPatterns(id),
      definedBy: `${id}-shape:`,
      namespaces: { ...ns, ...aliases },
    },
  )
}
