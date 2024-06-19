import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import { getJson } from '../src/epo/readEpo.js'
import { getAllPrefixes } from '../src/prefix/prefix.js'

expect.extend({ toMatchSnapshot })

describe('prefix', () => {
  const epoJson = getJson(UNDER_REVIEW)

  it(`getAllPrefixes`, function () {
    const allPrefixes = getAllPrefixes(epoJson)
    expect(allPrefixes).toMatchSnapshot(this)
  })
})

