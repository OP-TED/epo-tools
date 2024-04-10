<script setup lang="js">
import { NDataTable } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { computed, ref } from 'vue'
import { useStore } from '../state.js'

const store = useStore()
const { jsonView } = storeToRefs(store)

const table = computed(() => {

  return {
    columns: [
      {
        title: 'source',
        key: 'source',
      },
      {
        title: 'predicate',
        key: 'predicate',
      },
      {
        title: 'target',
        key: 'target',
      },
      // {
      //   title: 'description',
      //   key: 'description',
      // },
    ],
    data: jsonView.value.edges ?? [],
  }
})

const pagination = ref({ pageSize: 20 })

</script>

<template>
  <n-data-table :columns="table.columns" :data="table.data" :pagination="pagination"/>
</template>
