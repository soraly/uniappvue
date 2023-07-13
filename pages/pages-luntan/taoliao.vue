<template>
    <LuntanMarket ref="LiuheGameHallRef" />
</template>

<script>
import LuntanMarket from "@/components/CommonPages/pages-luntan/LuntanMarket.vue";
export default {
    components: {
        LuntanMarket
    },
    onShow() {
        this.$nextTick(() => {
            this.$refs.LiuheGameHallRef._onShow && this.$refs.LiuheGameHallRef._onShow()
        })
    },
    onLoad() {
        this.$nextTick(() => {
            this.$refs.LiuheGameHallRef._onLoad && this.$refs.LiuheGameHallRef._onLoad({})
        })
    },
}
</script>
<style lang="scss" scoped></style>