<template>
    <LiuheWallet ref="LiuheWalletRef" showTabBar />
</template>
  
<script>
import LiuheWallet from "@/components/CommonPages/pages-liuhe/LiuheWallet.vue";
export default {
    components: {
        LiuheWallet
    },
    onShow() {
        this.$nextTick(() => {
            this.$refs.LiuheWalletRef._onShow && this.$refs.LiuheWalletRef._onShow()
        })
    },
}
</script>
<style lang="scss" scoped></style>