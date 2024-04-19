import { computedAsync, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { INHERITANCE } from '../conceptualModel/const.js'
import { filterBy, suggestNodes } from '../conceptualModel/filter.js'
import { toPlantuml } from '../plantuml/plantumlTemplate.js'
import { toShacl } from '../shacl/model2Shacl.js'

const DEFAULT_VIEW = {
  filter: ['epo:Document', 'epo:Buyer', 'epo:AwardDecision'],
  includeIncoming: false,
}
const DEFAULT_CM = { nodes: [], edges: [] }

export const useStore = defineStore('counter', () => {

  const eaJson = useStorage('enterprise-architect', DEFAULT_CM)
  const filterOptions = useStorage('filterBy', DEFAULT_VIEW)
  const savedFilters = useStorage('savedFilterBy', [])
  const sparql = useStorage('sparql', '')

  // Enterprise architect handling
  function resetSelection () {
    eaJson.value = DEFAULT_CM
  }

  function setEaJson (json) {
    eaJson.value = {
      nodes: json.nodes,
      edges: json.edges.map(x => x.type === INHERITANCE
        ? { ...x, predicate: 'rdfs:subClassOf' }
        : x),
    }
  }

  // Filters
  const jsonView = computed(() => {
    return eaJson.value.nodes
      ? filterBy(eaJson.value, filterOptions.value)
      : DEFAULT_CM
  })

  function addFilterTerms (terms) {
    let newTerms = terms.filter(
      element => !filterOptions.value.filter.includes(element))
    filterOptions.value.filter = filterOptions.value.filter.concat(newTerms)
  }

  const suggestedNodes = computed(() => {
    return suggestNodes(jsonView.value, filterOptions.value)
  })

  // Templates
  const plantUml = computed(() => {
    const { nodes, edges } = jsonView.value
    return edges.length ? toPlantuml({ nodes, edges }) : undefined
  })

  const shacl = computedAsync(async () => {
    const { nodes, edges } = jsonView.value
    const { turtle } = await toShacl({ nodes, edges })
    return turtle
  }, null)

  return {
    setEaJson,
    resetSelection,
    addFilterTerms,
    eaJson,
    suggestedNodes,
    jsonView,
    plantUml,
    shacl,
    sparql,
    filterOptions,
    savedFilters,
  }
})
