<template>
    <u-popup v-model="show" mode="left">
        <view class="header" @click="toHomePage">
            返回首页
            <image class="img" mode="widthFix" src="/static/img/liuhe/shouzhi.png" />
        </view>
        <u-collapse accordion>
            <u-collapse-item :open="item.open" v-for="(item, index) in itemList" :key="index">
                <template #title>
                    <view class="title">
                        <view class="left-bar"></view>{{ item.typeName }}
                    </view>
                </template>
                <view class="body">
                    <view class="item" :class="{ checked: lottery.lotteryId == lotteryId }"
                        v-for="(lottery, i) in item.lotteries" :key="i" @click="detail(lottery)">
                        {{ lottery.name }}
                    </view>
                </view>
            </u-collapse-item>
        </u-collapse>
    </u-popup>
</template>

<script>
import { categoryData } from "../../../utils/lottery/betting";
import defaultTemplate from "../../../utils/defaultTemplate";
export default {
    props: {
        lotteryId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            show: false,
            itemList: [],
        }
    },
    mounted() {
        this.getCategoryData()
    },
    methods: {
        open() {
            this.show = true
        },
        toHomePage() {
            let delta = getCurrentPages().length
            if (delta > 1) {
                uni.navigateBack({
                    delta
                })
            } else {
                uni.reLaunch({
                    url: '/pages/liuhe/index'
                })
            }
        },
        getCategoryData() {
            let prams = {
                categoryId: 2
            };
            const data = uni.getStorageSync('leftMenuData') || []
            if (data.length) {
                this.itemList = data
            }
            categoryData(prams).then(res => {
                if (res.code == 200) {
                    const data = defaultTemplate([
                        {
                            typeName: "",
                            lotteries: [
                                {
                                    lotteryId: '',
                                    name: "",
                                    lotteryTypeId: 4,
                                    isLive: '',
                                    jumpType: '',
                                    lotteryTypeId: ''
                                },
                            ]
                        },
                    ], res.result)
                    data.forEach(item => {
                        item.lotteries.forEach(lottery => {
                            if (lottery.lotteryId === this.lotteryId) {
                                item.open = true
                            }
                        });
                    });
                    uni.setStorageSync('leftMenuData', data)
                    this.itemList = data
                }
            }).catch(err => {
                console.log(err)
            })
        },
        detail(item) {
            const that = this
            if (item.jumpType == 1) {
                uni.setStorageSync('lotteryNameTitle', { title: item.name });
                let url = this.$config.gameRouterMgr.getJumpRouteByType(item.lotteryTypeId, item.lotteryId, item.isLive);
                // if (item.lotteryTypeId == 4) {
                //     let isLive = item.isLive != false && item.isLive != "false" ? 1 : 0;
                //     url = '/pages/liuhe/liuhePlaying?id=' + item.lotteryId + "&isLive=" + isLive
                // } else if (item.lotteryTypeId == 29) {
                //     url = '/pages/liuhe/airship?id=' + item.lotteryId
                // } else if (item.lotteryTypeId == 28) {
                //     url = '/pages/liuhe/kuaisan?id=' + item.lotteryId
                // } else {
                //     url = '/pages/liuhe/shishicai?id=' + item.lotteryId
                // }
                uni.navigateTo({ url: url })
            } else if (item.jumpType == 2) {
                let prams = {
                    platformId: item.gamePlatformId
                };
                gamePlatformUpholdInfo(prams).then(res => {
                    if (res.result.upholdStatus == 1) {
                        this.$refs.maintain.openMaintain(res.result)
                        return false
                    }
                    this.enterGame(item.gameCode, item.gamePlatformId, item.platformCateId)
                }).catch(err => {
                    console.log(err)
                })
            } else {
                uni.navigateTo({
                    url: item.jumpUrl,
                    success: function (res) {
                        res.eventChannel.emit('argParams', {
                            id: that.id
                        })
                    }
                })
            }
        },
    }
} 
</script>

<style lang="scss" scoped>
.header {
    padding: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    width: 500rpx;
    background: linear-gradient(180deg, #1794FF 0%, #1794FF 0.01%, #1794FF 21.88%, #0089FF 100%);
    font-size: 30rpx;
    color: #FFFFFF;

    .img {
        width: 33rpx;
        height: 40rpx;
    }
}

.title {
    font-size: 26rpx;
    color: #666666;
    padding: 0 50rpx;
    display: flex;
    align-items: center;

    .left-bar {
        width: 10rpx;
        height: 24rpx;
        background: #FF9900;
        border-radius: 30rpx;
        margin-right: 20rpx;
    }
}

.body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding: 20rpx;

    .item {
        width: 100%;
        height: 80rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
            0rpx 0rpx 1rpx 0rpx rgba(0, 0, 0, 0.10),
            0rpx 2rpx 2rpx 0rpx rgba(0, 0, 0, 0.09),
            0rpx 4rpx 2rpx 0rpx rgba(0, 0, 0, 0.05),
            0rpx 7rpx 3rpx 0rpx rgba(0, 0, 0, 0.01),
            0rpx 11rpx 3rpx 0rpx rgba(0, 0, 0, 0.00);
        border-radius: 10px;
        display: grid;
        place-content: center;
        font-size: 20rpx;
        color: #666666;
    }

    .checked {
        background: linear-gradient(180deg, #4FACFD 0%, #0089FF 100%);
        box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
            0rpx 0rpx 1rpx 0rpx rgba(0, 0, 0, 0.10),
            0rpx 2rpx 2rpx 0rpx rgba(0, 0, 0, 0.09),
            0rpx 4rpx 3rpx 0rpx rgba(0, 0, 0, 0.05),
            0rpx 7rpx 3rpx 0rpx rgba(0, 0, 0, 0.01),
            0rpx 12rpx 3rpx 0rpx rgba(0, 0, 0, 0.00);
        color: #fff;
    }
}
</style>