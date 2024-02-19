import formats from '@rdfjs/formats'
import fs from 'fs'
import { glob } from 'glob'
import rdf from 'rdf-ext'

function getMimetype (path) {
  if (path.endsWith('.rdf')) {
    return 'application/rdf+xml'
  }
  return 'text/turtle'
}

function getGraph (path) {
  return rdf.namedNode(`file://${path}`)
}

async function applyGlob (globPattern) {
  const files = await glob(globPattern, {
    stat: true, nodir: true,
  })

  if (files.length === 0) {
    console.log('No files found')
    console.log({ workingDir: process.cwd(), globPattern })
  } else {
    console.log('loading', files.length, 'files')
  }
  return files
}

async function getRdfAssets ({ globPattern }, graphFactory = getGraph) {

  const turtleFiles = await applyGlob(globPattern)

  const assets = []
  for (const path of turtleFiles) {

    const fileStream = fs.createReadStream(path, 'utf-8')
    const dataset = rdf.dataset()
    try {
      const mimeType = getMimetype(path)
      await dataset.import(formats.parsers.import(mimeType, fileStream))
      for (const quad of [...dataset]) {
        quad.graph = graphFactory(path)
      }
    } catch (e) {
      // console.error(path, 'failed to parse')
      throw e
    }
    assets.push({ path, dataset })
  }
  return assets
}

export { getRdfAssets, applyGlob }
