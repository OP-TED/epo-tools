import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { getAllPrefixes } from '../src/prefix/prefix.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('prefix', () => {
  const epoJson = getEpoJson()
  it(`getAllPrefixes`, function () {
    const allPrefixes = getAllPrefixes(epoJson)
    expect(allPrefixes).toMatchSnapshot(this)
  })
})

