import chardet from 'chardet'
import fs from 'fs'
import rdf from 'rdf-ext'
import { EPO_LATEST } from '../config.js'
import { getRdfAssets } from '../io/assets.js'
import { toHTML } from '../io/html.js'
import { prettyPrintTrig } from '../io/serialization.js'

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

function getEncoding (filePath) {
  const data = fs.readFileSync(filePath)
  return chardet.detect(data)
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

const oldAssetsPath = EPO_LATEST.localDirectory
const newAssetsPath = 'assets/ePO/release/4.1.0'
const targetDirectory = 'assets/diff/release/4.1.0'

const oldAssets = await load(oldAssetsPath)
const newAssets = await load(newAssetsPath)
fs.mkdirSync(targetDirectory, { recursive: true })

const newFiles = newAssets.filter(
  x => !oldAssets.map(x => x.path).includes(x.path))
for (const { path, dataset } of newFiles) {
  console.log('new file:', path, 'encoding',
    getEncoding(`${newAssetsPath}${path}`))
  const htmlFilePath = `${targetDirectory}/${path.split('/').pop()}.html`
  fs.writeFileSync(htmlFilePath, toHTML({ dataset, maxLevel: 1 }))
  console.log('wrote', htmlFilePath)
}
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



