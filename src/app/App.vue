<script setup>
import { darkTheme, NCard, NConfigProvider } from 'naive-ui'
import Header from './components/Header.vue'
import Tabs from './Tabs.vue'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-card>
      <Header/>
      <Tabs/>
    </n-card>
  </n-config-provider>
</template>
