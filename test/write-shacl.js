import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { describe, it } from 'mocha'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { UNDER_REVIEW } from '../src/config.js'
import { prettyPrintTurtle } from '../src/io/serialization.js'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../src/ontology/ea/add-warnings.js'
import { toJson } from '../src/ontology/ea/ea-to-json.js'
import { toTurtle } from '../src/ontology/templates/turtle-template.js'
import { narrowToEpo } from '../src/ontology/views/epo-views.js'

expect.extend({ toMatchSnapshot })

const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')

describe('write-shacl', () => {
  const assetsPath = UNDER_REVIEW.localDirectory
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`

  const jsonExport = toJson({ databasePath })

  it(`generates shacl for ${assetsPath}`, async function () {

    const { nodes, edges } = narrowToEpo(jsonExport)
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

