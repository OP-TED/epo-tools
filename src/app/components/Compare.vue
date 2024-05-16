<script setup lang="js">
import { NCard, NInput, NSelect, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Diff } from 'vue-diff'
import { startsWith } from '../../conceptualModel/filter.js'
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

function counts (g) {
  const nodeCount = (x) => x.nodes.length ?? 0
  const edgeCount = (x) => x.edges.length ?? 0
  return `${nodeCount(g)}-${edgeCount(g)})`
}

const comparisonResult = computed(() => {

  const source = selectedSource.value
  const target = selectedTarget.value

  if (source && target) {

    const key1 = library.value.models[source].key
    const _g1 = JSON.parse(localStorage.getItem(key1) ?? {})
    const g1 = start.value ? startsWith(_g1, start.value) : _g1

    const key2 = library.value.models[target].key
    const _g2 = JSON.parse(localStorage.getItem(key2) ?? {})
    const g2 = start.value ? startsWith(_g2, start.value) : _g2

    return {
      title: `Comparing ${source} (${counts(g1)}) with ${target} (${counts(g2)})`,
      chunks: getComparisonChunks(g1, g2),
    }

  }
})

const fold = ref()
const mode = ref()
const start = ref('epo')

</script>

<template>
  <n-card title="Source">
    <n-select
        v-model:value="selectedSource" :options="libraryOptions"/>
  </n-card>
  <n-card title="Target">
    <n-select
        v-model:value="selectedTarget" :options="libraryOptions"/>
  </n-card>
  <n-card size="small" title="Prefix starts with">
    <n-input v-model:value="start"/>
  </n-card>
  <n-card v-if="comparisonResult" :title="comparisonResult.title">

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
    <template v-for="chunk of comparisonResult.chunks">
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
