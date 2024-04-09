import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../src/ontology/ea/add-warnings.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

const withWarnings = x => x.warnings.length > 0

describe('add-warnings', () => {

  const epoJson = getEpoJson()

  it(`adds warnings`, function () {
    const warnings = {
      nodes: epoJson.nodes.map(addNodeWarnings).filter(withWarnings),
      edges: epoJson.edges.map(addEdgeWarnings).filter(withWarnings),
    }
    expect(warnings).toMatchSnapshot(this)
  })
})

