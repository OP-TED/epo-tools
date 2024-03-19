import chardet from 'chardet'
import fs from 'fs'
import rdf from 'rdf-ext'
import { getRdfAssets } from '../io/assets.js'
import { toHTML } from '../io/html.js'
import { prettyPrintTrig } from '../io/serialization.js'

async function load (dir) {

  // Leaving out OWL and SHACL.
  const globPattern = `${dir}/implementation/**/!(*_restrictions|*_shapes).ttl`

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

const oldAssetsPath = 'assets/ePO/release/4.1.0'
const newAssetsPath = 'assets/ePO/feature/4.1.0-rc.2'
const targetDirectory = 'assets/diff/feature/4.1.0-rc.2'

const oldAssets = await load(oldAssetsPath)
const newAssets = await load(newAssetsPath)
fs.mkdirSync(targetDirectory, { recursive: true })

const newFiles = newAssets.filter(
  x => !oldAssets.map(x => x.path).includes(x.path))
for (const { path, dataset } of newFiles) {
  console.log('new file:', path, 'encoding', getEncoding(`${newAssetsPath}${path}`))
  const htmlFilePath = `${targetDirectory}/${path.split('/').pop()}.html`
  fs.writeFileSync(htmlFilePath, toHTML({ dataset, maxLevel: 1 }))
  console.log('wrote', htmlFilePath)
}
const { added, removed } = await diff(oldAssets, newAssets)

fs.writeFileSync(`${targetDirectory}/added.trig`,
  await prettyPrintTrig({ dataset: added }))
fs.writeFileSync(`${targetDirectory}/removed.trig`,
  await prettyPrintTrig({ dataset: removed }))



