import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../../src/config.js'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../../src/ontology/ea/add-warnings.js'
import { toJson } from '../../src/ontology/ea/ea-to-json.js'
import { narrowToEpo } from '../../src/ontology/views/epo-views.js'

expect.extend({ toMatchSnapshot })

describe('read-enterprise-architect-database', () => {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
  const json = toJson({ databasePath })

  const withWarnings = x => x.warnings.length > 0

  const jsonExport = toJson({ databasePath })
  const epoJson = narrowToEpo(jsonExport)

  it(`generates warnings for ${assetsPath}`, function () {
    const warnings = {
      nodes: epoJson.nodes.map(addNodeWarnings).filter(withWarnings),
      edges: epoJson.edges.map(addEdgeWarnings).filter(withWarnings),
    }
    expect(warnings).toMatchSnapshot(this)
  })
})

