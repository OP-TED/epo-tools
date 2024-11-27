import { mkdirSync, writeFileSync } from 'fs'
import { getRdfAssets } from '../src/io/assets.js'
import {
  prettyPrintTurtle,
} from '../src/io/serialization.js'
import { filterDataset, getRedefined } from './fixRedefined.js'
import { dirname } from 'path'
import rdf from 'rdf-ext'

const localPath = `assets/ePO/develop`
const globPattern = `${localPath}/implementation/*/owl_ontology/*.ttl`

const assets = await getRdfAssets({ globPattern }, (path) => rdf.defaultGraph())

for (const asset of assets) {

  const { path, dataset } = asset

  const redefined = getRedefined({ assets: [asset] })
  const { wanted, unwanted } = filterDataset(redefined, dataset)

  const targetPath = path.replaceAll(`${localPath}`,
    'postprocess/result')
  mkdirSync(dirname(targetPath), { recursive: true })

  const wantedTurtle = await prettyPrintTurtle({ dataset: wanted })
  writeFileSync(targetPath, wantedTurtle)

  const debugPath = path.replaceAll(`${localPath}`,
    'postprocess/result/debug')
  mkdirSync(dirname(debugPath), { recursive: true })
  const unwantedTurtle = await prettyPrintTurtle({ dataset: unwanted })
  writeFileSync(debugPath, unwantedTurtle)

}
