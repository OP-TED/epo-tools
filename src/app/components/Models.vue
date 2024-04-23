<script setup lang="js">
import { NCard, NCode, NButton, NSelect } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { bufferToJson } from '../../conceptualModel/ea-to-json.js'

import { useStore } from '../state.js'
import { repositories } from '../../epo/knownEpo.js'
import { useFileDialog, useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'

const store = useStore()

const { library } = storeToRefs(store)

const { files, open, reset, onChange } = useFileDialog({
  accept: '*.eap',
  multiple: false,
})

onChange(async (selectedFiles) => {
  if (selectedFiles) {
    const [file] = selectedFiles
    const reader = new FileReader()
    reader.onload = (e) => handleUserUpload(e.target.result, file)
    reader.readAsArrayBuffer(file)
  }
})

function handleUserUpload (buffer, file) {
  const { name } = file
  const eaJson = bufferToJson({ buffer: Buffer.from(buffer) })
  const key = name
  const repo = {
    title: name,
    key: key,
  }
  addToLibrary(key, repo, eaJson)
}

async function handleUpload (repo) {
  const response = await fetch(repo.appUrl)
  const eaJson = await response.json()
  const key = repo.key
  addToLibrary(key, repo, eaJson)
}

function addToLibrary (key, repo, eaJson) {
  localStorage.setItem(key, JSON.stringify(eaJson))
  library.value.models[key] = repo
  library.selected = key
}

function clearFromLibrary (key) {
  localStorage.removeItem(key)
  delete library.value.models[key]
}

const libraryOptions = computed(() => {
  return Object.keys(library.value.models).map(key => ({
    label: library.value.models[key].title,
    value: key,
  }))
})
</script>

<template>

  <n-card title="In library">
    <template v-for="repo of libraryOptions">
      <n-button @click="clearFromLibrary(repo.value)"> {{ repo.label }}</n-button>
    </template>
  </n-card>

  <n-card title="Available models">
    <template v-for="repo of repositories.filter(x=>!library.models[x.key])">
      <n-button @click="handleUpload(repo)">{{ repo.title }}</n-button>
    </template>
  </n-card>
  <n-card title="Upload yours">
    <n-button @click="open()">
      Select eap
    </n-button>
  </n-card>
</template>
