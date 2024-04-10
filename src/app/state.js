import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { INHERITANCE } from '../ontology/const.js'
import {
  addEdgeWarnings,
  addNodeWarnings,
} from '../ontology/ea/add-warnings.js'
import { toPlantuml } from '../ontology/templates/plantuml-template.js'
import { filterBy } from '../ontology/views/filter.js'
import { useStorage } from '@vueuse/core'


const EMPTY = { nodes: [], edges: [] }
export const useStore = defineStore('counter', () => {

  const eaJson = ref(EMPTY)

  function resetSelection () {
    eaJson.value = EMPTY
  }

  const tags = useStorage('tags', ['epo:', 'epo-cat:'])
  const jsonView = computed(() => {

    const narrowed = eaJson.value.nodes ? filterBy(eaJson.value,
      { filter: tags.value }) : EMPTY

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
    return edges.length?toPlantuml(withoutErrors):undefined
  })

  return { eaJson, jsonView, plantUml, resetSelection, tags }
})
