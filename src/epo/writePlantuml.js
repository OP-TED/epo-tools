import { writeFileSync } from 'fs'
import { filterByPrefix } from '../conceptualModel/filter.js'
import { toPlantuml } from '../plantuml/plantumlTemplate.js'
import { getAllPrefixes } from '../prefix/prefix.js'
import { repositories } from './knownEpo.js'
import { getEpoJson } from './readEpo.js'

for (const { localPath, conceptualModelPath, tag } of repositories) {
  const g = getEpoJson({ localPath, conceptualModelPath })
  for (const prefix of getAllPrefixes(g).filter(x => x.startsWith('epo'))) {
    const module = filterByPrefix(g, { prefix })
    const plantUML = toPlantuml(module,
      { includeRelationships: false, sorted: true })
    const filename = `outputs/epo/epo___${prefix}___${tag}.plantuml`
    writeFileSync(filename, plantUML)
    console.log('wrote', filename)
  }

}
