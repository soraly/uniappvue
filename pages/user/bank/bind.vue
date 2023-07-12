<template>
  <view class="bind-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="img-box">
      <image src="../../../static/img/user/bank/wu.png"></image>
    </view>
    <view class="msg">您还没有绑定用于提现的银行卡</view>
    <view class="btn-box">
      <view class="btn" @click="toUrl('/pages/user/bank/add')">绑定银行卡</view>
      <view class="btn" @click="toUrl('/pages/user/bank/usdt')">绑定USDT地址</view>
      <view class="btn" @click="toUrl('/pages/user/bank/wallet')">绑定第三方钱包</view>
      <view class="btn" @click="toUrl('/pages/user/bank/qrcode')">绑定收款二维码</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import { getRechargeGroup, getRechargeType } from "../../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "bind",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "绑定",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
    }
  },
  onLoad() {
  },
  methods: {
    toUrl(url) {
      uni.navigateTo({
        url: url
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.bind-box {
  font-family: 'PingFang SC';
  background: #FFFFFF;
  height: var(--vh);

  .img-box {
    height: 544rpx;
    border-radius: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      height: 340rpx;
      width: 340rpx;
      border-radius: 0px;
    }
  }

  .msg {
    font-weight: 400;
    font-size: 32rpx;
    line-height: 42rpx;
    text-align: center;
    color: #666666;
  }

  .btn-box {
    margin-top: 57rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .btn {
      width: 705rpx;
      height: 90rpx;
      background: #16A7FB;
      border-radius: 50rpx;
      margin-bottom: 30rpx;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 45rpx;
      text-align: center;
      color: #FFFFFF;
      line-height: 90rpx;
    }
  }
}
</style>