<template>
    <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" @open="handleOpen" @close="handleClose">
        <view class="account-box">
            <view class="titles">{{ title }}</view>
            <view class="notice">
                {{ notice }}
                <view class="desc">{{ desc }}</view>
            </view>
            <view class="btn-box">
                <view class="cancel-btn" @click="detail">查看详情</view>
                <view class="account-btn" @click="close">我知道了</view>
            </view>
        </view>
    </u-popup>
</template>

<script>
import defaultTemplate from '../../../../utils/defaultTemplate'

export default {
    name: "Account",
    props: {
        zIndex: {
            type: [Number, String],
            default: () => {
                return 10075
            }
        }
    },
    data() {
        return {
            show: false,
            callback: null,
            title: '',
            notice: '',
            desc: '',
            detailUrl: ''
        }
    },
    methods: {
        open(data, { callback }) {
            this.show = true
            this.callback = callback

            const { title, msgTxt, msgRemark, createTime, msgId, source } = defaultTemplate({
                title: '',
                msgTxt: '',
                msgRemark: '',
                createTime: '',
                msgId: '',
                source: '',
            }, data)
            this.title = title
            this.notice = msgTxt
            this.desc = msgRemark
            this.detailUrl = `/pages/user/accountLog/detail?createTime=${createTime}&id=${msgId}&source=${source}`
        },
        close() {
            this.show = false
        },
        handleOpen() {
            this.$emit('open')
            this.callback && this.callback({
                type: 'open'
            })
        },
        handleClose() {
            this.$emit('close')
            this.callback && this.callback({
                type: 'close'
            })
        },
        detail() {
            uni.navigateTo({
                url: this.detailUrl,
                success: () => {
                    this.close()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.account-box {
    min-height: 339rpx;
    width: 540rpx;
    padding: 20rpx 54rpx 20rpx 54rpx;
    background: #fff;

    .titles {
        height: 80rpx;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 80rpx;
        text-align: center;
        color: #9A9A9A;
    }

    .notice {
        height: 160rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        display: flex;
        align-items: flex-start;
        flex-direction: column;

        .desc {
            font-weight: 400;
            font-size: 24rpx;
            color: #999999;
        }
    }

    .btn-box {
        display: flex;
        color: #FFFFFF;
        font-weight: 400;
        font-size: 30rpx;
        justify-content: center;
        margin-top: 24rpx;

        .cancel-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60rpx;
            width: 200rpx;
            border-radius: 264rpx;
            background: #8CB2C9;
            margin-right: 20rpx;
        }

        .account-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60rpx;
            width: 200rpx;
            border-radius: 264rpx;
            background: #FF9900;
            margin-left: 20rpx;
        }
    }
}
</style>