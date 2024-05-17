import { UNDER_REVIEW } from '../../src/config.js'
import { getEpoJson } from '../../src/epo/readEpo.js'
import { getRdfAssets } from '../../src/io/assets.js'
import { createTriplestore, doSelect } from '../../src/sparql/localStore.js'

const globPattern = `${UNDER_REVIEW.localPath}/implementation/*/shacl_shapes/**/*.ttl`
const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })
const { nodes, edges } = getEpoJson(UNDER_REVIEW)

function queryShapeForClass (clazz) {

  const query = `
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX epo: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-acc: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-cat: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-con: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-ful: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-not: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-ord: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-sub: <http://data.europa.eu/a4g/ontology#>
  
SELECT ?g ?shape ?source ?predicate ?datatypeTarget ?classTarget ?minCount ?maxCount {
  GRAPH ?g {
    BIND(${clazz} AS ?source)
    ?shape  sh:targetClass ?source ;
            sh:property  ?propertyShape .
    
    ?propertyShape a sh:PropertyShape ;
                   sh:path ?predicate .
                   
    OPTIONAL { ?propertyShape sh:minCount ?minCount } .
    OPTIONAL { ?propertyShape sh:maxCount ?maxCount } .
    OPTIONAL { ?propertyShape sh:datatype ?datatypeTarget } .
    OPTIONAL { ?propertyShape sh:class ?classTarget } .
  }
}
`

  return doSelect({ store, query })
}

function queryBoth (name) {
  const actual = queryShapeForClass(name).
    map(x => ({ target: x.datatypeTarget || x.classTarget, ...x }))
  const expected = edges.filter(x => x.source === name).
    filter(x => x.predicate !== 'rdfs:subClassOf')

  return { actual, expected }
}

function printSummary () {
  const result = []
  for (const { name } of nodes) {
    if (name.startsWith('epo')) {

      const { actual, expected } = queryBoth(name)
      result.push(
        {
          class: name,
          actual, expected,
          message: `class ${name}: ${actual.length}/${expected.length} properties found`,
        },
      )
    }
  }
  const withProblems = result.filter(x => x.actual.length < x.expected.length)
  console.log(withProblems.length,
    'Classes contain less properties than expected')

  const delta = result.reduce(
    (accumulator, x) => accumulator + x.expected.length - x.actual.length, 0)
  console.log('total', delta, 'properties missing')
  console.log(result.length, 'classes inspected')
}

function showDifference (name) {
  const { actual, expected } = queryBoth(name)

  console.log('Actual')
  for (const current of actual) {
    // console.log(Object.values(current).map(x=>x.value))
    console.log({
      source: current.source.value,
      predicate: current.predicate.value,
      target: current.target.value,
    })

  }
  for (const { source, predicate, target } of expected) {
    console.log({ source, predicate, target })
  }

}

printSummary()
// showDifference('epo-sub:ESPDResponse')

// 150 Classes contain less properties than expected
// total 369 properties missing
// 316 classes inspected
