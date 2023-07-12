<template>
  <view class="website" :style="{ paddingTop: statusBarH }">
    <view class="navcol">
      <view :class="curr == 0 ? 'text selected' : 'text'" @click="curr = 0">网址大全</view>
      <view :class="curr == 1 ? 'text selected' : 'text'" @click="curr = 1">担保平台</view>
    </view>
    <view class="website-box" v-show="curr == 0" style="">
      <view class="website-body clearfix">
        <view class="website-item" v-for="(item, index) in ListSite" :key="index">
          <view class="web-rol" v-if="item.turnType == 2" @click="tiaozhuan(item)">
            <image v-if="item.imgPath" :src="item.imgPath"></image>
            <p :class="item.imgPath ? '' : 'bg'">{{ item.name }}</p>
          </view>
          <uni-link class="web-rol" showUnderLine="false" :href="item.url" v-else>
            <image v-if="item.imgPath" :src="item.imgPath"></image>
            <p :class="item.imgPath ? '' : 'bg'">{{ item.name }}</p>
          </uni-link>
        </view>
      </view>
    </view>
    <view class="dbptdiv" v-show="curr == 1" style="">
      <view class="item" v-for="(item, index) in ListAd">
        <image :src="item.imgPath"></image>
        <view class="descs">
          <span class="descs1">{{ item.name }}</span>
          <view class="jumpurl" v-if="item.turnType == 2" @click="tiaozhuan(item)">
            点击访问
          </view>
          <uni-link v-else color="#07c160" :href="item.url" class="jumpurl" showUnderLine="false">
            点击访问
          </uni-link>
        </view>
      </view>
    </view>
    <!--底部-->
    <view class="footer">
      <tab-bar :current="'3'"></tab-bar>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { siteList, AdList } from "../../utils/common/index"
import UniLink from "../../uni_modules/uni-link/components/uni-link/uni-link";
import TabBar from "../../components/common/tabbar/TabBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, UniLink, TabBar
  },
  data() {
    return {
      curr: 0,
      ListSite: [],
      ListAd: [],
      statusBarH: uni.getStorageSync("systemInfo").safeArea.top + "px"
    }
  },
  onLoad() {
    this.siteList()
    this.AdList()
  },
  onShow() {
    uni.hideTabBar()
  },
  methods: {
    //跳转
    tiaozhuan(item) {
      console.log(item)
      uni.navigateTo({
        url: "/pages/webview/index?url=" + item.url
      })
    },
    //网址大全
    siteList() {
      siteList().then(res => {
        this.ListSite = res.result.list
      }).catch(err => {
        console.log(err)
      })
    },
    //担保平台
    AdList() {
      AdList().then(res => {
        this.ListAd = res.result.list
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.website {
  width: 100%;
  max-width: 480px;

  .navcol {
    padding: 0;
    width: 100%;
    height: 88rpx;
    left: 0;
    top: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
    font-size: 36rpx;
    line-height: 50rpx;

    .text {
      width: 50%;
      text-align: center;
    }

    .selected {
      color: #07c160;
    }
  }

  .website-box {
    width: 100%;
  }

  .website-body {
    height: 100%;
    background: #fff;
    padding: 0 12rpx;
    display: flow-root;
    min-height: var(--vh);

    .website-item {
      float: left;
      width: 25%;
      text-align: center;
      padding: 20rpx 0 20rpx;

      .web-rol {
        padding: 0 10rpx;
        display: block;

        image {
          width: 90%;
          height: 80rpx;
          border-radius: 8rpx;
        }

        p {
          color: #444;
          font-size: 32rpx;
          line-height: 44rpx;
          margin-top: 8rpx;
        }

        .bg {
          background: #f2f2f2;
          padding: 10rpx 0;
          border-radius: 8rpx;
          font-size: 28rpx;
        }
      }
    }
  }

  .dbptdiv {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 690rpx;
    margin: 0 auto;

    .item {
      width: 100%;
      height: 251.88rpx;
      filter: drop-shadow(0 8rpx 8rpx rgba(0, 0, 0, .05));
      border-radius: 16rpx;
      margin: 30rpx 0;

      image {
        width: 100%;
        height: 163.88rpx;
      }

      .descs {
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        position: static;
        height: 88rpx;
        background: #fff;
        font-family: PingFang SC;

        .descs1 {
          width: 458rpx;
          height: 44rpx;
          font-style: normal;
          font-weight: 700;
          font-size: 32rpx;
          line-height: 44rpx;
          color: #444;
          order: 0;
          flex-grow: 1;
        }

        .jumpurl {
          font-size: 28rpx;
          line-height: 32rpx;
          color: #07c160;
          width: 160rpx;
          height: 48rpx;
          background: #fff;
          border: 2rpx solid #07c160;
          box-sizing: border-box;
          border-radius: 200rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .footer {
    height: 50px;
  }
}
</style>
