import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { INHERITANCE } from '../ontology/const.js'
import { toPlantuml } from '../ontology/templates/plantuml-template.js'
import { filterBy } from '../ontology/views/filter.js'
import { toShacl } from '../ontology/views/shacl.js'

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
    return edges.length ? toPlantuml({ nodes, edges }) : undefined
  })

  // Seriously? no async computed?
  const shacl = ref('')
  watch(jsonView, async (newJsonView, oldQuestion) => {
    const { nodes, edges } = jsonView.value
    if (edges.length) {
      const { turtle } = await toShacl({ nodes, edges })
      shacl.value = turtle
    }
  })


  return { eaJson, jsonView, plantUml, shacl, resetSelection, filterOptions }
})
