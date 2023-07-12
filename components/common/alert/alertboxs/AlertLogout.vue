<template>
    <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" @open="handleOpen" @close="handleClose">
        <view class="logout">
            <view class="img">
                <image src="/static/img/liuhe/err.png"></image>
            </view>
            <view class="msg">
                {{ msg }}
            </view>
            <view class="btn" @click="close">
                我已知晓
            </view>
        </view>
    </u-popup>
</template>

<script>
import defaultTemplate from '../../../../utils/defaultTemplate'

export default {
    name: "Logout",
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
            msg: '',
        }
    },
    methods: {
        open(data, { callback }) {
            this.show = true
            this.callback = callback

            console.log('data', data);
            const { msgTxt } = defaultTemplate({ msgTxt: '', }, data)
            this.msg = msgTxt
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
    }
}
</script>

<style lang="scss" scoped>
.logout {
    height: 464rpx;
    width: 620rpx;
    border-radius: 10rpx;
    background: #FFFFFF;

    .img {
        display: flex;
        justify-content: center;
        align-items: center;

        image {
            height: 121rpx;
            width: 121rpx;
            margin-top: 43rpx;
        }
    }

    .msg {
        margin: 33rpx 30rpx 40rpx 30rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
    }

    .btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: auto;
        width: 240rpx;
        height: 70rpx;
        background: #F25542;
        border-radius: 10rpx;
        font-weight: 500;
        font-size: 30rpx;
        line-height: 70rpx;
        text-align: center;
        color: #FFFFFF;
    }
}
</style>