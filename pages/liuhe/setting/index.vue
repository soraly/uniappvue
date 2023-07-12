<template>
  <view class="lottery-page" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <view v-if="isLogin" class="list-row">
      <view class="list-item" @click="toUrl('./userInfo')">
        <view class="left">
          <image src="/static/img/liuhe/setting/user.png"></image>
          <view class="title">账号资料</view>
        </view>
        <view class="right">
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/fx.png"></image>
          <view class="title">分享投注</view>
        </view>
        <view class="right">
          <switch color="#6CD578" :checked="share" @change="switchShare" />
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/fx.png"></image>
          <view class="title">中奖动画</view>
        </view>
        <view class="right">
          <switch color="#6CD578" :checked="win" @change="switchWin" />
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/fx.png"></image>
          <view class="title">左右手势(默认左手)</view>
        </view>
        <view class="right">
          <switch color="#6CD578" :checked="hand" @change="switchHand" />
        </view>
      </view>

    </view>

    <view class="list-row" style="margin-top: 30rpx">
      <view class="list-item" @click="clearCache">
        <view class="left">
          <image src="/static/img/liuhe/setting/clear.png"></image>
          <view class="title">清空缓存</view>
        </view>
        <view class="right">
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>
      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/bb.png"></image>
          <view class="title">当前版本</view>
        </view>
        <view class="right">
          <text class="title">{{ $store.state.appInfoStore.configs.version_pro }}</text>
        </view>
      </view>
    </view>

    <view class="testLogin" v-if="userInfo.userType == 'demo'">
      <view class="reg-btn" @click="toUrl('/pages/liuhe/reg')">注册</view>
      <view class="login-btn" @click="toUrl('/pages/liuhe/login')">登录</view>
    </view>
    <view v-if="isLogin" class="logut-btn" @click="loginOut">退出登录</view>

    <uni-popup ref="confirm" type="center" background-color="#fff">
      <view class="confirm-box">
        <view class="title">提示</view>
        <view class="notice">
          <text>是否立即清空缓存信息？</text>
        </view>
        <view class="btn-box">
          <view class="cancel-btn" @click="cancel">取消</view>
          <view class="confirm-btn" @click="confirm">确认</view>
        </view>
      </view>
    </uni-popup>

    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { info } from "../../../utils/user";
import { logout } from "../../../utils/common/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: this.$t("liuhe.setting.title"),
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      isLogin: false,
      share: false,
      win: false,
      hand: false,
      userInfo: {},
    }
  },
  onLoad(option) {
    if (isLogin()) {
      this.isLogin = true
      this.getUserInfo()
    }
    this.share = uni.getStorageSync("isShare")
    this.win = uni.getStorageSync("isWin")
    this.hand = uni.getStorageSync("isHand") || false
  },
  onShow() {
  },
  methods: {
    getUserInfo() {//从storage获取用户信息
      this.userInfo = uni.getStorageSync('userInfo');
      let prams = {}
      info(prams).then(res => {
        this.userInfo = res.result
        uni.setStorageSync('userInfo', this.userInfo);
      }).catch(err => {
        console.log(err)
      })
    },
    toUrl(url) {
      uni.navigateTo({
        url: url
      })
    },
    switchShare(e) {
      this.share = e.detail.value
      uni.setStorageSync('isShare', this.share);
    },
    switchWin(e) {
      this.win = e.detail.value
      uni.setStorageSync('isWin', this.win);
    },
    switchHand(e) {
      this.hand = e.detail.value
      uni.setStorageSync('isHand', this.hand)
    },
    clearCache() {
      this.$refs.confirm.open()
    },
    cancel() {
      this.$refs.confirm.close()
    },
    confirm() {
      // #ifdef APP-PLUS
      var self = this;
      //使用plus.cache.clear 清除应用中的缓存数据
      plus.cache.clear();
      // #endif
      this.$refs.confirm.close()
    },
    loginOut() {
      logout().then(res => {
        if (res.code === 200) {
          this.$store.dispatch("userLoginOut");
          this.isLogin = false;
          backPage(true)
        } else {
          uni.showToast({
            title: '退出失败',
            duration: 2000,
            icon: "none"
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
      flex: 1;
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

.testLogin {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;

  .reg-btn,
  .login-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 337.5rpx;
    height: 90rpx;
    border-radius: 50rpx;
    font-weight: 400;
    font-size: 32rpx;
  }

  .reg-btn {
    background: #FFFFFF;
    border: 1px solid #39B4AA;
    color: #39B4AA;
    margin-right: 30rpx;
  }

  .login-btn {
    background: linear-gradient(89.45deg, #2DB49C 0.35%, #09B371 94.83%);
    border: 1px solid #39B4AA;
    color: #FFFFFF;
  }
}

.logut-btn {
  background: #16A7FB;
  border-radius: 50rpx;
  margin: 52rpx auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 705rpx;
  height: 90rpx;
  font-weight: 500;
  font-size: 32rpx;
  text-align: center;
  color: #FFFFFF;
}

.confirm-box {
  height: 360rpx;
  width: 432rpx;
  border-radius: 10rpx;
  padding: 20rpx 54rpx 20rpx 54rpx;

  .title {
    height: 80rpx;
    font-weight: 400;
    font-size: 32rpx;
    line-height: 80rpx;
    text-align: center;
    color: #9A9A9A;
    border-bottom: 2rpx solid #E6E6E6;
  }

  .notice {
    height: 220rpx;
    font-weight: 400;
    font-size: 28rpx;
    text-align: center;
    color: #333333;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .btn-box {
    display: flex;
    color: #FFFFFF;
    font-weight: 400;
    font-size: 26rpx;

    .cancel-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60rpx;
      width: 200rpx;
      border-radius: 264rpx;
      background: #8CB2C9;
      margin-right: 20rpx;
    }

    .confirm-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60rpx;
      width: 200rpx;
      border-radius: 264rpx;
      background: #FF9900;
      margin-left: 20rpx;
    }
  }
}
</style>