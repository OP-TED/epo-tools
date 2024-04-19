import { UNDER_REVIEW } from '../../src/config.js'
import { checkAuthorityTables } from './checkAuthorityTables.js'
import { checkCommonVocabularies } from './checkCommonVocabularies.js'

const { localDirectory } = UNDER_REVIEW
const targetDirectory = `outputs/checkers`

await checkAuthorityTables({
  sourceDirectory: localDirectory, targetDirectory,
})

await checkCommonVocabularies({
  sourceDirectory: localDirectory, targetDirectory,
})
