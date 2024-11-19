import rdf from 'rdf-ext'
import { ns } from '../src/namespaces.js'
import { createTriplestore, doConstruct } from '../src/sparql/localStore.js'

function filterDataset (redefined, dataset) {
  // Subjects to remove
  const subjects = rdf.termSet()
  for (const quad of redefined) {
    subjects.add(quad.subject)
  }
  // Traverse the dataset, go deeper if is a blank but do not follow ePO subjects
  const traverser = rdf.traverser(({
    dataset,
    level,
    quad,
  }) => !quad.subject.value.startsWith(ns.a4g().value) ||
    quad.subject.termType === 'BlankNode')

  const unwanted = rdf.dataset()
  for (const term of [...subjects]) {
    traverser.forEach({ term, dataset }, ({ dataset, level, quad }) => {
      unwanted.add(quad)
    })
  }

  const wanted = dataset.difference(unwanted)

  return { wanted, unwanted }

}

function getRedefined ({ assets }) {
  const store = createTriplestore({ assets })

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
PREFIX ns16: <http://www.w3.org/2001/XMLSchema#>
PREFIX eli: <http://data.europa.eu/eli/ontology#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>    

CONSTRUCT {?s ?p ?o }
WHERE {
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
              STRSTARTS(str(?s), str(ns15:)) ||
              STRSTARTS(str(?s), str(ns16:)) ||
              STRSTARTS(str(?s), str(eli:)) ||
              STRSTARTS(str(?s), str(foaf:)))
           )
}
`
  return doConstruct({ store, query: filterUnwantedQuery })
}

export { getRedefined, filterDataset }
