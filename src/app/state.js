import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { filterBy } from '../ontology/views/filter.js'

const EMPTY = { nodes: [], edges: [] }
export const useStore = defineStore('counter', () => {

  const eaJson = ref(EMPTY)

  function resetSelection () {
    eaJson.value = EMPTY
  }

  const tags = ref(['epo:', 'epo-cat:'])

  const filteredEaJson = computed(() => {
    return eaJson.value.nodes
      ? filterBy(eaJson.value, { filter: tags.value })
      : EMPTY
  })

  return { eaJson, filteredEaJson, resetSelection, tags }
})
