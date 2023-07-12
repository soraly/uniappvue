<template>
    <component ref="componentRef" :is="componentId" />
</template>

<script>
import LiuheIndex_01 from '@/components/CommonPages/pages-liuhe/LiuheIndex_01.vue'
import LiuheIndex_02 from '@/components/CommonPages/pages-liuhe/LiuheIndex_02.vue'
export default {
    components: {
        LiuheIndex_01,
        LiuheIndex_02
    },
    data() {
        return {
            componentId: 'LiuheIndex_01',
            componentIdMap: {
                1: 'LiuheIndex_01',
                2: 'LiuheIndex_02',
            }
        }
    },
    onShow() {
        this.$nextTick(() => {
            this.$refs.componentRef._onShow && this.$refs.componentRef._onShow()
        })
    },
    onLoad() {
        const { liuhe_config } = getApp().globalData.websiteConfigData
        console.log('getApp().globalData.liuhe_config', liuhe_config);
        this.componentId = this.componentIdMap[liuhe_config || 1]
        this.$nextTick(() => {
            this.$refs.componentRef._onLoad && this.$refs.componentRef._onLoad({})
        })
    },
}
</script>
<style lang="scss" scoped></style>