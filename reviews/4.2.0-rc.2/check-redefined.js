import fs from 'fs'
import { getRdfAssets } from '../../src/io/assets.js'
import {
  prettyPrintTurtle,
} from '../../src/io/serialization.js'
import {
  createTriplestore,
  doConstruct,
} from '../../src/sparql/localStore.js'

const notEPO = `
PREFIX a4g: <http://data.europa.eu/a4g/ontology#>
PREFIX ex: <http://example.org#>

CONSTRUCT {
    ?s ?p ?o .
    ?s ex:redefinedAt ?g .
    }
WHERE {
    GRAPH ?g {
      ?s ?p ?o
      FILTER (isURI(?s) && (!STRSTARTS(str(?s), str(a4g:))))
    }
}
`

const localPath = `assets/ePO/feature/4.2.0-rc.2`
const globPattern = `${localPath}/implementation/*/owl_ontology/*.ttl`

const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })

const targetPath = 'reviews/4.2.0-rc.2/redefined.ttl'
const dataset = doConstruct({ store, query: notEPO })
const rewritten = await prettyPrintTurtle({ dataset })
fs.writeFileSync(targetPath, rewritten)
console.log(
  `wrote ${dataset.size} redefined triples at ${targetPath}`)

