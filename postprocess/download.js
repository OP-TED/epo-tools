import { fetchFromGithub } from '../src/download/github.js'

const model = {
  owner: 'OP-TED',
  repo: 'ePO',
  branch: 'develop',
  localPath: `assets/ePO/develop`,
  databasePath: `assets/ePO/develop/analysis_and_design/conceptual_model/ePO_CM.eap`,
}

await fetchFromGithub(model)
