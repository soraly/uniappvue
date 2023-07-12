<template>
  <view class="login-box">
    <view class="login-confirm">
      <span class="step" @click="registers">注册</span>
      <image :src="logo" class="login-logo"></image>
      <view class="forms">
        <view class="tablist">
          <view v-for="(item, index) in tab" :key="index" :class="isActive == index ? 'tablist-item active' : 'tablist-item'"
            @click="selectTab(index)">
            <span>{{ item }}</span>
          </view>
          <view class="van-tabs__line" :style="styles[isActive]"></view>
        </view>
        <uni-forms :modelValue="formData" ref="valiForm">
          <uni-forms-item name="phone" class="form-item">
            <input type="text" v-model="formData.phone" maxlength="11" placeholder="输入您的手机号码" />
          </uni-forms-item>
          <uni-forms-item name="pwd" class="form-item" v-show="isActive == 0">
            <input type="password" v-model="formData.pwd" placeholder="输入您的密码锁" />
          </uni-forms-item>
          <uni-forms-item name="msgCode" class="form-item" v-show="isActive == 1">
            <input type="text" v-model="formData.msgCode" placeholder="输入验证码" style="width: 180px" />
            <view class="code">
              <span size="small" type="primary" class="get-code" @click="getCode" v-show="!isSend">获取验证码</span>
              <span size="small" type="primary" class="get-code" v-show="isSend">{{ sendText }}</span>
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="forgetpwd clearfix">
        <span @click="forgotpwd">忘记密码?</span>
      </view>
      <view class="btn primary-btn" style="clear: both" @click="submit('valiForm')">
        登录
      </view>
      <uni-icons @click="closed" custom-prefix="iconfont" type="cuowuguanbiquxiao-yuankuang" size="27"
        color="rgb(153 153 153)" style="position: absolute;bottom: -50px;left: 50%;transform: translate(-50%);">

      </uni-icons>

    </view>
  </view>
</template>

<script>
import { login, getVCode } from "../../../utils/common/index.js";
import { checkPhone, codeCheck } from "../../../utils/common.js"
export default {
  name: "Login",
  data() {
    return {
      isActive: 0,
      logo: '../../../static/logo.png',
      isShow: false,
      countDown: 60,
      isSend: false,
      sendText: '',
      tab: ['密码登录', '验证码登录'],
      styles: ['transform: translateX(56rpx) translateX(-50%);', 'transform: translateX(262rpx) translateX(-50%);'],
      formData: {
        phone: '',
        pwd: '',
        msgCode: '',
        type: 1,
      }
    }
  },
  mounted() {
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
    closed: function () {
      this.$emit('closePopup')
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
          uni.showToast({
            title: '请输入密码',
            duration: 2000,
            icon: "none"
          })
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
      let prams = this.formData
      login(prams).then(res => {
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
        this.$emit('closePopup')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.login-box {
  top: 0px;
  max-width: 480px;
  height: var(--vh);
  position: fixed;
  z-index: 23;
}

.login-confirm {
  background: #fff;
  width: 320px;
  padding: 21px 30px 110px;
  box-sizing: border-box;
  overflow-y: inherit !important;
  border-radius: 3px;
  position: fixed;
  max-height: 100%;
  -webkit-transition: -webkit-transform .3s;
  transition: -webkit-transform .3s;
  transition: transform .3s;
  transition: transform .3s, -webkit-transform .3s;
  -webkit-overflow-scrolling: touch;
  transform: translate3d(-50%, -50%, 0);
  top: 50%;
  left: 50%;
}

.login-confirm .step {
  position: absolute;
  color: #07c160;
  font-size: 15px;
  line-height: 21px;
  top: 21px;
  right: 27px;
}

.login-confirm .login-logo {
  display: block;
  margin: 0 auto;
  width: 168rpx;
  height: 168rpx;
}

.forms .tablist {
  width: 186px;
  margin: 25px 0 27px;
  height: 44px;
  overflow: hidden;
  box-sizing: content-box;
  display: flex;
  background-color: #fff;
  user-select: none;
  position: relative;
}

.tablist .tablist-item {
  padding: 0;
  font-size: 16px;
  flex: 1;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 20px;
  cursor: pointer;
}

.tablist .tablist-item.active {
  color: #07c160;
}

.tablist .tablist-item span {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.van-tabs__line {
  background: #07c160;
  position: absolute;
  bottom: 10px;
  left: 0;
  z-index: 1;
  width: 40px;
  height: 3px;
  border-radius: 3px;
  width: 72px;
  height: 2px;
  border-radius: 2px;
  transition-duration: 0.3s;
}

.form-item {
  position: relative;
}

.code {
  position: absolute;
  right: 0px;
  top: 8px;
  color: #07c160;
  font-size: 14px;
}

.login-confirm .forgetpwd {
  margin: -11px 0 30px;
  display: table;
  width: 100%;
}

.login-confirm .forgetpwd span {
  float: right;
  color: #07c160;
  font-size: 14px;
}

.btn.primary-btn {
  margin: 0 auto;
  background: #07c160;
  height: 44px;
  line-height: 44px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  width: 100%;
  border-radius: 3px;
  margin-top: 40px !important;
}</style>