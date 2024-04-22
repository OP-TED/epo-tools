import { writeFileSync } from 'fs'
import { filterByPrefix } from '../conceptualModel/filter.js'
import { toPlantuml } from '../plantuml/plantumlTemplate.js'
import { getAllPrefixes } from '../prefix/prefix.js'
import { repositories } from './knownEpo.js'
import { getEpoJson } from './readEpo.js'

function fixKnownBugs (g) {

  const removeWhiteSpace = (name) => name?.replaceAll('epo :', 'epo:')

  return {
    nodes: g.nodes.map(
      x => ({ ...x, name: removeWhiteSpace(x.name) })),
    edges: g.edges.filter(x => x.predicate).map(
      x => ({
        ...x,
        source: removeWhiteSpace(x.source),
        predicate: removeWhiteSpace(x.predicate),
        target: removeWhiteSpace(x.target),
      })),
  }
}

const index = []
for (const { localPath, conceptualModelPath, tag } of repositories) {
  const g = fixKnownBugs(getEpoJson({ localPath, conceptualModelPath }))

  for (const prefix of getAllPrefixes(g).filter(x => x.startsWith('epo'))) {
    const module = filterByPrefix(g, { prefix })
    const plantUML = toPlantuml(module,
      { includeRelationships: false, sorted: true })
    const plantumlFile = `models/epo___${prefix}___${tag}.plantuml`
    const filename = `public/${plantumlFile}`
    writeFileSync(filename, plantUML)

    index.push({
      version: tag,
      module: prefix,
      plantumlFile,
    })

    console.log('wrote', filename)
  }

}

const indexPath = 'src/app/components/modelIndex.json'
writeFileSync(indexPath, JSON.stringify(index, null, 2))
console.log('wrote', indexPath)
