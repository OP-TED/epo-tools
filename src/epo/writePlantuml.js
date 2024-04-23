import { writeFileSync } from 'fs'
import { filterByPrefix } from '../conceptualModel/filter.js'
import { toPlantuml } from '../plantuml/plantumlTemplate.js'
import { getAllPrefixes } from '../prefix/prefix.js'
import { repositories } from './knownEpo.js'
import { getEpoJson } from './readEpo.js'


const index = []
for (const { databasePath, publicJsonPath } of repositories) {


// Write model
//   const epoJson = getEpoJson({ databasePath })
//   const g = fixKnownBugs(epoJson)
//   writeFileSync(publicJsonPath, JSON.stringify(g,null,2))


  // Write plantUML
  // for (const prefix of getAllPrefixes(g).filter(x => x.startsWith('epo'))) {
  //   const module = filterByPrefix(g, { prefix })
  //   const plantUML = toPlantuml(module,
  //     { includeRelationships: false, sorted: true })
  //   const plantumlFile = `models/epo_${prefix}_${tag}.plantuml`
  //   const targetFilename = `public/${plantumlFile}`
  //   writeFileSync(targetFilename, plantUML)
  //
  //   index.push({
  //     version: tag,
  //     module: prefix,
  //     plantumlFile,
  //   })
  //
  //   console.log('wrote', targetFilename)
  // }

}

const indexPath = 'src/app/components/modelIndex.json'
writeFileSync(indexPath, JSON.stringify(index, null, 2))
console.log('wrote', indexPath)
