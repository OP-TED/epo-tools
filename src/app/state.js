import { computedAsync, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { INHERITANCE } from '../ontology/const.js'
import { toPlantuml } from '../ontology/templates/plantuml-template.js'
import { filterBy } from '../ontology/views/filter.js'
import { toShacl } from '../ontology/views/shacl.js'

const VIEW_LOCAL_STORAGE_KEY = 'filterBy'
const DEFAULT_VIEW = {
  filter: ['epo:Document', 'epo:Buyer', 'epo:AwardDecision'],
  includeIncoming: false,
}

const CM_LOCAL_STORAGE_KEY = 'enterprise-architect'
const DEFAULT_CM = { nodes: [], edges: [] }

export const useStore = defineStore('counter', () => {

  const eaJson = useStorage(CM_LOCAL_STORAGE_KEY, DEFAULT_CM)

  function resetSelection () {
    eaJson.value = DEFAULT_CM
  }

  const filterOptions = useStorage(VIEW_LOCAL_STORAGE_KEY, DEFAULT_VIEW)

  function setEaJson (json) {
    eaJson.value = {
      nodes: json.nodes,
      edges: json.edges.map(x => x.type === INHERITANCE
        ? { ...x, predicate: 'rdfs:subClassOf' }
        : x),
    }
  }

  const jsonView = computed(() => {
    return eaJson.value.nodes
      ? filterBy(eaJson.value, filterOptions.value)
      : DEFAULT_CM
  })

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
    eaJson, setEaJson, jsonView, plantUml, shacl, resetSelection, filterOptions,
  }
})
