import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../src/ontology/ea/add-warnings.js'
import { toPlantuml } from '../src/ontology/templates/plantuml-template.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

describe('write-plantuml', () => {

  const epoJson = getEpoJson()

  it(`generates plantuml`, function () {

    const { nodes, edges } = epoJson
    const epoOntology = {
      nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
      edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
    }

    const plantuml = toPlantuml(epoOntology)

    expect(plantuml).toMatchSnapshot(this)
  })
})

