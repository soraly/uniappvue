<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <view class="header-box">
      <div class="header" :style="{ marginTop: safeHeight }">
        <view class="box-bg">
          <uni-nav-bar backgroundColor="#fff" height="46" color="#ffffff" :border="false" rightWidth="65px">
            <block slot="left">
              <uni-icons @click="back" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
            </block>
          </uni-nav-bar>
        </view>
      </div>
    </view>
    <view class="form-box" v-show="!isGetCode">
      <h4>忘记密码</h4>
      <uni-forms :modelValue="formData" ref="valiForm">
        <uni-forms-item name="phone" class="form-item">
          <input type="text" maxlength="11" v-model="formData.phone" placeholder="输入您的手机号码" />
        </uni-forms-item>
        <uni-forms-item name="msgCode" class="form-item">
          <input type="text" v-model="formData.code" placeholder="输入验证码" maxlength="6" style="width: 180px" />
          <view class="code">
            <span size="small" type="primary" class="get-code" @click="getCode" v-show="!isSend">获取验证码</span>
            <span size="small" type="primary" class="get-code" v-show="isSend">{{ sendText }}</span>
          </view>
        </uni-forms-item>
      </uni-forms>
      <div class="btn primary-btn" @click="nextBtn">下一步</div>
    </view>
    <view class="form-box" v-show="isGetCode">
      <h4>设置您的密码</h4>
      <uni-forms :modelValue="formData" ref="valiForm1">
        <uni-forms-item name="phone" class="form-item">
          <input type="password" v-model="formData.pwd" placeholder="请设置您的密码" />
        </uni-forms-item>
        <uni-forms-item name="phone" class="form-item">
          <input type="password" v-model="formData.repwd" placeholder="请再输入一次" />
        </uni-forms-item>
      </uni-forms>
      <div class="btn primary-btn" @click="update">下一步</div>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { getVCode, findPwd, checkCode } from '../../utils/common/index.js'
import { checkPhone, codeCheck } from "../../utils/common.js"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
  },
  name: "forgotpwd",
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      countDown: 60,
      isSend: false,
      isGetCode: false,
      sendText: '',
      formData: {
        phone: '',
        type: 'findPwd',
        code: '',
        pwd: '',
        verificationToken: '',
        repwd: ""
      }
    }
  },
  methods: {
    //返回
    back: function () {
      if (this.isGetCode) {
        this.isGetCode = false
        this.isSend = false
        this.sendText = ''
      } else {
        backPage()
      }
    },
    getCode: function () {
      const phone = this.formData.phone
      if (!checkPhone(phone)) return false
      let prams = { phone: this.formData.phone, type: this.formData.type }
      getVCode(prams).then(res => {
        if (res.code == 200) {
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
        } else {
          pop(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    nextBtn: function () {
      const phone = this.formData.phone
      const code = this.formData.code
      if (!checkPhone(phone)) return false
      if (!codeCheck(code)) return false
      let prams = {
        phone: this.formData.phone,
        type: this.formData.type,
        code: this.formData.code
      }
      checkCode(prams).then(res => {
        if (res.code == 200) {
          this.isGetCode = true
          this.formData.verificationToken = res.result.verificationToken
        } else {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: "none"
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    update: function () {
      if (this.formData.pwd != this.formData.repwd) {
        uni.showToast({
          title: '两次输入的密码不一致',
          duration: 2000,
          icon: "none"
        })
      }
      let prams = {
        phone: this.formData.phone,
        confirmPwd: this.formData.repwd,  //确认密码
        pwd: this.formData.pwd,
        verificationToken: this.formData.verificationToken
      }
      findPwd(prams).then(res => {
        if (res.code == 200) {
          uni.navigateTo({
            url: "/pages/liuhe/login" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
          });
        } else {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: "none"
          })
        }
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
  height: var(--vh);
}

.form-box {
  padding: 63px 27px 0;
}

.form-box h4 {
  font-size: 26px;
  line-height: 36px;
  color: #444;
  margin-bottom: 36px;
}

.code {
  position: absolute;
  right: 0px;
  top: 8px;
  color: #07c160;
  font-size: 14px;
}

.btn.primary-btn {
  width: 100%;
  border-radius: 3px;
  margin: 40px auto;
  background: #07c160;
  height: 44px;
  line-height: 44px;
  color: #fff;
  font-size: 16px;
  text-align: center;
}
</style>