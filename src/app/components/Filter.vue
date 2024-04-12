<script setup lang="js">
import { ArrowBackOutline } from '@vicons/ionicons5'
import { NButton, NDynamicTags, NFlex, NIcon, NSelect, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from '../state.js'

const store = useStore()
const { filterOptions, suggestedNodes } = storeToRefs(store)

const value = ref([])

const options = computed(() => {
  const suggested = suggestedNodes.value ?? []
  return suggested.map(({ name }) => {
    return {
      label: name,
      value: name,
    }
  })
})

function add () {
  if (value?.value?.length) {
    filterOptions.value = {
      ...filterOptions.value,
      filter: [...filterOptions.value.filter, ...value.value],
    }
    value.value = []
  }
}

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
  <n-flex justify="end">
    <div>
      <n-select
          class="margin-left"
          v-model:value="value"
          filterable
          multiple
          :options="options"
          :reset-menu-on-options-change="true"
      />
    </div>
    <n-button
        @click="add"
        :disabled="!value.length">Add
    </n-button>
  </n-flex>
</template>

<style>
.margin-left {
  min-width: 200px;
}
</style>
