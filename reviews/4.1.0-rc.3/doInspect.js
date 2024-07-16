import { fetchFromGithub } from '../../src/download/github.js'
import checkAuthorityTables from '../checkers/checkAuthorityTables.js'
import checkCommonVocabularies from '../checkers/checkCommonVocabularies.js'
import checkMissingShacl from '../checkers/checkMissingShacl.js'

const local = 'feature/4.1.0-rc.3'
const model = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch: 'feature/4.1.0-rc.3',
  localPath: `assets/ePO/${local}`,
  databasePath: `assets/ePO/${local}/analysis_and_design/conceptual_model/ePO_CM.eap`,
}

await fetchFromGithub(model)

const { localPath } = model

await checkAuthorityTables({
  sourceDirectory: localPath,
  targetDirectory: `reviews/4.1.0-rc.3/authority-tables`,
})

await checkCommonVocabularies({
  sourceDirectory: localPath,
  targetDirectory: `reviews/4.1.0-rc.3/redefined`,
})
await checkMissingShacl({
  model,
  targetDirectory: `reviews/4.1.0-rc.3/missingShacl`,
})
