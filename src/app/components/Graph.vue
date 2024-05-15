<script setup lang="js">
import { NButton, NCard, NDrawer, NDrawerContent, NEllipsis, NTable } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { toSigmaGraph } from '../../epo/toSigmaGraph.js'
import { useStore } from '../state.js'
import SigmaGraph from './SigmaGraph.vue'

const store = useStore()

const { eaJson } = storeToRefs(useStore())

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

const displayDetail = ref(false)

const { toggleFilterTerm } = store

</script>

<template>
  <n-drawer v-model:show="displayDetail" :width="1200" placement="right">
    <n-drawer-content>

      <n-card
          :contentClass="current.type"
          :title="current.name" size="small">
         {{ current.description }} ({{current.type}})
      </n-card>

      <!--  Outgoing-->
      <template v-if="eaJson.edges.find(x=>x.source===current.name)">
        <n-card title="Outgoing" size="small">
          <n-table :bordered="false" :single-line="false">
            <template v-for="out of eaJson.edges.filter(x=>x.source===current.name)">
              <tr>
                <td>{{ out.predicate }} {{ out.quantifiers?.raw }}</td>
                <td>
                  <NButton @click="()=>handleNodeSelected(out.target)"> {{ out.target }}</NButton>
                </td>
                <td width="400">
                  <n-ellipsis :line-clamp="2">{{ out.description }}</n-ellipsis>
                </td>
              </tr>
            </template>
          </n-table>
        </n-card>
      </template>
      <!--      Incoming-->
      <template v-if="eaJson.edges.find(x=>x.target===current.name)">
        <n-card title="Incoming" size="small">
          <n-table :bordered="false" :single-line="false">
            <template v-for="out of eaJson.edges.filter(x=>x.target===current.name)">
              <tr>
                <td>
                  <NButton @click="()=>handleNodeSelected(out.source)"> {{ out.source }}</NButton>
                </td>
                <td>{{ out.predicate }} {{ out.quantifiers?.raw }}</td>
                <td width="400">
                  <n-ellipsis :line-clamp="2">{{ out.description }}</n-ellipsis>
                </td>
              </tr>
            </template>
          </n-table>
        </n-card>
      </template>

      <n-card title="Dev zone" size="small">
      {{ current }}
      <n-button @click="()=>toggleFilterTerm(current.name)">Toggle filters</n-button>
      </n-card>
    </n-drawer-content>
  </n-drawer>

  <div>
    <template v-if="sigmaData">
      <SigmaGraph :data="sigmaData" :key="componentKey" @node-selected="handleNodeSelected"/>
    </template>
  </div>
</template>
