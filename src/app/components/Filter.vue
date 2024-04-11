<script setup lang="js">
import { ArrowBackOutline } from '@vicons/ionicons5'
import { NDynamicTags, NFlex, NIcon, NSwitch } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useStore } from '../state.js'

const store = useStore()
const { filterOptions } = storeToRefs(store)
//
// const customValue = ref([
//   {
//     isCheck: true,
//     filter: ['epo:Document'],
//     includeIncoming: false,
//     not: false,
//   },
// ])
//
// function onCreate () {
//   return {
//     isCheck: false,
//     filter: [],
//     not: false,
//     includeIncoming: false,
//   }
// }
//
// const railStyle = ({
//   checked,
// }) => {
//   return checked ? { background: '#d03050' } : {}
// }

</script>

<template>


  <!--  <n-dynamic-input v-model:value="customValue" :on-create="onCreate">-->
  <!--    <template #create-button-default>-->
  <!--    </template>-->
  <!--    <template #default="{ value }">-->
  <!--      <div>-->
  <!--        <n-checkbox v-model:checked="value.isCheck"/>-->
  <!--        <n-switch v-model:value="value.includeIncoming">-->
  <!--          <template #checked>-->
  <!--            <n-icon :component="ArrowBackOutline"/>-->
  <!--          </template>-->
  <!--          <template #unchecked>-->
  <!--          </template>-->
  <!--        </n-switch>-->
  <!--        <n-switch v-model:value="value.not" :rail-style="railStyle">-->
  <!--          <template #checked>-->
  <!--            <n-icon :component="CloseOutline" color="#0e7a0d"/>-->
  <!--          </template>-->
  <!--          <template #unchecked>-->
  <!--          </template>-->
  <!--        </n-switch>-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <n-dynamic-tags v-model:value="value.filter"/>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </n-dynamic-input>-->


  <n-flex justify="start">
    <n-switch v-model:value="filterOptions.includeIncoming">
      <template #checked>
        <n-icon :component="ArrowBackOutline"/>
      </template>
      <template #unchecked>
      </template>
    </n-switch>
    <n-dynamic-tags v-model:value="filterOptions.filter"/>

  </n-flex>
</template>
