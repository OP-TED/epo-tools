<script setup lang="js">
import Graph from 'graphology'
import { random } from 'graphology-layout'
import forceAtlas2 from 'graphology-layout-forceatlas2'
import FA2Layout from 'graphology-layout-forceatlas2/worker'
import { storeToRefs } from 'pinia'
import Sigma from 'sigma'
import { onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '../state.js'

const { eaJson } = storeToRefs(useStore())
const store = useStore()

const { toggleFilterTerm } = store

function toSigmaGraph (g) {

  const allNodes = new Set(g.nodes.map(x => x.name).filter(x => x))
  const nodeMap = new Map() // Use a Map to track nodes and their duplicate count

  const nodes = []
  g.nodes.forEach(x => {
    if (allNodes.has(x.name)) {
      let count = nodeMap.get(x.name) || 0 // Get the current count or initialize to 0
      let keyName = x.name
      if (count > 0) {
        keyName = `duplicate-${count}-${x.name}`
        console.log(keyName, x.description)
      }
      nodeMap.set(x.name, count + 1)
      nodes.push({
        key: keyName,
        attributes: {
          label: keyName,
          size: keyName.startsWith('epo') ? 10 : 5,
          color: keyName.startsWith('duplicate') ? 'red' : 'blue',
        },
      })
    }
  })

  let keys = 0

  function addAttribute (key) {
    const newKey = `${keys}_${key}`
    const node = {
      key: newKey,
      attributes: {
        label: key, size: 4,
      },
    }
    nodes.push(node)
    keys = keys + 1
    return newKey
  }

  const edges = g.edges.map(x => {
    let sourceKey = allNodes.has(x.source) ? x.source : addAttribute(x.source)
    let targetKey = allNodes.has(x.target) ? x.target : addAttribute(x.target)
    return {
      source: sourceKey,
      target: targetKey,
      attributes: {
        label: `${x.predicate ?? 'NO_NAME'} ${x.quantifiers.raw ?? ''}`,
        type: 'arrow',
        color: x.predicate ? 'gray' : 'red',
      },
    }
  })

  return {
    nodes,
    edges,
  }
}

let sigmaRenderer = null
let fa2Layout = null
let container = null

watch(eaJson, (newValue, oldValue) => {
  render() // Fix this
})

onMounted(() => {
  container = document.getElementById('sigma-container')
  render()
})

const setupGraph = () => {
  const graph = new Graph({ multi: true })
  graph.import(toSigmaGraph(eaJson.value))
  return graph
}

function render () {
  const graph = setupGraph()
  random.assign(graph)
  // const { scalingRatio, ...tail } = forceAtlas2.inferSettings(graph)
  // const settings = { scalingRatio:20, ...tail }

  const settings = forceAtlas2.inferSettings(graph)

  fa2Layout = new FA2Layout(graph, { settings })
  sigmaRenderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    renderEdgeLabels: true,
    // defaultEdgeType: "curve",
    // edgeProgramClasses: {
    //   curve: EdgeCurveProgram,
    // },
  })

  sigmaRenderer.on('clickNode', ({ node }) => {
    toggleFilterTerm(node)
  })

  doForceLayout()
}

onUnmounted(() => {
  if (fa2Layout) fa2Layout.kill()
})

const doForceLayout = () => {
  if (fa2Layout) {
    fa2Layout.start()
    setTimeout(() => {
      if (fa2Layout.isRunning) {
        fa2Layout.stop()
      }
    }, 2000) // Stops the layout after 1 second
  }
}
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
