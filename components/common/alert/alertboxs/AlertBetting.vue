<template>
    <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" @open="handleOpen" @close="handleClose">
        <view class="rewards-content">
            <view class="close" @click="close"></view>
            <view class="rewards-title">
                恭喜您在{{ playName }}
            </view>
            <view class="win">{{ setAmount(winAmount) }}</view>
        </view>
    </u-popup>
</template>

<script>
import Playing from '../../../../utils/common/playing';

import defaultTemplate from '../../../../utils/defaultTemplate'

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
            callback: null,
            playing: new Playing(),
            playName: '',
            winAmount: '',
        }
    },
    methods: {
        open(data, { callback }) {
            // 收到弹窗消息 判断是否可以显示
            if (data.source === 3 && this.playing.getStorage('isWin')) {
                this.show = true
                this.callback = callback

                let obj = JSON.parse(data.msgTxt);
                const { playName, winAmount } = defaultTemplate({
                    playName: '',
                    winAmount: '',
                }, obj)
                this.playName = playName
                this.winAmount = winAmount
                // 3秒自动关闭
                setTimeout(() => {
                    this.close()
                }, 3000)
            }
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
        setAmount(num) {
            return this.playing.setAmount(num, 2, '.', ',')
        },
    }
}
</script>

<style lang="scss" scoped>
/deep/ .u-mode-center-box {
    background-color: unset;
}

.rewards-content {
    background-image: url("./../../../../static/img/liuhe/rewards.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 750rpx;
    max-width: 480px;
    height: 719rpx;
    position: relative;

    .rewards-title {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 288rpx;
        color: #FFFFFF;
        font-size: 36rpx;
    }

    .status {
        font-weight: 500;
        font-size: 50rpx;
        color: #FFFFFF;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 300rpx;
    }

    .win {
        font-size: 56rpx;
        color: #FFFE99;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 460rpx;
    }

    .close {
        width: 54rpx;
        height: 54rpx;
        background-image: url("./../../../../static/img/liuhe/rewards-close.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 80rpx;
        top: 80rpx;
    }
}
</style>