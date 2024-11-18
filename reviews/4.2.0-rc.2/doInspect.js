import { fetchFromGithub } from '../../src/download/github.js'
import checkAuthorityTables from '../checkers/checkAuthorityTables.js'
import checkCommonVocabularies from '../checkers/checkCommonVocabularies.js'
import checkMissingShacl from '../checkers/checkMissingShacl.js'

const branch = 'feature/4.2.0-rc.2'
const model = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch,
  localPath: `assets/ePO/${branch}`,
  databasePath: `assets/ePO/${branch}/analysis_and_design/conceptual_model/ePO_CM.qea`,
}

// await fetchFromGithub(model)
//
// const { localPath } = model
//
// await checkAuthorityTables({
//   sourceDirectory: localPath,
//   targetDirectory: `reviews/${version}/authority-tables`,
// })
//
// await checkCommonVocabularies({
//   sourceDirectory: localPath,
//   targetDirectory: `reviews/${version}/redefined`,
// })
await checkMissingShacl({
  model,
  targetDirectory: `reviews/${branch}/missingShacl`,
})
