import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  filterBy,
} from '../src/ontology/views/filter.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('filter', () => {
  const epoJson = getEpoJson()
  it(`filterBy`, function () {
    const filtered = filterBy(epoJson, ['epo-cat:', 'epo-not:'])
    expect(filtered).toMatchSnapshot(this)
  })
})

