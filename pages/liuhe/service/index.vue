<template>
  <view class="service" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="title">
      如遇问题，请咨询我们！
    </view>
    <view class="desc">
      分享赚钱.充值提现等均可咨询
    </view>
    <uni-link :href="serviceUrl">
      <view :href="serviceUrl" class="btn">
        <image src="/static/img/liuhe/kf.png"></image>
        <text class="text">人工客服</text>
      </view>
    </uni-link>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { aboutUs } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "客服中心",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      serviceUrl: ""
    }
  },
  onLoad() {
    this.getUrl()
  },
  methods: {
    getUrl() {
      let configData = uni.getStorageSync('config')
      for (let i = 0; i < configData.length; i++) {
        if (configData[i].type == "1") {
          this.serviceUrl = configData[i].url;
          this.qqList = configData[i].qqList;
          break;
        }
      }
    },
    handleQq() {
      console.log('点击QQ客服按钮');
    },
    handleZx() {
      console.log('点击在线客服按钮');
    }
  },
}
</script>

<style lang="scss" scoped>
.service {
  background: #fff;
  height: var(--vh);
  font-family: 'PingFang SC';

  .title {
    margin-top: 128rpx;
    margin-left: 40rpx;
    font-style: normal;
    font-weight: 400;
    font-size: 36rpx;
    color: #444444;
  }

  .desc {
    margin-left: 40rpx;
    font-weight: 400;
    font-size: 18rpx;
    color: #666666;
  }

  .btn {
    margin: 70rpx auto 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 10rpx;
    width: 630rpx;
    height: 100rpx;
    background: linear-gradient(90deg, #AAACFE 0%, #6684FC 100%);
    border-radius: 50rpx;

    image {
      width: 72rpx;
      height: 72rpx;
    }

    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #FFFFFF;
    }
  }
}
</style>