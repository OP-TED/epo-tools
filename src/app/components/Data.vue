<script setup>
import { NTabPane, NTabs } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useStore } from '../state.js'
import Edges from './Edges.vue'
import Filter from './Filter.vue'
import Nodes from './Nodes.vue'
import SelectModel from './SelectModel.vue'

const store = useStore()
const { eaJson, jsonView } = storeToRefs(store)

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
  <n-card>
    <SelectModel/>
    <Filter></Filter>
  </n-card>
  <n-tabs type="line" animated>
    <n-tab-pane name="Nodes" :tab="nodesTitle">
      <Nodes/>
    </n-tab-pane>
    <n-tab-pane name="Edges" :tab="edgesTitle">
      <Edges/>
    </n-tab-pane>
  </n-tabs>

</template>
