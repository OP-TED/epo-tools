const EPO_LATEST = {
  owner: 'OP-TED',
  repo: 'ePO',
  latest: true,
  localPath: 'assets/ePO/master',
  databasePath: `assets/ePO/master/analysis_and_design/conceptual_model/ePO_CM.eap`,
}

const COMMON_VOCABS = {
  localPath: 'assets/common-vocabularies',
}

const PRODUCTION = {
  owner: 'OP-TED',
  repo: 'ePO',
  tag: 'v4.0.0',
  localPath: 'assets/ePO/v4.0.0',
  databasePath: `assets/ePO/master/analysis_and_design/conceptual_model/ePO_CM.eap`,
}

const UNDER_REVIEW = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch: 'develop',
  localPath: `assets/ePO/develop`,
  databasePath: `assets/ePO/develop/analysis_and_design/conceptual_model/ePO_CM.eap`,
}

export {
  EPO_LATEST, UNDER_REVIEW, COMMON_VOCABS, PRODUCTION,
}
