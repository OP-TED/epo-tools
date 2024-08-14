<script setup lang="js">
import { NButton, NCard, NDrawer, NDrawerContent, NEllipsis, NSelect, NTable } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { ATTRIBUTE } from '../../conceptualModel/const.js'
import { toSigmaGraph } from '../../epo/toSigmaGraph.js'
import { useStore } from '../state.js'
import SigmaGraph from './SigmaGraph.vue'
import NodeDetails from './NodeDetails.vue'

const store = useStore()

const { eaJson } = storeToRefs(store)

const sigmaData = ref()

onMounted(() => {
  const data = toSigmaGraph(eaJson.value)
  sigmaData.value = data
})

// Unfortunate hack to control re-rendering of SigmaGraph
const componentKey = ref(0)

watch(eaJson, (newValue, oldValue) => {
  sigmaData.value = toSigmaGraph(newValue)
  componentKey.value++ // Increment key to force re-render
  console.log('Graph data updated:', sigmaData.value)
})

const current = ref()

function handleNodeSelected (node) {
  const maybeNode = eaJson.value.nodes.find(x => x.name === node)
  if (maybeNode) {
    current.value = maybeNode
    displayDetail.value = true
  }
}

const options = computed(() => {
  const candidates = new Set(
      eaJson.value.edges.filter(x => x.type !== ATTRIBUTE).
          flatMap(({ source, target }) => [source, target]))
  return [...candidates].map(tag => {
    return {
      label: tag,
      value: tag,
    }
  })
})

const displayDetail = ref(false)

const test = ref()

</script>

<template>
  <n-drawer v-model:show="displayDetail" :width="1200" placement="right">
    <n-drawer-content>
      <NodeDetails :node="current" :graph="eaJson" @node-selected="handleNodeSelected"/>
    </n-drawer-content>
  </n-drawer>

  <div style="display: flex;">
    <n-select
        placeholder="Search a term"
        v-model:value="test"
        filterable
        :options="options"
        :reset-menu-on-options-change="true"
        style="flex: 8;"
        @update:value="handleNodeSelected"
    />

  </div>

  <div>
    <template v-if="sigmaData">
      <SigmaGraph :data="sigmaData" :key="componentKey" @node-selected="handleNodeSelected"/>
    </template>
  </div>
</template>
