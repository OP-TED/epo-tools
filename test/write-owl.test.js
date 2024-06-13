import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { PRODUCTION } from '../src/config.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { toOwl } from '../src/shacl/model2Owl.js'

expect.extend({ toMatchSnapshot })

describe('write-owl', () => {

  const epoJson = getEpoJson(PRODUCTION)

  it(`generates owl`, async function () {
    const { dataset, turtle, errors } = await toOwl(epoJson)
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates owl, empty graph`, async function () {
    const { dataset, turtle, errors } = await toOwl({ nodes: [], edges: [] })
    expect(turtle).toMatchSnapshot(this)
  })

})

