<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  msg: String,
})

const plantUml = ref('')

onMounted(() => {

})
</script>

<template>
  <h1>{{ plantUml }}</h1>
</template>
