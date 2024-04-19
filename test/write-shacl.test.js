import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { toShacl } from '../src/shacl/model2Shacl.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('write-shacl', () => {

  const epoJson = getEpoJson()

  it(`generates shacl`, async function () {
    const { dataset, turtle, errors } = await toShacl(epoJson)
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates shacl, empty graph`, async function () {
    const { dataset, turtle, errors } = await toShacl({ nodes: [], edges: [] })
    expect(turtle).toMatchSnapshot(this)
  })

})

