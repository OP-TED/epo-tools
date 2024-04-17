<script setup lang="js">
import { NCode, NCard } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { useStore } from '../state.js'
import { useClipboard, usePermission } from '@vueuse/core'

const store = useStore()
const { shacl } = storeToRefs(store)
const { text, isSupported, copy } = useClipboard()

</script>

<template>
  <template v-if="shacl">
    <n-card title="SHACL">
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
