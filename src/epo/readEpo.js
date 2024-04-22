import { readFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'
import { filterBy } from '../conceptualModel/filter.js'

function getJson ({ localPath, conceptualModelPath }) {
  const databasePath = `${localPath}/${conceptualModelPath}`
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

const narrowToEpo = (g) => filterBy(g, { filter: ['epo*'] })

function getEpoJson ({ localPath, conceptualModelPath }) {
  return narrowToEpo(getJson({ localPath, conceptualModelPath }))
}

export { getJson, getEpoJson }
