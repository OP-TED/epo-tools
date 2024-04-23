<script setup lang="js">
import { useClipboard } from '@vueuse/core'
import { NCard, NCode, NImage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import plantumlEncoder from 'plantuml-encoder'
import { computed } from 'vue'
import { useStore } from '../state.js'
import Filter from './Filter.vue'

const store = useStore()
const { plantUml } = storeToRefs(store)

const { text, isSupported, copy } = useClipboard()

const imageUrl = computed(() => {
  const encoded = plantumlEncoder.encode(plantUml.value)
  return `http://www.plantuml.com/plantuml/img/${encoded}`
})


</script>

<template>
  <n-card title="Entities shown">
    <Filter></Filter>
  </n-card>
  <template v-if="plantUml">
    <template v-if="imageUrl">
      <n-image
          width="100%"
          :src="imageUrl"
      />
    </template>

    <n-card title="PlantUML">
      <button v-if="isSupported" @click="copy(plantUml)">
        <template v-if="text">Copied</template>
        <template v-else>Copy</template>
      </button>
      <div style="overflow: auto">
        <n-code :code="plantUml" language="plantuml" show-line-numbers/>
      </div>
    </n-card>
  </template>

</template>
