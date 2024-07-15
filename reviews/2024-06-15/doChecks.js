import { fetchFromGithub } from '../../src/download/github.js'
import checkAuthorityTables from '../checkers/checkAuthorityTables.js'
import checkCommonVocabularies from '../checkers/checkCommonVocabularies.js'

const doChecks = 'feature/4.1.0-rc.3'
const CURRENT = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch: 'develop',
  localPath: `assets/ePO/${doChecks}`,
  databasePath: `assets/ePO/${doChecks}/analysis_and_design/conceptual_model/ePO_CM.eap`,
}

await fetchFromGithub(CURRENT)

const { localPath } = CURRENT

await checkAuthorityTables({
  sourceDirectory: localPath,
  targetDirectory: `reviews/2024-06-15/authority-tables`,
})

await checkCommonVocabularies({
  sourceDirectory: localPath,
  targetDirectory: `reviews/2024-06-15/redefine`,
})
