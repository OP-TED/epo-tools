<script setup lang="js">
import {
  NButton,
  NCard,
  NCheckbox,
  NCollapse,
  NCollapseItem,
  NDrawer,
  NDrawerContent,
  NDynamicTags,
  NSelect,
  NSpace,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from '../state.js'
import FiltersPanel from './FiltersPanel.vue'

const store = useStore()
const { filterOptions, suggestedNodes } = storeToRefs(store)
const { addFilterTerms } = store

const options = computed(() => {
  const suggested = suggestedNodes.value ?? []
  return suggested.map(tag => {
    return {
      label: tag,
      value: tag,
    }
  })
})

const termsToAdd = ref([])

function add (terms) {
  addFilterTerms(terms)
  termsToAdd.value = []
}

const displaySavedActive = ref(false)

function toggleSaved () {
  displaySavedActive.value = true
}

</script>

<template>
  <n-drawer v-model:show="displaySavedActive" :width="502" placement="top">
    <n-drawer-content>
      <FiltersPanel/>
    </n-drawer-content>
  </n-drawer>
  <n-card>

    <div style="display: flex;">
      <n-select
          v-model:value="termsToAdd"
          filterable
          :options="options"
          multiple
          :reset-menu-on-options-change="true"
          style="flex: 8;"
      />
      <n-button
          @click="add(termsToAdd)"
          :disabled="!termsToAdd.length"
          style="margin-left: 10px; flex-shrink: 0;">
        Add
      </n-button>
    </div>

    <n-dynamic-tags
        round
        v-model:value="filterOptions.filter"/>

    <n-collapse arrow-placement="right">
      <n-collapse-item title="..." name="1">

        <n-space justify="start">
          <n-button
              dashed
              size="tiny"
              @click="toggleSaved">open saved views
          </n-button>
          <n-checkbox v-model:checked="filterOptions.includeIncoming">
            Include incoming nodes
          </n-checkbox>
        </n-space>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>
