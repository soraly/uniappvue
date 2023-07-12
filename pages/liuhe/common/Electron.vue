<template>
  <view class="list-box">
    <view class="list-item" v-for="(item, index) in data" @click="detail(item)">
      <view class="img">
        <image :src="item.icon"></image>
      </view>
      <view class="title">{{ item.name }}</view>
    </view>
  </view>
</template>

<script>
import { enter } from "../../../utils/lottery/mine";
export default {
  name: "Electron",
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
      console.log(1111)
      if (!isLogin()) {
        this.$emit("openLoginPop")
        return false
      }
      this.enterGame(item.gameCode, item.gamePlatformId, item.platformCateId)
      const that = this
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
.list-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10rpx;

  .list-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10rpx;

    .img {
      image {
        height: 160rpx;
        width: 160rpx;
      }
    }

    .title {
      font-weight: 400;
      font-size: 26rpx;
      text-align: center;
      color: #222222;
    }
  }
}</style>