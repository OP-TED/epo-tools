import { UNDER_REVIEW } from '../src/config.js'
import { getRdfAssets } from '../src/io/assets.js'
import { writeFileSync } from 'fs'
import {
  prettyPrintTrig,
} from '../src/io/serialization.js'
import { createTriplestore, doSelect } from '../src/sparql/localStore.js'
import rdf from 'rdf-ext'

const globPattern = `${UNDER_REVIEW.localPath}/implementation/**/*.ttl`

const assets = await getRdfAssets({ globPattern })

const store = createTriplestore({ assets })

function doQuery (query) {
  const result = doSelect({ store, query })
  const dataset = rdf.dataset()
  for (const { s, p, o, graph } of result) {
    dataset.add(rdf.quad(s, p, o, graph))
  }
  return dataset

}

const filterUnwantedQuery = `
PREFIX ns1: <http://www.w3.org/2006/time#>
PREFIX ns2: <http://www.w3.org/ns/locn#>
PREFIX ns3: <http://www.w3.org/ns/org#>
PREFIX ns4: <http://www.w3.org/ns/person#>
PREFIX ns5: <http://www.w3.org/ns/adms#>
PREFIX ns6: <http://www.w3.org/2004/02/skos/core#>
PREFIX ns1: <http://www.w3.org/2006/time#>
PREFIX ns2: <http://www.w3.org/ns/locn#>
PREFIX ns3: <http://www.w3.org/ns/org#>
PREFIX ns4: <http://www.w3.org/ns/person#>
PREFIX ns5: <http://www.w3.org/ns/adms#>
PREFIX ns6: <http://www.w3.org/2004/02/skos/core#>
PREFIX ns7: <http://www.w3.org/2002/07/owl#>
PREFIX ns8: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX ns9: <http://xmlns.com/foaf/spec/index.rdf>
PREFIX ns10: <http://data.europa.eu/m8g/>
PREFIX ns11: <http://purl.org/dc/terms/>
PREFIX ns12: <http://www.w3.org/ns/dcat#>
PREFIX ns13: <http://www.w3.org/2002/07/owl#>
PREFIX ns14: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX ns15: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?graph ?s ?p ?o
WHERE {
  GRAPH ?graph {
    ?s ?p ?o
    FILTER (isURI(?s) && 
            (STRSTARTS(str(?s), str(ns1:)) ||
              STRSTARTS(str(?s), str(ns2:)) ||
              STRSTARTS(str(?s), str(ns3:)) ||
              STRSTARTS(str(?s), str(ns4:)) ||
              STRSTARTS(str(?s), str(ns5:)) ||
              STRSTARTS(str(?s), str(ns6:)) ||
              STRSTARTS(str(?s), str(ns7:)) ||
              STRSTARTS(str(?s), str(ns8:)) ||
              STRSTARTS(str(?s), str(ns9:)) ||
              STRSTARTS(str(?s), str(ns10:)) ||
              STRSTARTS(str(?s), str(ns11:)) ||
              STRSTARTS(str(?s), str(ns12:)) ||
              STRSTARTS(str(?s), str(ns13:)) ||
              STRSTARTS(str(?s), str(ns14:)) ||
              STRSTARTS(str(?s), str(ns15:)))
           )
  }
}
`
const filteredDataset = doQuery(filterUnwantedQuery)
const filteredStr = await prettyPrintTrig({ dataset: filteredDataset })
writeFileSync('./assets/filteredStr.ttl', filteredStr)
console.log('filteredDataset', filteredDataset.size)
