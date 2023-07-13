<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight, height: 'calc(var(--vh) - safeHeight)' }">
    <!--顶部导航栏-->
    <nav-bar></nav-bar>
    <view class="login-confirm">
      <text class="step" @click="registers">注册</text>
      <image :src="logo" class="login-logo"></image>
      <view class="forms">
        <view class="tablist">
          <view v-for="(item, index) in tab" :key="index"
            :class="isActive == index ? 'tablist-item active' : 'tablist-item'" @click="selectTab(index)">
            <text>{{ item }}</text>
          </view>
          <view class="van-tabs__line" :style="styles[isActive]"></view>
        </view>
        <uni-forms :modelValue="formData" ref="valiForm">
          <uni-forms-item name="phone" class="form-item">
            <input type="text" placeholder-style="color:#c8c9cc" maxlength="11" v-model="formData.phone"
              placeholder="输入您的手机号码" />
          </uni-forms-item>
          <uni-forms-item name="pwd" class="form-item" v-show="isActive == 0">
            <input type="password" placeholder-style="color:#c8c9cc" v-model="formData.pwd" placeholder="输入您的密码锁" />
          </uni-forms-item>
          <uni-forms-item name="msgCode" class="form-item" v-show="isActive == 1">
            <input type="text" placeholder-style="color:#c8c9cc" maxlength="6" v-model="formData.msgCode"
              placeholder="输入验证码" style="width: 180px" />
            <view class="code">
              <text size="small" type="primary" class="get-code" @click="getCode" v-show="!isSend">获取验证码</text>
              <text size="small" type="primary" class="get-code" v-show="isSend">{{ sendText }}</text>
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="forgetpwd clearfix">
        <text @click="forgotpwd">忘记密码?</text>
      </view>
      <view class="btn primary-btn" style="clear: both" @click="submit('valiForm')">
        登录
      </view>

    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { login, getVCode } from "@/utils/common/index.js";
import { checkPhone, codeCheck } from "@/utils/common.js"
import NavBar from "@/components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "Login",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      isActive: 0,
      isShow: false,
      logo: '/static/logo.png',
      countDown: 60,
      isSend: false,
      sendText: '',
      tab: ['密码登录', '验证码登录'],
      styles: ['transform: translateX(90rpx) translateX(-50%);', 'transform: translateX(271rpx) translateX(-50%);'],
      formData: {
        phone: '',
        pwd: '',
        msgCode: '',
        type: 1,
      }
    }
  },
  onLoad(option) {
    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 22) {
          this.logo = item.url
          throw Error();
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    //返回
    back() {
      uni.navigateBack({
        delta: 1,//返回层数，2则上上页
      })
    },
    registers: function () {
      uni.navigateTo({
        url: '/pages/user/register'
      })
    },
    forgotpwd: function () {
      uni.navigateTo({
        url: '/pages/user/forgotpwd'
      })
    },
    selectTab: function (index) {
      this.isActive = index
      if (index == 0) {
        this.formData.type = 1
      } else {
        this.formData.type = 2
      }
    },
    //获取验证码
    getCode: function () {
      const phone = this.formData.phone
      if (!checkPhone(phone)) return false
      let prams = { phone: this.formData.phone, type: 'login' }
      getVCode(prams).then(res => {
        if (res.code == 200) {
          pop('发送成功', 1000)
          this.isSend = true
          this.timerId = setInterval(() => {
            this.countDown--;
            this.sendText = this.countDown + "秒后重试";
            if (this.countDown <= 0) {
              clearInterval(this.timerId);
              this.countDown = 60;
              this.isSend = false
            }
          }, 1000);
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submit: function () {
      const phone = this.formData.phone
      if (!checkPhone(phone)) return false
      if (this.formData.type == 1) {
        if (!this.formData.pwd) {
          pop(this.$t("liuhe.login.pwd.empty"), 2000)
          return false
        }
      } else {
        if (!this.formData.msgCode) {
          uni.showToast({
            title: '请输入验证码',
            duration: 2000,
            icon: "none"
          })
          return false
        }
      }
      let prams = this.formData;
      login(prams).then(res => {
        clearInterval(this.timerId);
        this.countDown = 60;
        this.isSend = false
        if (res.code != 200) {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: "none"
          })
          return false
        }
        uni.setStorageSync('userInfo', res.result.user);
        uni.setStorageSync('token', res.result.token);

        const urlMap = {
          ALL: '/pages/user/index',
          LIUHE: '/pages/pages-liuhe/index',
          LUNTAN: '/pages/pages-luntan/index'
        }

        uni.reLaunch({
          url: urlMap[this.$config.station] // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
        });
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.mint-tab-container-item {
  background: #fff;
}

.login-confirm {
  height: 80vh;
  position: relative;
  background: #fff;
  padding: 80rpx 54rpx;
}

.login-confirm .step {
  position: absolute;
  color: #444;
  font-size: 30rpx;
  line-height: 42rpx;
  top: 0rpx;
  right: 54rpx;
}

.login-confirm .login-logo {
  display: block;
  margin: 0 auto;
  width: 200rpx;
  height: 200rpx;
}

.forms .tablist {
  width: 362rpx;
  margin: 50rpx 0 54rpx;
  height: 88rpx;
  overflow: hidden;
  box-sizing: content-box;
  display: flex;
  background-color: #fff;
  user-select: none;
  position: relative;
}

.tablist .tablist-item {
  padding: 0;
  font-size: 28rpx;
  flex: 1;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 40rpx;
  cursor: pointer;
  text-align: center;
}

.tablist .tablist-item.active {
  color: #07c160;
}

.tablist .tablist-item text {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.van-tabs__line {
  background: #07c160;
  position: absolute;
  bottom: 20rpx;
  left: 0;
  z-index: 1;
  width: 80rpx;
  height: 6rpx;
  border-radius: 6rpx;
  width: 144rpx;
  height: 4rpx;
  border-radius: 4rpx;
  transition-duration: 0.3s;
}

.form-item {
  position: relative;
}

.code {
  position: absolute;
  right: 0px;
  top: 16rpx;
  color: #07c160;
  font-size: 28rpx;
}

.login-confirm .forgetpwd {
  margin: -22rpx 0 60rpx;
  display: inline-block;
  width: 100%;
}

.login-confirm .forgetpwd text {
  float: right;
  color: #07c160;
  font-size: 28rpx;
}

.btn.primary-btn {
  margin: 0 auto;
  background: #07c160;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
  text-align: center;
  width: 100%;
  border-radius: 6rpx;
  margin-top: 80rpx !important;
}
</style>
