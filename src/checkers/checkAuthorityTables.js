import fs from 'fs'
import { getRdfAssets } from '../io/assets.js'
import { rdfArrayToCSV } from '../io/serialization.js'
import { createTriplestore, doSelect } from '../io/sparql.js'

async function checkAuthorityTables ({ sourceDirectory, targetDirectory }) {
  const globPattern = `${sourceDirectory}/implementation/**/*.{ttl,rdf}`

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

    fs.mkdirSync(targetDirectory, { recursive: true })

    const output = rdfArrayToCSV(data)
    const filename = `${targetDirectory}/authority.csv`
    fs.writeFileSync(filename, output)
    console.log(`${filename} created successfully.`)
  } else {
    console.log('no authority tables redefined in', assets.length, 'files')
  }
}

export { checkAuthorityTables }
