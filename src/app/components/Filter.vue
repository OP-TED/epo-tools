<script setup lang="js">
import { ArrowBackOutline } from '@vicons/ionicons5'
import { NButton, NDynamicTags, NFlex, NIcon, NSelect, NSwitch, NDrawer, NDrawerContent } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from '../state.js'
import SavedFilters from './SavedFilters.vue'

const store = useStore()
const { filterOptions, suggestedNodes } = storeToRefs(store)
const { addFilterTerms } = store

const value = ref([])

const options = computed(() => {
  const suggested = suggestedNodes.value ?? []
  return suggested.map(tag => {
    return {
      label: tag,
      value: tag,
    }
  })
})

function add () {
  if (value?.value?.length) {
    addFilterTerms(value.value)
    value.value = []
  }
}

const displaySavedActive = ref(false)

function toggleSaved () {
  displaySavedActive.value = true
}

</script>

<template>
  <n-drawer v-model:show="displaySavedActive" :width="502" placement="top">
    <n-drawer-content>
      <SavedFilters/>
    </n-drawer-content>
  </n-drawer>
  <n-flex justify="start">
    <n-button
        @click="toggleSaved">Lib
    </n-button>
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
