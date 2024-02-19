import {
  TrigSerializer, TurtleSerializer,
} from '@rdfjs-elements/formats-pretty'
import { stringify } from 'csv-stringify/sync'
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

function rdfArrayToCSV (array) {
  if (array.length) {
    const header = Object.keys(array[0])
    const arrayOfArrays = array.map(obj => Object.values(obj).map(x => x.value))
    return stringify([header, ...arrayOfArrays])
  }

}

export { prettyPrintTurtle, prettyPrintTrig, rdfArrayToCSV }
