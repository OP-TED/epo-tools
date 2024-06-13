import { writeFileSync } from 'fs'
import { PRODUCTION } from '../src/config.js'
import { toOwl } from '../src/shacl/model2Owl.js'
import { getEpoJson } from '../src/epo/readEpo.js'

const onlyEPO = getEpoJson(PRODUCTION)

const { dataset, turtle, errors } = await toOwl(onlyEPO)

const path = `assets/epo.owl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)

const errorFile = `assets/epo.owl.errors.json`
writeFileSync(errorFile, JSON.stringify(errors, null, 2))
console.log('wrote', errors.edges.length, 'edges with errors at', errorFile)
