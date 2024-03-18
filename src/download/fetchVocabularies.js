import { promises as fs, mkdirSync } from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'
import { COMMON_VOCABS } from '../config.js'

const vocabularies = [
  { filename: 'w3c-time.ttl', url: 'http://www.w3.org/2006/time#' },
  { filename: 'w3c-locn.ttl', url: 'http://www.w3.org/ns/locn#' },
  { filename: 'w3c-org.ttl', url: 'http://www.w3.org/ns/org#' },
  { filename: 'w3c-person.ttl', url: 'http://www.w3.org/ns/person#' },
  { filename: 'w3c-adms.ttl', url: 'http://www.w3.org/ns/adms#' },
  { filename: 'w3c-skos.rdf', url: 'http://www.w3.org/2004/02/skos/core#' }, // SKOS does not dereference correctly TODO report this.
  { filename: 'w3c-owl.ttl', url: 'http://www.w3.org/2002/07/owl#' },
  {
    filename: 'w3c-22-rdf-syntax-ns.ttl',
    url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  },
  { filename: 'foaf.rdf', url: 'http://xmlns.com/foaf/spec/index.rdf' }, // 'http://xmlns.com/foaf/0.1/' FOAF does not dereference at all :(
  { filename: 'm8g.ttl', url: 'http://data.europa.eu/m8g/' },
  { filename: 'dc-terms.ttl', url: 'http://purl.org/dc/terms/' },
  { filename: 'dcat.ttl', url: 'http://www.w3.org/ns/dcat#' },
  { filename: 'owl.ttl', url: 'http://www.w3.org/2002/07/owl#' },
  { filename: 'rdf.ttl', url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
  { filename: 'rdfs.ttl', url: 'http://www.w3.org/2000/01/rdf-schema' },

]

const { localDirectory } = COMMON_VOCABS

async function downloadVocabularies () {
  mkdirSync(localDirectory, { recursive: true })

  const downloadPromises = vocabularies.map(async ({ filename, url }) => {
    const path = join(localDirectory, filename)
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'text/turtle',
        },
      })

      const data = await response.text()
      await fs.writeFile(path, data)
      console.log(`Downloaded: ${url}  at ${path}`)
    } catch (error) {
      console.error(`Failed to download: ${url}`)
      console.error(error)
    }
  })

  await Promise.all(downloadPromises)
}

await downloadVocabularies()
