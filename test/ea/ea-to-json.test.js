import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../../src/config.js'
import { toJson } from '../../src/ontology/ea/ea-to-json.js'

expect.extend({ toMatchSnapshot })

describe('read-enterprise-architect-database', () => {
  const assetsPath = UNDER_REVIEW.localDirectory

  it(`generates Json for ${assetsPath}`, function () {
    const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
    const json = toJson({ databasePath })
    expect(json).toMatchSnapshot(this)
  })
})

