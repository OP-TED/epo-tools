import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

const databasePath = './test/support/ePO_CM.eap'

console.log('reading database', databasePath)

const buffer = readFileSync(databasePath)
const reader = new MDBReader(buffer)

function searchEnterpriseArchitect (text) {
  const allTables = reader.getTableNames() // ['t_object', 't_connector', 't_attribute']
  for (const table of allTables) {
    for (const row of reader.getTable(table).
      getData()) {
      for (const value of Object.values(row)) {
        if (typeof value === 'string' && value.includes(text)) {
          console.log(table, row)
        }
      }
    }
  }
}

searchEnterpriseArchitect('cccev:')
