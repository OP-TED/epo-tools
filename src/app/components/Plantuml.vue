<script setup lang="js">
import { NCode, NImage, NCard } from 'naive-ui'
import { storeToRefs } from 'pinia'
import plantumlEncoder from 'plantuml-encoder'
import { computed } from 'vue'
import { useStore } from '../state.js'

const store = useStore()
const { plantUml } = storeToRefs(store)
import { useClipboard, usePermission } from '@vueuse/core'

const { text, isSupported, copy } = useClipboard()

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
