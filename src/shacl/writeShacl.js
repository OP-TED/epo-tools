import { writeFileSync } from 'fs'
import { latestConceptualModel } from '../config.js'
import { toShacl } from './model2Shacl.js'

const onlyEPO = latestConceptualModel()
const { dataset, turtle, errors } = await toShacl(onlyEPO)

const path = `assets/epo.shacl.ttl`
writeFileSync(path, turtle)
console.log('wrote', dataset.size, 'quads at', path)
console.log('ommited', errors.edges.length, 'edges with errors')
