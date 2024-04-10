<script setup lang="js">
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'
import { NDynamicTags, NDataTable } from 'naive-ui'

import { defineComponent, computed, reactive, ref } from 'vue'

const store = useStore()
const { eaJson, tags } = storeToRefs(store)

const table = computed(() => {

  const data = eaJson.value.edges ?? []
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
    data,
  }
})

const pagination = ref({ pageSize: 20 })

</script>

<template>
  <n-data-table :columns="table.columns" :data="table.data" :pagination="pagination"/>
</template>
