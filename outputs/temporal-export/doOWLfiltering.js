import { mkdirSync, writeFileSync } from 'fs'
import rdf from 'rdf-ext'
import { getRdfAssets } from '../../src/io/assets.js'
import {
  prettyPrintTurtle,
} from '../../src/io/serialization.js'
import { getRedefined } from '../getRedefined.js'
import { dirname } from 'path'
import { UNDER_REVIEW } from '../../src/config.js'

const { localPath } = UNDER_REVIEW
// const globPattern = `${localPath}/implementation/*/owl_ontology/*.ttl`
const globPattern = `${localPath}/implementation/eAccess/owl_ontology/*.ttl`

const assets = await getRdfAssets({ globPattern }, (path) => rdf.DefaultGraph)

for (const asset of assets) {

  const { path, dataset } = asset

  // const redefined = getRedefined({ assets: [asset] })
  // const filtered = dataset.filter(item => !redefined.has(item)).
  //   map(quad => rdf.quad(quad.subject, quad.predicate, quad.object))

  const filtered = dataset.map(quad => rdf.quad(quad.subject, quad.predicate, quad.object))



  // const traverser = rdf.traverser(({
  //   dataset,
  //   level,
  //   quad
  // }) => level === 0 || quad.subject.termType === 'BlankNode')
  //
  // traverser.forEach({ term, dataset }, ({ dataset, level, quad })=>{
  //   console.log(quad)
  // })


  // const turtle = await prettyPrintTurtle({ dataset: filtered })
  //
  // const targetPath = path.replaceAll(`${localPath}`,
  //   'assets/temporal-export')
  // mkdirSync(dirname(targetPath), { recursive: true })
  // writeFileSync(targetPath, turtle)
  // console.log('wrote', dataset.size, 'triples', targetPath)
}


