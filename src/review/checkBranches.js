import { checkAuthorityTables } from '../checkers/checkAuthorityTables.js'
import { checkCommonVocabularies } from '../checkers/checkCommonVocabularies.js'
import { fetchFromGithub } from '../download/github.js'

const branches = ['release/4.1.0', 'feature/4.1.0-rc.2']

for (const branchName of branches) {
  console.log('branch', branchName)
  const githubBranch = {
    owner: 'OP-TED',
    repo: 'ePO',
    localDirectory: `assets/ePO/${branchName}`,
    branch: branchName,
  }
  await fetchFromGithub(githubBranch)

  const sourceDirectory = githubBranch.localDirectory
  const targetDirectory = `assets/checkers/${branchName}`

  await checkAuthorityTables({
    sourceDirectory, targetDirectory,
  })

  await checkCommonVocabularies({
    sourceDirectory, targetDirectory,
  })
}



