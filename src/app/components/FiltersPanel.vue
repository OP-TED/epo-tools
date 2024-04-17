<script setup lang="js">
import { NButton, NDynamicInput, NIcon, NDynamicTags, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { toRaw } from 'vue'
import { useStore } from '../state.js'
import { ArrowBackOutline } from '@vicons/ionicons5'

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
  <n-dynamic-input v-model:value="savedFilters" :on-create="onCreate">
    <template #default="{ value }">
      <div>
        <n-button @click="select(value)">
          Select
        </n-button>
      </div>
      <n-switch v-model:value="value.includeIncoming">
        <template #checked>
          <n-icon :component="ArrowBackOutline"/>
        </template>
        <template #unchecked>
        </template>
      </n-switch>
      <div>
        <n-dynamic-tags v-model:value="value.filter"/>
      </div>
    </template>
  </n-dynamic-input>
  <div>
    <n-button @click="reset()">Reset current</n-button>
    <n-button @click="save()">Add current</n-button>
  </div>

</template>
