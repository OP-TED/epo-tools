<script setup lang="js">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { addEdgeWarnings, addNodeWarnings } from '../../ontology/ea/add-warnings.js'
import { toPlantuml } from '../../ontology/templates/plantuml-template.js'
import { useStore } from '../state.js'
import { NCode, NCard, NFlex } from 'naive-ui'

const store = useStore()
const { filteredEaJson } = storeToRefs(store)

const plantUml = computed(() => {
  const { nodes, edges } = filteredEaJson.value
  const hasNoErrors = x => !x.warnings.some(x => x.severity === 'error')
  const withoutErrors = {
    nodes: nodes.map(addNodeWarnings).filter(hasNoErrors),
    edges: edges.map(addEdgeWarnings).filter(hasNoErrors),
  }
  return toPlantuml(withoutErrors)
})


</script>

<template>

  <template v-if="plantUml">
    <div style="overflow: auto">
      <n-code :code="plantUml" language="plantuml" show-line-numbers />
    </div>

  </template>
</template>
