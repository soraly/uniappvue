<template>
  <view class="safe-box" :style="{ marginTop: safeHeight }">
    <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
      :font-color="fontColor" :title-style="titleStyle">
      <block slot="left">
        <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
      </block>
    </NavBar>
    <view class="img-box">
      <image src="/static/img/safe.png"></image>
      <view class="title">您的账户正在享受全面的安全保护</view>
    </view>
    <view class="list-row">
      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/phone.png"></image>
          <view class="title">绑定手机号</view>
        </view>
        <view class="right" @click="setMobile()">
          <text class="title" v-if="init.isBindMobile == 1">{{ init.phone }}</text>
          <text class="title" v-else>未绑定</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/pwd.png"></image>
          <view class="title">登录密码</view>
        </view>
        <view class="right" @click="setPwd()">
          <text class="title">修改</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/coin_pwd.png"></image>
          <view class="title">资金密码</view>
        </view>
        <view class="right" @click="setPinCode()">
          <text class="title">{{ init.isBindPinCode == 1 ? '修改' : '设置' }}</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/sz.png"></image>
          <view class="title">锁屏手势</view>
        </view>
        <view class="right" @click="updateSafe">
          <text class="title">修改</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/sb.png"></image>
          <view class="title">设备锁</view>
        </view>
        <view class="right">
          <switch :checked="checked" @change="switchChange" />
        </view>
      </view>

      <view class="list-item" @click="toPage('/pages/user/bank/index')">
        <view class="left">
          <image src="/static/img/safe/phone.png"></image>
          <view class="title">银行卡管理</view>
        </view>
        <view class="right">
          <text class="title"></text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

    </view>
    <uni-popup ref="confirm" type="center" background-color="#fff">
      <view class="confirm-box">
        <view class="head-box">提示</view>
        <view class="title">只有手机App可设置，是否下载App</view>
        <view class="btn-box">
          <view class="cancel-btn" @click="cancel">稍后下载</view>
          <view class="confirm-btn" @click="confirm">立即下载</view>
        </view>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import { mySecurityCenter } from "../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "安全中心",
      headerStyle: {
        backgroundColor: "#1586F7"
      },
      checked: false,
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      msg: "",
      init: {}
    }
  },
  onLoad(option) {
    uni.$on('emitParams', data => {
      this.msg = data.msg


    })
    this.getInit()
  },
  onShow() {
    if (this.msg) {
      pop(this.msg, 2000)
      this.msg = ''
      //逻辑设计就有问题 最偷懒的改法 请在当前页面处理完成之后 通知其它区域的信息清空MSG避免重复显示提示
      uni.$emit('emitParams', { msg: null })
    }
  },
  methods: {
    back() {
      uni.redirectTo({
        url: "/pages/user/wallet/index"
      })
    },
    toPage(url) {
      uni.navigateTo({ url: url })
    },
    switchChange(e) {
      //#ifdef H5
      this.checked = true
      if (e.detail.value) {
        this.$refs.confirm.open()
      }
      //#endif
      //#ifdef APP-PLUS

      //#endif
    },
    updateSafe() {
      //#ifdef H5
      this.$refs.confirm.open()
      //#endif
      //#ifdef APP-PLUS

      //#endif
    },
    cancel() {
      this.$refs.confirm.close()
      this.checked = false
    },
    confirm() {
      uni.navigateTo({
        url: "/pages/user/downloadPage",
      })
    },
    getInit() {
      mySecurityCenter().then(res => {
        this.init = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    setPinCode() {
      if (this.init.isBindPinCode == 1) {
        uni.navigateTo({
          url: "/pages/user/pwd/update_pwd",
        })
      } else {
        uni.navigateTo({
          url: "/pages/user/pwd/set_pwd",
        })
      }
    },
    setMobile() {
      if (this.init.isBindMobile == 1) {
        uni.navigateTo({
          url: "/pages/liuhe/setting/upMobile",
        })
      } else {
        uni.navigateTo({
          url: "/pages/liuhe/setting/setMobile",
        })
      }
    },
    setPwd() {
      uni.navigateTo({
        url: "/pages/liuhe/setting/setPwd",
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.safe-box {
  font-family: 'PingFang SC';

  .img-box {
    height: 462rpx;
    background: linear-gradient(180deg, #1788F1 0%, #06BDF6 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    image {
      height: 158rpx;
      width: 149rpx;
    }

    .title {
      margin-top: 82rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .list-row {
    background: #FFFFFF;

    .list-item {
      display: flex;
      height: 100rpx;
      align-items: center;
      padding-left: 20rpx;
      padding-right: 30rpx;
      border-bottom: 1px solid #e7e7e7;

      .left {
        width: 50%;
        display: flex;

        image {
          height: 40rpx;
          width: 40rpx;
        }

        .title {
          margin-left: 20rpx;
          font-weight: 400;
          font-size: 30rpx;
          color: #222222;
        }
      }

      .right {
        width: 50%;
        display: flex;
        justify-content: flex-end;

        .title {
          margin-right: 10rpx;
          font-weight: 500;
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
  }

  .confirm-box {
    height: 340rpx;
    width: 540rpx;
    border-radius: 10rpx;

    .head-box {
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      border-bottom: 2rpx solid #E6E6E6;
      margin: 0 20rpx;
      font-weight: 400;
      font-size: 32rpx;
      color: #9A9A9A;
    }

    .title {
      height: 150rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }

    .btn-box {
      height: 100rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-weight: 400;
      font-size: 26rpx;
      color: #FFFFFF;

      .cancel-btn,
      .confirm-btn {
        height: 60rpx;
        width: 200rpx;
        border-radius: 264rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .cancel-btn {
        background: #8CB2C9;
      }

      .confirm-btn {
        background: #FF9900;
      }
    }
  }
}</style>