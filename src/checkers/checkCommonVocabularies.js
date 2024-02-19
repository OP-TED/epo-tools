import { stringify } from 'csv-stringify/sync'
import fs from 'fs'
import rdf from 'rdf-ext'
import { getRdfAssets } from '../io/assets.js'
import { prettyPrintTrig } from '../io/serialization.js'
import { queryAssets } from '../io/sparql.js'
import { EPO } from '../variables.js'

const { localDirectory } = EPO
const globPattern = `${localDirectory}/implementation/**/*.{ttl,rdf}`

const cleanNamedGraph = (path) => rdf.namedNode(
  `file://${path.replaceAll('assets/ePO', '')}`)

const checkCommonVocabularies = await getRdfAssets(
  { globPattern: `assets/common-vocabularies/*` }, cleanNamedGraph)

const assets = await getRdfAssets({ globPattern }, cleanNamedGraph)

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

const forbiddenOnes = await queryAssets(
  { assets: checkCommonVocabularies, query })

const offendingQuads = rdf.dataset()
const officialQuads = rdf.dataset()

const data = [
  [
    'ontology file',
    'common vocabulary file',
    'subject',
    'predicate',
    'original value',
    'offending value']]

for (const { path, dataset } of assets) {
  for (const quad of [...dataset]) {
    for (const { graph, s, p, o } of forbiddenOnes) {
      if (quad.subject.value === s.value && quad.predicate.value === p.value) {
        offendingQuads.add(quad)
        officialQuads.add(rdf.quad(quad.subject, quad.predicate, o, graph))
        data.push(
          [path, graph.value, s.value, p.value, o.value, quad.object.value])
      }
    }
  }
}

const directory = 'outputs/checkers'
fs.mkdirSync(directory, { recursive: true })

const csv = stringify(data)
fs.writeFileSync(`${directory}/do-not-redefine.csv`, csv)

const offendingQuadsPath = `${directory}/rewritten-triples.trig`
fs.writeFileSync(offendingQuadsPath,
  await prettyPrintTrig({ dataset: offendingQuads }))
console.log(
  `wrote ${offendingQuads.size} offending quads at ${offendingQuadsPath}`)

const officialQuadsPath = `${directory}/reference-triples.trig`
fs.writeFileSync(officialQuadsPath,
  await prettyPrintTrig({ dataset: officialQuads }))
console.log(
  `wrote ${officialQuads.size} redefined quads at ${officialQuadsPath}`)
