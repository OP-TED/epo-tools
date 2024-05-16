import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  appendIssues,
  inspectEdge,
  inspectNode,
} from '../src/conceptualModel/issues.js'
import { UNDER_REVIEW } from '../src/config.js'
import { getEpoJson } from '../src/epo/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('issues', () => {

  const { edges, nodes } = getEpoJson(UNDER_REVIEW)

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

