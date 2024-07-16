import checkMissingShacl from '../../reviews/checkers/checkMissingShacl.js'
import { PRODUCTION } from '../../src/config.js'
import { fetchFromGithub } from '../../src/download/github.js'

const MODEL = PRODUCTION
const sourceDirectory = MODEL.localPath
const targetDirectory = 'outputs/missing'
await fetchFromGithub(MODEL)
await checkMissingShacl({ sourceDirectory, targetDirectory })

// 150 Classes contain fewer properties than expected
// There is a mismatch of 369 properties
// 316 classes inspected
