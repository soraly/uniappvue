<template>
    <scroll-view scroll-y="true" show-scrollbar="true" scroll-with-animation="true" lower-threshold="700" class="wallet-box"
        :style="{ marginTop: safeHeight }">
        <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
            :font-color="fontColor" :title-style="titleStyle">
            <block slot="left" v-if="!showTabBar">
                <uni-icons @click="back" type="back" :color="fontColor" size="18"
                    style="font-weight: bold;margin-left: 10px" />
            </block>
            <block slot="right">
                <view class="config" @click="setting">
                    <view class="text">设置</view>
                    <uni-icons class="icon-text" type="gear" size="30"></uni-icons>
                </view>
            </block>
        </NavBar>
        <view class="top-box">
            <view class="tag-box">
                <view class="user-box">
                    <view class="avatar">
                        <image :src="userInfo.headImgUrl"></image>
                    </view>
                    <view class="info">
                        <view class="nickname">
                            昵称：{{ userInfo.nickname }}
                        </view>
                        <view class="vip-details" @click="vip">
                            <view class="level-name">{{ vipSpeedInfo.levelName }}</view>
                            <view class="content">
                                <view class="title">
                                    <template
                                        v-if="vipSpeedInfo.nextLevel === vipSpeedInfo.level && vipSpeedInfo.nextLevel !== 0 && vipSpeedInfo.level !== 0">
                                        恭喜您<text class="vip">VIP</text>等级已达最高
                                    </template>
                                    <template v-else>距离 <text class="vip">{{ vipSpeedInfo.nextLevelName }}</text>
                                        打码还差{{ vipSpeedInfo.gapCodingAmount }}
                                    </template>
                                </view>
                                <view class="num text-fff" :style="{ '--vip-num-width': vipSpeedInfo.speed + '%' }">
                                    <text class="num-text"
                                        v-if="vipSpeedInfo.nextLevel === vipSpeedInfo.level && vipSpeedInfo.nextLevel !== 0 && vipSpeedInfo.level !== 0">
                                        {{ vipSpeedInfo.currentCodingAmount }}
                                    </text>
                                    <text class="num-text" v-else>
                                        {{ vipSpeedInfo.currentCodingAmount }}/{{ vipSpeedInfo.needCodingAmount }}
                                    </text>
                                </view>
                            </view>
                        </view>
                        <view class="invite-code">邀请码：{{ userInfo.inviteCode }}</view>
                    </view>
                </view>
            </view>
            <view class="balance-box">
                <view class="money-box">
                    <view class="money-text">
                        <template v-if="$store.state.appInfoStore.userInfo.userBalance">
                            <view class="text" v-if="isEnd1 && $store.state.appInfoStore.userInfo.userBalance > 1000">
                                {{ parseFloat($store.state.appInfoStore.userInfo.userBalance).toLocaleString() }}
                            </view>
                            <u-count-to class="text" :decimals="2" :start-val="0"
                                :end-val="$store.state.appInfoStore.userInfo.userBalance" @end="isEnd1 = true"
                                v-else></u-count-to>
                        </template>
                        <text class="img" @click="refresh">
                            <image :class="{ run: isRef }" src="@/static/img/user/wallet/refsh.png"></image>
                        </text>
                    </view>
                    <view class="money-desc">
                        钱包余额（元）
                    </view>
                </view>
                <view class="money-box">
                    <view class="money-text">
                        <template v-if="$store.state.appInfoStore.userInfo.gameLockBalance">
                            <view class="text" v-if="isEnd2 && $store.state.appInfoStore.userInfo.gameLockBalance > 1000">
                                {{ parseFloat($store.state.appInfoStore.userInfo.gameLockBalance).toLocaleString() }}
                            </view>
                            <u-count-to class="text" :decimals="2" :start-val="0"
                                :end-val="$store.state.appInfoStore.userInfo.gameLockBalance" @end="isEnd2 = true"
                                v-else></u-count-to>
                        </template>
                    </view>
                    <view class="money-desc">
                        未结金额（元）
                    </view>
                </view>
            </view>
        </view>
        <view class="list-content" :class="{ 'show-tabBar': !showTabBar }">
            <view class="list-row">
                <view class="list-item" v-for="(item, index) in czMenu" @click="onClick(item)">
                    <image :src="item.img"></image>
                    <text class="name">{{ item.name }}</text>
                </view>
            </view>
            <view class="list-box">
                <view class="list-col" v-for="(item, index) in   firstMenu  " @click="onClick(item)">
                    <image :src="item.img"></image>
                    <view class="text-box">
                        <view class="name">{{ item.name }}</view>
                        <view v-if="item.name == '网络状态'" class="desc" :class="debugWebsocketTimeInterval < 150 ? 'green-text' :
                            debugWebsocketTimeInterval > 150 && debugWebsocketTimeInterval < 300 ? 'orange-text' :
                                'red-text'">
                            <Network ref="network" v-slot="{ lineName }">
                                <view class="line-name">{{ lineName }}</view>
                            </Network>
                            {{ debugWebsocketTimeInterval }}MS
                        </view>
                        <view v-else class="desc" :class="{ 'blue-text': item.name == '安全中心' }">
                            {{ item.desc }}
                        </view>
                    </view>
                    <view class="line" v-if="index % 2 == 0"></view>
                </view>
            </view>

            <view class="list-box">
                <view class="list-col" @click="onClick({ url: '/pages/yeb/index' })">
                    <image src="/static/img/user/wallet/yeb.png"></image>
                    <view class="text-box">
                        <view class="name">
                            余额宝
                            <text class="year">年化率{{ mineData.baseRate }}%</text>
                        </view>
                        <view class="desc">昨日收益<text style="color: #FF6600">+{{ mineData.yesterdayProfit }}</text></view>
                    </view>
                    <view class="line"></view>
                </view>
                <!--      <view class="list-col">
          <image src="/static/img/user/wallet/hd.png"></image>
          <view class="text-box">
            <view class="name">精彩活动</view>
            <view class="desc">查看所有精彩活动</view>
          </view>
        </view>-->
            </view>
            <view class="list-box">
                <view class="list-col" v-for="(  item, index  ) in   lastMenu  " @click="onClick(item)">
                    <image :src="item.img"></image>
                    <view class="text-box">
                        <view class="name">
                            {{ item.name }}
                            <view class="hot" v-show="item.hot">Hot</view>
                        </view>
                        <view class="desc" :class="{ 'blue-text': item.name == '安全中心' }">{{ item.desc }}</view>
                    </view>
                    <view class="line" v-if="index % 2 == 0"></view>
                </view>
            </view>
        </view>
        <uni-popup ref="confirm" type="center" background-color="#fff">
            <view class="confirm-box">
                <view class="title">提示</view>
                <view class="notice">
                    <text>您还没有设置资金密码，</text>
                    <text>提现需先设置资金密码。</text>
                </view>
                <view class="btn-box">
                    <view class="cancel-btn" @click="cancel">取消</view>
                    <view class="confirm-btn" @click="confirm">确认</view>
                </view>
            </view>
        </uni-popup>
        <TabBar :current="3" v-if="showTabBar" />
        <AlertInjectLayer />
    </scroll-view>
