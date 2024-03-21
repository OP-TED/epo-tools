import fs from 'fs'
import rdf from 'rdf-ext'
import { EPO_LATEST, UNDER_REVIEW } from '../config.js'
import { getRdfAssets } from '../io/assets.js'
import { toHTML } from '../io/html.js'
import { prettyPrintTrig, prettyPrintTurtle } from '../io/serialization.js'

const targetDirectory = `assets/diff/${UNDER_REVIEW.branch}`
fs.mkdirSync(targetDirectory, { recursive: true })

const oldAssets = await load(EPO_LATEST.localDirectory)
const newAssets = await load(UNDER_REVIEW.localDirectory)

// Generate HTML representations of new files
const newFilesTogether = rdf.dataset()
const newFiles = newAssets.filter(
  x => !oldAssets.map(x => x.path).includes(x.path))
for (const { path, dataset } of newFiles) {
  console.log('new file added:', path)
  // const htmlFilePath = `${targetDirectory}/${path.split('/').pop()}.html`
  // fs.writeFileSync(htmlFilePath, toHTML({ dataset, maxLevel: 10 }))
  // console.log('wrote', htmlFilePath)

  newFilesTogether.addAll(dataset)
}
// fs.writeFileSync(`${targetDirectory}/newFilesTogether.html`,
//   toHTML({ dataset: newFilesTogether, maxLevel: 10 }))
fs.writeFileSync(`${targetDirectory}/newFiles.trig`,
  await prettyPrintTrig({ dataset: newFilesTogether }))

fs.writeFileSync(`${targetDirectory}/newFiles.ttl`, await prettyPrintTurtle({
  dataset: newFilesTogether.map(
    quad => rdf.quad(quad.subject, quad.predicate, quad.object)),
}))

// WARNING
// I cannot do a review with so many exported elements.
fs.writeFileSync(`${targetDirectory}/filtered.trig`, await prettyPrintTrig({
  dataset: newFilesTogether.filter(quad => quad.subject.value.startsWith()),
}))

// Generate Diffs
const { added, removed } = await diff(oldAssets, newAssets)

if (!added.size) {
  console.log('no triples added')
}
fs.writeFileSync(`${targetDirectory}/added.trig`,
  await prettyPrintTrig({ dataset: added }))
if (!removed.size) {
  console.log('no triples added')
}
fs.writeFileSync(`${targetDirectory}/removed.trig`,
  await prettyPrintTrig({ dataset: removed }))

// Support functions
async function load (dir) {
  const globPattern = `${dir}/implementation/**/*.ttl`
  const assets = await getRdfAssets({ globPattern })
  return assets.map(x => {
    const path = x.path.replace(dir, '')
    const graph = rdf.namedNode(path)
    return {
      path,
      dataset: x.dataset.map(
        quad => rdf.quad(quad.subject, quad.predicate, quad.object, graph)),
    }
  })
}

async function diff (oldAssets, newAssets) {
  const added = rdf.dataset()
  const removed = rdf.dataset()
  for (const { path, dataset } of oldAssets) {
    const newDataset = newAssets.find(x => x.path === path).dataset
    added.addAll(newDataset.difference(dataset))
    removed.addAll(dataset.difference(newDataset))
  }
  return { added, removed }
}

