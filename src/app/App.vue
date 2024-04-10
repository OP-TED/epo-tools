<script setup>
import { storeToRefs } from 'pinia'
import Edges from './components/Edges.vue'
import Nodes from './components/Nodes.vue'

import LoadEA from './components/LoadEA.vue'
import Filter from './components/Filter.vue'

import { NConfigProvider, darkTheme, NTabPane, NTabs } from 'naive-ui'
import { computed, ref } from 'vue'
import { useStore } from './state.js'

const store = useStore()
const { eaJson, tags } = storeToRefs(store)

const nodesTitle = computed(() => {
  const nodeCount = eaJson?.value?.nodes?.length ?? 0
  return `Nodes (${nodeCount})`
})

const edgesTitle = computed(() => {
  const edgeCount = eaJson?.value?.edges?.length ?? 0
  return `Edges (${edgeCount})`
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
      </n-tabs>
    </n-config-provider>
  </div>

</template>
