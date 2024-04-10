<script setup lang="js">
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'
import { NDynamicTags, NCard, NFlex } from 'naive-ui'

import { defineComponent, computed, reactive, ref } from 'vue'

const store = useStore()
const { filteredEaJson, tags } = storeToRefs(store)

const nodes = computed(() => {
  return filteredEaJson.value.nodes ?? []
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
