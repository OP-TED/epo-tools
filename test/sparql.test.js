import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFileSync } from 'fs'
import { describe, it } from 'mocha'
import { applyGlob } from '../src/io/assets.js'

import { termsFromQuery } from '../src/ontology/sparql/extract.js'
import {
  validateAgainstGraph,
} from '../src/ontology/sparql/validate.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

const globPattern = `test/support/queries/**`
const assets = await applyGlob(globPattern)
const epoJson = getEpoJson()

describe('extract terms', async () => {

  for (const path of assets) {
    const queryStr = readFileSync(path).toString()
    it(`asset:${path}`, async function () {
      const { terms } = termsFromQuery({ queryStr })
      expect(terms).toMatchSnapshot(this)
    })
  }

  it(`failed query`, async function () {
    const { terms, error } = termsFromQuery({ queryStr: 'not a query' })
    expect(error).toMatchSnapshot(this)
  })
})

describe('validate against conceptual model', async () => {

  for (const path of assets) {
    const queryStr = readFileSync(path).toString()

    it(`asset:${path}`, async function () {
      const result = validateAgainstGraph(epoJson, { queryStr })
      expect(result).toMatchSnapshot(this)
    })
  }

})


