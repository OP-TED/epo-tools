<script setup lang="js">
import { NButton, NCheckbox, NDynamicInput, NDynamicTags, NSpace } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { toRaw } from 'vue'
import { useStore } from '../state.js'

const store = useStore()
const { filterOptions, savedFilters } = storeToRefs(store)

function save () {
  savedFilters.value.push(toRaw(filterOptions.value))
}

function reset () {
  filterOptions.value = {
    filter: [],
  }
}

function select (value) {
  filterOptions.value = toRaw(value)
}

function onCreate () {
  return {
    filter: [],
    includeIncoming: false,
  }
}

</script>

<template>

  <n-dynamic-input

      v-model:value="savedFilters" :on-create="onCreate">
    <template #default="{ value }">

      <n-space>
        <n-button @click="select(value)">
          Select
        </n-button>
        <n-checkbox v-model:checked="value.includeIncoming">
          Incoming
        </n-checkbox>
        <n-dynamic-tags v-model:value="value.filter"/>
      </n-space>
      <n-space>

      </n-space>
    </template>
  </n-dynamic-input>


  <n-space justify="end">

    <n-button @click="reset()">Reset current</n-button>
    <n-button @click="save()">Add current</n-button>
  </n-space>
</template>
