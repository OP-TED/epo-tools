import { mkdirSync, writeFileSync } from 'fs'
import { fetchFromGithub } from '../../src/download/github.js'
import { getRdfAssets } from '../../src/io/assets.js'
import {
  prettyPrintTurtle,
} from '../../src/io/serialization.js'
import { filterDataset, fixRedefined } from '../fixRedefined.js'
import { dirname } from 'path'
import { PRODUCTION, UNDER_REVIEW } from '../../src/config.js'
import rdf from 'rdf-ext'

const model = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch: 'feature/4.1.0-rc.3',
  localPath: `assets/feature/4.1.0-rc.3`,
  databasePath: `assets/ePO/develop/analysis_and_design/conceptual_model/ePO_CM.eap`,
}
const { localPath } = model

await fetchFromGithub(model)

const globPattern = `${localPath}/implementation/*/owl_ontology/*.ttl`
// const globPattern = `${localPath}/implementation/eAccess/owl_ontology/*_restrictions.ttl`

const assets = await getRdfAssets({ globPattern }, (path) => rdf.defaultGraph())

for (const asset of assets) {

  const { path, dataset } = asset

  const redefined = fixRedefined({ assets: [asset] })
  const { wanted, unwanted } = filterDataset(redefined, dataset)

  const targetPath = path.replaceAll(`${localPath}`,
    'assets/temporal-export')
  mkdirSync(dirname(targetPath), { recursive: true })

  const wantedTurtle = await prettyPrintTurtle({ dataset: wanted })
  writeFileSync(targetPath, wantedTurtle)

  const debugPath = path.replaceAll(`${localPath}`,
    'assets/removed')
  mkdirSync(dirname(debugPath), { recursive: true })
  const unwantedTurtle = await prettyPrintTurtle({ dataset: unwanted })
  writeFileSync(debugPath, unwantedTurtle)

}


