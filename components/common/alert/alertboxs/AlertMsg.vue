<template>
  <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" @open="handleOpen" @close="handleClose">
    <view class="pop-box">
      <view class="notice">{{ data.title }}</view>
      <view class="top">
        <text>{{ data.content }}</text>
      </view>
      <view class="btn-box">
        <view class="forget" @click="close">
          <view class="cancel-btn">
            取消
          </view>
        </view>
        <view class="retry" @click="confirm">
          <view class="cancel-btn">
            确认
          </view>
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
      data: {
        title: '提示',
        content: '您还没有登录账号，\n是否立即前往登录？'
      },
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
  width: 540rpx;
  border-radius: 10rpx;
  background: #FFFFFF;
  font-family: 'PingFang SC';

  .notice {
    font-weight: 400;
    font-size: 32rpx;
    text-align: center;
    color: #9A9A9A;
    padding: 20rpx 0;
    margin: 0 17.5rpx;
    border-bottom: 1px solid #E6E6E6;
  }

  .top {
    height: 215rpx;
    padding: 0 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-weight: 400;
    font-size: 28rpx;
    color: #000000;
  }

  .btn-box {
    height: 100rpx;
    display: flex;

    .forget {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      .cancel-btn {
        height: 60rpx;
        width: 200rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #8CB2C9;
        border-radius: 264rpx;
        font-size: 26rpx;
        text-align: center;
        color: #FFFFFF;
      }
    }

    .retry {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      .cancel-btn {
        height: 60rpx;
        width: 200rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #FF9900;
        border-radius: 264rpx;
        font-size: 26rpx;
        text-align: center;
        color: #FFFFFF;
      }
    }
  }
}
</style>