<script setup lang="js">
import { NCard, NDynamicTags, NSelect, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Diff } from 'vue-diff'
import { filterBy } from '../../conceptualModel/filter.js'
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
  const filter = selectedFilter.value

  if (source && target) {

    const key1 = library.value.models[source].key
    const _g1 = JSON.parse(localStorage.getItem(key1) ?? {})
    const g1 = filterBy(_g1, { filter })

    const key2 = library.value.models[target].key
    const _g2 = JSON.parse(localStorage.getItem(key2) ?? {})
    const g2 = filterBy(_g2, { filter })

    return {
      title: `Comparing ${source} (${counts(g1)}) with ${target} (${counts(g2)})`,
      chunks: getComparisonChunks(g1, g2),
    }

  }
})

const fold = ref()
const mode = ref()
const selectedFilter = ref(['epo*'])

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
  <n-card title="Compare only">
    <n-dynamic-tags v-model:value="selectedFilter"/>
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
