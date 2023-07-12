<template>
    <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" @open="handleOpen" @close="handleClose">
        <view class="pop-box">
            <view class="top">
                <image class="img" src="/static/img/TryProfit.png" />
                <text class="content">你已盈利{{ data }}元，财源滚滚！成为正式用户，赚取第一桶金。</text>
            </view>
            <view class="btn-box">
                <view class="btn forget" @click="close">
                    继续试玩
                </view>
                <view class="btn retry" @click="confirm">
                    立即注册
                </view>
            </view>
        </view>
    </u-popup>
</template>
  
<script>

export default {
    name: "Betting",
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
            args: {},
            data: 0,
        }
    },
    methods: {
        open(data, args) {
            this.show = true
            this.data = data
            this.args = args
            this.callback = args.callback
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
        confirm() {
            this.$emit('confirm')
            this.args?.confirm && this.args.confirm()
            this.show = false
            uni.navigateTo({
                url: "/pages/liuhe/reg"
            })
        },
        close() {
            this.args?.close && this.args.close()
            this.show = false
        },
    }
}
</script>
  
<style lang="scss" scoped>
.pop-box {
    width: 630rpx;
    height: 463rpx;
    border-radius: 10rpx;
    background: #FFFFFF;
    padding: 64rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 30rpx;

    .top {
        display: flex;
        flex-direction: column;
        gap: 30rpx;
        align-items: center;

        .img {
            width: 118rpx;
            height: 130rpx;
        }

        .content {
            width: 400rpx;
            color: #666;
            text-align: center;
            font-size: 28rpx;
        }
    }

    .btn-box {
        height: 70rpx;
        display: flex;
        gap: 60rpx;

        .btn {
            text-align: center;
            font-size: 30rpx;
            display: grid;
            place-content: center;
            flex: 1;
            border-radius: 10rpx;
        }

        .forget {
            color: #999;
            border: 1px solid #999;
            background: #FFF;
        }

        .retry {
            background: #F25542;
            color: #fff;
        }
    }
}
</style>