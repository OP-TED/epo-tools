<script setup lang="js">
import { onLongPress } from '@vueuse/core'
import { NSpace } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useStore } from '../state.js'

const store = useStore()
const { developerMode } = storeToRefs(store)

function onLongPressCallbackHook (e) {
  developerMode.value = !developerMode.value
}

const htmlRefHook = ref()

onLongPress(
    htmlRefHook,
    onLongPressCallbackHook,
    {
      modifiers: {
        prevent: true,
      },
    },
)
</script>
<template>
  <n-space justify="end">
    <div ref="htmlRefHook">
      ePO explorer {{ developerMode ? '(developer mode enabled)' : '' }}
    </div>
  </n-space>

</template>
