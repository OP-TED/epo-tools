import {
  TrigSerializer,
  TurtleSerializer,
  RdfXmlSerializer,
} from '@rdfjs-elements/formats-pretty'
import getStream from 'get-stream'

import { ns } from '../namespaces.js'

function toPlain (prefixes) {
  const result = {}
  for (const [key, value] of Object.entries({ ...prefixes })) {
    result[key] = value().value
  }
  return result
}

async function prettyPrintTurtle ({ dataset, namespaces }) {
  const turtleSink = new TurtleSerializer({
    prefixes: toPlain(namespaces ?? ns),
  })

  const stream = await turtleSink.import(dataset.toStream())
  return await getStream(stream)
}

async function prettyPrintTrig ({ dataset, namespaces }) {
  const trigSink = new TrigSerializer({
    prefixes: toPlain(namespaces ?? ns),
  })
  const stream = await trigSink.import(dataset.toStream())
  return await getStream(stream)
}

async function printRDFXML ({ dataset, namespaces }) {
  const rdfSink = new RdfXmlSerializer({
    prefixes: toPlain(namespaces ?? ns),
  })
  const stream = await rdfSink.import(dataset.toStream())
  return await getStream(stream)
}

export { prettyPrintTurtle, prettyPrintTrig, printRDFXML }
