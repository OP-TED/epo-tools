import { Store } from 'oxigraph'

import pkg from 'sparqljs'
import rdf from 'rdf-ext'

const { Parser } = pkg

function createTriplestore ({ assets }) {
  const store = new Store()
  for (const { path, dataset } of assets) {
    for (const quad of [...dataset]) {
      try {
        store.add(quad)
      } catch (error) {

        // Oxygraph fails to add the following quads
        // Quad {
        //   subject: NamedNode { value: 'http://www.w3.org/ns/locn' },
        //   predicate: NamedNode { value: 'http://xmlns.com/foaf/0.1/depiction' },
        //   object: NamedNode { value: 'locn.svg' },
        //   graph: NamedNode {
        //     value: 'file:///home/cvasquez/github.com/OP-TED/ted-rdf-assessment/assets/common-vocabularies/w3c-locn.ttl'
        //   }
        // }
        // Quad {
        //   subject: NamedNode { value: 'locn.svg' },
        //   predicate: NamedNode { value: 'http://www.w3.org/2000/01/rdf-schema#label' },
        //   object: Literal {
        //     value: 'Class and property diagram of the LOCN vocabulary',
        //       language: '',
        //       datatype: NamedNode { value: 'http://www.w3.org/2001/XMLSchema#string' }
        //   },
        //   graph: NamedNode {
        //     value: 'file:///home/cvasquez/github.com/OP-TED/ted-rdf-assessment/assets/common-vocabularies/w3c-locn.ttl'
        //   }
        // }
        // console.log(quad)
      }

    }
  }
  return store
}

function doSelect ({ store, query }) {
  const result = []

  // This is here because Oxygraph parser does not give feedback.
  new Parser().parse(query)

  for (const binding of store.query(query)) {
    const item = Object.fromEntries(binding)

    for (const [varName, term] of Object.entries(item)) {
      item[varName] = termInstance(term)
    }

    result.push(item)
  }
  console.log(`store: ${store.size} elements, results: ${result.length}`)
  return result
}

function doConstruct ({ store, query }) {
  const result = rdf.dataset()
  for (const current of store.query(query)) {
    const quad = rdf.quad(termInstance(current.subject),
      termInstance(current.predicate), termInstance(current.object))
    result.add(quad)
  }
  console.log(`store: ${store.size} elements, results: ${result.size}`)
  return result
}

// Used to defeat Oxygraph bug, hangs when invoking .value multiple times.
// TODO report a github issue
function termInstance (term) {
  if (term.termType === 'Literal') {
    return rdf.literal(term.value, term.language || term.datatype)
  } else if (term.termType === 'NamedNode') {
    return rdf.namedNode(term.value)
  } else if (term.termType === 'BlankNode') {
    return rdf.blankNode(term.value)
  } else if (term.termType === 'DefaultGraph') {
    return rdf.defaultGraph()
  } else {
    // Handle other RDF term types as needed
    return term
  }
}

export { createTriplestore, doSelect, doConstruct }
