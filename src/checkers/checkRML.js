import { readFileSync } from 'fs'
import { EPO_3_1_0 } from '../config.js'
import { getRdfAssets } from '../io/assets.js'
import { createTriplestore, doSelect } from '../io/sparql.js'
import { bufferToJson } from '../ontology/ea/ea-to-json.js'
import { getAllPrefixes, getPrefix, stripPrefix } from '../prefix/prefix.js'

const BASE = '/home/cvasquez/github.com/OP-TED/ted-rdf-assessment'
const globPattern = `${BASE}/pdds/rml/**/*.ttl`

const CONCEPTUAL_MODEL = EPO_3_1_0

// await fetchFromGithub(EPO_ONTOLOGY)

function getConceptualModel () {
  const assetsPath = CONCEPTUAL_MODEL.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
  const buffer = readFileSync(databasePath)
  return bufferToJson({ buffer })
}

function getKnownEntities () {
  const { nodes, edges } = getConceptualModel()
  const allEpoPrefixes = new Set(
    getAllPrefixes({ nodes, edges }).filter(x => x.startsWith('epo')))
  const reduceToSet = (set, x) => {
    const prefix = getPrefix(x)
    if (allEpoPrefixes.has(prefix)) {
      set.add(`http://data.europa.eu/a4g/ontology#${stripPrefix(x)}`)
    }
    return set
  }
  const knownSubjects = edges.map(x => x.source).reduce(reduceToSet, new Set())
  const knownPredicates = edges.map(x => x.predicate).
    reduce(reduceToSet, new Set())
  return { knownSubjects, knownPredicates }
}

const { knownSubjects, knownPredicates } = getKnownEntities()

const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })

const propertiesQuery = `PREFIX rr: <http://www.w3.org/ns/r2rml#> 
SELECT distinct ?predicate
WHERE {
    GRAPH ?graph {
        ?s rr:predicate ?predicate .
        FILTER(strstarts(str(?predicate), "http://data.europa.eu/a4g/ontology#"))
    }
}
`
console.log('Predicates not recognized')
for (const { graph, predicate } of doSelect(
  { store, query: propertiesQuery })) {
  if (!knownPredicates.has(predicate.value)) {
    console.log(predicate.value)
  }
}

const classesQuery = `PREFIX rr: <http://www.w3.org/ns/r2rml#> 
SELECT distinct ?clazz
WHERE {
    GRAPH ?graph {
        ?s rr:class ?clazz .
        FILTER(strstarts(str(?clazz), "http://data.europa.eu/a4g/ontology#"))
    }
}
`

console.log('Classes not recognized')
for (const { clazz } of doSelect({ store, query: classesQuery })) {
  if (!knownSubjects.has(clazz.value)) {
    console.log(clazz.value)
  }
}
