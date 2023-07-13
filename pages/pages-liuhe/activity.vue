<template>
    <LiuheActivity ref="LiuheActivityRef" showTabBar />
</template>

<script>
import LiuheActivity from "@/components/CommonPages/pages-liuhe/LiuheActivity.vue";
export default {
    components: {
        LiuheActivity
    },
    onLoad() {
        this.$nextTick(() => {
            this.$refs.LiuheActivityRef._onLoad && this.$refs.LiuheActivityRef._onLoad({})
        })
    },
}
</script>
<style lang="scss" scoped></style>