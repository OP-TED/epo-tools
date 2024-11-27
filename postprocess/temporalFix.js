import rdf from 'rdf-ext'

// The following resources:
//
// - http://publications.europa.eu/resource/authority/nuts
// - http://publications.europa.eu/resource/authority/cpv
//
// Should be replaced by:
//
// - http://data.europa.eu/nuts/scheme/2021
// - http://data.europa.eu/cpv/cpv

function replaceTerms (term) {

  if (term.value === 'http://publications.europa.eu/resource/authority/nuts') {
    console.log(
      'replaced http://publications.europa.eu/resource/authority/nuts')
    return rdf.namedNode('http://data.europa.eu/nuts/scheme/2021')
  }
  if (term.value === 'http://publications.europa.eu/resource/authority/cpv') {
    console.log('replaced http://publications.europa.eu/resource/authority/cpv')
    return rdf.namedNode('http://data.europa.eu/cpv/cpv')
  }
  return term
}

function rewriteTerms (dataset) {
  return dataset.map(quad => {
    return rdf.quad(
      replaceTerms(quad.subject),
      replaceTerms(quad.predicate),
      replaceTerms(quad.object),
      quad.graph,
    )
  })
}

export { rewriteTerms }
