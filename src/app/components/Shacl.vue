<script setup lang="js">
import { useClipboard, computedAsync } from '@vueuse/core'
import { NCard, NCode, NInput } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { startsWith } from '../../conceptualModel/filter.js'
import { toShacl } from '../../shacl/model2Shacl.js'
import { useStore } from '../state.js'
import SelectModel from './SelectModel.vue'

const store = useStore()
const { eaJson } = storeToRefs(store)
const { text, isSupported, copy } = useClipboard()

async function writeSHACL () {
  const g = eaJson.value
  const { nodes, edges } = startsWith(g, start.value)
  const { turtle } = await toShacl({ nodes, edges })
  shacl.value = turtle
}

const shacl = ref('')
const start = ref('epo')

watch([eaJson, start], () => {
  writeSHACL()
})

onMounted(() => {
  writeSHACL()
})

</script>

<template>
  <SelectModel/>
  <n-card size="small" title="EA class name starts with">
    <n-input v-model:value="start"/>
  </n-card>
  <n-card> Note: This SHACL is dynamically generated based on the selected filters and is intended for debugging
    purposes.
  </n-card>
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
