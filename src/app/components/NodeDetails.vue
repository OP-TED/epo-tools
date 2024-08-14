<script setup lang="js">
import { NButton, NCard, NDrawer, NDrawerContent, NEllipsis, NTable } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps({
  node: Object,
  graph: Object,
})

const emit = defineEmits(['update:show', 'node-selected'])

function handleNodeSelected (nodeName) {
  emit('node-selected', nodeName)
}

function isDatatype (name) {
  return name && (name.startsWith('rdf:') || name.startsWith('xsd:'))
}

// Computed properties for superclass and narrower terms
const superClassEdges = computed(
    () => props.graph.edges.filter(edge => edge.source === props.node.name && edge.predicate === 'rdfs:subClassOf'))
const narrowerTermEdges = computed(
    () => props.graph.edges.filter(edge => edge.predicate === 'rdfs:subClassOf' && edge.target === props.node.name))

const properties = computed(
    () => props.graph.edges.filter(edge => edge.source === props.node.name && edge.predicate !== 'rdfs:subClassOf'))
const backlinks = computed(
    () => props.graph.edges.filter(edge => edge.predicate !== 'rdfs:subClassOf' && edge.target === props.node.name))


</script>

<template>

  <n-card
      :contentClass="node.type"
      :title="node.name" size="small">
    {{ node.description }} ({{ node.type }})
  </n-card>


  <!-- Superclass Section -->
  <template v-if="superClassEdges.length">
    <n-card title="Broader" size="small">
      <template v-for="edge in superClassEdges" :key="edge.source">
        <NButton @click="()=>handleNodeSelected(edge.target)"> {{ edge.target }}</NButton>
      </template>
    </n-card>
  </template>

  <!-- Narrower Terms Section -->
  <template v-if="narrowerTermEdges.length">
    <n-card title="Narrower" size="small">
      <n-table :bordered="false" :single-line="false">
        <template v-for="edge in narrowerTermEdges" :key="edge.source">
          <NButton @click="()=>handleNodeSelected(edge.source)"> {{ edge.source }}</NButton>
        </template>
      </n-table>
    </n-card>
  </template>
  <!--  Outgoing-->
  <template v-if="properties.length">
    <n-card title="Properties" size="small">
      <n-table :bordered="false" :single-line="false">
        <template v-for="out of properties">
          <tr>
            <td>{{ out.predicate }} {{ out.quantifiers?.raw }}</td>

            <td width="400">
              <n-ellipsis :line-clamp="2">{{ out.description }}</n-ellipsis>
            </td>
            <td>
              <template v-if="isDatatype(out.target)">
                <div>{{ out.target }}</div>
              </template>
              <template v-else>
                <NButton @click="()=>handleNodeSelected(out.target)"> {{ out.target }}</NButton>
              </template>
            </td>
          </tr>
        </template>
      </n-table>
    </n-card>
  </template>
  <!--      backlinks-->
  <template v-if="backlinks.length">
    <n-card title="Referenced by" size="small">
      <template v-for="out of backlinks">
        <NButton @click="()=>handleNodeSelected(out.source)"> {{ out.source }}</NButton>
      </template>
    </n-card>
  </template>
</template>
