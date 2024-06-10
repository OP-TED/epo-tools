import { UNDER_REVIEW } from '../../src/config.js'
import { checkAuthorityTables } from './checkAuthorityTables.js'
import { checkCommonVocabularies } from './checkCommonVocabularies.js'

const { localPath } = UNDER_REVIEW
const targetDirectory = `outputs/checkers`

await checkAuthorityTables({
  sourceDirectory: localPath, targetDirectory,
})

await checkCommonVocabularies({
  sourceDirectory: localPath, targetDirectory,
})
