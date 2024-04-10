<script setup lang="js">
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'
import { NDynamicTags, NCard, NFlex } from 'naive-ui'

import { defineComponent, computed, reactive, ref } from 'vue'

const store = useStore()
const { eaJson, tags } = storeToRefs(store)

const nodes = computed(() => {
  const data = eaJson.value.nodes ?? []
  console.log(data)
  return data
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
