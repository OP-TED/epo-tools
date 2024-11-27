import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { ATTRIBUTE, RELATIONSHIP } from '../src/conceptualModel/const.js'
import {
  anyMatch,
  filterBy,
  startsWith,
} from '../src/conceptualModel/filter.js'

import eaJson from '../public/models/ePO_CM_v4.1.1.json' assert { type: 'json' }

expect.extend({ toMatchSnapshot })

describe('filter', () => {

  it(`allEpo`, function () {
    const result = startsWith(eaJson, 'epo')
    expect(result).toMatchSnapshot(this)
  })

  it(`byPrefix`, function () {
    const result = startsWith(eaJson, 'epo-cat:')
    expect(result).toMatchSnapshot(this)
  })

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

  it(`simple-node negation`, function () {
    const filtered = filterBy(graph, { filter: ['a', 'c', '-e'] })
    expect(filtered).toMatchSnapshot(this)
  })

  it(`at-voc-new:certification-label-type`, function () {
    const filtered = filterBy(eaJson,
      { filter: ['at-voc-new:certification-label-type'] })

    expect(filtered).toMatchSnapshot(this)
  })

})

