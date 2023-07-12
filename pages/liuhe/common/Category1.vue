<template>
  <view class="category">
    <view class="data-box" :class="{ isHeight: isHeight }">
      <scroll-view scroll-y="true" class="menu" :class="{ isTop: isTop }" :style="{ marginTop: safeHeight }">
        <view class="menu-item" @click="recommend()">
          <view class="text">本站推荐</view>
        </view>
        <view class="menu-item" v-for="(item, index) in data" @click="selectData(item, index)"
          :class="{ active: curr == index }">
          <view class="text">{{ item.name }}</view>
        </view>
        <view class="height-null"></view>
      </scroll-view>
      <!-- @touchend="onScrollPanelTouchEnd" -->
      <scroll-view :scroll-y="true" :scroll-top="scrollPointY" :scroll-with-animation="false" lower-threshold="80"
        @scrolltolower="loadMore" @scroll="onCommentScroll" @touchend="onScrollPanelTouchEnd"
        @touchstart="onScrollPanelTouchBegin" @touchmove.stop="" :class="`list ${isTop ? 'top' : ''}`">
        <view class="list-item" v-for="(item, index) in list">
          <image :src="item.logo" @click.stop="detail(item)"></image>
          <view class="name">{{ item.name }}</view>
          <image v-if="isShow && item.collectStatus == 0" @click="collect(item)" class="collect"
            src="/static/img/liuhe/list/nsc.png"></image>
          <image v-if="isShow && item.collectStatus == 1" @click="collect(item)" class="collect"
            src="/static/img/liuhe/list/ysc.png"></image>
        </view>
      </scroll-view>
    </view>
    <Maintain ref="maintain" />
  </view>
</template>

<script>
import Maintain from "./Maintain";
import { gameListByPlatformCateId, gameCollect } from "../../../utils/lottery/list";
import { enter, gamePlatformUpholdInfo } from "../../../utils/lottery/mine";

