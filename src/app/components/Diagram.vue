<script setup lang="js">
import { useClipboard } from '@vueuse/core'
import { NCard, NCode, NImage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import plantumlEncoder from 'plantuml-encoder'
import { computed } from 'vue'
import { toPlantuml } from '../../plantuml/plantumlTemplate.js'
import { useStore } from '../state.js'
import Filter from './Filter.vue'
import SelectModel from './SelectModel.vue'

const store = useStore()
const { jsonView } = storeToRefs(store)

const { text, isSupported, copy } = useClipboard()

// Templates
const plantUml = computed(() => {
  const { nodes, edges } = jsonView.value
  return edges.length ? toPlantuml({ nodes, edges }) : undefined
})

const imageUrl = computed(() => {
  const encoded = plantumlEncoder.encode(plantUml.value)
  return `http://www.plantuml.com/plantuml/img/${encoded}`
})

</script>

<template>
  <SelectModel/>
  <Filter></Filter>
  <template v-if="plantUml">
    <n-card :title="`PlantUML (${plantUml?.split('\n')?.length} lines)`">
      <template v-if="imageUrl">
        <n-image
            width="100%"
            :src="imageUrl"
        />
      </template>
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
