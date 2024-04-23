import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFileSync } from 'fs'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { applyGlob } from '../src/io/assets.js'

import { termsFromQuery } from '../src/sparql/extractFromQuery.js'
import { validateAgainstGraph } from '../src/sparql/validate.js'

expect.extend({ toMatchSnapshot })

const globPattern = `test/support/queries/**`
const assets = await applyGlob(globPattern)
const epoJson = getEpoJson(UNDER_REVIEW)

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


