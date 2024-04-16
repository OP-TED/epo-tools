import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFileSync } from 'fs'
import { describe, it } from 'mocha'
import { applyGlob } from '../src/io/assets.js'

import { termsFromQuery } from '../src/ontology/views/sparql-views.js'

expect.extend({ toMatchSnapshot })

const globPattern = `test/support/queries/**`
const assets = await applyGlob(globPattern)

describe('sparql-views', async () => {

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

