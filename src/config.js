const EPO_LATEST = {
  owner: 'OP-TED',
  repo: 'ePO',
  localPath: 'assets/ePO/master',
  conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  latest: true,
}

const COMMON_VOCABS = {
  localPath: 'assets/common-vocabularies',
}

const branchName = 'develop'
const UNDER_REVIEW = {
  owner: 'OP-TED',
  repo: 'ePO',
  localPath: `assets/ePO/${branchName}`,
  conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  branch: branchName,
}

export {
  EPO_LATEST, UNDER_REVIEW, COMMON_VOCABS,
}
