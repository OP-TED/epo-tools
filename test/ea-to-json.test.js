import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import { getJson } from '../src/epo/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('read-enterprise-architect-database', () => {

  it(`generates Json`, function () {
    const g = getJson(UNDER_REVIEW)
    expect(g).toMatchSnapshot(this)
  })
})

