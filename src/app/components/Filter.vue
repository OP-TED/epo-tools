<script setup lang="js">
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'
import { NDynamicTags, NDataTable } from 'naive-ui'

const store = useStore()
const { eaJson, tags } = storeToRefs(store)

</script>

<template>
  <n-dynamic-tags v-model:value="tags"/>
</template>
