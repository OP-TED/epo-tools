import fs from 'fs'
import rdf from 'rdf-ext'
import { EPO_LATEST, UNDER_REVIEW } from './config.js'
import { getRdfAssets, rdfAssetsDiff } from './io/assets.js'
import { prettyPrintTrig } from './io/serialization.js'

const targetDirectory = `assets/diff/${UNDER_REVIEW.branch}`
fs.mkdirSync(targetDirectory, { recursive: true })

const oldAssets = await loadNormalized(EPO_LATEST.localPath)
const newAssets = await loadNormalized(UNDER_REVIEW.localPath)

newAssets.filter(({ path }) => !oldAssets.map(x => x.path).includes(path)).
  forEach(({ path, dataset }) => {
    console.log('found new file:', path, 'quad count', dataset.size)
  })

// Generate Diffs
const { added, removed } = await rdfAssetsDiff(oldAssets, newAssets)

if (!added.size) {
  console.log('no triples added')
}
const addedPath = `${targetDirectory}/added.trig`
fs.writeFileSync(addedPath, await prettyPrintTrig({ dataset: added }))
console.log(`wrote ${addedPath}`)

if (!removed.size) {
  console.log('no triples removed')
}
const removedPath = `${targetDirectory}/removed.trig`
fs.writeFileSync(removedPath, await prettyPrintTrig({ dataset: removed }))
console.log(`wrote ${removedPath}`)

// Support functions
async function loadNormalized (dir) {
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


