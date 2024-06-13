import { filterBy } from '../conceptualModel/filter.js'
import { PRODUCTION } from '../config.js'
import { getEpoJson } from '../epo/readEpo.js'
import { toLinkML } from './linkmlTemplate.js'

const g = getEpoJson(PRODUCTION)
const core = filterBy(g, { filter: ['epo:*'] })

const yaml = toLinkML(core)

console.log(yaml)
