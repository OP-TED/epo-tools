import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { toOwl } from '../src/shacl/model2Owl.js'
import eaJson from '../public/models/ePO_CM_v4.1.1.json' assert { type: 'json' }

expect.extend({ toMatchSnapshot })

describe('write-owl', () => {

  it(`generates owl`, async function () {
    const { dataset, turtle, errors } = await toOwl(eaJson)
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates owl, empty graph`, async function () {
    const { dataset, turtle, errors } = await toOwl({ nodes: [], edges: [] })
    expect(turtle).toMatchSnapshot(this)
  })

})

