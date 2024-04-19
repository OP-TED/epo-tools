import { readFileSync } from 'fs'
import { bufferToJson } from '../conceptualModel/ea-to-json.js'
import { EPO_LATEST } from '../config.js'
import { getRdfAssets } from '../io/assets.js'
import { createTriplestore, doSelect } from '../sparql/localStore.js'
import { getKnownEntities } from './epoConceptualModel.js'

function getUnknownClasses ({ store, knownClasses }) {
  const result = doSelect({
    store, query: `PREFIX rr: <http://www.w3.org/ns/r2rml#> 
SELECT distinct ?clazz
WHERE {
    GRAPH ?graph {
        ?s rr:class ?clazz .
        FILTER(strstarts(str(?clazz), "http://data.europa.eu/a4g/ontology#"))
    }
}
`,
  })
  return result.map(x => x.clazz.value).filter(x => !knownClasses.has(x))
}

function getUnknownProperties ({ store, knownProperties }) {
  const result = doSelect({
    store, query: `PREFIX rr: <http://www.w3.org/ns/r2rml#> 
SELECT distinct ?predicate
WHERE {
    GRAPH ?graph {
        ?s rr:predicate ?predicate .
        FILTER(strstarts(str(?predicate), "http://data.europa.eu/a4g/ontology#"))
    }
}`,
  })
  return result.map(x => x.predicate.value).filter(x => !knownProperties.has(x))
}

function loadConceptualModel (REPO) {
  const assetsPath = REPO.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

const BASE = '/home/cvasquez/github.com/OP-TED/ted-rdf-assessment'
const globPattern = `${BASE}/pdds/rml/**/*.ttl`

const g = loadConceptualModel(EPO_LATEST)

const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })

const { knownClasses, knownProperties } = getKnownEntities(g)

const unknownClasses = getUnknownClasses({ store, knownClasses })
console.log(`${unknownClasses.length} classes were not recognized`)
console.log(unknownClasses)

const unknownProperties = getUnknownProperties({ store, knownProperties })
console.log(`${unknownProperties.length} properties were not recognized`)
console.log(unknownProperties)



