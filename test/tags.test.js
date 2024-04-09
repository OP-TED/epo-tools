import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  addTags,
  filterByTags,
  getAllTags,
} from '../src/ontology/views/tags.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('add-tags', () => {

  const epoJson = getEpoJson()

  it(`addTags`, function () {
    const withTags = addTags(epoJson)
    expect(withTags).toMatchSnapshot(this)
  })

  it(`filterByTags`, function () {

    const withTags = addTags(epoJson)
    const filtered = filterByTags(withTags, new Set(['epo-cat', 'epo-not']))
    expect(filtered).toMatchSnapshot(this)
  })

  it(`getAllTags`, function () {

    const epoTags = getAllTags(epoJson)
    expect(epoTags).toMatchSnapshot(this)
  })
})

