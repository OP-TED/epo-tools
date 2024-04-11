<script setup lang="js">
import { NDynamicTags, NSwitch, NIcon,NFlex } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'
import { ArrowBackOutline, ArrowForwardOutline } from '@vicons/ionicons5'
const store = useStore()
const { filterOptions } = storeToRefs(store)

</script>

<template>
  <n-flex justify="start">
    <n-switch v-model:value="filterOptions.includeIncoming">
      <template #checked>
        <n-icon :component="ArrowBackOutline" />
        <n-icon :component="ArrowForwardOutline" />
      </template>
      <template #unchecked>
        <n-icon :component="ArrowForwardOutline" />
      </template>
    </n-switch>
  <n-dynamic-tags v-model:value="filterOptions.filter"/>

  </n-flex>
</template>
