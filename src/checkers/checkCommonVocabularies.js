import { stringify } from 'csv-stringify/sync'
import fs from 'fs'
import rdf from 'rdf-ext'
import { getRdfAssets } from '../io/assets.js'
import { prettyPrintTrig } from '../io/serialization.js'
import { createTriplestore, queryAssets } from '../io/sparql.js'
import { EPO, COMMON_VOCABS } from '../variables.js'

const { localDirectory } = EPO
const globPattern = `${localDirectory}/implementation/**/*.{ttl,rdf}`
const cleanNamedGraph = (path) => rdf.namedNode(
  `file://${path.replaceAll(localDirectory, '')}`)

const checkCommonVocabularies = await getRdfAssets(
  { globPattern: `${COMMON_VOCABS.localDirectory}/*` }, cleanNamedGraph)

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

const store = createTriplestore({ assets: checkCommonVocabularies })
const forbiddenOnes = await queryAssets({ store, query })

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

const checkerReportOutputdir = 'outputs/checkers'
fs.mkdirSync(checkerReportOutputdir, { recursive: true })

const csv = stringify(data)
fs.writeFileSync(`${checkerReportOutputdir}/do-not-redefine.csv`, csv)

const offendingQuadsPath = `${checkerReportOutputdir}/rewritten-triples.trig`
fs.writeFileSync(offendingQuadsPath,
  await prettyPrintTrig({ dataset: offendingQuads }))
console.log(
  `wrote ${offendingQuads.size} offending quads at ${offendingQuadsPath}`)

const officialQuadsPath = `${checkerReportOutputdir}/reference-triples.trig`
fs.writeFileSync(officialQuadsPath,
  await prettyPrintTrig({ dataset: officialQuads }))
console.log(
  `wrote ${officialQuads.size} redefined quads at ${officialQuadsPath}`)
