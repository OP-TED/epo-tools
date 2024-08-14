<script setup>
import { NCard, NTabPane, NTabs } from 'naive-ui'

import Graph from './Graph.vue'

import SelectModel from './SelectModel.vue'


</script>

<template>
  <n-card>
    <SelectModel/>
  </n-card>
  <n-tabs type="line" animated>

    <n-tab-pane name="Graph" tab="Graph">
      <Graph/>
    </n-tab-pane>
  </n-tabs>

</template>
