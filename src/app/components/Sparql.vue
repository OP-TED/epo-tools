<script setup lang="js">
import { NInput, NSpace, NTag, NButton } from 'naive-ui'
import { ref, computed } from 'vue'
import { termsFromQuery } from '../../ontology/views/sparql-views.js'
import { useStore } from '../state.js'

const store = useStore()
const { addFilterTerms } = store

const sparql = ref('')

const extracted = computed(() => sparql.value ? termsFromQuery({ queryStr: sparql.value }) : {})

</script>

<template>

  <div>
    <template v-if="extracted.terms && extracted.terms.length > 0">
      <n-tag v-for="tag of extracted.terms">{{ tag }}</n-tag>
      <n-button type="primary" @click="addFilterTerms(extracted.terms)">Add to filters</n-button>
    </template>
  </div>

  <n-input
      v-model:value="sparql"
      placeholder="Sparql"
      type="textarea"
      size="small"
      :autosize="{
        minRows: 3
      }"
  />

  <div>{{ extracted.error }}</div>

</template>
