import { checkAuthorityTables } from '../checkers/checkAuthorityTables.js'
import { checkCommonVocabularies } from '../checkers/checkCommonVocabularies.js'
import { fetchFromGithub } from '../download/github.js'

const EPO_4_1_0 = {
  owner: 'OP-TED',
  repo: 'ePO',
  localDirectory: 'assets/ePO/develop',
  branch: 'release/4.1.0',
}
await fetchFromGithub(EPO_4_1_0)

const sourceDirectory = EPO_4_1_0.localDirectory
const targetDirectory = `assets/checkers/release/4.1.0`

await checkAuthorityTables({
  sourceDirectory, targetDirectory,
})

await checkCommonVocabularies({
  sourceDirectory, targetDirectory,
})
