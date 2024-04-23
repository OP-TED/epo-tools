import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { EPO_LATEST, UNDER_REVIEW } from '../src/config.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { getComparisonChunks } from '../src/plantuml/comparison.js'
import { toPlantuml } from '../src/plantuml/plantumlTemplate.js'

expect.extend({ toMatchSnapshot })

describe('write-plantuml', () => {

  const current = getEpoJson(UNDER_REVIEW)

  it(`generates plantuml`, function () {
    const plantuml = toPlantuml(current)
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml simple`, function () {
    const plantuml = toPlantuml(current,
      { includeRelationships: false, sorted: true })
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml, empty graph`, async function () {
    const plantuml = toPlantuml(current)
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates comparison-chunks`, async function () {
    const prev = getEpoJson(EPO_LATEST)
    const comparison = getComparisonChunks(prev, current)
    expect(comparison).toMatchSnapshot(this)
  })
})

