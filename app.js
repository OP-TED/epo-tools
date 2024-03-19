import cors from 'cors'
import express from 'express'
import { getRdfAssets } from './src/io/assets.js'
import { createTriplestore, doConstruct } from './src/io/sparql.js'
import { EPO_LATEST } from './src/config.js'
import { toHTML, toTable } from './src/io/html.js'

const app = express()

// CORS with all origins allowed (not recommended for production)
app.use(cors())

app.use(express.json())

// Serve static files
app.use(express.static('public'))

// Generic error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false, message: err.stack,
  })
})

// Leaving out OWL and SHACL.
const globPattern = `${EPO_LATEST.localDirectory}/implementation/**/!(*_restrictions|*_shapes).ttl`
const assets = await getRdfAssets({ globPattern })
const store = createTriplestore({ assets })

// Through a construct
app.use(['/all'], (req, res) => {
  const query = `
  CONSTRUCT {
    ?subject ?predicate ?object
  }
  WHERE {
    GRAPH ?g {
      ?subject ?predicate ?object
    }
  }
`
  const dataset = doConstruct({ store, query })
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(toHTML({ dataset, maxLevel: 1 }))

})

const getApiPath = (str) => str.match(/\/owl_ontology\/([^/]+)\.ttl$/)?.[1] ||
  null

for (const { path, dataset } of assets) {
  const apiPath = `/${getApiPath(path)}`
  console.log('module', apiPath)
  app.use([apiPath], (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(toHTML({ dataset, maxLevel: 1 }))
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT,
  () => console.log(`Server listening on http://localhost:${PORT}`))
