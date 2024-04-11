<script setup>
import { darkTheme, NConfigProvider, NTabPane, NTabs } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Edges from './components/Edges.vue'
import Filter from './components/Filter.vue'

import LoadEA from './components/LoadEA.vue'
import Nodes from './components/Nodes.vue'
import Plantuml from './components/Plantuml.vue'
import Shacl from './components/Shacl.vue'

import { useStore } from './state.js'

const store = useStore()
const { eaJson, jsonView, tags } = storeToRefs(store)

const nodesTitle = computed(() => {
  const count = (x) => x?.value?.nodes?.length ?? 0
  return `Nodes (${count(jsonView)}/${count(eaJson)})`
})

const edgesTitle = computed(() => {
  const count = (x) => x?.value?.edges?.length ?? 0
  return `Edges (${count(jsonView)}/${count(eaJson)})`
})
</script>

<template>
  <div>
    <n-config-provider :theme="darkTheme">
      <LoadEA/>
      <Filter/>
      <n-tabs type="line" animated>
        <n-tab-pane name="Diagram" tab="Diagram">
          <Plantuml/>
        </n-tab-pane>
        <n-tab-pane name="Shacl" tab="Shacl">
          <Shacl/>
        </n-tab-pane>
        <n-tab-pane name="Nodes" :tab="nodesTitle">
          <Nodes/>
        </n-tab-pane>
        <n-tab-pane name="Edges" :tab="edgesTitle">
          <Edges/>
        </n-tab-pane>
      </n-tabs>
    </n-config-provider>
  </div>

</template>
