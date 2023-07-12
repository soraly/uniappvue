<template>
  <view class="lottery-list">
    <uni-section v-show="isShow" class="mb-10" :title="title" :decorationPadding="'16rpx 0px'" :titleColor="'#666666'">
      <template v-slot:decoration>
        <view class="decoration"></view>
      </template>
    </uni-section>
    <uni-row class="row-box">
      <uni-col :span="12" class="row-col" v-for="(item, index) in data" :key="index">
        <view class="item-box">
          <image @click="detail(item)" :src="item.icon"></image>
          <uni-col :span="14" class="item-right">
            <view @click="detail(item)" class="name" :class="{ 'name-small': item.bigType == 2 }">{{ item.name }}</view>
            <view @click="detail(item)" class="desc" :class="{ 'desc-big': item.bigType == 2 }">{{ item.content }}</view>
          </uni-col>
        </view>
        <view class="label-box">
          <image v-if="item.isLive" class="live" src="../../../static/img/liuhe/index/live.png"></image>
          <image v-if="item.isOpen" class="kaijiang" src="../../../static/img/liuhe/index/open.png"></image>
        </view>
      </uni-col>
    </uni-row>
    <Maintain ref="maintain" />
  </view>
</template>

<script>
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import { enter, gamePlatformUpholdInfo } from "../../../utils/lottery/mine";
import Maintain from "./Maintain";
export default {
  name: "LotteryList",
  components: { UniCol, UniRow, Maintain },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
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
        let url = this.$config.gameRouterMgr.getJumpRouteByType(item.lotteryTypeId, item.lotteryId, item.isLive);
        uni.navigateTo({ url: url })
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
            res.eventChannel.emit('argParams', {
              id: that.id
            })
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
.lottery-list {
  font-family: 'PingFang SC';
  background: #fff;
  border-radius: 10rpx;
  overflow: hidden;

  .row-box {
    .row-col {
      height: 140rpx;
      border-bottom: 2rpx solid #DDDDDD;
      position: relative;

      .item-box {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 10rpx;
        justify-content: space-between;
        padding: 0 12rpx;

        image {
          height: 110rpx;
          width: 110rpx;
        }

        .item-right {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .name {
            font-style: normal;
            font-weight: 400;
            font-size: 26rpx;
            line-height: 34rpx;
            color: #222222;
          }

          .name-small {
            font-size: 16rpx;
            color: #000000;
          }

          .desc {
            font-style: normal;
            font-weight: 400;
            font-size: 20rpx;
            line-height: 28rpx;
            color: #999999;
            width: 90%;
          }

          .desc-big {
            font-size: 24rpx;
            color: #222222;
          }
        }
      }

      .label-box {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        height: 22rpx;
        width: 132rpx;

        .live {
          width: 66rpx;
          height: 22rpx;
        }

        .kaijiang {
          width: 80rpx;
          height: 22rpx;
        }
      }
    }
  }

  .mb-10 {
    background: none;

    .decoration {
      width: 10rpx;
      height: 24rpx;
      border-radius: 30rpx;
      margin-right: 20rpx;
      background-color: #FF9900;
    }
  }
}
</style>
