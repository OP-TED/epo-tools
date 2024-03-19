import { stringify } from 'csv-stringify/sync'
import fs from 'fs'
import rdf from 'rdf-ext'
import { getRdfAssets } from '../io/assets.js'
import { prettyPrintTrig } from '../io/serialization.js'
import { createTriplestore, doSelect } from '../io/sparql.js'
import { COMMON_VOCABS } from '../config.js'

async function checkCommonVocabularies ({ sourceDirectory, targetDirectory }) {

  const globPattern = `${sourceDirectory}/implementation/**/*.{ttl,rdf}`

  const cleanNamedGraph = (path) => rdf.namedNode(
    `file://${path.replaceAll(sourceDirectory, '')}`)

  const commonVocabulariesAssets = await getRdfAssets(
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

  const store = createTriplestore({ assets: commonVocabulariesAssets })
  const forbiddenOnes = doSelect({ store, query })

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
        if (quad.subject.value === s.value && quad.predicate.value ===
          p.value) {
          offendingQuads.add(quad)
          officialQuads.add(rdf.quad(quad.subject, quad.predicate, o, graph))
          data.push(
            [path, graph.value, s.value, p.value, o.value, quad.object.value])
        }
      }
    }
  }

  fs.mkdirSync(targetDirectory, { recursive: true })
  const csv = stringify(data)
  fs.writeFileSync(`${targetDirectory}/do-not-redefine.csv`, csv)

  const offendingQuadsPath = `${targetDirectory}/rewritten-triples.trig`
  fs.writeFileSync(offendingQuadsPath,
    await prettyPrintTrig({ dataset: offendingQuads }))
  console.log(
    `wrote ${offendingQuads.size} offending quads at ${offendingQuadsPath}`)

  const officialQuadsPath = `${targetDirectory}/reference-triples.trig`
  fs.writeFileSync(officialQuadsPath,
    await prettyPrintTrig({ dataset: officialQuads }))
  console.log(
    `wrote ${officialQuads.size} redefined quads at ${officialQuadsPath}`)

}

export {
  checkCommonVocabularies,
}
