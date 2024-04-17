import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { filterBy } from '../src/ontology/views/filter.js'
import { toShacl } from '../src/ontology/views/shacl.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('write-shacl', () => {

  const epoJson = getEpoJson()

  it(`generates shacl`, async function () {
    const { dataset, turtle, errors } = await toShacl(epoJson)
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates shacl, empty graph`, async function () {
    const { dataset, turtle, errors } = await toShacl({ nodes: [], edges: [] })
    expect(turtle).toMatchSnapshot(this)
  })

  it(`generates shacl with inference`, async function () {

    const filter = ['epo:Buyer', 'epo:AwardDecision', 'epo:AwardOutcome']
    const narrow = filterBy(epoJson, { filter, includeIncoming: false })

    const { dataset, turtle, errors } = await toShacl(narrow,
      { inference: true })
    expect(turtle).toMatchSnapshot(this)
  })

})

