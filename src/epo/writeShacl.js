import { writeFileSync } from 'fs'
import { PRODUCTION } from '../config.js'
import { toShacl } from '../shacl/model2Shacl.js'
import { getEpoJson } from './readEpo.js'

const onlyEPO = getEpoJson(PRODUCTION)

const { dataset, turtle, errors } = await toShacl(onlyEPO)

const path = `assets/epo.shacl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)

const errorFile = `assets/epo.shacl.errors.json`
writeFileSync(errorFile, JSON.stringify(errors, null, 2))
console.log('wrote', errors.edges.length, 'edges with errors at', errorFile)
