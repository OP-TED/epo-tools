import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFileSync } from 'fs'
import { describe, it } from 'mocha'
import { bufferToJson } from '../src/conceptualModel/ea-to-json.js'
import { UNDER_REVIEW } from '../src/config.js'

expect.extend({ toMatchSnapshot })

describe('read-enterprise-architect-database', () => {

  it(`generates Json`, function () {

    const assetsPath = UNDER_REVIEW.localDirectory
    const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
    const buffer = readFileSync(databasePath)
    const json = bufferToJson({ buffer })
    expect(json).toMatchSnapshot(this)
  })
})

