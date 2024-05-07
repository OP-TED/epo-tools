<script setup lang="js">
import { NButton, NCard, NDynamicTags, NInput, NTag, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { validateAgainstGraph } from '../../sparql/validate.js'
import { filterHelp } from '../help.js'

import { useStore } from '../state.js'
import SelectModel from './SelectModel.vue'

const store = useStore()
const { addFilterTerms } = store
const { sparql, eaJson, library, filterOptions, developerMode } = storeToRefs(store)

const extracted = computed(() => {
  if (sparql.value) {
    return validateAgainstGraph(eaJson.value, { queryStr: sparql.value, filter: verifyOnlyFilter.value })
  }
  return { terms: [] }
})

const verifyOnlyFilter = ref(['epo*'])

// These are new terms wrt the current view. Used to create an LLM context starting from SPARQL
// (Developer mode)
const newTerms = computed(() => {
  const current = new Set(filterOptions?.value.filter || [])
  return (extracted.value?.terms || []).filter(x => x.isPresent).map(x => x.term).filter(x => !current.has(x))
})


</script>

<template>
  <SelectModel/>
  <n-card
      :title="`Mismatch`"
      v-if="extracted?.terms?.filter(x => !x.isPresent).length">
    <n-text type="error">
      Missing
      <template v-for="{term} of extracted?.terms?.filter(x=>!x.isPresent)">
        <n-tag type="warning">{{ term }}</n-tag>
      </template>
      in {{ library.selected.title }}. (the query might not work)
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
    <n-card v-if="extracted.error" title="Error">
      {{ extracted.error }}
    </n-card>
  </n-card>

  <n-card size="small" title="Verify only the following:">
    <template v-if="!verifyOnlyFilter.length">{{ filterHelp }}</template>
    <n-dynamic-tags v-model:value="verifyOnlyFilter"/>
  </n-card>
  <template v-if="developerMode">
    <n-card title="Extracted tags" v-if="newTerms && newTerms.length > 0">
      <template v-for="term of newTerms">
        <n-tag>{{ term }}</n-tag>
      </template>
      <n-button type="primary" @click="addFilterTerms(newTerms)">Add to
        filters
      </n-button>
    </n-card>
  </template>
</template>
