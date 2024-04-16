<script setup lang="js">
import { NCode } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { useStore } from '../state.js'
import { useClipboard, usePermission } from '@vueuse/core'

const store = useStore()
const { shacl } = storeToRefs(store)
const { text, isSupported, copy } = useClipboard()

</script>

<template>

  <template v-if="shacl">
    <div v-if="isSupported">
      <button @click="copy(shacl)">
        <template v-if="text">Copied</template>
        <template v-else>Copy</template>
      </button>
    </div>
    <div style="overflow: auto">
      <n-code :code="shacl" language="turtle" show-line-numbers/>
    </div>

  </template>
</template>
