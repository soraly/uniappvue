<template>
  <view class="lottery-page" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <view class="list-row">
      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/user.png"></image>
          <view class="title">头像</view>
        </view>
        <view class="right" @click="toUrl('./setHead')">
          <image :src="userHeadImageUrl"></image>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/nickname.png"></image>
          <view class="title">昵称</view>
        </view>
        <view class="right" @click="toUrl('./setNickname')">
          <text class="title">{{ userInfo.nickname }}</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/zh.png"></image>
          <view class="title">账号</view>
        </view>
        <view class="right">
          <text class="title">{{ userInfo.userName }}</text>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/id.png"></image>
          <view class="title">ID</view>
        </view>
        <view class="right">
          <text class="title">{{ userInfo.id }}</text>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/liuhe/setting/yq.png"></image>
          <view class="title">邀请码</view>
        </view>
        <view class="right">
          <text class="title">{{ userInfo.inviteCode }}</text>
        </view>
      </view>
    </view>

    <view class="list-row" style="margin-top: 30rpx">
      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/phone.png"></image>
          <view class="title">绑定手机号</view>
        </view>
        <view class="right" @click="toUrl('./upMobile')" v-if="init.isBindMobile == 1">
          <text class="title">{{ userInfo.phone }}</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
        <view class="right" @click="toUrl('./setMobile')" v-else>
          <text class="title">未绑定</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/pwd.png"></image>
          <view class="title">登录密码</view>
        </view>
        <view class="right" @click="toUrl('./setPwd')">
          <text class="title">修改</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

      <view class="list-item">
        <view class="left">
          <image src="/static/img/safe/coin_pwd.png"></image>
          <view class="title">资金密码</view>
        </view>
        <view class="right" @click="toUrl('/pages/user/pwd/update_pwd')" v-if="init.isBindPinCode == 1">
          <text class="title">修改</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
        <view class="right" @click="toUrl('/pages/user/pwd/set_pwd')" v-else>
          <text class="title">设置</text>
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
        <view class="right" @click="updateSafe">
          <text class="title">修改</text>
          <uni-icons type="right" style="font-size: 40rpx;color: #999999"></uni-icons>
        </view>
      </view>

    </view>
    <view class="testLogin" v-if="userInfo.userType == 'demo'">
      <view class="reg-btn" @click="toReg('/pages/liuhe/reg')">注册</view>
      <view class="login-btn" @click="toReg('/pages/liuhe/login')">登录</view>
    </view>
    <view class="logut-btn" @click="loginOut">退出登录</view>

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
import NavBar from "../../../components/common/navBar/navBar";
import { info } from "../../../utils/user/index";
import { mySecurityCenter } from "../../../utils/lottery/mine";
import { logout } from "../../../utils/common/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import { mapGetters } from "vuex";

export default {
  name: "index",
  components: {
    AlertInjectLayer, NavBar,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: this.$t("liuhe.setting.userInfo.title"),
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      isLogin: false,
      userInfo: {},
      msg: '',
      init: {}
    }
  },
  computed: {
    ...mapGetters(["userHeadImageUrl"])
  },

  onLoad(option) {
    uni.$on('setSucc', data => {
      this.msg = data.msg
    })
    uni.$on('emitParams', data => {
      this.msg = data.msg
    })
  },
  onShow() {
    if (this.msg) {
      pop(this.msg, 2000)
      this.msg = ''
      uni.$emit('emitParams', { msg: null })
    }
    if (isLogin()) {
      this.isLogin = true
      this.getUserInfo()
      this.getInit()
    } else {
      this.toLogin()
    }
  },
  methods: {
    getUserInfo() {//从storage获取用户信息
      this.userInfo = this.$localdb.get("userInfo.getUserInfo");  //uni.getStorageSync('userInfo');
      let prams = {}
      info(prams).then(res => {
        this.userInfo = res.result
        this.$localdb.set("userInfo.setUserInfo", this.userInfo, (v) => { return v != null })
      }).catch(err => {
        console.log(err)
      })
    },
    getInit() {
      mySecurityCenter().then(res => {
        this.init = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    toUrl(url) {
      if (this.userInfo.userType == "demo") {
        uni.$emit('showPop', { refName: 'AlertTestMsg', })
        return false
      }
      uni.navigateTo({ url: url })
    },
    toReg(url) {
      uni.navigateTo({ url: url })
    },
    toLogin() {
      uni.navigateTo({ url: '/pages/liuhe/login' })
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
    loginOut() {
      logout().then(res => {
        if (res.code === 200) {
          this.$store.dispatch("userLoginOut");
          this.isLogin = false
          backPage()
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
.lottery-page {
  padding-bottom: 211rpx;
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
      width: 30%;
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
      width: 70%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      image {
        height: 80rpx;
        width: 80rpx;
      }

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
</style>