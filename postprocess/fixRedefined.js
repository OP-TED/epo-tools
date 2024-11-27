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

const notEPO = `
PREFIX a4g: <http://data.europa.eu/a4g/ontology#>

CONSTRUCT {?s ?p ?o }
WHERE {
    ?s ?p ?o
    FILTER (isURI(?s) && (!STRSTARTS(str(?s), str(a4g:))))
}
`

function getRedefined ({ assets }) {
  const store = createTriplestore({ assets })
  return doConstruct({ store, query: notEPO })
}

export { getRedefined, filterDataset }
