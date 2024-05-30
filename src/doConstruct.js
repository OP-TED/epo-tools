import rdf from 'rdf-ext'
import { PRODUCTION } from './config.js'
import { getRdfAssets } from './io/assets.js'
import { createTriplestore, doConstruct } from './sparql/localStore.js'
import { writeFileSync} from 'fs'

const globPattern = `${PRODUCTION.localPath}/implementation/**/*.ttl`
const assets = await getRdfAssets({ globPattern },
  (path) => rdf.namedNode(`file://none`))
const store = createTriplestore({ assets })

const queryAll = `
  CONSTRUCT {
    ?subject ?predicate ?object
  }
  WHERE {
    GRAPH ?g {
      ?subject ?predicate ?object
    }
  }
`

/**
 *
 * @prefix shacl: <http://www.w3.org/ns/shacl#> .
 * @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
 *
 * # If a child subclasses from parent
 * # Then it's shape inherits it's properties
 *
 * {
 *     ?child rdfs:subClassOf ?parent .
 *     ?parentShape a shacl:NodeShape ;
 *         shacl:targetClass ?parent ;
 *         shacl:property ?parentProperty .
 *     ?childShape a shacl:NodeShape ;
 *         shacl:targetClass ?child .
 * } => {
 *     ?childShape shacl:property ?parentProperty .
 * }
 */

const query = `
PREFIX shacl: <http://www.w3.org/ns/shacl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
  ?childShape shacl:property ?parentProperty .
}
WHERE {
  GRAPH ?g {
         ?child rdfs:subClassOf* ?parent .
         ?parentShape a shacl:NodeShape ;
            shacl:targetClass ?parent ;
            shacl:property ?parentProperty .
          ?childShape a shacl:NodeShape ;
          shacl:targetClass ?child .         
  }
}
`

const dataset = doConstruct({ store, query })

writeFileSync('tail.ttl', dataset.toCanonical())
