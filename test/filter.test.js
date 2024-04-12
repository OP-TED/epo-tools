import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { filterBy } from '../src/ontology/views/filter.js'
import { getJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('filter', () => {
  const eaJson = getJson()

  it(`filterBy incoming=true`, function () {
    const view = {
      filter: ['epo-cat:*', 'epo-not:*'], includeIncoming: true,
    }

    const filtered = filterBy(eaJson, view)
    expect(filtered).toMatchSnapshot(this)
  })

  it(`filterBy incoming=false`, function () {

    const view = {
      filter: ['epo-cat:*', 'epo-not:*'], includeIncoming: false,
    }

    const filtered = filterBy(eaJson, view)
    expect(filtered).toMatchSnapshot(this)
  })

  it(`filterBy incoming=false small`, function () {

    const view = {
      filter: ['foaf:Agent', 'epo:Purpose', '!epo:Q*', '-dct*'],
      includeIncoming: false,
    }

    const filtered = filterBy(eaJson, view)
    expect(filtered).toMatchSnapshot(this)
  })
})