</template>
  
<script>
import TabBar from '@/components/Tabbar/Liuhe'
import NavBar from "@/components/common/navBar/navBar";
import UniCol from "@/uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "@/uni_modules/uni-row/components/uni-row/uni-row";

import { init } from "@/utils/lottery/mine";
import { info } from "@/utils/user/index";
import { vipSpeed } from "@/utils/user/vip";
import defaultTemplate from "@/utils/defaultTemplate";
import Network from '@/components/network'

import { mapGetters } from "vuex";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import { init as mineInit } from '@/utils/mine'

export default {
    name: "index",
    components: {
        TabBar,
        AlertInjectLayer,
        UniCol,
        UniRow,
        NavBar,
        Network
    },
    props: {
        showTabBar: Boolean
    },
    data() {
        return {
            isEnd1: false,
            isEnd2: false,
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: "我的钱包",
            headerStyle: {
                backgroundColor: "#1794FF"
            },
            fontColor: "#FFFFFF",
            titleStyle: {
                color: "#FFFFFF"
            },
            czMenu: [
                { img: '/static/img/user/wallet/cz1.png', name: '充值', url: '/pages/pay/index' },
                { img: '/static/img/user/wallet/tx1.png', name: '提现', url: '/pages/withdraw/index' },
                { img: '/static/img/user/wallet/mtzc.png', name: '免提直充', url: '/pages/withdraw/mtzc' }
            ],
            lastMenu: [
                { img: '/static/img/user/wallet/fx.png', name: '推广赚钱', hot: true, url: '/pages/ptp/index', desc: "月入百万" },
                { img: '/static/img/user/wallet/help.png', name: '帮助中心', hot: false, url: '/pages/liuhe/help/index', desc: "解答各种问题" },
                { img: '/static/img/user/wallet/xx.png', name: '消息中心', hot: false, url: '/pages/liuhe/notice/index', desc: "查看公告站内信" },
                { img: '/static/img/user/wallet/down.png', name: '下载APP', hot: false, url: '/pages/user/downloadPage', desc: "进入下载页面" },
                { img: '/static/img/user/wallet/kf.png', name: '客服中心', hot: false, url: '/pages/user/service/index', desc: "直接与客服联系" },
                { img: '/static/img/user/wallet/feedback.png', name: '反馈有奖', hot: false, url: `/pages/user/feedback/index?type=${this.$config.enumMgr.USER_FEEDBACK_TYPE.LOTTERY}`, desc: "直接奖励礼金" }
            ],
            isRef: false,
            status: 0,
            userInfo: {},
            vipSpeedInfo: {},
            upgradeMsg: '',
            mineData: {}
        }
    },
    computed: {
        ...mapGetters(['orderList', "debugWebsocketTimeInterval", "inLotteryId"]),
        firstMenu() {
            return [
                { img: '/static/img/user/wallet/zb.png', name: '账变明细', url: '/pages/user/accountLog/menu', desc: "查看账户资金变动" },
                { img: '/static/img/user/wallet/edhs1.png', name: '额度回收', url: '/pages/user/wallet/quota', desc: "回收电子游艺的余额" },
                { img: '/static/img/user/wallet/aq.png', name: '安全中心', url: '/pages/safe/index', desc: "保护您的账户安全" },
                { img: '/static/img/user/wallet/wifi.png', name: '网络状态', url: 'network', desc: this.debugWebsocketTimeInterval + 'MS' },

                /*{img:'/static/img/user/wallet/yl.png',name:'盈亏报表',url:'/pages/user/profitreport/profitreport',desc:"查看您的盈亏详情"},
                {img:'/static/img/user/wallet/cq1.png',name:'存取记录',url:'/pages/user/accountLog/index',desc:"查看充值提现记录"},
                {img:'/static/img/user/wallet/game.png',style:{width:'40rpx',height:"30rpx"},name:'游戏记录',url:'',desc:"查看您的盈亏详情"},*/
            ]
        }
    },
    methods: {
        _onShow() {
            this.userInfo = this.$store.state.appInfoStore.userInfo
            this.getInit()
            if (!isLogin()) {
                uni.navigateTo({
                    url: "/pages/liuhe/login"
                })
            } else {
                this.getUserVipSpeed()
                this.initData()
            }
        },
        async initData() {
            const res = await mineInit()
            const data = defaultTemplate({
                nickname: '',
                inviteCode: "",
                userBalance: 0,
                unsettledAmount: 0,
                baseRate: 0,
                yesterdayProfit: 0,
                lineList: [
                    {
                        id: '',
                        type: '',
                        urlType: '',
                        name: "线路1",
                        url: "",
                        projectType: '',
                        status: '',
                        qqList: [],
                        createTime: "",
                        updateTime: ""
                    }
                ]
            }, res.result)
            this.mineData = data
        },
        back() {
            const urlMap = {
                ALL: '/pages/liuhe/index',
                LIUHE: '/pages/pages-liuhe/index',
                LUNTAN: '/pages/pages-luntan/index'
            }
            uni.switchTab({
                url: urlMap[this.$config.station]
            })
        },
        vip() {
            uni.navigateTo({
                url: '/pages/user/wallet/vip'
            })
        },
        setting() {
            if (!this.isTest()) return
            uni.navigateTo({
                url: '/pages/liuhe/setting/index'
            })
        },
        isTest() {
            if (this.userInfo.userType == "demo") {
                uni.$emit('showPop', { refName: 'AlertTestMsg', })
                return false
            }
            return true
        },
        async getUserVipSpeed() {
            const { result } = await vipSpeed()
            this.vipSpeedInfo = defaultTemplate({
                levelName: "",
                level: 0,
                needCodingAmount: 0,
                currentCodingAmount: 0,
                gapCodingAmount: 0,
                speed: 0,
                nextLevel: 0,
                nextLevelName: ""
            }, result)

        },
        async getInit() {
            await init().then(res => {
                if (res.code == 200) {
                    this.status = res.result.status
                }
            }).catch(err => {
                console.log(err)
            })
        },
        async onClick(item) {
            if (!item || !item.url) {
                pop('敬请期待', 2000)
                return false
            }
            if (item.name == "充值" || item.name == "免提直充" || item.name == "提现") {
                if (!this.isTest()) return
            }
            if (item.name == "网络状态") {
                this.$refs.network[0].open()
                return
            }
            if (item.name == '提现' || item.name == '免提直充') {
                if (this.status == 2) {
                    this.$refs.confirm.open()
                    return false
                } else if (this.status == 3) {
                    uni.navigateTo({
                        url: "/pages/user/bank/bind"
                    })
                    return false
                } else if (this.status == 0) {
                    return false
                }
            }
            let url = item.url
            uni.navigateTo({
                url: url
            })
        },
        refresh() {
            this.isEnd1 = false
            this.isEnd2 = false
            this.isRef = true
            this.getUserVipSpeed()
            this.$store.dispatch("appInfoStoreInit");
            setTimeout(() => {
                this.isRef = false;
            }, 1000)
        },
        cancel() {
            this.$refs.confirm.close()
        },
        confirm() {
            this.cancel()
            uni.navigateTo({
                url: "/pages/user/pwd/set_pwd"
            })
        }
    }
}
</script>
  
