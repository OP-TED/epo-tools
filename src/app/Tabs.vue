<script setup>
import { NTabPane, NTabs } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Edges from './components/Edges.vue'
import KnownModels from './components/KnownModels.vue'
import Nodes from './components/Nodes.vue'
import Plantuml from './components/Plantuml.vue'
import Shacl from './components/Shacl.vue'
import Sparql from './components/Sparql.vue'

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

const dataTitle = computed(() => {
  const nodeCount = (x) => x?.value?.nodes?.length ?? 0
  const edgeCount = (x) => x?.value?.edges?.length ?? 0
  return `Data (${nodeCount(jsonView)}-${edgeCount(jsonView)})`
})

</script>

<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="KnownModels" tab="Known models">
      <KnownModels/>
    </n-tab-pane>
    <n-tab-pane name="Diagram" tab="Diagram">
      <Plantuml/>
    </n-tab-pane>
    <n-tab-pane name="SHACL" tab="SHACL">
      <Shacl/>
    </n-tab-pane>
    <n-tab-pane name="SPARQL" tab="SPARQL">
      <Sparql/>
    </n-tab-pane>

    <n-tab-pane name="data" :tab="dataTitle">
      <n-tabs type="line" animated>
        <n-tab-pane name="Nodes" :tab="nodesTitle">
          <Nodes/>
        </n-tab-pane>
        <n-tab-pane name="Edges" :tab="edgesTitle">
          <Edges/>
        </n-tab-pane>
      </n-tabs>
    </n-tab-pane>

  </n-tabs>
</template>
