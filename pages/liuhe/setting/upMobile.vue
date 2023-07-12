<template>
  <view class="setting" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <view class="form-box" v-if="current === 0">
      <view class="title">手机号</view>
      <view class="form-item">
        <view class="qh">+86 <uni-icons type="bottom" style="font-size: 40rpx"></uni-icons></view>
        <input class="uni-input" placeholder-style="color: #C9C9C9;" v-model="formData.phone" :placeholder='"请输入手机号"' />
      </view>
      <view class="code-box">
        <input class="uni-input" placeholder-style="color: #C9C9C9;" v-model="formData.code" :placeholder='"输入验证码"' />
        <view class="getCode" v-show="!isSend" @click="getCode">获取验证码</view>
        <view class="getCode" v-show="isSend">{{ sendText }}</view>
      </view>
    </view>

    <view class="form-box" v-if="current === 1">
      <view class="title">手机号</view>
      <view class="form-item">
        <view class="qh">+86 <uni-icons type="bottom" style="font-size: 40rpx"></uni-icons></view>
        <input class="uni-input" placeholder-style="color: #C9C9C9;" v-model="newPhoneFormData.phone"
          :placeholder='"请输入手机号"' />
      </view>
      <view class="code-box">
        <input class="uni-input" placeholder-style="color: #C9C9C9;" v-model="newPhoneFormData.code"
          :placeholder='"输入验证码"' />
        <view class="getCode" v-show="!isSend" @click="getCode">获取验证码</view>
        <view class="getCode" v-show="isSend">{{ sendText }}</view>
      </view>
    </view>
    <view class="submit-btn" v-if="current === 0" @click="submitForm">下一步</view>
    <view class="submit-btn" v-if="current === 1" @click="submitForm">立即绑定</view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { checkPhone } from "../../../utils/common.js"
import { getVCode, checkCode } from "../../../utils/common/index";
import { updateOldPhone, updateNewPhone } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "upMobile",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "验证旧手机号",
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      nickname: '',
      isSend: false,
      countDown: 60,
      current: 0,
      formData: {
        phone: '',
        verificationToken: '',
        code: ''
      },
      newPhoneFormData: {
        phone: '',
        verificationToken: '',
        code: ''
      },
      timerId: null,
      sendText: '',
    }
  },
  methods: {
    /**
     * 获取验证码
     */
    getCode() {
      let params = {};
      if (this.current === 0) {
        const phone = this.formData.phone
        if (!checkPhone(phone)) return false
        params = { phone: this.formData.phone, type: "findPwd" }
      } else {
        const phone = this.newPhoneFormData.phone
        if (!checkPhone(phone)) return false
        params = { phone: this.newPhoneFormData.phone, type: "findPwd" }
      }
      getVCode(params).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: '发送成功',
            duration: 1000,
            icon: "none"
          })
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
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkOldPhoneCode() {
      checkCode({
        phone: this.formData.phone,
        type: "findPwd",
        code: this.formData.code
      }).then(res => {
        if (res.code === 200) {
          this.sendText = ''
          this.isSend = false
          clearInterval(this.timerId);
          this.formData.verificationToken = res.result.verificationToken
          updateOldPhone({
            phone: this.formData.phone,
            verificationToken: res.result.verificationToken
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.current = 1
              this.title = '验证新手机号'
            } else if (res.code === 500) {
              uni.showToast({
                title: res.message,
                icon: "none"
              })
            }
          })
        } else if (res.code === 500) {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    },
    checkNewPhoneCode() {
      checkCode({
        phone: this.newPhoneFormData.phone,
        type: "findPwd",
        code: this.newPhoneFormData.code
      }).then(res => {
        if (res.code === 200) {
          updateNewPhone({
            phone: this.newPhoneFormData.phone,
            verificationToken: res.result.verificationToken,
            oldVerificationToken: this.formData.verificationToken
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.current = 1
              uni.$emit('setSucc', { msg: "绑定成功" })
              backPage()
            } else if (res.code === 500) {
              uni.showToast({
                title: res.message,
                icon: "none"
              })
            }
          })
        } else if (res.code === 500) {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    },
    submitForm() {//提交表单
      console.log(this.formData)
      if (this.current === 0) {
        this.checkOldPhoneCode()
      } else {
        this.checkNewPhoneCode()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  background: #FFFFFF;
  min-height: var(--vh);
  font-family: 'PingFang SC';

  .form-box {
    margin-top: 60rpx;
    padding: 0 40rpx;

    .title {
      font-style: normal;
      font-weight: 400;
      font-size: 30rpx;
      color: #333333;
    }

    .form-item {
      height: 90rpx;
      border-radius: 20rpx;
      display: flex;
      background: #FFFFFF;
      margin-top: 14rpx;
      border: 1px solid #DADADA;

      .qh {
        width: 130rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        border-radius: 20rpx;

      }

      .uni-input {
        width: 540rpx;
        height: 90rpx;
        background: #F5F5F5;
        text-align: left;
        border: 0px;
        padding-left: 10rpx;
      }
    }

    .code-box {
      height: 90rpx;
      border-radius: 20rpx;
      display: flex;
      background: #FFFFFF;
      margin-top: 20rpx;
      border: 1px solid #DADADA;

      .uni-input {
        width: 450rpx;
        height: 90rpx;
        background: #F5F5F5;
        text-align: left;
        border: 0px;
        padding-left: 10rpx;
      }

      .getCode {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 220rpx;
        font-weight: 300;
        font-size: 30rpx;
        color: #3881A8;
      }
    }
  }

  .submit-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 75rpx auto;
    width: 705rpx;
    height: 90rpx;
    background: #16A7FB;
    border-radius: 50rpx;
    font-weight: 500;
    font-size: 34rpx;
    color: #FFFFFF;
  }
}
</style>