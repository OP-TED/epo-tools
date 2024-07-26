import { mkdirSync, writeFileSync } from 'fs'
import { getRdfAssets } from '../../src/io/assets.js'
import {
  prettyPrintTurtle,
} from '../../src/io/serialization.js'
import { filterDataset, fixRedefined } from '../fixRedefined.js'
import { dirname } from 'path'
import { UNDER_REVIEW } from '../../src/config.js'
import rdf from 'rdf-ext'

const { localPath } = UNDER_REVIEW
const globPattern = `${localPath}/implementation/*/owl_ontology/*.ttl`
// const globPattern = `${localPath}/implementation/eAccess/owl_ontology/*_restrictions.ttl`

const assets = await getRdfAssets({ globPattern }, (path) => rdf.defaultGraph())

for (const asset of assets) {

  const { path, dataset } = asset

  const redefined = fixRedefined({ assets: [asset] })
  const { wanted, unwanted } = filterDataset(redefined, dataset)

  const targetPath = path.replaceAll(`${localPath}`,
    'outputs/temporal-export')
  mkdirSync(dirname(targetPath), { recursive: true })

  const wantedTurtle = await prettyPrintTurtle({ dataset: wanted })
  writeFileSync(targetPath, wantedTurtle)

  const debugPath = path.replaceAll(`${localPath}`,
    'outputs/removed')
  mkdirSync(dirname(debugPath), { recursive: true })
  const unwantedTurtle = await prettyPrintTurtle({ dataset: unwanted })
  writeFileSync(debugPath, unwantedTurtle)

}


