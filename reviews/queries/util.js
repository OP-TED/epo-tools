import { stringify } from 'csv-stringify/lib/sync.js'

function rdfArrayToCSV (array) {
  if (array.length) {
    const header = Object.keys(array[0])
    const arrayOfArrays = array.map(obj => Object.values(obj).map(x => x.value))
    return stringify([header, ...arrayOfArrays])
  }
}

export { rdfArrayToCSV }
