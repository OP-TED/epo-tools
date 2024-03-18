import fs from 'fs'
import { getRdfAssets } from '../io/assets.js'
import { rdfArrayToCSV } from '../io/serialization.js'
import { createTriplestore, doSelect } from '../io/sparql.js'
import { EPO } from '../config.js'

const { localDirectory } = EPO
const globPattern = `${localDirectory}/implementation/**/*.{ttl,rdf}`

const assets = await getRdfAssets({ globPattern })

const query = `
PREFIX ns: <http://publications.europa.eu/resource/authority>
SELECT ?s ?p ?o {
 GRAPH ?g { 
   ?s  ?p  ?o
   FILTER (isURI(?s) && STRSTARTS(str(?s), str(ns:) ) )
 }
}
`
const store = createTriplestore({ assets })
const data = doSelect({ store, query })

if (data.length) {
  const directory = 'outputs/checkers'
  fs.mkdirSync(directory, { recursive: true })

  const output = rdfArrayToCSV(data)
  const filename = `${directory}/authority.csv`
  fs.writeFileSync(filename, output)
  console.log(`${filename} created successfully.`)
} else {
  console.log('no problems found in', assets.length, 'files')
}


