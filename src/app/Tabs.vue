<script setup>
import { NTabPane, NTabs } from 'naive-ui'
import { storeToRefs } from 'pinia'
import Compare from './components/Compare.vue'
import Data from './components/Data.vue'
import Diagram from './components/Diagram.vue'
import Models from './components/Models.vue'
import Shacl from './components/Shacl.vue'
import Sparql from './components/Sparql.vue'

import { useStore } from './state.js'

const store = useStore()

const { developerMode } = storeToRefs(store)

</script>


<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="Models" tab="Models">
      <n-tabs type="line" animated>
        <n-tab-pane name="Current models" tab="Current models">
          <Models/>
        </n-tab-pane>
        <n-tab-pane name="Compare two versions" tab="Compare two versions">
          <Compare/>
        </n-tab-pane>
        <n-tab-pane name="Check SPARQL" tab="Check SPARQL">
          <Sparql/>
        </n-tab-pane>
        <n-tab-pane v-if="developerMode" name="Inspect SHACL" tab="Inspect SHACL">
          <Shacl/>
        </n-tab-pane>
      </n-tabs>
    </n-tab-pane>
    <n-tab-pane name="Diagram" tab="Diagram">
      <Diagram/>
    </n-tab-pane>
    <n-tab-pane v-if="developerMode" name="data" tab="Data">
      <Data/>
    </n-tab-pane>

  </n-tabs>
</template>
