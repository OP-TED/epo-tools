<script setup>
import { darkTheme, NConfigProvider } from 'naive-ui'
import SelectModel from './components/SelectModel.vue'
import Tabs from './Tabs.vue'
</script>

<template>
  <div>
    <n-config-provider :theme="darkTheme">
      <Tabs/>
    </n-config-provider>
  </div>

</template>
