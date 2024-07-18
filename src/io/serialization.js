import {
  TrigSerializer,
  TurtleSerializer,
  RdfXmlSerializer
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

const turtleSink = new TurtleSerializer({
  prefixes: toPlain(ns),
})

const trigSink = new TrigSerializer({
  prefixes: toPlain(ns),
})

async function prettyPrintTurtle ({ dataset }) {
  const stream = await turtleSink.import(dataset.toStream())
  return await getStream(stream)
}

async function prettyPrintTrig ({ dataset }) {
  const stream = await trigSink.import(dataset.toStream())
  return await getStream(stream)
}

const rdfSink = new RdfXmlSerializer({
  prefixes: toPlain(ns),
})
async function printRDFXML ({ dataset }) {
  const stream = await rdfSink.import(dataset.toStream())
  return await getStream(stream)
}

export { prettyPrintTurtle, prettyPrintTrig, printRDFXML}
