<script setup lang="js">
import { NDynamicTags } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'

const store = useStore()
const { tags } = storeToRefs(store)

</script>

<template>
  <n-dynamic-tags v-model:value="tags"/>
</template>
