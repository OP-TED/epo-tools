<script setup>
import { darkTheme, NConfigProvider } from 'naive-ui'
import Filter from './components/Filter.vue'

import LoadEA from './components/LoadEA.vue'
import SelectModel from './components/SelectModel.vue'
import Tabs from './Tabs.vue'
</script>

<template>
  <div>
    <n-config-provider :theme="darkTheme">
      <SelectModel/>
      <!--      <LoadEA/>-->
      <Filter/>
      <Tabs/>
    </n-config-provider>
  </div>

</template>
