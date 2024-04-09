<script setup lang="js">
import { useFileDialog } from '@vueuse/core'
import { Buffer } from 'buffer/'
import { bufferToJson } from '../../ontology/ea/ea-to-json.js'

const { files, open, reset, onChange } = useFileDialog({
  accept: '*.eap',
  multiple: false,
})

onChange(async (selectedFiles) => {

  const [file] = selectedFiles
  const reader = new FileReader()
  reader.onload = (e) => handleBuffer(e.target.result)
  reader.readAsArrayBuffer(file)
})

function handleBuffer (buffer) {

  const json = bufferToJson({ buffer:Buffer.from(buffer) })

  console.log(json)
}


</script>

<template>
  <button type="button" @click="open()">
    Choose files
  </button>
  <button type="button" :disabled="!files" @click="reset()">
    Reset
  </button>

  <template v-if="files">
    <p>You have selected: <b>{{ `${files.length} ${files.length === 1 ? 'file' : 'files'}` }}</b></p>
    <li v-for="file of files" :key="file.name">
      {{ file.name }}
    </li>
  </template>

  <div v-if="buffers?.value?.length">
    Buffers:
    <ul>
      <li v-for="(buffer, index) in buffers.value" :key="index">
        <pre>{{ buffer }}</pre>
      </li>
    </ul>
  </div>
  <button type="button" @click="processFiles()" :disabled="!buffers?.value?.length">
    Process File
  </button>
</template>
