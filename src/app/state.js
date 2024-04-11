import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { INHERITANCE } from '../ontology/const.js'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../ontology/ea/add-warnings.js'
import { toPlantuml } from '../ontology/templates/plantuml-template.js'
import { filterBy } from '../ontology/views/filter.js'

const VIEW_LOCAL_STORAGE_KEY = 'filterBy'
const DEFAULT_VIEW = {
  filter: ['epo:', 'epo-cat:'], includeIncoming: false,
}

const CM_LOCAL_STORAGE_KEY = 'enterprise-architect'
const DEFAULT_CM = { nodes: [], edges: [] }

export const useStore = defineStore('counter', () => {

  const eaJson = useStorage(CM_LOCAL_STORAGE_KEY, DEFAULT_CM)

  function resetSelection () {
    eaJson.value = DEFAULT_CM
  }

  const filterOptions = useStorage(VIEW_LOCAL_STORAGE_KEY, DEFAULT_VIEW)

  const jsonView = computed(() => {
    const narrowed = eaJson.value.nodes ? filterBy(eaJson.value,
      filterOptions.value) : DEFAULT_CM
    return {
      nodes: narrowed.nodes,
      edges: narrowed.edges.map(x => x.type === INHERITANCE
        ? { ...x, predicate: 'rdfs:subClassOf' }
        : x),
    }
  })

  const plantUml = computed(() => {
    const { nodes, edges } = jsonView.value
    const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')
    const withoutErrors = {
      nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
      edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
    }
    return edges.length ? toPlantuml(withoutErrors) : undefined
  })

  return { eaJson, jsonView, plantUml, resetSelection, filterOptions }
})
