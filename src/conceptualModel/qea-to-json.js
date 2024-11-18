import Database from 'better-sqlite3';
import { dbToJson } from './db-to-json.js';

function qeaToJson({ databasePath }) {
  const db = new Database(databasePath);

  const objects = db.prepare('SELECT * FROM t_object').all();
  const attributes = db.prepare('SELECT * FROM t_attribute').all();
  const connectors = db.prepare('SELECT * FROM t_connector').all();

  db.close();

  return dbToJson({ objects, attributes, connectors });
}

export { qeaToJson };
