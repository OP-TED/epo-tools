// main.js
import { EAReader } from './eaReader.js';

async function readEAFile() {
  const reader = new EAReader('assets/ePO/4.2.0-rc.2/analysis_and_design/conceptual_model/ePO_CM.qea');

  try {
    await reader.connect();

    // Get all packages
    const packages = await reader.getPackages();
    console.log('Packages:', packages);

    // Get all elements
    const elements = await reader.getElements();
    console.log('Elements:', elements);

    // Get all diagrams
    const diagrams = await reader.getDiagrams();
    console.log('Diagrams:', diagrams);

    // Get all connectors
    const connectors = await reader.getConnectors();
    console.log('Connectors:', connectors);

    await reader.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Using top-level await (Node.js 14.8+ required)
await readEAFile();