export default {
  name: "Category",
  components: {
    Maintain
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    isTop: {
      type: Number,
      default: 0
    },
    isShow: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    gameCategoryId: {
      type: Number,
      default: 0
    }
  },


  watch: {
    data: {
      handler(newData, oldData) {
        this.reload()
      },
      immediate: true,
      deep: true
    },
    isTop(val) {
      console.log("now in top")
      if (val) {
        //this.scrolled=false;
      }

    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      platformCateId: 0,
      curr: 0,
      info: null,
      pageNo: 1,
      pageSize: 18,
      isLoadMore: false,
      isHeight: false,
      list: [],
      scrolled: false,
      scrollPointY: 0,
      isTopOnTouchStart: 0
    }
  },
  methods: {
    pageHeight() {
      if (!this.isTop) return "";
      let systemInfo = uni.getSystemInfoSync();
      let offset = systemInfo.screenHeight - systemInfo.windowHeight;
      let topHieght = 0;
      let style = `calc( var(--vh) - ${topHieght}px - ${offset}px - 92rpx - 60rpx )`;
      console.log("get page height :" + style);
      return style;
    },
    onCommentScroll(res) {
      if (!this.isTop) return;
      if (this.isLoadMore) return;
      this.scrolled = true;
      if (res.detail.scrollTop <= 0) {
        uni.showToast({
          icon: "none",
          title: "status:" + status
        })
        this.$emit("onChangeScrollStatu", 0);
      }
    },
    onScrollPanelTouchEnd() {
      if (this.isLoadMore) return;
      if (!this.isTop) return;
      if (!this.isTopOnTouchStart) return;
      uni.showToast({
        icon: "none",
        title: "onScrollPanelTouchEnd:" + this.scrolled
      })
      if (!this.scrolled) {
        this.$emit("onChangeScrollStatu", 0);
      }
    },
    onScrollPanelTouchBegin() {
      this.isTopOnTouchStart = this.isTop;
    },

    selectData(item, index) {
      this.curr = index
      this.info = item
      this.pageNo = 1
      this.list = []
      let prams = {
        platformId: item.gamePlatformId
      };
      this.isHeight = false
      if (item.gamePlatformId > 0) {
        gamePlatformUpholdInfo(prams).then(res => {
          if (res.result.upholdStatus == 1) {
            this.$refs.maintain.openMaintain(res.result)
            this.isLoadMore = true
            return false
          }
          this.getGameList()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.getGameList()
      }
    },
    top() {

    },
    reload() {
      this.isHeight = false
      if (this.data.length > 0) {
        this.curr = 0
        this.info = this.data[0]
      } else {
        this.list = []
        return false
      }
      let _this = this;
      this.pageNo = 1
      this.list = [];
      this.scrolled = false;
      this.getGameList();

      this.$nextTick(function () {
        _this.scrollPointY = 0;
      })
    },
    loadMore() {
      if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.pageNo += 1
        this.getGameList()
      }
    },
    getGameList() {
      let prams = {
        gameCategoryId: this.info.gameCategoryId,
        platformCateId: this.info.gamePlatformId,
        name: this.name,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.info.gameCategoryIds != null) {
        prams.gameCategoryIds = this.info.gameCategoryIds
      }
      pop("加载中...", 1000);
      gameListByPlatformCateId(prams).then(res => {
        this.isHeight = true
        this.list.push(...res.result.records)
        if (res.result.records.length > 0) {
          this.isLoadMore = false
        } else {
          pop("没有更多数据了....");
        }
      }).catch(err => {
        console.log(err)
      })
    },
    detail(item) {
      if (!isLogin()) {
        this.$emit("openLoginPop")
        return false
      }
      let prams = {
        platformId: item.platformId
      };
      gamePlatformUpholdInfo(prams).then(res => {
        if (res.result.upholdStatus == 1) {
          this.$refs.maintain.openMaintain(res.result)
          return false
        }
        this.enterGame(item.code, item.platformId, item.platformCateId)
      }).catch(err => {
        console.log(err)
      })
    },
    collect(item) {
      let prams = {
        gameId: item.id
      }
      gameCollect(prams).then(res => {
        item.collectStatus = res.result ? 1 : 0
      }).catch(err => {
        console.log(err)
      })
    },
    recommend() {
      uni.navigateTo({
        url: '/pages/liuhe/recommend'
      })
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
.category {
  margin-top: 20rpx;
  margin-bottom: calc(var(--vh) - 92rpx - 60rpx - 50px);

  .isHeight {
    // margin-bottom: calc(var(--vh) - 92rpx - 60rpx - 50px);
  }

  .data-box {
    display: flex;

    .menu {
      width: 164rpx;
      background: #FFFFFF;

      .menu-item {
        background: #FFFFFF;
        width: 100%;
        height: 88rpx;
        font-style: normal;
        font-weight: 400;
        font-size: 26rpx;
        color: #03536E;
        text-align: center;
        /*white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;*/
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;

        .text {
          display: block;
          padding-right: 24rpx;
          width: calc(164rpx - 24rpx);
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; // 默认不换行；
          text-align: right;
        }

        /*&:after{
          background: #9DC7D8;
          width: 60rpx;
          content: "";
          height: 2rpx;
          bottom: 0;
          left: 0;
        }
        &:last-child{
          &:after{
            content: "";
            height: 0rpx;
            border:0px
          }
        }*/
      }

      .active {
        background: #0DA5E3;
        /*border-bottom: 2rpx solid #0DA5E3;
        border-radius: 10rpx;*/
        color: #FFFFFF;
      }
    }

    .isTop {
      position: fixed;
      top: calc(92rpx + 60rpx);
      height: calc(var(--vh) - 92rpx - 60rpx - 50px);
      background: #ffffff;
      z-index: 10;

      .height-null {
        height: 100px;
      }
    }

    .top {
      margin-left: 164rpx;
    }

    .list.top {
      position: fixed;
      top: calc(92rpx + 60rpx);
      height: calc(var(--vh) - 92rpx - 60rpx - 50px);
      background: #ffffff;
      z-index: 10;
      right: 0px;
    }

    .list {
      padding: 15rpx 0rpx 60rpx 0rpx;
      width: calc(100vw - 164rpx);
      max-width: calc(480px - 164rpx);
      z-index: 4;

      .list-item {
        margin-bottom: 28rpx;
        width: 33%;
        display: inline-block;
        text-align: center;

        .name {
          width: 170rpx;
          text-align: center;
          font-weight: 400;
          font-size: 22rpx;
          color: #222222;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        image {
          width: 170rpx;
          height: 170rpx;
        }

        .collect {
          height: 40rpx;
          width: 40rpx;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }

  .goTop {
    position: absolute;
    right: 0;

    image {
      height: 58rpx;
      width: 58rpx;
    }
  }
}
</style>
