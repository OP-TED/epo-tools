<script setup lang="js">
import { NCard, NDataTable } from 'naive-ui'

import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from '../state.js'
import Filter from './Filter.vue'

const store = useStore()
const { jsonView } = storeToRefs(store)

const table = computed(() => {

  return {
    columns: [
      {
        title: 'source',
        key: 'source',
        defaultSortOrder: 'ascend',
        sorter: 'default',

      },
      {
        title: 'predicate',
        key: 'predicate',
        defaultSortOrder: 'ascend',
        sorter: 'default',
      },
      {
        title: 'description',
        key: 'description',
        width: 400,
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: 'target',
        key: 'target',
        defaultSortOrder: 'ascend',
        sorter: 'default',
      },

      {
        title: 'quantifier',
        key: 'quantifiers.raw',
        defaultSortOrder: 'ascend',
        sorter: 'default',
      },
    ],
    data: (jsonView.value.edges ?? []),
  }
})

const pagination = ref({ pageSize: 20 })

</script>

<template>
  <n-card>
    <Filter></Filter>
  </n-card>
  <n-data-table :columns="table.columns" :data="table.data" :pagination="pagination"/>
</template>
