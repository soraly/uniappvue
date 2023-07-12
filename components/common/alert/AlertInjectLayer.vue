<template>
    <view>
        <Account ref="account" :z-index="101" />
        <Betting ref="betting" :z-index="102" />
        <Logout ref="logout" :z-index="103" />
        <AlertMsg ref="AlertMsg" :z-index="104" />
        <AlertTestMsg ref="AlertTestMsg" :z-index="105" />
        <AlertChangePasword ref="AlertChangePasword" :z-index="106" />
        <TryProfit ref="TryProfit" :z-index="107" />
        <Verify ref="Verify" :z-index="108" />
    </view>
</template>
<script>
// 账户弹窗
import Account from "./alertboxs/AlertAccount";
// 中奖弹窗
import Betting from './alertboxs/AlertBetting'
// 掉线退出弹窗
import Logout from "./alertboxs/AlertLogout";
// confirm提示弹窗
import AlertMsg from './alertboxs/AlertMsg'
// 未登录账号提示弹窗
import AlertTestMsg from './alertboxs/AlertTestMsg'
// 未登录账号提示弹窗
import AlertChangePasword from './alertboxs/AlertChangePassword'
// 试玩盈利
import TryProfit from './alertboxs/TryProfit'
// 验证码
import Verify from './alertboxs/verify/index'


export default {
    name: "AlertInjectLayer",
    components: {
        Account,
        Betting,
        Logout,
        AlertMsg,
        AlertTestMsg,
        AlertChangePasword,
        TryProfit,
        Verify
    },
    mounted() {
        this.path = this.$route.path
        uni.$on('showPop', this.hanldePopup)
    },
    methods: {
        // 处理显示弹窗
        hanldePopup({ refName, data, ...args }) {
            // 如果不是当前页面,不打开弹窗
            if (this.$route.path !== this.path) {
                return
            }
            this.$refs[refName] && this.$refs[refName].open(data, args)
        },
    }
}
</script>

<style lang="scss" scoped></style>