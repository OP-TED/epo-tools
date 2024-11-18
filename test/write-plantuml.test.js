import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'

import { getComparisonChunks } from '../src/plantuml/comparison.js'
import { toPlantuml } from '../src/plantuml/plantumlTemplate.js'

import before from '../public/models/ePO_CM_v4.0.0.json' assert { type: 'json' }
import after
  from '../public/models/ePO_CM_v4.1.1.json' assert { type: 'json' }

expect.extend({ toMatchSnapshot })

describe('write-plantuml', () => {

  it(`generates plantuml`, function () {
    const plantuml = toPlantuml(before)
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml, empty graph`, async function () {
    const plantuml = toPlantuml({ nodes: [], edges: [] })
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml simple`, function () {
    const plantuml = toPlantuml(before,
      { shrink: true, sorted: true })
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates comparison-chunks`, async function () {
    const comparison = getComparisonChunks(before, after)
    expect(comparison).toMatchSnapshot(this)
  })
})

