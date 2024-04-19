<script setup lang="js">
import { NButton, NCard, NInput, NTag, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { validateAgainstGraph } from '../../sparql/validate.js'

import { useStore } from '../state.js'

const store = useStore()
const { addFilterTerms } = store
const { sparql, eaJson } = storeToRefs(store)

const extracted = computed(
    () => sparql.value ? validateAgainstGraph(eaJson.value, { queryStr: sparql.value }) : { terms: [] })


</script>

<template>

  <n-card title="Extracted tags" v-if="extracted?.terms && extracted.terms.length > 0">
    <template v-for="{term} of extracted.terms.filter(x=>x.isPresent)">
      <n-tag>{{ term }}</n-tag>
    </template>

    <n-button type="primary" @click="addFilterTerms(extracted.terms.filter(x => x.isPresent).map(x => x.term))">Add to
      filters
    </n-button>
  </n-card>

  <n-card v-if="extracted?.terms?.filter(x => !x.isPresent).length">

    <n-text type="error">
      Missing
      <template v-for="{term} of extracted?.terms?.filter(x=>!x.isPresent)">
        <n-tag type="warning">{{ term }}</n-tag>
      </template>
      in the current model. (the query might not work)
    </n-text>
  </n-card>

  <n-card title="SPARQL query">
    <n-input
        v-model:value="sparql"
        placeholder="Sparql"
        type="textarea"
        size="small"
        :autosize="{
        minRows: 3
      }"
    />
  </n-card>
  <n-card v-if="extracted.error" title="Error">
    {{ extracted.error }}
  </n-card>


</template>
