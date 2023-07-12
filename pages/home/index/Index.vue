<template>
    <component ref="componentRef" :is="componentId" />
</template>

<script>
import LuntanIndex_01 from '@/components/CommonPages/pages-luntan/LuntanIndex_01.vue'
import LuntanIndex_02 from '@/components/CommonPages/pages-luntan/LuntanIndex_02.vue'
export default {
    components: {
        LuntanIndex_01,
        LuntanIndex_02
    },
    data() {
        return {
            componentId: 'LuntanIndex_01',
            componentIdMap: {
                2: 'LuntanIndex_01',
                1: 'LuntanIndex_02',
            }
        }
    },
    onShow() {
        this.$nextTick(() => {
            this.$refs.componentRef._onShow && this.$refs.componentRef._onShow()
        })
    },
    onLoad() {
        const { luntan_config } = getApp().globalData.websiteConfigData
        this.componentId = this.componentIdMap[luntan_config || 1]
        this.$nextTick(() => {
            this.$refs.componentRef._onLoad && this.$refs.componentRef._onLoad({})
        })
    },
}
</script>
<style lang="scss" scoped></style>