import { writeFileSync } from 'fs'
import { getRdfAssets } from '../../src/io/assets.js'
import { ns } from '../../src/namespaces.js'
import {
  createTriplestore,
  doConstruct,
  doSelect,
} from '../../src/sparql/localStore.js'
import { prettyPrintTurtle } from '../../src/io/serialization.js'

const sourceDirectory = 'assets/ePO/feature/4.1.0-rc.3'
const globPattern = `${sourceDirectory}/implementation/*/owl_ontology/**/*.ttl`
const assets = await getRdfAssets({ globPattern }, (x) => undefined) // No named graph
const store = createTriplestore({ assets })

const all = `
PREFIX shacl: <http://www.w3.org/ns/shacl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#> 

CONSTRUCT { ?s ?p ?o. } WHERE { ?s ?p ?o }
`

const dataset = await doConstruct({ store, query: all })
const turtle = await prettyPrintTurtle({ dataset })
writeFileSync('assets/4.1.0-rc.3.owl.ttl', turtle)

const distinctOwlClass = `
PREFIX shacl: <http://www.w3.org/ns/shacl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#> 

SELECT distinct ?s
WHERE {
    ?s a owl:Class .
}
`
const bindings = await doSelect({ store, query: distinctOwlClass })

const fromEpo = x => x.startsWith(ns.a4g().value)
const external = bindings.map(({ s }) => s).
  filter(x => x.termType === 'NamedNode').
  map(x => x.value).filter(x => !fromEpo(x))
console.log(external.sort())

