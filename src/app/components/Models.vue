<script setup lang="js">
import { useFileDialog } from '@vueuse/core'
import { NButton, NCard } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { eapToJson } from '../../conceptualModel/eap-to-json.js'

import { repositories } from '../../epo/knownEpo.js'

import { useStore } from '../state.js'

const store = useStore()

const { library } = storeToRefs(store)

const { files, open, reset, onChange } = useFileDialog({
  // accept: '*.eap, *.qea',
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

function toJson (buffer, name) {
  if (name.endsWith('.eap')) {
    return eapToJson({ buffer: Buffer.from(buffer) })
  }
  // if (name.endsWith('.eap')) {
  //  Expects a path
  //   return qeaToJson({ buffer: Buffer.from(buffer) })
  // }
  throw Error(`I don't know how to parse ${name}`)
}

function handleUserUpload (buffer, file) {
  const { name } = file


  if (name.endsWith('.eap')) {

  }

  const eaJson = toJson(buffer,name)
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

  <div class="card-container">
    <n-card title="Available models">
      <template v-for="repo of repositories.filter(x=>!library.models[x.key])">
        <n-button @click="handleUpload(repo)">{{ repo.title }}</n-button>
      </template>
    </n-card>
    <n-card title="Selected">
      <template v-for="repo of libraryOptions">
        <n-button @click="clearFromLibrary(repo.value)"> {{ repo.label }}</n-button>
      </template>
    </n-card>
  </div>
  <n-card title="Upload yours">
    <n-button @click="open()">
      Select eap
    </n-button>
  </n-card>
</template>

<style>
.card-container {
  display: flex;
}
</style>
