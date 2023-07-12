<template>
  <view class="four-box">
    <view class="row-box">
      <view class="item" v-for="(item, index) in data" :key="index">
        <view class="img-box">
          <image class="img" mode="widthFix" style="display: flex;" :src="item.icon" @click="detail(item)"></image>
        </view>
        <view class="text">{{ item.name }}</view>
      </view>
    </view>
    <Maintain ref="maintain" />
  </view>
</template>

<script>
import Maintain from "./Maintain";
import { enter, gamePlatformUpholdInfo } from "../../../utils/lottery/mine";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";

export default {
  name: "FourItem",
  components: { UniCol, UniRow, Maintain },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    detail(item) {
      const that = this
      if (item.jumpType == 1) {
        uni.setStorageSync('lotteryNameTitle', { title: item.name });
        if (item.lotteryTypeId == 4) {
          let isLive = item.isLive ? 1 : 0
          uni.navigateTo({
            url: '/pages/liuhe/liuhePlaying?id=' + item.lotteryId + "&isLive=" + isLive,
            success: function (res) {
              res.eventChannel.emit('argParams', {
                id: that.id
              })
            }
          })
        } else {
          uni.navigateTo({
            url: '/pages/liuhe/shishicai?id=' + item.lotteryId,
            success: function (res) {
              res.eventChannel.emit('argParams', {
                id: that.id
              })
            }
          })
        }
      } else if (item.jumpType == 2) {
        if (!isLogin()) {
          this.$emit("openLoginPop")
          return false
        }
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
            res.eventChannel.emit('argParams', item)
          }
        })
      }
    },
    enterGame(gameCode, platformId, platformCateId) {
      let prams = {
        gameCode: gameCode,
        platformId: platformId,
        platformCateId: platformCateId
      }
      console.log(prams);
      enter(prams).then(res => {
        if (res.code == 200) {
          uni.navigateTo({
            url: '/pages/webview/game?platformId=' + platformId + '&url=' + res.result + '&backPath=' + this.$route.path,
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
    }
  }
}
</script>

<style lang="scss" scoped>
.four-box {

  .row-box {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .item {
      flex: 1;
      border-radius: 10px;
      background: #EFF6FE;
      box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
        0rpx 1rpx 2rpx 0rpx rgba(0, 0, 0, 0.10),
        0rpx 4rpx 4rpx 0rpx rgba(0, 0, 0, 0.09),
        0rpx 9rpx 5rpx 0rpx rgba(0, 0, 0, 0.05),
        0rpx 15rpx 6rpx 0rpx rgba(0, 0, 0, 0.01),
        0rpx 24rpx 7rpx 0rpx rgba(0, 0, 0, 0.00);
      ;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      padding-bottom: 10rpx;
      background: #fff;
      width: 162.5rpx;
      height: 212.5rpx;

      .img-box {
        flex: 1;
        width: 100%;
        display: grid;
        place-content: center;
        border-radius: 20rpx;
        overflow: hidden;

        .img {
          width: 162.5rpx;
        }
      }

      .text {
        color: #222;
        font-size: 24rpx;
      }
    }
  }
}
</style>