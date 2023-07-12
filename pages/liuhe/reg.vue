<template>
  <view class="reg">
    <view class="safe" :style="{ height: safeHeight, backgroundColor: '#03536E' }"></view>
    <view class="header">
      <view class="header-box">
        <uni-icons class="icon-item" type="back" color="#ffffff" @click="backPage()"></uni-icons>
        <view class="right" @click="toUrl('/pages/user/service/index')">{{ $t("liuhe.login.kefu") }}</view>
      </view>
    </view>
    <view class="form-box">
      <view class="title">{{ $t("liuhe.reg.form.title") }}</view>
      <!--用户名-->
      <FormItem ref="user" v-model="formData.phone" :rules="phoneVaildate" :placeholder='$t("liuhe.enter.user")'
        :labelName="$t('liuhe.username')" />
      <!--密码-->
      <FormItem ref="pwd" v-model="formData.pwd" :rules="pwdVaildate" :isPassword="true" :showPassword="true"
        :showType="true" :placeholder='$t("liuhe.enter.password")' :labelName="$t('liuhe.password')" />
      <!--确认密码-->
      <FormItem v-model="formData.repwd" ref="repwd" :eachValue="formData.pwd" :rules="repwdVaildate" :isPassword="true"
        :showPassword="true" :placeholder='$t("liuhe.enter.repassword")' :labelName="$t('liuhe.repassword')" />
      <!--真实姓名-->
      <FormItem v-model="formData.truename" ref="truename" :requied="true" :rules="truenameVaildate" :showClear="false"
        :showTipsIcon="false" :tipsMsg='$t("liuhe.enter.truename.err")' :placeholder='$t("liuhe.enter.truename")'
        :labelName="$t('liuhe.truename')" />
      <!--邀请码-->
      <FormItem v-model="formData.inviteCode" ref="inviteCode" :disabled="inviteCodeDisabled" optional :showClear="false"
        labelName="邀请码" />
      <!--      <view class="form-item">
        <view class="label">{{ $t("liuhe.password") }}</view>
        <view class="input-view">
          <input class="uni-input" v-model="formData.pwd" :placeholder='$t("liuhe.enter.password")' :password="showPassword" />
        </view>
        <view class="show" @click="changePassword">
          <image v-if="showPassword" src="/static/img/liuhe/login/baneye.png"></image>
          <image v-else src="/static/img/liuhe/login/eye.png"></image>
        </view>
      </view>-->
      <!--确认密码-->
      <!--      <view class="form-item">
        <view class="label">{{ $t("liuhe.repassword") }}</view>
        <view class="input-view">
          <input class="uni-input" v-model="formData.repwd" :placeholder='$t("liuhe.enter.repassword")' :password="showRePassword" />
        </view>
        <view class="show" @click="changeRePassword">
          <image v-if="showRePassword" src="/static/img/liuhe/login/baneye.png"></image>
          <image v-else src="/static/img/liuhe/login/eye.png"></image>
        </view>
      </view>-->
      <!--真实姓名-->
      <!--      <view class="form-item">
        <view class="label">{{ $t("liuhe.truename") }}</view>
        <view class="input-view">
          <input class="uni-input" v-model="formData.phone" :placeholder='$t("liuhe.enter.truename")' />
        </view>
        <view class="show">{{ $t("liuhe.reg.required") }}</view>
      </view>-->
      <view class="reg-btn" @click="reg">{{ $t("liuhe.reg.btn.text") }}</view>
      <view class="reg-tips">{{ $t("liuhe.reg.tips") }}</view>
      <view class="reg-pact" @click="toUrl('/pages/liuhe/pact')">《{{ $t("liuhe.reg.pact") }}》</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { regAndLoginLiu } from "../../utils/common/index";
import FormItem from "./common/FormItem";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "reg",
  components: {
    AlertInjectLayer, FormItem
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: this.$t('liuhe.login.title'),
      logo: '../../static/logo.png',
      phoneVaildate: [
        { type: "required", msg: this.$t('liuhe.enter.user.err') },
        { type: "RegExp", rule: /^[0-9A-Za-z]{6,18}$/, msg: this.$t('liuhe.enter.user.err') }
      ],
      pwdVaildate: [
        { type: "MinLength", minLength: 8, msg: this.$t("liuhe.enter.password.err") }
      ],
      repwdVaildate: [
        { type: "Each", msg: this.$t("liuhe.enter.repwd.err") }
      ],
      truenameVaildate: [
        { type: "required", msg: this.$t('liuhe.enter.truename.err') }
      ],
      formData: {
        phone: '',
        pwd: '',
        repwd: '',
        truename: '',
        inviteCode: ''
      },
      inviteCodeDisabled: false
    }
  },
  onLoad(option) {
    let inviteCode = option.inviteCode || uni.getStorageSync('inviteCode')
    this.inviteCodeDisabled = !!inviteCode
    this.formData.inviteCode = inviteCode
  },
  methods: {
    backPage() {
      backPage()
    },
    changePassword() {
      this.showPassword = !this.showPassword
    },
    changeRePassword() {
      this.showRePassword = !this.showRePassword
    },
    toUrl(url) {
      uni.navigateTo({ url: url })
    },
    reg() {
      if (!this.$refs.user.succ || !this.$refs.pwd.succ || !this.$refs.repwd.succ || !this.$refs.truename.succ) {
        this.$refs.user.setRules()
        this.$refs.pwd.setRules()
        this.$refs.repwd.setRules()
        this.$refs.truename.setRules()
        return false
      }
      let sys = {}
      uni.getSystemInfo({
        success: function (res) {
          sys = res
        }
      })
      let prams = {
        confirmPwd: this.formData.repwd,
        deviceId: sys.deviceId,
        phoneType: sys.deviceType,
        pwd: this.formData.pwd,
        realName: this.formData.truename,
        userName: this.formData.phone,
        inviteCode: this.formData.inviteCode
      }
      regAndLoginLiu(prams).then(res => {
        if (res.code == 200) {
          uni.setStorageSync('userInfo', res.result.user);
          uni.setStorageSync('token', res.result.token);
          this.$store.dispatch("initUserInfo");
          this.toUrl("./set_data")
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reg {
  background: #ffffff;
  height: var(--vh);
  font-family: 'PingFang SC';

  .header {
    height: 242rpx;
    background-image: url("/static/img/liuhe/login/back1.png");
    background-position: bottom;
    background-size: 100%;
    background-repeat: no-repeat;

    .header-box {
      display: flex;
      justify-content: space-between;
      padding-top: 21.55rpx;
      align-items: center;

      .icon-item {
        font-size: 45rpx !important;
        margin-left: 40rpx;
      }

      .right {
        font-weight: 400;
        font-size: 28rpx;
        color: #FFFFFF;
        margin-right: 22rpx;
        display: flex;
        align-items: center;
      }
    }
  }

  .form-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      height: 50rpx;
      font-style: normal;
      font-weight: 400;
      font-size: 36rpx;
      color: #222222;
      text-align: center;
      margin-top: 65rpx;
      margin-bottom: 80rpx;
    }

    .reg-btn {
      width: 630rpx;
      height: 100rpx;
      background: #16A7FB;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 100rpx;
      text-align: center;
      color: #FFFFFF;
    }

    .reg-tips {
      margin-top: 30rpx;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 30rpx;
      color: #999999;
    }

    .reg-pact {
      margin-top: 16rpx;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 30rpx;
      color: #8CB2C9;
    }
  }
}
</style>