import { EPO_LATEST } from './config.js'
import { getRdfAssets } from './io/assets.js'
import { createTriplestore, doConstruct } from './sparql/localStore.js'

const globPattern = `${EPO_LATEST.localDirectory}/implementation/**/!(*_restrictions|*_shapes).ttl`
const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })

const query = `
  CONSTRUCT {
    ?subject ?predicate ?object
  }
  WHERE {
    GRAPH ?g {
      ?subject ?predicate ?object
    }
  }
`
const dataset = doConstruct({ store, query })

console.log(dataset.toCanonical())
