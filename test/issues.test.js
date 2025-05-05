import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  appendIssues,
  inspectEdge,
  inspectNode,
} from '../src/conceptualModel/issues.js'

import eaJson from '../public/models/ePO_CM_v4.1.1.json' with { type: 'json' }

expect.extend({ toMatchSnapshot })

describe('issues', () => {

  const { edges, nodes } = eaJson

  it(`appendIssues`, function () {
    const result = appendIssues({ edges, nodes, hello: 'world' })
    expect(result).toMatchSnapshot(this)
  })

  it(`inspectNode`, function () {
    const result = nodes.map(inspectNode).filter(x => x.length)
    expect(result).toMatchSnapshot(this)
  })

  it(`inspectEdge`, function () {
    const result = edges.map(inspectEdge).filter(x => x.length)
    expect(result).toMatchSnapshot(this)
  })
})

