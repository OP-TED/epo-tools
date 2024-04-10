import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  filterBy,
} from '../src/ontology/views/filter.js'
import { getJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('filter', () => {
  const eaJson = getJson()
  const filter = ['epo-cat:', 'epo-not:']
  it(`filterBy incoming=true`, function () {
    const filtered = filterBy(eaJson, {
      filter,
    })
    expect(filtered).toMatchSnapshot(this)
  })
  it(`filterBy incoming=false`, function () {

    const filtered = filterBy(eaJson, {
      filter, includeIncoming: false,
    })
    expect(filtered).toMatchSnapshot(this)
  })
})

