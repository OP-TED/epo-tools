<script setup lang="js">
import { NCode } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { useStore } from '../state.js'

const store = useStore()
const { shacl } = storeToRefs(store)


</script>

<template>

  <template v-if="shacl">

    <div style="overflow: auto">
      <n-code :code="shacl" language="turtle" show-line-numbers/>
    </div>

  </template>
</template>
