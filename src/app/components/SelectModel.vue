<script setup lang="js">
import { NCard, NSelect } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useStore } from '../state.js'

const store = useStore()

const { library } = storeToRefs(store)

const libraryOptions = computed(() => {
  return Object.keys(library.value.models).map(key => ({
    label: library.value.models[key].title,
    value: key,
  }))
})
const selectedLibraryItem = ref()

onMounted(()=>{
  if (library.value.selected){
    selectedLibraryItem.value = library.value.selected.key
  }
})

function handleSelectModel (value, option) {
  library.value.selected = library.value.models[value]
  const json = JSON.parse(localStorage.getItem(value) ?? {})
  store.setEaJson(json)
}

const placeHolder = computed(() => {
  const keys = Object.keys(library.value.models)
  if (keys.length) {
    return `Please select a model (${keys.length})`
  } else {
    return 'No models loaded'
  }
})
</script>

<template>

  <n-card>
    <n-select
        @update:value="handleSelectModel"
        v-model:value="selectedLibraryItem"
        :placeholder="placeHolder"
        :options="libraryOptions"/>
  </n-card>

</template>
