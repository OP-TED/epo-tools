<script setup>
import { storeToRefs } from 'pinia'
import Edges from './components/Edges.vue'
import Nodes from './components/Nodes.vue'

import LoadEA from './components/LoadEA.vue'
import Filter from './components/Filter.vue'
import Plantuml from './components/Plantuml.vue'

import { NConfigProvider, darkTheme, NTabPane, NTabs } from 'naive-ui'
import { computed, ref } from 'vue'
import { useStore } from './state.js'

const store = useStore()
const { eaJson, filteredEaJson, tags } = storeToRefs(store)

const nodesTitle = computed(() => {
  const count = (x) => x?.value?.nodes?.length ?? 0
  return `Nodes (${count(filteredEaJson)}/${count(eaJson)})`
})

const edgesTitle = computed(() => {
  const count = (x) => x?.value?.edges?.length ?? 0
  return `Edges (${count(filteredEaJson)}/${count(eaJson)})`
})
</script>

<template>
  <div>
    <n-config-provider :theme="darkTheme">
      <LoadEA/>
      <Filter/>
      <n-tabs type="line" animated>
        <n-tab-pane name="Nodes" :tab="nodesTitle">
          <Nodes/>
        </n-tab-pane>
        <n-tab-pane name="Edges" :tab="edgesTitle">
          <Edges/>
        </n-tab-pane>
        <n-tab-pane name="PlantUML" tab="PlantUML">
          <Plantuml/>
        </n-tab-pane>
      </n-tabs>
    </n-config-provider>
  </div>

</template>
