const epo = [
  {
    tag: 'v4.0.2',
    conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  },
  {
    tag: 'v4.0.1',
    conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  },
  {
    tag: 'v4.0.0',
    conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  },
  {
    tag: 'v3.1.0',
    conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  },
  {
    tag: 'v3.0.1',
    conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  },
  {
    tag: 'v3.0.0',
    conceptualModelPath: 'analysis_and_design/conceptual_model/ePO_CM.eap',
  },
  {
    tag: 'v2.0.1',
    conceptualModelPath: 'v2.0.1/02-Analysis and design/EA-Conceptual Model/ePO_CM.eap',
  },
  {
    tag: 'v2.0.0',
    conceptualModelPath: 'v2.0.0/03_Analysis and design/EA-Conceptual Model/ePO-CM.eap',
  },
  {
    tag: 'v1.0.0',
    conceptualModelPath: 'v1.0.0/02_Analysis and design/EA-Conceptual Model/ePO-CM.eap',
  },
]

const epoRepo = ({ tag, conceptualModelPath }) => ({
  owner: 'OP-TED',
  repo: 'ePO',
  tag,
  localPath: `assets/ePO/${tag}`,
  conceptualModelPath,
})

const knownEpo = [...epo]

const repositories = knownEpo.map(epoRepo)
export {
  repositories,
}
