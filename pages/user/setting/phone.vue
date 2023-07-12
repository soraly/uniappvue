<template>
  <view class="change-phone-warp" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="change-phone-form" v-if="current === 0">
      <uni-forms :modelValue="formData" ref="valiForm">
        <uni-forms-item name="phone" class="form-item phone-form-item">
          <input type="text" v-model="formData.phone" maxlength="11" placeholder-style="color: #c9c9cb;"
            placeholder="输入您的手机号码" />
        </uni-forms-item>
        <uni-forms-item name="msgCode" class="form-item phone-form-item">
          <uni-row>
            <uni-col :span="18">
              <input type="text" v-model="formData.code" maxlength="6" placeholder-style="color: #c9c9cb;"
                placeholder="输入验证码" />
            </uni-col>
            <uni-col :span="6">
              <view class="code">
                <span size="small" type="primary" class="get-code" @click="getCode" v-show="!isSend">获取验证码</span>
                <span size="small" type="primary" class="get-code" v-show="isSend">{{ sendText }}</span>
              </view>
            </uni-col>
          </uni-row>
        </uni-forms-item>
      </uni-forms>
      <button class="btn primary-btn" @click="submitForm">保存</button>
    </view>
    <view class="change-phone-form" v-if="current === 1">
      <uni-forms :modelValue="newPhoneFormData" ref="valiForm">
        <uni-forms-item name="phone" class="form-item phone-form-item">
          <input type="text" v-model="newPhoneFormData.phone" maxlength="11" placeholder-style="color: #c9c9cb;"
            placeholder="输入您的新手机号码" />
        </uni-forms-item>
        <uni-forms-item name="msgCode" class="form-item phone-form-item">
          <uni-row>
            <uni-col :span="18">
              <input type="text" v-model="newPhoneFormData.code" maxlength="6" placeholder-style="color: #c9c9cb;"
                placeholder="输入验证码" />
            </uni-col>
            <uni-col :span="6">
              <view class="code">
                <span size="small" type="primary" class="get-code" @click="getCode" v-show="!isSend">获取验证码</span>
                <span size="small" type="primary" class="get-code" v-show="isSend">{{ sendText }}</span>
              </view>
            </uni-col>
          </uni-row>
        </uni-forms-item>
      </uni-forms>
      <button class="btn primary-btn" @click="submitForm">保存</button>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import { updateOldPhone, updateNewPhone } from "../../../utils/user";
import { logout } from "@/utils/common/index.js";
import { getVCode, checkCode } from "../../../utils/common/index.js";
import { checkPhone } from "../../../utils/common.js"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  components: {
    AlertInjectLayer, UniCol, NavBar
  },
  data() {
    return {
      title: "修改手机",
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      current: 0,
      sendText: '',
      isSend: false,
      customStyle: {
        color: "#ffffff",
      },// 自定义样式
      countDown: 60,
      formData: {
        phone: '',
        verificationToken: '',
        code: ''
      },
      newPhoneFormData: {
        phone: '',
        verificationToken: '',
        code: ''
      }
    }
  },
  onLoad() {

  },
  onReady() {
    this.isLogin = global.isLogin()
    if (this.isLogin) {
      this.userInfo = uni.getStorageSync('userInfo');
      this.formData.phone = this.userInfo.phone;
    }
  },
  methods: {
    back() {//返回
      uni.navigateBack()
    },
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
    checkOldPhoneCode() {
      checkCode({
        phone: this.formData.phone,
        type: "findPwd",
        code: this.formData.code
      }).then(res => {
        if (res.code === 200) {
          this.sendText = ''
          this.isSend = false
          this.formData.verificationToken = res.result.verificationToken
          updateOldPhone({
            phone: this.formData.phone,
            verificationToken: res.result.verificationToken
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.current = 1
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
              uni.showToast({
                title: res.message,
              })
              this.setLogout()
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
    setLogout() {
      logout().then(res => {
        if (res.code === 200) {
          this.$store.dispatch("userLoginOut");
          uni.navigateTo({
            url: "/pages/liuhe/login"
          });
        } else {
          uni.showToast({
            title: '退出失败',
            duration: 2000,
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
.change-phone-warp {
  background-color: #f8f8f8;
}

.change-phone-form {
  margin-top: 16px;

  .primary-btn {
    margin-top: 22px;
  }

  .btn.primary-btn {
    width: calc(100% - 22px);
    margin: 0 auto;
    background: #07c160;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    border-radius: 20px;
  }

  .phone-form-item {
    background-color: #ffffff;
    padding: 16rpx 18rpx;
    font-size: 28rpx;
    line-height: 48rpx;

    input {
      font-size: 28rpx;
    }

    .code {
      .get-code {
        color: #07c160;
        line-height: 35px;
      }
    }
  }

}

.uni-forms-item__content {
  border: none !important;
}

.uni-forms-item[data-v-61dfc0d0] {
  margin-bottom: 16rpx !important;
}
</style>
