<script setup lang="js">
import { useClipboard, computedAsync } from '@vueuse/core'
import { NCard, NCode } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { toShacl } from '../../shacl/model2Shacl.js'
import { useStore } from '../state.js'
import Filter from './Filter.vue'
import SelectModel from './SelectModel.vue'

const store = useStore()
const { jsonView } = storeToRefs(store)
const { text, isSupported, copy } = useClipboard()


const shacl = computedAsync(async () => {
  const { nodes, edges } = jsonView.value
  const { turtle } = await toShacl({ nodes, edges })
  return turtle
}, null)

</script>

<template>
  <SelectModel/>
  <Filter></Filter>
  <template v-if="shacl">
    <n-card :title="`SHACL (${shacl?.split('\n')?.length} lines)`">
      <button v-if="isSupported" @click="copy(shacl)">
        <template v-if="text">Copied</template>
        <template v-else>Copy</template>
      </button>
      <div style="overflow: auto">
        <n-code :code="shacl" language="turtle" show-line-numbers/>
      </div>
    </n-card>
  </template>
</template>
