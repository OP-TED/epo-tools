<script setup lang="js">
import { NCard, NFlex } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { computed } from 'vue'
import { useStore } from '../state.js'

const store = useStore()
const { jsonView } = storeToRefs(store)

const nodes = computed(() => {
  return jsonView.value.nodes ?? []
})

</script>

<template>
  <n-flex>
    <template v-for="{name, description} of nodes">
      <n-card :title="name" size="small">
        {{ description }}
      </n-card>
    </template>
  </n-flex>
</template>
