import { mkdirSync, writeFileSync } from 'fs'
import { Store } from 'oxigraph'
import { prettyPrintTurtle } from '../src/io/serialization.js'
import { toShacl } from '../src/shacl/model2Shacl.js'
import { getJson } from '../src/epo/readEpo.js'
import { doConstruct } from '../src/sparql/localStore.js'

const databasePath = `assets/ePO/feature/4.2.0-rc.2/analysis_and_design/conceptual_model/ePO_CM.qea`

const targetDir = 'postprocess/debug'
mkdirSync(targetDir, { recursive: true })

const g = getJson({ databasePath })

/**
 * Write SHACL
 */
const { dataset, turtle, errors } = await toShacl(g)

const outputPath = `${targetDir}/shacl.ttl`
writeFileSync(outputPath, turtle)
console.log('wrote', dataset.size, 'quads at', outputPath)

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

const shaclInferredPath = `${targetDir}/shacl.inferred.ttl`

const prettyTurtle = await
  prettyPrintTurtle({ dataset: inferred })
writeFileSync(shaclInferredPath, prettyTurtle)
console.log('wrote', inferred.size, 'quads at', shaclInferredPath)

/**
 * Write source errors
 */
const errorPath = `${targetDir}/shacl.errors.json`
writeFileSync(errorPath, JSON.stringify(errors, null, 2))
console.log('wrote', errors.edges.length, 'edges with errors at', errorPath)
