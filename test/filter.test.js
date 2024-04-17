import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { ATTRIBUTE, RELATIONSHIP } from '../src/ontology/const.js'
import {
  filterBy,
  suggestNodes,
  anyMatch,
} from '../src/ontology/views/filter.js'
import { getJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('filter', () => {
  const eaJson = getJson()

  it(`anyMatch`, function () {
    const toCheck = ['epo-cat:*', 'who-are-you']
    const result = toCheck.map(x => anyMatch(eaJson, { filter: [x] }))
    expect(result).toMatchSnapshot(this)
  })

  it(`filterBy incoming=true`, function () {
    const view = {
      filter: ['epo-cat:*', 'epo-not:*'], includeIncoming: true,
    }

    const filtered = filterBy(eaJson, view)
    expect(filtered).toMatchSnapshot(this)
  })

  it(`filterBy attributes`, function () {
    const view = {
      filter: ['epo:hasPublicationDate', 'epo:refersToLot'],
      includeIncoming: false,
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

  it(`filterBy negation`, function () {

    const view = {
      filter: ['foaf:Agent', 'epo:Purpose', '!epo:Q*', '-dct*'],
      includeIncoming: false,
    }

    const filtered = filterBy(eaJson, view)
    expect(filtered).toMatchSnapshot(this)
  })

  it(`filterBy suggestNodes`, function () {

    const view = {
      filter: ['epo:Document'], includeIncoming: false,
    }

    const filtered = filterBy(eaJson, view)

    const suggested = suggestNodes(filtered, view)

    expect(suggested).toMatchSnapshot(this)
  })

  const graph = {
    nodes: [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
      { name: 'e' },
      { name: 'datatype' }], edges: [
      { source: 'a', predicate: 'selected', target: 'b', type: RELATIONSHIP },
      {
        source: 'a', predicate: 'has', target: 'datatype3', type: ATTRIBUTE,
      },
      { source: 'b', predicate: 'selected', target: 'c', type: RELATIONSHIP },
      { source: 'c', predicate: 'foaf', target: 'e', type: RELATIONSHIP },
      {
        source: 'b', predicate: 'has', target: 'datatype1', type: ATTRIBUTE,
      },
      {
        source: 'b',
        predicate: 'selected',
        target: 'datatype2',
        type: ATTRIBUTE,
      },
      { source: 'e', predicate: 'incoming', target: 'b', type: RELATIONSHIP }],
  }

  it(`simple-edge`, function () {
    const filtered = filterBy(graph, { filter: ['selected'] })
    expect(filtered).toMatchSnapshot(this)
  })

  it(`simple-datatype`, function () {
    const filtered = filterBy(graph, { filter: ['datatype1'] })
    console.log(filtered)
    expect(filtered).toMatchSnapshot(this)
  })

  it(`simple-node`, function () {
    const filtered = filterBy(graph, { filter: ['a', 'c'] })
    expect(filtered).toMatchSnapshot(this)
  })

  it(`simple-edge negation`, function () {
    const filtered = filterBy(graph, { filter: ['selected', '-a'] })
    expect(filtered).toMatchSnapshot(this)
  })

  it(`simple-datatype negation`, function () {
    const filtered = filterBy(graph, { filter: ['datatype1', '-has'] })
    console.log(filtered)
    expect(filtered).toMatchSnapshot(this)
  })

  it(`simple-node negation`, function () {
    const filtered = filterBy(graph, { filter: ['a', 'c', '-e'] })
    expect(filtered).toMatchSnapshot(this)
  })

})

