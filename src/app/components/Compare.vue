<script setup lang="js">
import { NCard, NSelect, NSwitch } from 'naive-ui'
import { computed, ref } from 'vue'
import { Diff } from 'vue-diff'
import { storeToRefs } from 'pinia'
import { getComparisonChunks } from '../../plantuml/comparison.js'
import { useStore } from '../state.js'

const store = useStore()

const { library } = storeToRefs(store)

const libraryOptions = computed(() => {
  return Object.keys(library.value.models).map(key => ({
    label: library.value.models[key].title,
    value: key,
  }))
})
const selectedSource = ref('')
const selectedTarget = ref('')

function handleSelectSource (value, option) {
  updateChunks(value, selectedSource.value)
}

function handleSelectTarget (value, option) {
  updateChunks(selectedSource.value, value)
}

function updateChunks (selectedSource, selectedTarget) {
  if (selectedSource && selectedTarget) {
    const key1 = library.value.models[selectedSource].key
    const g1 = JSON.parse(localStorage.getItem(key1) ?? {})

    const key2 = library.value.models[selectedTarget].key
    const g2 = JSON.parse(localStorage.getItem(key2) ?? {})

    chunks.value = getComparisonChunks(g1, g2)
  }
}

const chunks = ref([])
const fold = ref()
const mode = ref()

</script>

<template>

  <n-card title="Source">
    <n-select
        @update:value="handleSelectSource"
        v-model:value="selectedSource" :options="libraryOptions"/>
  </n-card>
  <n-card title="Target">
    <n-select
        @update:value="handleSelectTarget"
        v-model:value="selectedTarget" :options="libraryOptions"/>
  </n-card>


  <n-card v-if="chunks.length" :title="`Comparing ${selectedSource} with ${selectedTarget} `">

    <n-switch v-model:value="fold">
      <template #checked>
        Fold
      </template>
      <template #unchecked>
      </template>
    </n-switch>
    <n-switch v-model:value="mode">
      <template #checked>
        unified
      </template>
      <template #unchecked>
        split
      </template>
    </n-switch>
    <template v-for="chunk of chunks">
      <n-card :title="chunk.title">
        <Diff
            :folding="fold"
            :mode="mode?'unified':'split'"
            :theme="'dark'"
            :language="'plaintext'"
            :prev="chunk.prev"
            :current="chunk.current"

        />
      </n-card>
    </template>
  </n-card>
</template>
