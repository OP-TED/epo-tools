import { readFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'
import { filterBy, startsWith } from '../conceptualModel/filter.js'

function getJson ({ databasePath }) {
  // const databasePath = `${localPath}/${conceptualModelPath}`
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

const narrowToEpo = (g) => startsWith(g, 'epo')

function getEpoJson ({ databasePath }) {
  const json = getJson({ databasePath })
  return narrowToEpo(json)
}

export { getJson, getEpoJson }
