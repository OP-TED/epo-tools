<script setup lang="js">
import { useFileDialog } from '@vueuse/core'
import { Buffer } from 'buffer/'
import { storeToRefs } from 'pinia'
import { bufferToJson } from '../../ontology/ea/ea-to-json.js'
import { useCounterStore } from '../state.js'

const store = useCounterStore()

const { resetSelection } = store
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
  if (selectedFiles){
    const [file] = selectedFiles
    const reader = new FileReader()
    reader.onload = (e) => handleBuffer(e.target.result)
    reader.readAsArrayBuffer(file)
  }
})

function handleBuffer (buffer) {
  eaJson.value = bufferToJson({ buffer: Buffer.from(buffer) })
}

</script>

<template>
  <button type="button" @click="open()">
    Choose eap file
  </button>
  <button type="button" :disabled="!files" @click="clearSelection()">
    Reset
  </button>
  <template v-if="files">
    <div v-for="file of files" :key="file.name">
      {{ file.name }}
    </div>
  </template>
</template>
