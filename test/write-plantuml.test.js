import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import { getEpoJson } from '../src/epo/readEpo.js'
import { toPlantuml } from '../src/plantuml/plantumlTemplate.js'

expect.extend({ toMatchSnapshot })

describe('write-plantuml', () => {

  const epoJson = getEpoJson(UNDER_REVIEW)

  it(`generates plantuml`, function () {
    const plantuml = toPlantuml(epoJson)
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml simple`, function () {
    const plantuml = toPlantuml(epoJson,
      { includeRelationships: false, sorted: true })
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml, empty graph`, async function () {
    const plantuml = toPlantuml(epoJson)
    expect(plantuml).toMatchSnapshot(this)
  })
})

