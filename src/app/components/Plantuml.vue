<script setup lang="js">
import { NCode } from 'naive-ui'
import { storeToRefs } from 'pinia'

import { useStore } from '../state.js'

const store = useStore()
const { plantUml } = storeToRefs(store)

</script>

<template>

  <template v-if="plantUml">
    <div style="overflow: auto">
      <n-code :code="plantUml" language="plantuml" show-line-numbers/>
    </div>

  </template>
</template>
