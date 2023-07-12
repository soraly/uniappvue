<template>
    <view class="ptp-promotion">
        <view class="item">
            <view class="line">
                <view class="name">分享网址</view>
            </view>
            <view class="link">
                <view class="name">我的链接</view>
                <view class="input">
                    <view class="text">{{ linkText }}</view>
                    <image class="img" mode="widthFix" src="/static/img/ptp/copy.png"
                        @click="copyText(getAddress + linkText)" />
                </view>
            </view>
            <view class="qr-code">
                <view class="code">
                    <uqrcode size="150" sizeUnit="rpx" class="code" ref="uqrcode" canvas-id="qrcode"
                        :value="getAddress + linkText" v-if="promotionData.channel.address">
                    </uqrcode>
                </view>
                <image class="img" mode="widthFix" src="/static/img/ptp/mobile.png" />
                <image class="img" mode="widthFix" src="/static/img/ptp/telegram.png" />
                <image class="img" mode="widthFix" src="/static/img/ptp/line.png" />
            </view>
            <view class="save" @click="saveQrCode">点击保存</view>
        </view>
        <view class="item">
            <view class="line">
                <view class="name blue">佣金</view>
                <view class="more">
                    更多<u-icon class="icon" name="arrow-right"></u-icon>
                </view>
            </view>
            <view class="line">
                <view class="name">累计佣金</view>
                <view class="num yellow">
                    0.00
                </view>
            </view>
            <view class="line">
                <view class="name">已领取佣金</view>
                <view class="num yellow">
                    0.00
                </view>
            </view>
            <view class="line">
                <view class="name">上次佣金</view>
                <view class="num yellow">
                    0.00
                </view>
            </view>
        </view>
        <view class="item">
            <view class="line">
                <view class="name">佣金</view>
                <view class="more">
                    更多<u-icon name="arrow-right"></u-icon>
                </view>
            </view>
            <view class="line">
                <view class="name">团队总数</view>
                <view class="num">
                    0人
                </view>
            </view>
            <view class="line">
                <view class="name">直属成员</view>
                <view class="num">
                    0人
                </view>
            </view>
            <view class="line">
                <view class="name">其他成员</view>
                <view class="num">
                    0人
                </view>
            </view>
            <view class="line">
                <view class="name">总业绩</view>
                <view class="num">
                    0.00
                </view>
            </view>
            <view class="line">
                <view class="name">直属业绩</view>
                <view class="num">
                    0.00
                </view>
            </view>
            <view class="line">
                <view class="name">其他业绩</view>
                <view class="num">
                    0.00
                </view>
            </view>
        </view>
        <view class="item">
            <view class="line">
                <view class="name">团队数据</view>
                <view class="more">
                    更多<u-icon name="arrow-right"></u-icon>
                </view>
            </view>
            <view class="line">
                <view class="name">总充值</view>
                <view class="num">
                    0.00
                </view>
            </view>
            <view class="line">
                <view class="name">总有效投注</view>
                <view class="num">
                    0.00
                </view>
            </view>
            <view class="line">
                <view class="name">总输赢</view>
                <view class="num yellow">
                    0.00
                </view>
            </view>
        </view>
    </view>
</view></template>
<script>
import { myPromotion } from "@/utils/ptp";
import defaultTemplate from '@/utils/defaultTemplate'
export default {
    data() {
        return {
            promotionData: {
                inviteCode: '',
                channel: {
                    address: ''
                }
            }
        }
    },
    computed: {
        linkText() {
            return '/?inviteCode=' + this.promotionData.inviteCode
        },
        getAddress() {
            return this.promotionData.channel.address
        }
    },
    mounted() {
        this.shareToFriends()
    },
    methods: {
        copyText(text) {
            uni.setClipboardData({ data: text });
        },
        saveQrCode() {
            this.$refs.uqrcode.save();
        },
        shareToFriends() {
            myPromotion().then(res => {
                if (res.code === 200) {
                    this.promotionData = defaultTemplate({
                        inviteCode: '',
                        channel: {
                            address: (val) => {
                                if (val) {
                                    return val.replace(/([\w\W]+)\/$/, "$1") + '/#'
                                }
                                //#ifdef H5
                                if (!val) {
                                    val = window.location.host + '/#/pages/liuhe/reg'
                                }
                                //#endif
                                return val || ''
                            }
                        }
                    }, res.result)
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.ptp-promotion {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .item {
        background: #FFFFFF;
        border-radius: 10rpx;

        .line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 23rpx 20rpx;
            border-bottom: 1px solid #DDDDDD;

            .name {
                font-size: 24rpx;
                color: #666666;
            }

            .blue {
                color: #1794FF;
            }

            .yellow {
                color: #FDA200;
            }

            .more {
                font-size: 20rpx;
                color: #1794FF;

                .icon {
                    color: #c9c9cd;
                }
            }
        }

        .link {
            display: flex;
            align-items: center;
            gap: 20rpx;
            padding: 23rpx 20rpx;

            .name {
                font-size: 20rpx;
                color: #666666;
            }

            .input {
                flex: 1;
                display: flex;
                border: 1px solid #DDDDDD;
                border-radius: 10px;
                padding: 21rpx 10rpx;

                .text {
                    flex: 1;
                    font-size: 20rpx;
                    color: #999999;
                }

                .img {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
        }

        .qr-code {
            display: flex;
            gap: 20rpx;
            align-items: center;
            padding: 23rpx 20rpx;

            .code {
                width: 150rpx;
                height: 150rpx;
            }

            .img {
                width: 60rpx;
                height: 60rpx;
            }
        }

        .save {
            margin: 0 20rpx 21rpx;
            width: 150rpx;
            height: 40rpx;
            background: #005DFE;
            border-radius: 0px 0px 10px 10px;
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #FFFFFF;
            text-align: center;
        }
    }
}
</style>