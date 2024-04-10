<script setup lang="js">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../state.js'

const store = useCounterStore()
const { eaJson } = storeToRefs(store)

</script>

<template>

  <template v-if="eaJson">
    {{ eaJson }}
  </template>
</template>
