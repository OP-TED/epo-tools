import { writeFileSync } from 'fs'
import { UNDER_REVIEW } from '../config.js'
import { toShacl } from '../shacl/model2Shacl.js'
import { getEpoJson } from './readEpo.js'

const onlyEPO = getEpoJson(UNDER_REVIEW)

const { dataset, turtle, errors } = await toShacl(onlyEPO)

const path = `assets/epo.shacl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)
console.log('ommited', errors.edges.length, 'edges with errors')
