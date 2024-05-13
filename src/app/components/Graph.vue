<script setup lang="js">
import { NDrawer, NDrawerContent } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { toSigmaGraph } from '../../epo/toSigmaGraph.js'
import { useStore } from '../state.js'
import SigmaGraph from './SigmaGraph.vue'

const store = useStore()

const { eaJson } = storeToRefs(useStore())

const { toggleFilterTerm } = store

// Unfortunate hack to control re-rendering of SigmaGraph
const componentKey = ref(0)

const sigmaData = ref()

onMounted(() => {

  const data = toSigmaGraph(eaJson.value)
  console.log('sigmaData', data)
  sigmaData.value = data

})

watch(eaJson, (newValue, oldValue) => {
  sigmaData.value = toSigmaGraph(newValue)
  componentKey.value++ // Increment key to force re-render
  console.log('Graph data updated:', sigmaData.value)
})

const selectedElement = ref()

function handleNodeSelected (node) {
  selectedElement.value = eaJson.value.nodes.find(x => x.name === node)
  displayDetail.value = true
}

const displayDetail = ref(false)

</script>

<template>
  <n-drawer v-model:show="displayDetail" :width="502" placement="right">
    <n-drawer-content>
      {{ JSON.stringify(selectedElement, null, 2) }}
    </n-drawer-content>
  </n-drawer>

  <div>
    <template v-if="sigmaData">
      <SigmaGraph :data="sigmaData" :key="componentKey" @node-selected="handleNodeSelected"/>
    </template>
  </div>
</template>
