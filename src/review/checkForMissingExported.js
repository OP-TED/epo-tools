import { applyGlob } from '../io/assets.js'
import fs from 'fs'
import { xml2js } from 'xml-js'
import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

const assetsPath = 'assets/ePO/release/4.1.0'

async function getNameSetFromXMI () {
  const globPattern = `${assetsPath}/implementation/**/xmi_conceptual_model/*.xml`

  const xmiFiles = await applyGlob(globPattern)
  const result = new Set()

  function traverse (items) {
    for (const { name, elements, attributes } of items ?? []) {
      if (attributes && attributes.name && attributes.name.startsWith('epo')) {
        result.add(attributes.name)
      }
      traverse(elements)
    }
  }

  for (const current of xmiFiles) {
    const xmlContent = fs.readFileSync(current, 'utf8')
    const { elements } = xml2js(xmlContent, { compact: false, spaces: 4 })
    traverse(elements)
  }
  return result
}

function getNameSetFromDB () {
  const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
  console.log('reading database', databasePath)

  const buffer = readFileSync(databasePath)
  const reader = new MDBReader(buffer)
  const objects = reader.getTable('t_object').
    getData().
    map(x => x.Name).
    filter(x => x && x.startsWith('epo'))

  const attributes = reader.getTable('t_attribute').
    getData().
    map(x => x.Name).
    filter(x => x && x.startsWith('epo'))

  const connectors = reader.getTable('t_connector').
    getData().
    map(x => x.DestRole).filter(x => x && x.startsWith('epo'))

  return new Set([...objects, ...attributes, ...connectors])
}

const set1 = await getNameSetFromXMI()
const set2 = await getNameSetFromDB()

// Find elements in set1 that are not in set2
const differenceSet1 = new Set([...set1].filter(x => !set2.has(x)))

// Find elements in set2 that are not in set1
const differenceSet2 = new Set([...set2].filter(x => !set1.has(x)))

console.log('Elements in set1 but not in set2:', [...differenceSet1])
console.log('Elements in set2 but not in set1:', [...differenceSet2])

