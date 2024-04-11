<script setup lang="js">
import { NCode, NImage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import plantumlEncoder from 'plantuml-encoder'
import { computed } from 'vue'

import { useStore } from '../state.js'

const store = useStore()
const { plantUml } = storeToRefs(store)

const imageUrl = computed(() => {
  const encoded = plantumlEncoder.encode(plantUml.value)
  return `http://www.plantuml.com/plantuml/img/${encoded}`
})


</script>

<template>

  <template v-if="plantUml">

    <template v-if="imageUrl">
      <n-image
          width="100%"
          :src="imageUrl"
      />
    </template>

    <div style="overflow: auto">
      <n-code :code="plantUml" language="plantuml" show-line-numbers/>
    </div>

  </template>
</template>
