<template>
  <view class="setting" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <view class="form-box">
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
    <view class="submit-btn" @click="checkNewPhoneCode">立即绑定</view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { checkPhone } from "../../../utils/common.js"
import { getVCode, checkCode } from "../../../utils/common/index";
import { bindMobile } from "../../../utils/user/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "setMobile",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "绑定手机",
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
      formData: {
        phone: '',
        verificationToken: '',
        code: ''
      },
      sendText: '',
    }
  },
  methods: {
    /**
     * 获取验证码
     */
    getCode() {
      let params = {};
      const phone = this.formData.phone
      if (!checkPhone(phone)) return false
      params = { phone: this.formData.phone, type: "bind" }
      getVCode(params).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: '发送成功',
            duration: 1000,
            icon: "none"
          })
          this.isSend = true
          let timerId = setInterval(() => {
            this.countDown--;
            this.sendText = this.countDown + "秒后重试";
            if (this.countDown <= 0) {
              clearInterval(timerId);
              this.countDown = 60;
              this.isSend = false
            }
          }, 1000);
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkNewPhoneCode() {
      checkCode({
        phone: this.formData.phone,
        type: "bind",
        code: this.formData.code
      }).then(res => {
        if (res.code === 200) {
          bindMobile({
            mobile: this.formData.phone,
            verificationToken: res.result.verificationToken,
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
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
        border: 0rpx;
        border-radius: 20rpx 0 0 20rpx;
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