import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useStore = defineStore('counter', () => {

  const eaJson = ref({})
  function resetSelection () {
    eaJson.value = {}
  }
  const tags = ref(['epo:','epo-cat:'])

  // const count = ref(0)
  // const name = ref('Eduardo')
  // const doubleCount = computed(() => count.value * 2)

  // function increment () {
  //   count.value++
  // }

  return { eaJson, resetSelection, tags }
})
