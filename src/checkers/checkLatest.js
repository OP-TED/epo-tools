import { EPO_LATEST } from '../config.js'
import { checkAuthorityTables } from './checkAuthorityTables.js'
import { checkCommonVocabularies } from './checkCommonVocabularies.js'

const { localDirectory } = EPO_LATEST
const targetDirectory = `outputs/checkers`

await checkAuthorityTables({
  sourceDirectory: localDirectory, targetDirectory,
})

await checkCommonVocabularies({
  sourceDirectory: localDirectory, targetDirectory,
})
