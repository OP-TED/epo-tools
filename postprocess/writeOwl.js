import { mkdirSync, writeFileSync } from 'fs'
import { Store } from 'oxigraph'
import { EPO_LATEST } from '../src/config.js'
import { prettyPrintTurtle } from '../src/io/serialization.js'
import { toOwl } from '../src/shacl/model2Owl.js'
import { getEpoJson, getJson } from '../src/epo/readEpo.js'
import { doConstruct } from '../src/sparql/localStore.js'
import rdf from 'rdf-ext'

const databasePath = `assets/ePO/feature/4.2.0-rc.2/analysis_and_design/conceptual_model/ePO_CM.qea`

const targetDir = 'postprocess/debug'
mkdirSync(targetDir, { recursive: true })

const g = getJson({ databasePath })

const { dataset, turtle, errors } = await toOwl(g)

/**
 * Write OWL
 */
const outputPath = `${targetDir}/owl.ttl`
writeFileSync(outputPath, turtle)
console.log('wrote', dataset.size, 'quads at', outputPath)

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

const inferredPath = `${targetDir}/owl.inferred.ttl`

const prettyTurtle = await
  prettyPrintTurtle({ dataset: inferredToExport })
writeFileSync(inferredPath, prettyTurtle)
console.log('wrote', inferredToExport.size, 'quads at', inferredPath)

/**
 * Write source errors
 */

const errorPath = `${targetDir}/owl.error.json`

writeFileSync(errorPath, JSON.stringify(errors, null, 2))
console.log('wrote', errors.edges.length, 'edges with errors at', errorPath)
