<script setup lang="js">
import { ArrowBackOutline } from '@vicons/ionicons5'
import { NDynamicTags, NFlex, NIcon, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'

const store = useStore()
const { filterOptions } = storeToRefs(store)

</script>

<template>

  <n-flex justify="start">
    <n-switch v-model:value="filterOptions.includeIncoming">
      <template #checked>
        <n-icon :component="ArrowBackOutline"/>
      </template>
      <template #unchecked>
      </template>
    </n-switch>
    <n-dynamic-tags v-model:value="filterOptions.filter"/>
  </n-flex>
</template>
