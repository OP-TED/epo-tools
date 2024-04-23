<script setup lang="js">
import { computedAsync } from '@vueuse/core'
import { NCard, NSelect, NTreeSelect } from 'naive-ui'
import { computed, ref } from 'vue'
import { Diff } from 'vue-diff'

// import modelIndex from './modelIndex.json'

const modelIndex = []
const versions = [...new Set(modelIndex.map(x => x.version))].sort()

const tree = versions.map(version => ({
  label: `EPO ${version}`,
  key: version,
  children: modelIndex.filter(x => x.version === version).map(x => ({
    label: `EPO ${version}, module ${x.module}`,
    key: x.plantumlFile,
    ...x,
  })),
}))

const options = ref(tree)

async function handleUpdateValue (value, option) {
  if (option.module) {
    selectedSource.value = modelIndex.filter(x => x.module === option.module && x.version === option.version)

  } else {
    selectedSource.value = modelIndex.filter(x => x.version === value)
  }
}

const selectedSource = ref([])
const selectedTargetVersion = ref()
const targetVersions = computed(() => {
  if (selectedSource.value.length) {
    const [{ version }] = selectedSource.value
    return versions.filter(x => x !== version).map(x => ({
      label: x,
      value: x,
    }))
  }
})

const chunks = computedAsync(async x => {

  if (selectedSource.value.length && selectedTargetVersion.value) {
    const chunks = []
    for (const { version, module, plantumlFile } of selectedSource.value) {
      const target = modelIndex.find(x => x.version === selectedTargetVersion.value && x.module === module)
      if (target) {
        chunks.push({
          title: `Module ${module}, left:${version}, right:${target.version}`,
          prev: await getPlantuml(plantumlFile),
          current: await getPlantuml(target.plantumlFile),
        })
      }
    }
    return chunks
  }
})

async function getPlantuml (file) {
  const response = await fetch(file)
  if (!response.ok) {
    throw new Error('Failed to fetch the file')
  }
  return await response.text()
}

</script>

<template>
  <n-card title="Models">
    <div>
      Select source
    </div>
    <n-tree-select
        :options="options"
        default-value="Drive My Car"
        @update:value="handleUpdateValue"
    />
    <template v-if="selectedSource.length">
      <n-select v-model:value="selectedTargetVersion" :options="targetVersions"/>
    </template>
    <template v-for="chunk of chunks">

      <n-card :title="chunk.title">
        <Diff
            :mode="'split'"
            :theme="'dark'"
            :language="'plaintext'"
            :prev="chunk.prev"
            :current="chunk.current"
            :folding="true"
        />
      </n-card>

    </template>


  </n-card>
</template>
