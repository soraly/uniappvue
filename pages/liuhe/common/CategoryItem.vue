<template>
    <view>
        <view class="list-item">
            <image class="image" mode="heightFix" :src="item.logo" @click.stop="detail(item)"></image>
            <view class="name">{{ item.name }}</view>
            <image v-if="isShow && item.collectStatus == 0" @click="collect(item)" class="collect"
                src="/static/img/liuhe/list/nsc.png"></image>
            <image v-if="isShow && item.collectStatus == 1" @click="collect(item)" class="collect"
                src="/static/img/liuhe/list/ysc.png"></image>
        </view>
        <Maintain ref="maintain" />
    </view>
</template>

<script>
import Maintain from "./Maintain";
import {
    gameCollect
} from "../../../utils/lottery/list";
import {
    enter,
    gamePlatformUpholdInfo
} from "../../../utils/lottery/mine";
export default {
    components: {
        Maintain,
    },
    data() {
        return {

        }
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: {}
        }
    },
    methods: {
        detail(item) {
            console.log('item', item);
            if (item.type == 1) {
                uni.setStorageSync('lotteryNameTitle', { title: item.name });
                let url = this.$config.gameRouterMgr.getJumpRouteByType(item.data.lotteryTypeId, item.data.lotteryId);
                uni.navigateTo({ url: url })
                return
            }
            if (!isLogin()) {
                uni.$emit('showPop', {
                    refName: 'AlertMsg',
                    data: {
                        title: '提示',
                        content: '您还没有登录账号，\n是否立即前往登录？'
                    },
                    confirm: () => {
                        uni.navigateTo({
                            url: "/pages/liuhe/login"
                        })
                    },
                })
                return false
            }
            let userInfo = uni.getStorageSync('userInfo');
            if (userInfo.userType == "demo") {
                uni.$emit('showPop', { refName: 'AlertTestMsg', })
                return false
            }

            let prams = {
                platformId: item.platformId
            };
            gamePlatformUpholdInfo(prams).then(res => {
                if (res.result.upholdStatus == 1) {
                    this.$refs.maintain.openMaintain(res.result)
                    return false
                }
                this.enterGame(item.code, item.platformId, item.platformCateId)
            }).catch(err => {
                console.log(err)
            })
        },
        enterGame(gameCode, platformId, platformCateId) {
            let prams = {
                gameCode: gameCode,
                platformId: platformId,
                platformCateId: platformCateId
            }
            enter(prams).then(res => {
                if (res.code == 200) {
                    uni.navigateTo({
                        url: '/pages/webview/game?platformId=' + platformId + '&url=' + encodeURIComponent(res.result) + '&backPath=' + this.$route.path,
                        success: function (res) {
                            res.eventChannel.emit('argParams', {})
                        }
                    })
                } else {
                    pop(res.message, 2000)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        collect(item) {
            let prams = {
                gameId: item.id
            }
            gameCollect(prams).then(res => {
                item.collectStatus = res.result ? 1 : 0
                this.$emit('collectSuccess')
            }).catch(err => {
                console.log(err)
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.list-item {
    display: inline-block;
    text-align: center;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
        0rpx 1rpx 2rpx 0rpx rgba(0, 0, 0, 0.10),
        0rpx 4rpx 4rpx 0rpx rgba(0, 0, 0, 0.09),
        0rpx 9rpx 5rpx 0rpx rgba(0, 0, 0, 0.05),
        0rpx 15rpx 6rpx 0rpx rgba(0, 0, 0, 0.01),
        0rpx 24rpx 7rpx 0rpx rgba(0, 0, 0, 0.00);
    border-radius: 10px;
    width: 170rpx;
    height: 217rpx;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .name {
        width: 100%;
        max-width: 170rpx;
        text-align: center;
        font-weight: 400;
        font-size: 22rpx;
        color: #222222;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .image {
        width: 100%;
        height: 170rpx;
        border-radius: 20rpx;
    }

    .collect {
        height: 40rpx;
        width: 40rpx;
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>