<style lang="scss" scoped>
.wallet-box {
    height: var(--vh);
    background: #f6f6f6;
    font-family: 'PingFang SC';
    font-style: normal;

    .config {
        display: flex;

        .text {
            font-weight: 400;
            font-size: 28rpx;
            color: #FFFFFF;
            margin-right: 10rpx;
        }

        .icon-text {
            font-size: 40rpx !important;
            color: #FFFFFF !important;
        }
    }

    .top-box {
        height: 376rpx;
        background: linear-gradient(180deg, #1794FF 0%, #3290E1 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30rpx 0 40rpx;
        box-sizing: border-box;
        z-index: 1;

        .tag-box {
            position: relative;
            display: flex;
            padding: 0 48rpx;

            .tag-item {
                width: 50%;
                display: flex;
                justify-content: center;
                align-items: center;

                text {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    padding: 3rpx 10rpx;
                    width: 148rpx;
                    height: 51rpx;
                    background: #FCBF0A;
                    border-radius: 50rpx;
                    color: #FFFFFF;
                }

                .recycle {
                    background: #04A29A;
                }
            }

            .user-box {
                display: flex;
                align-items: center;

                .avatar {
                    margin-right: 29.5rpx;

                    image {
                        height: 110rpx;
                        width: 110rpx;
                        border-radius: 20rpx;
                    }
                }

                .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;

                    .nickname {
                        font-weight: 400;
                        font-size: 28rpx;
                        color: #FFFFFF;
                        display: flex;
                        align-items: center;
                        line-height: 1;
                    }

                    .vip-details {
                        display: flex;
                        align-items: center;
                        height: 68rpx;
                        padding: 20rpx 0;

                        .level-name {
                            height: 100%;
                            line-height: 34rpx;
                            background: #FFBF00;
                            border-radius: 5rpx;
                            font-size: 22rpx;
                            color: #FFFFFF;
                            padding: 0 10rpx;
                            margin-right: 10rpx;
                            display: grid;
                            place-content: center;
                        }

                        .content {
                            flex: 1;

                            .title {
                                font-size: 28rpx;
                                color: #fff;
                                font-weight: 300;

                                .vip {
                                    font-weight: 600;
                                    color: #FCBF0A;
                                }
                            }


                            .num {
                                width: 360rpx;
                                height: 24rpx;
                                margin-top: 10rpx;
                                position: relative;
                                overflow: hidden;
                                font-size: 24rpx;
                                color: #04A29A;
                                background: #DDDDDD;
                                border-radius: 20rpx;
                                display: grid;
                                place-content: center;
                                line-height: 1;

                                &::before {
                                    content: '';
                                    transition: all 5s;
                                    position: absolute;
                                    left: 0;
                                    background: #04A29A;
                                    width: var(--vip-num-width);
                                    height: 100%;
                                    border-radius: 20rpx;
                                    z-index: 1;
                                }

                                .num-text {
                                    z-index: 2;
                                }
                            }

                            .text-fff {
                                color: #fff;
                            }
                        }
                    }

                    .invite-code {
                        font-weight: 500;
                        font-size: 24rpx;
                        display: flex;
                        align-items: center;
                        color: #FFFFFF;
                    }
                }
            }
        }

        .balance-box {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .money-box {
                display: flex;
                flex-direction: column;
                align-items: center;

                .money-text {
                    height: 60rpx;
                    position: relative;

                    .text {
                        font-weight: 500;
                        font-size: 42rpx !important;
                        line-height: 59rpx;
                        text-align: center;
                        color: #FFFFFF !important;
                        display: inline-flex;
                    }

                    .img {
                        margin-left: 50rpx;
                        position: absolute;
                        top: 10rpx;

                        image {
                            height: 40rpx;
                            width: 40rpx;
                        }
                    }
                }

                .money-desc {
                    font-weight: 500;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }
    }

    .list-content {
        height: calc(100% - 576rpx);
        overflow: auto;
    }

    .show-tabBar {
        height: calc(100% - 476rpx);
    }

    .list-row {
        display: flex;
        height: 120rpx;
        margin-top: 18rpx;
        background: #FFFFFF;

        .list-item {
            display: flex;
            width: 230rpx;
            justify-content: center;
            align-items: center;

            image {
                height: 40rpx;
                width: 60rpx;
                margin-right: 14rpx;
            }

            .name {
                font-weight: 400;
                font-size: 28.5rpx;
                color: #222222;
            }

            &:last-child {
                width: 290rpx;
            }
        }
    }

    .list-box {
        display: flex;
        flex-wrap: wrap;
        background: #FFFFFF;
        margin-top: 20rpx;

        .list-col {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 140rpx;
            position: relative;
            border-bottom: 1px solid #F3F3F3;

            image {
                height: 40rpx;
                width: 40rpx;
                margin-right: 38rpx;
            }

            .text-box {
                width: 65%;

                .name {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #222222;
                    display: flex;
                    white-space: nowrap;
                    align-items: flex-end;

                    .year {
                        color: #FF0000;
                        margin-left: 10rpx;
                        font-size: 20rpx;
                    }

                    .hot {
                        margin-left: 20rpx;
                        color: #C40404;
                    }
                }

                .desc {
                    margin-top: 10rpx;
                    font-weight: 400;
                    font-size: 22rpx;
                    color: #8A8A8A;
                    display: flex;
                    gap: 10rpx;
                }

                .line-name {
                    color: #8A8A8A;
                }

                .blue-text {
                    color: #0089FF;
                }

                .green-text {
                    color: #5ac54c;
                }

                .orange-text {
                    color: #ff7010;
                }

                .red-text {
                    color: #ff0000;
                }
            }

            .line {
                width: 1px;
                height: 75rpx;
                background: #dadada;
                position: absolute;
                right: 0;
            }
        }
    }

    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
        }

        25% {
            -webkit-transform: rotate(90deg);
        }

        50% {
            -webkit-transform: rotate(180deg);
        }

        75% {
            -webkit-transform: rotate(270deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    /*
    turn : 定义的动画名称
    1s : 动画时间
    linear : 动画以何种运行轨迹完成一个周期
    infinite :规定动画应该无限次播放
    */
    .run {
        animation: rotate 1s linear infinite;
    }

    .confirm-box {
        height: 339rpx;
        width: 540rpx;
        border-radius: 10rpx;
        padding: 20rpx 54rpx 20rpx 54rpx;

        .title {
            height: 80rpx;
            font-weight: 400;
            font-size: 32rpx;
            line-height: 80rpx;
            text-align: center;
            color: #9A9A9A;
            border-bottom: 2rpx solid #E6E6E6;
        }

        .notice {
            height: 160rpx;
            font-weight: 400;
            font-size: 28rpx;
            text-align: center;
            color: #333333;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .btn-box {
            display: flex;
            color: #FFFFFF;
            font-weight: 400;
            font-size: 26rpx;

            .cancel-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 60rpx;
                width: 200rpx;
                border-radius: 264rpx;
                padding: 10rpx 74rpx;
                background: #8CB2C9;
                margin-right: 20rpx;
            }

            .confirm-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 60rpx;
                width: 200rpx;
                border-radius: 264rpx;
                padding: 10rpx 74rpx;
                background: #FF9900;
                margin-left: 20rpx;
            }
        }
    }

    .upgrade-modal {
        width: 540rpx;
        padding: 0 10rpx;

        .title {
            font-size: 32rpx;
            line-height: 40rpx;
            text-align: center;
            color: #9A9A9A;
            border-bottom: 1px solid #9A9A9A;
            padding: 20rpx 0;
        }

        .content {
            height: 180rpx;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #333333;
            display: grid;
            place-content: center;
        }

        .btn {
            width: 300rpx;
            border-radius: 100rpx;
            background: #FF9900;
            color: #fff;
            margin-bottom: 20rpx;
        }
    }
}
</style>