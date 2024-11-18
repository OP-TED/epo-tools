import sqlite3 from 'sqlite3';

export class EAReader {
  constructor(qeaFilePath) {
    this.dbPath = qeaFilePath;
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          reject(`Error connecting to QEA file: ${err.message}`);
        }
        resolve('Connected to QEA file successfully');
      });
    });
  }

  async getPackages() {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT t_package.Package_ID, t_package.Name, t_package.Parent_ID
                FROM t_package
                ORDER BY t_package.Parent_ID, t_package.Package_ID
            `;

      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(`Error fetching packages: ${err.message}`);
        }
        resolve(rows);
      });
    });
  }

  async getElements() {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT t_object.Object_ID, t_object.Name, t_object.Object_Type, 
                       t_object.Package_ID, t_object.Stereotype
                FROM t_object
                ORDER BY t_object.Package_ID, t_object.Name
            `;

      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(`Error fetching elements: ${err.message}`);
        }
        resolve(rows);
      });
    });
  }

  async getDiagrams() {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT t_diagram.Diagram_ID, t_diagram.Name, t_diagram.Package_ID,
                       t_diagram.DiagramType, t_diagram.StyleEx
                FROM t_diagram
                ORDER BY t_diagram.Package_ID, t_diagram.Name
            `;

      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(`Error fetching diagrams: ${err.message}`);
        }
        resolve(rows);
      });
    });
  }

  async getConnectors() {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT t_connector.Connector_ID, t_connector.Name, 
                       t_connector.Start_Object_ID, t_connector.End_Object_ID,
                       t_connector.Connector_Type
                FROM t_connector
                ORDER BY t_connector.Connector_ID
            `;

      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(`Error fetching connectors: ${err.message}`);
        }
        resolve(rows);
      });
    });
  }

  close() {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) {
            reject(`Error closing database: ${err.message}`);
          }
          resolve('Database connection closed');
        });
      });
    }
    return Promise.resolve('Database was not open');
  }
}
