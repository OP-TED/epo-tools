import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { filterBy, suggestNodes } from '../conceptualModel/filter.js'

const DEFAULT_VIEW = {
  filter: ['epo:Document', 'epo:Buyer', 'epo:AwardDecision'],
  includeIncoming: false,
}
const DEFAULT_CM = { nodes: [], edges: [] }
const DEFAULT_LIBRARY = {
  selected: undefined,
  models: {},
}

export const useStore = defineStore('counter', () => {

  const library = useStorage('user-library', DEFAULT_LIBRARY)
  const eaJson = useStorage('current-ea-model', DEFAULT_CM)

  // APP
  const filterOptions = useStorage('filterBy', DEFAULT_VIEW)
  const savedFilters = useStorage('savedFilterBy', [])
  const developerMode = useStorage('developerMode', true)

  const sparql = useStorage('sparql', '')

  // Filters
  const jsonView = computed(() => {
    return eaJson.value.nodes
      ? filterBy(eaJson.value, filterOptions.value)
      : DEFAULT_CM
  })

  function setEaJson (json) {
    eaJson.value = json
  }

  function addFilterTerms (terms) {
    let newTerms = terms.filter(
      element => !filterOptions.value.filter.includes(element))
    filterOptions.value.filter = filterOptions.value.filter.concat(newTerms)
  }


  function toggleFilterTerm(term) {
    const index = filterOptions.value.filter.indexOf(term);
    if (index > -1) {
      filterOptions.value.filter.splice(index, 1);
      return false
    } else {
      filterOptions.value.filter.push(term);
      return true
    }
  }

  const suggestedNodes = computed(() => {
    return suggestNodes(jsonView.value, filterOptions.value)
  })

  return {
    library,
    developerMode,
    addFilterTerms,
    toggleFilterTerm,
    setEaJson,
    eaJson,
    suggestedNodes,
    jsonView,
    sparql,
    filterOptions,
    savedFilters,
  }
})
