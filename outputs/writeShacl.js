import { writeFileSync } from 'fs'
import { Store } from 'oxigraph'
import { PRODUCTION } from '../src/config.js'
import { prettyPrintTurtle } from '../src/io/serialization.js'
import { toShacl } from '../src/shacl/model2Shacl.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { doConstruct } from '../src/sparql/localStore.js'

const { databasePath, tag } = PRODUCTION
const filePrefix = `outputs/shacl/epo_${tag}`
const onlyEPO = getEpoJson({ databasePath })

/**
 * Write SHACL
 */
const { dataset, turtle, errors } = await toShacl(onlyEPO)

const path = `${filePrefix}.shacl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)

/**
 * Infer subproperties SHACL
 */
const query = `
PREFIX shacl: <http://www.w3.org/ns/shacl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
  ?childShape shacl:property ?parentProperty .
}
WHERE {
   ?child rdfs:subClassOf* ?parent .
   ?parentShape a shacl:NodeShape ;
      shacl:targetClass ?parent ;
      shacl:property ?parentProperty .
    ?childShape a shacl:NodeShape ;
    shacl:targetClass ?child .         
}
`

const store = new Store()
for (const quad of dataset) {
  store.add(quad)
}
const inferred = doConstruct({ store, query })
const inferredFile = `${filePrefix}.shacl.inferred.ttl`
const prettyTurtle = await
  prettyPrintTurtle({ dataset: inferred })
writeFileSync(inferredFile, prettyTurtle)
console.log('wrote', inferred.size, 'quads at', inferredFile)

/**
 * Write source errors
 */
const errorFile = `${filePrefix}.shacl.errors.json`
writeFileSync(errorFile, JSON.stringify(errors, null, 2))
console.log('wrote', errors.edges.length, 'edges with errors at', errorFile)
