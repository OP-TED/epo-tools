import Database from 'better-sqlite3';
import { dbToJson } from './db-to-json.js';

function qeaToJson({ databasePath }) {

  console.log('databasePath',databasePath);
  const db = new Database(databasePath);

  const objects = db.prepare('SELECT * FROM t_object').all();
  const objectProperties = db.prepare('SELECT * FROM t_objectproperties').all();
  const attributes = db.prepare('SELECT * FROM t_attribute').all();
  const connectors = db.prepare('SELECT * FROM t_connector').all();

  db.close();

  return dbToJson({ objects, objectProperties, attributes, connectors });
}

export { qeaToJson };
