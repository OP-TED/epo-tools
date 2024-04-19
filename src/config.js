const EPO_LATEST = {
  owner: 'OP-TED',
  repo: 'ePO',
  localDirectory: 'assets/ePO/master',
  latest: true,
}

const EPO_3_1_0 = {
  owner: 'OP-TED',
  repo: 'ePO',
  tag: 'v3.1.0',
  localDirectory: `assets/ePO/v3.1.0`,
}

const COMMON_VOCABS = {
  localDirectory: 'assets/common-vocabularies',
}

const branchName = 'develop'
const UNDER_REVIEW = {
  owner: 'OP-TED',
  repo: 'ePO',
  localDirectory: `assets/ePO/${branchName}`,
  branch: branchName,
}

export { EPO_LATEST, EPO_3_1_0, UNDER_REVIEW, COMMON_VOCABS }
