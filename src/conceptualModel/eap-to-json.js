import MDBReader from 'mdb-reader'
import { dbToJson } from './db-to-json.js'

function eapToJson ({ buffer }) {
  const reader = new MDBReader(buffer)
  const objects = reader.getTable('t_object').getData()
  const attributes = reader.getTable('t_attribute').getData()
  const connectors = reader.getTable('t_connector').getData()
  return dbToJson({ objects, attributes, connectors })
}

export { eapToJson }
