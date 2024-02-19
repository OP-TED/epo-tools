import fs from 'fs'
import { dirname } from 'path'
import rdf from 'rdf-ext'
import { getRdfAssets } from '../io/assets.js'
import { prettyPrintTurtle } from '../io/serialization.js'
import { queryAssets } from '../io/sparql.js'
import { EPO, COMMON_VOCABS } from '../variables.js'

const query = `
SELECT distinct ?graph ?s ?p ?o
WHERE {
  graph ?graph {
    ?s a ?type .
    ?s ?p ?o .
    FILTER (isIRI(?o)) .
  }
}
`

const ontologyRDF = await getRdfAssets(
  { globPattern: `${EPO.localDirectory}/implementation/**/*.ttl` })

const commonVocabsRDF = await getRdfAssets(
  { globPattern: `${COMMON_VOCABS.localDirectory}/*` })

const forbiddenOnes = await queryAssets({ assets: commonVocabsRDF, query })

function isForbiddenQuad (quad) {
  for (const { graph, s, p, o } of forbiddenOnes) {
    if (quad.subject.value === s.value && quad.predicate.value === p.value) {
      return true
    }
  }
  return false
}

for (const { path, dataset } of ontologyRDF) {
  const targetPath = path.replace(/assets\//, 'outputs/')
  const directory = dirname(targetPath)
  fs.mkdirSync(directory, { recursive: true })
  const fixedDataset = dataset.map(
    quad => rdf.quad(quad.subject, quad.predicate, quad.object)).
    filter(quad => !isForbiddenQuad(quad))
  console.log(targetPath, 'removed', dataset.size - fixedDataset.size,
    'triples')
  const turtle = await prettyPrintTurtle({ dataset })
  fs.writeFileSync(targetPath, turtle)
}
