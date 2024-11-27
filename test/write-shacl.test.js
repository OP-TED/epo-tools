import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { toShacl } from '../src/shacl/model2Shacl.js'

import eaJson from '../public/models/ePO_CM_v4.1.1.json' assert { type: 'json' }

expect.extend({ toMatchSnapshot })

describe('write-shacl', () => {

  it(`generates shacl`, async function () {
    const { dataset, turtle, errors } = await toShacl(eaJson)
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates shacl, empty graph`, async function () {
    const { dataset, turtle, errors } = await toShacl({ nodes: [], edges: [] })
    expect(turtle).toMatchSnapshot(this)
  })

})

