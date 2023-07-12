<template>
  <view class="login-box" :style="{ marginTop: safeHeight }">
    <view class="safe" :style="{ height: safeHeight, backgroundColor: '#03536E' }"></view>
    <view class="header">
      <view class="header-box">
        <uni-icons class="icon-item" type="back" color="#ffffff" @click="backPage()"></uni-icons>
        <view class="right" @click="toUrl('/pages/user/service/index')">{{ $t("liuhe.login.kefu") }}</view>
      </view>
      <view class="img-box">
        <image :src="logo"></image>
      </view>
    </view>
    <view class="form-box">
      <view class="input-item">
        <view class="icon">
          <image src="/static/img/liuhe/login/user.png"></image>
        </view>
        <view class="input-view">
          <input class="uni-input" v-model="formData.phone" :placeholder='$t("liuhe.enter.user")' />
        </view>
      </view>
      <view class="input-item">
        <view class="icon">
          <image src="/static/img/liuhe/login/pwd.png"></image>
        </view>
        <view class="input-view">
          <input class="uni-input" v-model="formData.pwd" :placeholder='$t("liuhe.enter.pwd")' :password="showPassword" />
        </view>
        <view class="show" @click="changePassword">
          <image v-if="showPassword" src="/static/img/liuhe/login/baneye.png"></image>
          <image v-else src="/static/img/liuhe/login/eye.png"></image>
        </view>
      </view>
      <view class="forget" @click="toUrl('/pages/user/service/index')">
        {{ $t("liuhe.forget.pwd") }}？
      </view>
    </view>
    <view class="login-btn-box">
      <view class="login-btn" @click="submit">{{ $t("liuhe.login.btn") }}</view>
    </view>
    <view class="reg-box">
      <view class="btn-item left-btn" @click="testLogin">
        <view class="img">
          <image src="/static/img/liuhe/login/head.png"></image>
        </view>
        <text class="text">{{ $t("liuhe.login.try.btn") }}</text>
      </view>
      <view class="btn-item right-btn" @click="toUrl('/pages/liuhe/reg')">
        <view class="img">
          <image src="/static/img/liuhe/login/reg.png"></image>
        </view>
        <text class="text">{{ $t("liuhe.login.reg.btn") }}</text>
      </view>
    </view>

    <uni-popup ref="confirm" type="center" background-color="#fff">
      <view class="confirm-box">
        <view class="img">
          <image src="/static/img/liuhe/login/loginErr.png"></image>
        </view>
        <view class="content">{{ errMsg }}</view>
        <view class="btn-box" @click="known">知道了</view>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { login } from "../../utils/common/index"
