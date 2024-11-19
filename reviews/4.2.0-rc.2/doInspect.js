import fs from 'fs'
import { getRdfAssets } from '../../src/io/assets.js'
import {
  prettyPrintTrig,
  prettyPrintTurtle,
} from '../../src/io/serialization.js'
import {
  createTriplestore,
  doConstruct,
  doSelect,
} from '../../src/sparql/localStore.js'

import { getRedefined } from '../queries/redefined.js'

const branch = 'feature/4.2.0-rc.2'
const databasePath = `assets/ePO/${branch}/analysis_and_design/conceptual_model/ePO_CM.qea`
const model = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch,
  localPath: `assets/ePO/${branch}`,
  databasePath,
}
const globPattern = `${model.localPath}/implementation/**/*.{ttl,rdf}`
const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })

async function checkRedefined () {
  const targetPath = 'reviews/4.2.0-rc.2/redefined.ttl'
  const dataset = doConstruct({ store, query: getRedefined })
  const rewritten = await prettyPrintTurtle({ dataset })
  fs.writeFileSync(targetPath, rewritten)
  console.log(
    `wrote ${dataset.size} triples at ${targetPath}`)
}

