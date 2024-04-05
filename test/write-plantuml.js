import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../src/ontology/ea/add-warnings.js'
import { toJson } from '../src/ontology/ea/ea-to-json.js'
import { toPlantuml } from '../src/ontology/templates/plantuml-template.js'
import { toTurtle } from '../src/ontology/templates/turtle-template.js'
import { narrowToEpo } from '../src/ontology/views/epo-views.js'

expect.extend({ toMatchSnapshot })

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

describe('write-plantuml', () => {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

  const jsonExport = toJson({ databasePath })

  it(`generates plantuml for ${assetsPath}`, function () {

    const { nodes, edges } = narrowToEpo(jsonExport)
    const epoOntology = {
      nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
      edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
    }

    const plantuml = toPlantuml(epoOntology)

    expect(plantuml).toMatchSnapshot(this)
  })
})

