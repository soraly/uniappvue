<template>
  <view class="v-platform">
    <view class="van-overlay" style="z-index: 101;">
      <view class="platform-row" @click="close">
        <view class="v-platform-list">
          <view class="item" :class="{ act: lotteryType == item.lotteryType }" v-for="(item, index) in list" :key="index"
            @click.stop="cutover(item)">
            <view class="title">{{ item.lotteryName }}</view>
            <view class="text">下期开奖时间</view>
            <view class="text">{{ item.lotteryTime }}</view>
          </view>
        </view>
        <view class="platform-btn">
          <view class="btn-item" @click.stop="confirm">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { lotteryTime } from '../../../utils/lottery/index'
export default {
  name: "setLottery",
  mounted() {
    this.lotteryTime()
  },
  data() {
    return {
      list: [],
      lotteryType: uni.getStorageSync('lotteryType') || 1
    }
  },
  methods: {
    lotteryTime() {
      let prams = {}
      lotteryTime(prams).then(res => {
        this.list = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    cutover(item) {
      this.lotteryType = item.lotteryType
    },
    close() {
      this.$emit('showLottery')
    },
    confirm() {
      uni.setStorageSync('lotteryType', this.lotteryType);
      this.$emit('showLottery')
    }
  }
}
</script>

<style lang="scss" scoped>
.v-platform {
  .van-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: var(--vh);

    .platform-row {
      background-color: rgba(0, 0, 0, 0.7);
      display: block;
      height: var(--vh);
      width: 100%;
      max-width: 480px;
      margin: auto;

      .v-platform-list {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .item {
          background-color: #e7e4e7;
          margin-bottom: 20rpx;
          border-radius: 8rpx;
          line-height: 40rpx;
          padding-bottom: 30rpx;
          text-align: center;
          width: 400rpx;

          .title {
            font-weight: 700;
            font-size: 36rpx;
            padding: 20rpx 0 10rpx 0;
          }

          .text {
            font-size: 26rpx;
          }
        }

        .act {
          background-color: #07c160;
          color: #fff;
          width: 420rpx;
          margin-left: -10rpx;
        }
      }
    }
  }

  .platform-btn {
    color: #fff;
    position: fixed;
    height: 70rpx;
    line-height: 70rpx;
    bottom: 100rpx;
    border-radius: 30rpx;
    text-align: center;
    font-size: 32rpx;
    width: 100%;
    max-width: 480px;

    .btn-item {
      background-color: #07c160;
      width: 80%;
      margin: auto;
      border-radius: 30rpx;
    }
  }
}</style>