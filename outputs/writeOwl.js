import { writeFileSync } from 'fs'
import { Store } from 'oxigraph'
import { PRODUCTION } from '../src/config.js'
import { prettyPrintTurtle } from '../src/io/serialization.js'
import { toOwl } from '../src/shacl/model2Owl.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { doConstruct } from '../src/sparql/localStore.js'
import rdf from 'rdf-ext'

const { databasePath, tag } = PRODUCTION
const filePrefix = `outputs/owl/epo_${tag}`
const onlyEPO = getEpoJson({ databasePath })

const { dataset, turtle, errors } = await toOwl(onlyEPO)

/**
 * Write OWL
 */
const path = `${filePrefix}.owl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)

/**
 * Append OWL disjoints
 */
const disjoints = `
PREFIX shacl: <http://www.w3.org/ns/shacl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#> 

CONSTRUCT {
  ?siblingA owl:disjointWith ?siblingB .
}
WHERE {
   ?siblingA rdfs:subClassOf ?parent .
   ?siblingB rdfs:subClassOf ?parent .
   FILTER(?siblingA != ?siblingB)
}
`

/**
 * Append rdfs:isDefinedBy
 */
const isDefinedBy = `
PREFIX shacl: <http://www.w3.org/ns/shacl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#> 

CONSTRUCT {
  ?s rdfs:isDefinedBy <http://data.europa.eu/a4g/ontology> .
}
WHERE {
  { ?s a owl:ObjectProperty }
  UNION
  { ?s a owl:Class }
}
`

const store = new Store()
for (const quad of dataset) {
  store.add(quad)
}
const inferredToExport = rdf.dataset()
for (const query of [isDefinedBy, disjoints]) {
  for (const quad of doConstruct({ store, query })) {
    inferredToExport.add(quad)
  }
}

const inferredFile = `${filePrefix}.owl.inferred.ttl`
const prettyTurtle = await
  prettyPrintTurtle({ dataset: inferredToExport })
writeFileSync(inferredFile, prettyTurtle)
console.log('wrote', inferredToExport.size, 'quads at', inferredFile)

/**
 * Write source errors
 */
const errorFile = `${filePrefix}.owl.errors.json`
writeFileSync(errorFile, JSON.stringify(errors, null, 2))
console.log('wrote', errors.edges.length, 'edges with errors at', errorFile)
