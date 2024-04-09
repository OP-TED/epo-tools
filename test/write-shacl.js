import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { prettyPrintTurtle } from '../src/io/serialization.js'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../src/ontology/ea/add-warnings.js'
import { toTurtle } from '../src/ontology/templates/turtle-template.js'
import { getEpoJson } from './support/readEpo.js'

expect.extend({ toMatchSnapshot })

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

describe('write-shacl', () => {

  const epoJson = getEpoJson()

  it(`generates shacl`, async function () {

    const { nodes, edges } = epoJson
    const epoOntology = {
      nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
      edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
    }

    const uglyTurtle = toTurtle(epoOntology)
    const dataset = rdf.dataset().addAll([...new Parser().parse(uglyTurtle)])
    const pretty = await prettyPrintTurtle({ dataset })

    expect(pretty).toMatchSnapshot(this)
  })
})

