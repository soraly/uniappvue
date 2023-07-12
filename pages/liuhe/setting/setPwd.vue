<template>
  <view class="setting" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <view class="tips-box">
      <view class="title-box">
        <view class="icon">!</view>
        <text class="title">温馨提示</text>
      </view>
      <view class="list-text">
        <view class="text">• 定期更换密码可以让您的账户更加安全</view>
        <view class="text">• 请确保登录密码与账号名不同</view>
        <view class="text">• 密码采用字母，数字和字符混合</view>
        <view class="text">• 更换登录密码后需要重新登录</view>
      </view>
    </view>
    <view class="form-box">
      <view class="form-item">
        <view class="title">
          请输入旧密码
        </view>
        <view class="input-box">
          <input class="uni-input" v-model="formData.oldPwd" :placeholder='"请输入旧密码"' />
        </view>
      </view>

      <view class="form-item">
        <view class="title">
          请输入新登录密码
        </view>
        <FormItem ref="pwd" v-model="formData.newPwd" :inputStyle="{ paddingLeft: '40rpx' }" :showLabel="false"
          :rules="pwdVaildate" :isPassword="true" :showPassword="true" :showType="true"
          :placeholder='$t("liuhe.enter.password")' :labelName="$t('liuhe.password')" />
      </view>

      <view class="form-item">
        <view class="title">
          请再次输入新密码
        </view>
        <FormItem v-model="formData.confirmNewPwd" :inputStyle="{ paddingLeft: '40rpx' }" ref="repwd" :showLabel="false"
          :eachValue="formData.newPwd" :rules="repwdVaildate" :isPassword="true" :showPassword="true"
          :placeholder='$t("liuhe.enter.password")' :labelName="$t('liuhe.repassword')" />
      </view>

    </view>
    <view class="btn-box" @click="submitForm">确定</view>
    <view class="forget">
      忘记密码？<text class="kefu">联系客服</text>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import FormItem from "../common/FormItem";
import { updatePassword } from "../../../utils/user/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "setNickname",
  components: {
    AlertInjectLayer, NavBar, FormItem
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "修改昵称",
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      showNewPassword: true,
      showReNewPassword: true,
      isAction: true,
      pwdVaildate: [
        { type: "MinLength", minLength: 8, msg: this.$t("liuhe.enter.password.err") }
      ],
      repwdVaildate: [
        { type: "Each", msg: this.$t("liuhe.enter.repwd.err") }
      ],
      formData: {
        oldPwd: "",
        newPwd: "",
        confirmNewPwd: ""
      }
    }
  },
  methods: {
    submitForm() {
      if (!this.$refs.pwd.succ || !this.$refs.repwd.succ) {
        this.$refs.pwd.setRules()
        this.$refs.repwd.setRules()
        return false
      }
      updatePassword(this.formData).then(res => {
        if (res.code === 200) {
          this.isAction = false
          uni.$emit('setSucc', { msg: res.message })
          backPage()
        } else if (res.code === 500) {
          pop(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  background: #FFFFFF;
  min-height: var(--vh);
  font-family: 'PingFang SC';

  .tips-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20rpx 0px 0px 20rpx;
    height: 180rpx;
    background: #FFF2DF;

    .title-box {
      display: flex;

      .icon {
        background: #FF9912;
        border-radius: 50%;
        height: 30rpx;
        width: 30rpx;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 5rpx;
      }

      .title {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 26rpx;
        color: #222222;
      }
    }

    .list-text {
      margin-left: 20rpx;

      .text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 22rpx;
        color: #999999;
      }
    }
  }

  .form-box {
    .form-item {
      padding: 42.5rpx 60rpx 0;

      .title {
        font-weight: 400;
        font-size: 26rpx;
        color: #708069;
        margin-left: 26rpx;
        margin-bottom: 20rpx;
      }

      .input-box {
        position: relative;

        .uni-input {
          box-sizing: border-box;
          /* 自动布局 */
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 630rpx;
          height: 100rpx;
          background: #F5F5F5;
          border: 1px solid #E2E2E3;
          border-radius: 50rpx;
          text-align: left;
          padding: 0 40rpx;
        }

        .show {
          position: absolute;
          top: 26rpx;
          right: 26rpx;

          image {
            height: 48rpx;
            width: 48rpx;
          }
        }
      }
    }
  }

  .btn-box {
    height: 100rpx;
    width: 630rpx;
    border-radius: 50rpx;
    margin: 45rpx auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #16A7FB;
    font-weight: 500;
    font-size: 32rpx;
    color: #FFFFFF;
  }

  .forget {
    margin-top: 35rpx;
    text-align: center;
    font-weight: 500;
    font-size: 24rpx;
    color: #333333;

    .kefu {
      text-decoration-line: underline;
      color: #0099CC;
    }
  }
}
</style>