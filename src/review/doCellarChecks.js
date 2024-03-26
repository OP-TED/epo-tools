import { UNDER_REVIEW } from '../config.js'
import { checkAuthorityTables } from '../checkers/checkAuthorityTables.js'
import { checkCommonVocabularies } from '../checkers/checkCommonVocabularies.js'

const { localDirectory } = UNDER_REVIEW
const targetDirectory = `assets/checkers/${UNDER_REVIEW.branch}`

await checkAuthorityTables({
  sourceDirectory: localDirectory, targetDirectory,
})

await checkCommonVocabularies({
  sourceDirectory: localDirectory, targetDirectory,
})
