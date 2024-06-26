<script setup lang="js">
import Graph from 'graphology'
import { random } from 'graphology-layout'
import forceAtlas2 from 'graphology-layout-forceatlas2'
import FA2Layout from 'graphology-layout-forceatlas2/worker'
import Sigma from 'sigma'
import {  onMounted, onUnmounted } from 'vue'
import { NodeBorderProgram } from "@sigma/node-border";

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


  const degrees = graph.nodes().map((node) => graph.degree(node));
  const minDegree = Math.min(...degrees);
  const maxDegree = Math.max(...degrees);
  const minSize = 2,
      maxSize = 15;
  graph.forEachNode((node) => {
    const degree = graph.degree(node);
    graph.setNodeAttribute(
        node,
        "size",
        minSize + ((degree - minDegree) / (maxDegree - minDegree)) * (maxSize - minSize),
    );
  });



  sigmaRenderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    renderEdgeLabels: true,
    defaultNodeType: "bordered",
    nodeProgramClasses: {
      bordered: NodeBorderProgram,
    },
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
    }, 4000) // Stops the layout after x mseconds
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
