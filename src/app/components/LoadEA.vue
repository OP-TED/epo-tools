<script setup lang="js">
import { useFileDialog } from '@vueuse/core'
import { Buffer } from 'buffer/'
import { NButton, NCard, NFlex } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { bufferToJson } from '../../conceptualModel/ea-to-json.js'
import { useStore } from '../state.js'

const store = useStore()

const { resetSelection, setEaJson } = store
const { eaJson } = storeToRefs(store)

const { files, open, reset, onChange } = useFileDialog({
  accept: '*.eap',
  multiple: false,
})

function clearSelection () {
  resetSelection()
  reset()
}

onChange(async (selectedFiles) => {
  if (selectedFiles) {
    const [file] = selectedFiles
    const reader = new FileReader()
    reader.onload = (e) => handleBuffer(e.target.result)
    reader.readAsArrayBuffer(file)
  }
})

function handleBuffer (buffer) {
  setEaJson(bufferToJson({ buffer: Buffer.from(buffer) }))
}

const summary = computed(() => {
  const nodesCount = eaJson?.value?.nodes?.length ?? 0
  const edgesCount = eaJson?.value?.edges?.length ?? 0
  return (nodesCount || edgesCount) ? `${nodesCount}-${edgesCount}` : ''
})


</script>

<template>
  <n-card>
    <n-flex justify="end">
      <n-button @click="open()">
        Select eap
      </n-button>
      <n-button :disabled="!(files||summary)" @click="clearSelection()">
        {{ files ? `${files[0].name} (${summary})` : '-' }}
      </n-button>
    </n-flex>
  </n-card>
</template>
