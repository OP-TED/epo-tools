import { mkdirSync, writeFileSync } from 'fs'
import { getRdfAssets } from '../../src/io/assets.js'
import {
  prettyPrintTurtle,
} from '../../src/io/serialization.js'
import { getRedefined } from '../getRedefined.js'
import { dirname } from 'path'

const globPattern = `assets/ePO/feature/4.1.0-rc.3/implementation/*/owl_ontology/*.ttl`
const assets = await getRdfAssets({ globPattern })

for (const asset of assets) {
  const redefined = getRedefined({ assets: [asset] })

  const { path, dataset } = asset
  const targetPath = path.replaceAll('assets/ePO/feature/4.1.0-rc.3',
    'outputs/temporal-export')
  mkdirSync(dirname(targetPath), { recursive: true })

  const filtered = dataset.filter(item => !redefined.has(item))
  const turtle = await prettyPrintTurtle({ dataset: filtered })
  writeFileSync(targetPath, turtle)
  console.log('wrote', dataset.size, 'triples', targetPath)

  // writeFileSync(`${targetPath}.original`, await prettyPrintTurtle({ dataset }))

}

