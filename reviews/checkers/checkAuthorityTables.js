import { stringify } from 'csv-stringify/sync'
import fs from 'fs'
import { UNDER_REVIEW } from '../../src/config.js'
import { getRdfAssets } from '../../src/io/assets.js'
import { createTriplestore, doSelect } from '../../src/sparql/localStore.js'

function rdfArrayToCSV (array) {
  if (array.length) {
    const header = Object.keys(array[0])
    const arrayOfArrays = array.map(obj => Object.values(obj).map(x => x.value))
    return stringify([header, ...arrayOfArrays])
  }
}

async function checkAuthorityTables ({ sourceDirectory, targetDirectory }) {
  const globPattern = `${sourceDirectory}/implementation/**/*.{ttl,rdf}`

  const assets = await getRdfAssets({ globPattern })

  const query = `
PREFIX ns: <http://publications.europa.eu/resource/authority>
SELECT ?g ?s ?p ?o {
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

export default checkAuthorityTables
