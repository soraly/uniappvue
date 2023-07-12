<template>
  <view class="one-box">
    <image mode="widthFix" v-for="(item, index) in data" :src="item.icon" @click="detail(item)"></image>
    <Maintain ref="maintain" />
  </view>
</template>

<script>
import { enter, gamePlatformUpholdInfo } from "../../../utils/lottery/mine";
import Maintain from "./Maintain";

export default {
  name: "OneItem",
  components: { Maintain },

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
        if (!isLogin()) {
          this.$emit("openLoginPop")
          return false
        }
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
.one-box {
  display: flex;
  justify-content: center;

  image {
    height: 160rpx;
    width: 100%;
  }
}
</style>