import defaultTemplate from "../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: this.$t('liuhe.login.title'),
      logo: '../../static/logo.png',
      showPassword: true,
      errMsg: "",
      formData: {
        phone: '',
        pwd: '',
        msgCode: '',
        type: 1,
      }
    }
  },
  onLoad() {
  },
  onShow() {
    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 22) {
          this.logo = item.url
          throw Error();
        }
      })
    } catch (err) {
    }
  },
  methods: {
    backPage() {
      backPage()
    },
    changePassword() {
      this.showPassword = !this.showPassword
    },
    toUrl(url) {
      console.log(url)
      uni.navigateTo({ url: url })
    },
    testLogin() {
      uni.reLaunch({
        url: "/pages/liuhe/index?istest=1"
      })
    },
    //检查手机格式
    checkPhone(phone) {
      let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (phone == '' || !reg.test(phone)) {
        pop(this.$t("liuhe.login.phone.empty"), 2000)
        return false
      }
      return true
    },
    known() {
      this.$refs.confirm.close()
    },
    //提交登录
    submit: function () {
      const phone = this.formData.phone
      /*if(!this.checkPhone(phone)) return false*/
      if (!this.formData.pwd) {
        pop(this.$t("liuhe.login.pwd.empty"), 2000)
        return false
      }
      let prams = this.formData;
      login(prams).then(res => {

        if (res.code == 600) {
          this.$refs.confirm.open()
          this.errMsg = res.message
          return false
        } else if (res.code == 200) {
          const { user, token } = defaultTemplate({
            user: {
              createType: '',
              id: "",
              userName: "",
              status: 1,
              phone: '',
              nickname: "",
              coin: 0,
              flowers: 0,
              score: 0,
              userLevel: 1,
              headImgUrl: "",
              izAuth: 0,
              expert: 0,
              commentStatus: 1,
              isRoom: 1,
              roomSpeak: 1,
              exchange: 1,
              remark: '',
              black: 0,
              userBlock: Boolean,
              vip: Boolean,
              concernCount: 0,
              fansCount: 0,
              collectCount: 0,
              publishCount: 0,
              thumbUpCount: 0,
              inviteCode: '',
              concern: 0,
              lastTime: '',
              medalList: [{
                conditions: "",
                filePath: "",
                hasMedal: 0,
                id: 0,
                name: "",
                remark: "",
                rewardAmount: 0,
                rewardScore: 0,
                status: 0
              }],
              userType: ""
            },
            token: ""
          }, res.result);
          uni.setStorageSync('userInfo', user);
          uni.setStorageSync('token', token);
          uni.$emit('loginUpdate', {})
          this.backPage()
          this.$nextTick(() => {
            this.$store.dispatch("appInfoStoreInit");
          })
        } else {
          pop(res.message, 2000)
          return false
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  background: #ffffff;
  height: var(--vh);

  .header {
    height: 330rpx;
    background-image: url("/static/img/liuhe/login/back.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;

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

    .img-box {
      position: absolute;
      bottom: -48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      image {
        height: 180rpx;
        width: 180rpx;
      }
    }
  }

  .form-box {
    margin-top: 76rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .input-item {
      display: flex;
      width: 630rpx;
      height: 90rpx;
      background: #E8F0FE;
      border: 1px solid #E2E2E3;
      border-radius: 50rpx;
      margin-top: 30rpx;

      .icon {
        margin-left: 52rpx;
        display: flex;
        align-items: center;

        image {
          height: 48rpx;
          width: 48rpx;
        }
      }

      .input-view {
        margin-left: 52rpx;
        width: calc(100% - 210rpx);
        height: 90rpx;

        .uni-input {
          width: 100%;
          height: 90rpx;
          line-height: 90rpx;
          border: none;
          background: none;
          text-align: left;
          font-weight: 400;
          font-size: 26rpx;
          color: #000000;
        }
      }

      .show {
        display: flex;
        align-items: center;
        margin-right: 21rpx;

        image {
          height: 48rpx;
          width: 48rpx;
        }
      }
    }

    .forget {
      margin-top: 30rpx;
      width: 630rpx;
      padding-left: 20rpx;
      font-weight: 500;
      font-size: 26rpx;
      text-align: left;
      color: #999999;
    }
  }

  .login-btn-box {
    display: flex;
    margin-top: 26.5rpx;
    justify-content: center;

    .login-btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 630rpx;
      height: 100rpx;
      background: #16A7FB;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
    }
  }

  .reg-box {
    display: flex;
    justify-content: center;
    margin-top: 30rpx;

    .btn-item {
      height: 84rpx;
      width: 294rpx;
      background: #F9F9F9;
      border: 2px solid #DCDCDC;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;

      .img {
        margin-right: 40rpx;

        image {
          height: 31rpx;
          width: 29rpx;
        }
      }

      .text {
        font-weight: 500;
        font-size: 30rpx;
      }
    }

    .left-btn {
      margin-right: 30rpx;

      .text {
        color: #333333;
      }
    }

    .right-btn {
      .text {
        color: #DF2939;
      }
    }
  }

  .confirm-box {
    height: 530rpx;
    width: 620rpx;
    border-radius: 10rpx;

    .img {
      display: flex;
      justify-content: center;
      padding: 64rpx 0;

      image {
        height: 136rpx;
        width: 114rpx;
      }
    }

    .content {
      margin: 0 70rpx;
      font-weight: 400;
      font-size: 28rpx;
      line-height: 39rpx;
      text-align: center;
      color: #666666;
    }

    .btn-box {
      height: 60rpx;
      width: 450rpx;
      margin: 64rpx 80rpx;
      border-radius: 10rpx;
      background: #FFFFFF;
      border: 1px solid #3BABAA;
      font-weight: 500;
      font-size: 28rpx;
      line-height: 60rpx;
      text-align: center;
      color: #3BABAA;
    }
  }
}
</style>