import { filterBy } from './filter.js'

const narrowToEpo = (g) => filterBy(g, { filter: ['epo*'] })

export {
  narrowToEpo,
}
