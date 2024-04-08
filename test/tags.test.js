import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { UNDER_REVIEW } from '../src/config.js'
import { toJson } from '../src/ontology/ea/ea-to-json.js'
import { narrowToEpo } from '../src/ontology/views/epo-views.js'
import {
  addTags,
  filterByTags,
  getAllTags,
} from '../src/ontology/views/tags.js'

expect.extend({ toMatchSnapshot })

describe('add-tags', () => {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

  const eaJson = toJson({ databasePath })
  const epoJson = narrowToEpo(eaJson)

  it(`addTags for ${assetsPath}`, function () {
    const withTags = addTags(epoJson)
    expect(withTags).toMatchSnapshot(this)
  })

  it(`filterByTags for ${assetsPath}`, function () {

    const withTags = addTags(epoJson)
    const filtered = filterByTags(withTags, new Set(['epo-cat', 'epo-not']))
    expect(filtered).toMatchSnapshot(this)
  })

  it(`getAllTags for ${assetsPath}`, function () {

    const epoTags = getAllTags(epoJson)
    expect(epoTags).toMatchSnapshot(this)
  })
})

