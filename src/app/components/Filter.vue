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
      <FiltersPanel/>
    </n-drawer-content>
  </n-drawer>
  <n-card>

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
        <n-space justify="end">
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
              :disabled="!value.length">Quick add
          </n-button>
        </n-space>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<style>
.margin-left {
  min-width: 200px;
}
</style>
