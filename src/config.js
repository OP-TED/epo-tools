const EPO_LATEST = {
  owner: 'OP-TED',
  repo: 'ePO',
  localDirectory: 'assets/ePO/master',
  latest: true,
}

const COMMON_VOCABS = {
  localDirectory: 'assets/common-vocabularies',
}

const branchName = 'release/4.1.0'
const UNDER_REVIEW = {
  owner: 'OP-TED',
  repo: 'ePO',
  localDirectory: `assets/ePO/${branchName}`,
  branch: branchName,
}

export { EPO_LATEST, UNDER_REVIEW, COMMON_VOCABS }
