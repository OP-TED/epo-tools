import { Parser } from 'sparqljs'

const sparqlQuery = `
PREFIX epo: <http://data.europa.eu/a4g/ontology#>
PREFIX cccev: <http://data.europa.eu/m8g/>
PREFIX dct: <http://purl.org/dc/terms/> 

SELECT DISTINCT
?Notice
?PublicationDate
?AwardedValue
?LotAwardedValueCurrencyURI
where {

    VALUES ?PublicationDate {
        "20230911"
    }

    ?Notice
            epo:hasPublicationDate ?PublicationDate;
            epo:refersToLot ?Lot .
            ?Lot a epo:Lot .
    ?LotAwardOutcome epo:describesLot ?Lot ;
                     epo:hasAwardedValue / epo:hasAmountValue ?AwardedValue;
                     epo:hasAwardedValue / epo:hasCurrency ?LotAwardedValueCurrencyURI.

} LIMIT 10
`

const parser = new Parser()
const parsedQuery = parser.parse(sparqlQuery)

// console.log(JSON.stringify(parsedQuery, null, 2))

// Function to extract named nodes
function extractNamedNodes (query) {
  const namedNodes = []
  const prefixes = query.prefixes

  query.where.forEach(element => {
    if (element.type === 'bgp' && Array.isArray(element.triples)) {
      element.triples.forEach(triple => {
        if (triple.predicate && triple.predicate.termType === 'NamedNode') {
          const predicateValue = triple.predicate.value
          const prefixMatch = Object.entries(prefixes).
            find(([prefix, uri]) => predicateValue.startsWith(uri))
          if (prefixMatch) {
            const [prefix, uri] = prefixMatch
            const curie = `${prefix}:${predicateValue.substring(uri.length)}`
            namedNodes.push(curie)
          } else {
            namedNodes.push(predicateValue) // No prefix, use full URI
          }
        }
      })
    }
  })

  return namedNodes
}

const namedNodes = extractNamedNodes(parsedQuery)
console.log(namedNodes)


