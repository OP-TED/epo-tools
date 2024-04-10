<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from './state.js'
import LoadEA from './components/LoadEA.vue'
import DisplayEAJson from './components/DisplayEAJson.vue'

// const store = useCounterStore()
//
// const { } = store
// const { eaJson } = storeToRefs(store)

</script>

<template>
  <div>
    <LoadEA/>
    <DisplayEAJson/>
<!--    {{ count }}-->
<!--    <button @click="increment">Increment</button>-->
  </div>

</template>
