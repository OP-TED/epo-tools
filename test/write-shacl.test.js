import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import { getJson } from '../src/epo/readEpo.js'
import { toShacl } from '../src/shacl/model2Shacl.js'

expect.extend({ toMatchSnapshot })

describe('write-shacl', () => {

  const epoJson = getJson(UNDER_REVIEW)

  it(`generates shacl`, async function () {
    const { dataset, turtle, errors } = await toShacl(epoJson)
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates shacl, empty graph`, async function () {
    const { dataset, turtle, errors } = await toShacl({ nodes: [], edges: [] })
    expect(turtle).toMatchSnapshot(this)
  })

})

