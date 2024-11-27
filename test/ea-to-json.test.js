import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFileSync } from 'fs'
import { describe, it } from 'mocha'
import { eapToJson } from '../src/conceptualModel/eap-to-json.js'
import { qeaToJson } from '../src/conceptualModel/qea-to-json.js'

expect.extend({ toMatchSnapshot })

describe('read-enterprise-architect-database', () => {

  it(`generates Json from eap`, function () {
    const buffer = readFileSync('test/support/ePO_CM.eap')
    const g = eapToJson({ buffer })
    expect(g).toMatchSnapshot(this)
  })

  it(`generates Json from qea`, function () {
    const databasePath = 'test/support/ePO_CM.qea'
    const g = qeaToJson({ databasePath })
    expect(g).toMatchSnapshot(this)
  })
})

