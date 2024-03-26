import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'
import { UNDER_REVIEW } from '../config.js'

const assetsPath = UNDER_REVIEW.localDirectory

const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
console.log('reading database', databasePath)

const buffer = readFileSync(databasePath)
const reader = new MDBReader(buffer)

function searchEnterpriseArchitect (text) {
  for (const table of ['t_object', 't_connector', 't_attribute']) { // reader.getTableNames()
    const data = reader.getTable(table).
      getData()
    for (const row of data) {
      for (const value of Object.values(row)) {
        if (typeof value === 'string' && value.includes(text)) {
          console.log(table, row)
        }
      }
    }
  }
}

searchEnterpriseArchitect('cccev:')
