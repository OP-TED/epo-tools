<script setup>
import { storeToRefs } from 'pinia'
import DisplayTable from './components/DisplayTable.vue'
import LoadEA from './components/LoadEA.vue'
import { NConfigProvider, darkTheme, NTabPane, NTabs } from 'naive-ui'
import { computed, ref } from 'vue'
import { useStore } from './state.js'

const number = ref('gol;a')

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
      <n-tabs type="line" animated>
        <n-tab-pane name="Nodes" :tab="nodesTitle">
          Hey Jude
        </n-tab-pane>
        <n-tab-pane name="Edges" :tab="edgesTitle">
          <DisplayTable/>
        </n-tab-pane>
      </n-tabs>
    </n-config-provider>
  </div>

</template>
