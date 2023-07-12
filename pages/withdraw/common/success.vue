<template>
  <view class="bank-div">
    <view class="bank-box" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <view class="img-box">
        <image src="/static/img/user/bank/ok.png"></image>
        <view class="msg">{{ msg }}</view>
      </view>
      <view class="btn" @click="back">返回</view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
export default {
  name: "list",
  components: { NavBar },
  props: {
    bankList: {
      type: Array,
      default: []
    },
    msg: {
      type: String,
      default: "提现成功，预计2小时内到账"
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "提现成功",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
    }
  },
  methods: {
    back() {
      backPage()
    },
  }
}
</script>

<style lang="scss" scoped>
.bank-div {
  width: 100vw;
  background: rgba(0, 0, 0, 0.1);
}

.bank-box {
  font-family: 'PingFang SC';
  width: 100vw;
  max-width: 480px;
  margin: auto;
  height: var(--vh);
  background: #ffffff;

  .img-box {
    margin-top: 139rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    image {
      height: 250rpx;
      width: 250rpx;
    }

    .msg {
      font-weight: 400;
      font-size: 32rpx;
      color: #666666;
    }
  }

  .btn {
    margin: 161rpx auto;
    width: 705rpx;
    height: 90rpx;
    background: #16A7FB;
    border-radius: 50px;
    font-weight: 500;
    font-size: 32rpx;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>