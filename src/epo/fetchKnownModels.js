import { mkdirSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { appendIssues } from '../conceptualModel/issues.js'
import { repositories } from './knownEpo.js'
import { getEpoJson } from './readEpo.js'

function fixKnownBugs (g) {
  const removeWhiteSpace = (name) => name?.replaceAll('epo :', 'epo:')
  return {
    nodes: g.nodes.map(
      x => ({ ...x, name: removeWhiteSpace(x.name) })),
    edges: g.edges.filter(x => x.predicate).map(
      x => ({
        ...x,
        source: removeWhiteSpace(x.source),
        predicate: removeWhiteSpace(x.predicate),
        target: removeWhiteSpace(x.target),
      })),
  }
}

async function downloadAndTransform ({ fileUrl, tag, appUrl }) {
  console.log(`downloading ${fileUrl}`)
  const response = await fetch(fileUrl)
  const arrayBuffer = await response.arrayBuffer()
  const databasePath = `assets/models/ePO_CM_${tag}.eap`
  writeFileSync(databasePath, Buffer.from(arrayBuffer))
  console.log(`Wrote to ${databasePath}`)
  const epoJson = getEpoJson({ databasePath })
  const g = appendIssues(fixKnownBugs(epoJson))
  const jsonPath = `./public/${appUrl}`
  writeFileSync(jsonPath, JSON.stringify(g, null, 2))
  console.log(`Wrote to ${jsonPath}`)

}

mkdirSync('./assets/models', { recursive: true })
mkdirSync('./public/models', { recursive: true })

const downloadPromises = repositories.map(repo => downloadAndTransform(repo))
await Promise.all(downloadPromises)
