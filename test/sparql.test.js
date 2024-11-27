import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFileSync } from 'fs'
import { describe, it } from 'mocha'
import { applyGlob } from '../src/io/assets.js'

import { termsFromQuery } from '../src/sparql/extractFromQuery.js'
import { validateAgainstGraph } from '../src/sparql/validate.js'
import eaJson from '../public/models/ePO_CM_v4.1.1.json' assert { type: 'json' }

expect.extend({ toMatchSnapshot })

const globPattern = `test/support/queries/**`
const assets = await applyGlob(globPattern)

describe('extract terms', async () => {

  for (const path of assets) {
    const queryStr = readFileSync(path).toString()
    it(`asset:${path}`, async function () {
      const result = termsFromQuery({ queryStr })
      expect(result).toMatchSnapshot(this)
    })
  }

  it(`failed query`, async function () {
    const result = termsFromQuery({ queryStr: 'not a query' })
    expect(result).toMatchSnapshot(this)
  })
})

describe('validate against conceptual model', async () => {

  for (const path of assets) {
    const queryStr = readFileSync(path).toString()

    it(`asset:${path}`, async function () {
      const result = validateAgainstGraph(eaJson,
        { queryStr, filter: ['epo*'] })
      expect(result).toMatchSnapshot(this)
    })
  }

})


