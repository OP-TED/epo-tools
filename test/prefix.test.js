import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { getAllPrefixes } from '../src/prefix/prefix.js'

import eaJson from '../public/models/ePO_CM_v4.1.1.json' with { type: 'json' }

expect.extend({ toMatchSnapshot })

describe('prefix', () => {

  it(`getAllPrefixes`, function () {
    const allPrefixes = getAllPrefixes(eaJson)
    expect(allPrefixes).toMatchSnapshot(this)
  })
})

