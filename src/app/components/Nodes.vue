<script setup lang="js">
import { NCard, NFlex } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { computed } from 'vue'
import { useStore } from '../state.js'
import Filter from './Filter.vue'

const store = useStore()
const { jsonView } = storeToRefs(store)

const nodes = computed(() => {
  return jsonView.value.nodes ?? []
})

</script>

<template>
  <n-card>
    <Filter></Filter>
  </n-card>
  <n-flex>
    <template v-for="{name, description, type} of nodes">
      <n-card :title="name" size="small">
        {{ description }} ({{ type}})
      </n-card>
    </template>
  </n-flex>
</template>
