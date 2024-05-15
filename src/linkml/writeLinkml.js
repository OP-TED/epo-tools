import { filterBy } from '../conceptualModel/filter.js'
import { UNDER_REVIEW } from '../config.js'
import { getEpoJson } from '../epo/readEpo.js'
import { toLinkML } from './linkmlTemplate.js'

const g = getEpoJson(UNDER_REVIEW)
const core = filterBy(g, { filter: ['epo:*'] })

const yaml = toLinkML(core)

console.log(yaml)
