<script setup>
import { darkTheme, NConfigProvider } from 'naive-ui'
import Filter from './components/Filter.vue'

import LoadEA from './components/LoadEA.vue'
import Tabs from './Tabs.vue'
</script>

<template>
  <div>
    <n-config-provider :theme="darkTheme">
      <LoadEA/>
      <Filter/>
      <Tabs/>
    </n-config-provider>
  </div>

</template>
