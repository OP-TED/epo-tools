<script setup lang="js">
import { NCode, NImage, NCard } from 'naive-ui'


</script>

<template v-else>
  <n-card title="Welcome">
    <div>
      This is the Conceptual model explorer.
    </div>
    <div>
      To start please upload Enterprise architect files with the 'Select eap' button, it will be stored in
      local-storage
    </div>
    <div>
      When loaded, you can add a terms using + button, for example 'epo:Document'.
    </div>
    <div>Wildcards like "epo-cat:*" or negation "-dct:terms" are allowed.
    </div>

  </n-card>
</template>
<script setup lang="ts">
</script>
