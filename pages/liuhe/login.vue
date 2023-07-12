<template>
  <component :is="componentId" />
</template>

<script>
import { config } from '@/config/config.js'
import ALL from '@/components/pages-all/login.vue';
import LIUHE from '@/components/pages-liuhe/login.vue';
import LUNTAN from '@/components/pages-luntan/login.vue';
export default {
  components: {
    ALL,
    LIUHE,
    LUNTAN,
  },
  data() {
    return {
      componentId: ''
    }
  },
  mounted() {
    this.componentId = config.station
  }
}
</script>
<style lang="scss" scoped></style>