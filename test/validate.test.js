import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { validateEdge, validateNode } from '../src/ontology/ea/validate.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('validate', () => {

  const { edges, nodes } = getEpoJson()

  it(`validateNode`, function () {
    const result = nodes.map(validateNode).filter(x=>x.length)
    expect(result).toMatchSnapshot(this)
  })

  it(`validateEdge`, function () {
    const result = edges.map(validateEdge).filter(x=>x.length)
    expect(result).toMatchSnapshot(this)
  })
})
