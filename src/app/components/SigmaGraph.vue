<script setup lang="js">
import Graph from 'graphology'
import { random } from 'graphology-layout'
import forceAtlas2 from 'graphology-layout-forceatlas2'
import FA2Layout from 'graphology-layout-forceatlas2/worker'
import Sigma from 'sigma'
import { defineEmits, defineProps, onMounted, onUnmounted } from 'vue'

// Define props and emits
const props = defineProps({
  data: Object, // Assuming data is an object, adjust according to the actual data structure
})

const emits = defineEmits(['nodeSelected'])
let fa2Layout = null
let sigmaRenderer = null

onMounted(() => {
  setupGraph()
})

const setupGraph = () => {
  const container = document.getElementById('sigma-container')
  const graph = new Graph({ multi: true })

  if (props.data) {
    graph.import(props.data)
  }
  random.assign(graph)

  sigmaRenderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    renderEdgeLabels: true,
    // defaultEdgeType: "curve",
    // edgeProgramClasses: {
    //   curve: EdgeCurveProgram,
    // },
  })

  const settings = forceAtlas2.inferSettings(graph)
  fa2Layout = new FA2Layout(graph, { settings })
  sigmaRenderer.on('clickNode', ({ node }) => {
    emits('nodeSelected', node)
  })
  doForceLayout()
}

const doForceLayout = () => {
  if (fa2Layout) {
    fa2Layout.start()
    setTimeout(() => {
      if (fa2Layout.isRunning) {
        fa2Layout.stop()
      }
    }, 3000) // Stops the layout after 1 second
  }
}

onUnmounted(() => {
  if (fa2Layout) fa2Layout.kill()
})


</script>

<template>
  <div>
    <button @click="doForceLayout">layout</button>
    <div id="sigma-container"></div>

  </div>
</template>

<style scoped>
#sigma-container {
  position: relative;
  height: 90vh;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: white;
}

button + button {
  margin-left: 10px;
}
</style>
