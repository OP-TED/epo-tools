import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { toPlantuml } from '../src/ontology/templates/plantuml-template.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

describe('write-plantuml', () => {

  const epoJson = getEpoJson()

  it(`generates plantuml`, function () {
    const plantuml = toPlantuml(epoJson)
    expect(plantuml).toMatchSnapshot(this)
  })

  it(`generates plantuml, empty graph`, async function () {
    const plantuml = toPlantuml(epoJson)
    expect(plantuml).toMatchSnapshot(this)
  })
})

