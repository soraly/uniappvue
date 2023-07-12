<template>
  <view class="catroy">
    <view class="list-row">
      <uni-section class="mb-10" :title="data.name" :decorationPadding="'7rpx 0px'" :titleColor="'#03536E'">
        <template v-slot:decoration>
          <view class="decoration"></view>
        </template>
        <template v-slot:right>
          <view class="label">最高人气</view>
        </template>
      </uni-section>
      <scroll-view class="scroll-y" scroll-x="true" scroll-left="120" @scrolltolower="loadMore"
        :scroll-with-animation="true">
        <view class="list-rol">
          <view class="item" v-for="(item, index) in list" @click="detail(item)">
            <image :src="item.logo"></image>
            <view class="text">{{ item.name }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { games } from "../../../utils/lottery/list";
import { enter } from "../../../utils/lottery/mine";
export default {
  name: "List",
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      isLoad: false,
      pageNo: 1,
      pageSize: 10,
      list: [],
    }
  },
  mounted() {
    this.getGameList()
  },
  methods: {
    loadMore() {
      if (!this.isLoad) {
        this.isLoad = true
        this.pageNo += 1;
        this.getGameList()
      }
    },
    getGameList() {
      let prams = {
        gameCategoryId: this.data.gameCategoryId,
        platformId: this.data.gamePlatformId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      pop("加载中...", 2000)
      games(prams).then(res => {
        if (res.result.records.length == 0) {
          pop("没有更多数据了...", 2000)
        } else {
          this.isLoad = false
        }
        this.list.push(...res.result.records)
      }).catch(err => {
        console.log(err)
      })
    },
    detail(item) {
      if (!isLogin()) {
        this.$emit("openLoginPop")
        return false
      }
      let userInfo = uni.getStorageSync('userInfo');
      if (userInfo.userType == "demo") {
        uni.$emit('showPop', { refName: 'AlertTestMsg', })
        return false
      }
      this.enterGame(item.code, item.platformId, item.platformCateId)
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
.mb-10 {
  .decoration {
    width: 10rpx;
    height: 30rpx;
    border-radius: 30rpx;
    margin-right: 10rpx;
    background-color: #FF9900;
  }
}

.list-row {
  padding: 0 20rpx;
  background: #ffffff;
  margin-bottom: 20rpx;
}

.label {
  width: 112rpx;
  height: 35rpx;
  background: #42AF99;
  border-radius: 50px;
  font-size: 18rpx;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-y {
  width: calc(100vw - 40rpx);
  max-width: calc(480px - 40rpx);
}

.list-rol {
  display: flex;

  .item {
    width: 120rpx;
    margin-right: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    image {
      height: 120rpx;
      width: 120rpx;
    }

    .text {
      width: 140rpx;
      font-weight: 400;
      font-size: 20rpx;
      text-align: center;
      color: #666666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>