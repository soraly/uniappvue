<template>
  <view class="mint-tab-container-item"
    :style="'margin-top:' + safeHeight + ';height:calc(var(--vh) - ' + safeHeight + ')'">
    <!--顶部导航栏-->
    <view class="header-box">
      <div class="header" :style="{ marginTop: safeHeight }">
        <view class="box-bg">
          <uni-nav-bar backgroundColor="#fff" height="55" color="#ffffff" :border="false" rightWidth="65px">
            <block slot="left">
              <uni-icons @click="back" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
            </block>
          </uni-nav-bar>
        </view>
      </div>
    </view>
    <view class="form-box" v-show="isGetCode == 1">
      <h4>手机注册</h4>
      <uni-forms :modelValue="formData" ref="valiForm">
        <uni-forms-item name="phone" class="form-item">
          <input type="text" v-model="formData.phone" maxlength="11" placeholder="输入您的手机号码" />
        </uni-forms-item>
        <uni-forms-item name="msgCode" class="form-item">
          <input type="text" v-model="formData.code" maxlength="6" placeholder="输入验证码" style="width: 180px" />
          <view class="code">
            <span size="small" type="primary" class="get-code" @click="getCode" v-show="!isSend">获取验证码</span>
            <span size="small" type="primary" class="get-code" v-show="isSend">{{ sendText }}</span>
          </view>
        </uni-forms-item>
      </uni-forms>
      <div class="btn primary-btn" @click="nextBtn">下一步</div>
    </view>
    <view class="form-box" v-show="isGetCode == 2">
      <h4>设置您的密码</h4>
      <uni-forms :modelValue="formData" ref="valiForm1">
        <uni-forms-item name="pwd" class="form-item">
          <input type="password" v-model="formData.pwd" placeholder="请设置您的密码" />
        </uni-forms-item>
        <uni-forms-item name="repwd" class="form-item">
          <input type="password" v-model="formData.repwd" placeholder="请再输入一次" />
        </uni-forms-item>
      </uni-forms>
      <div class="btn primary-btn" @click="reg">下一步</div>
    </view>
    <view class="form-box" v-show="isGetCode == 3">
      <span :style="{ marginTop: safeHeight }" class="step" @click="tiaoguo()">跳过</span>
      <h4>完善您的个人资料</h4>
      <uni-forms :modelValue="formData" ref="valiForm1">
        <div class="person-icon" @click="upload">
          <div class="van-uploader">
            <div class="van-uploader__wrapper">
              <div class="van-uploader__input-wrapper">
                <image :src="headerPic"></image>
                <span>点击设置头像</span>
              </div>
            </div>
          </div>
        </div>
        <uni-forms-item name="uname" class="form-item">
          <input type="text" v-model="formData.uname" placeholder="请设置您的昵称（选填）" />
        </uni-forms-item>
        <uni-forms-item name="inviteCode" class="form-item">
          <input type="text" v-model="formData.inviteCode" placeholder="填写您的邀请码（选填）" />
        </uni-forms-item>
      </uni-forms>
      <div class="btn primary-btn" @click="setData">下一步</div>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { getVCode, regAndLogin, checkCode, updateUser } from '../../utils/common/index.js'
import { checkPhone, codeCheck } from "../../utils/common.js"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
  },
  name: "register",
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      countDown: 60,
      isSend: false,
      isGetCode: 1,
      sendText: '',
      headerPic: '../../static/img/user/touxiang.png',
      formData: {
        phone: '',
        type: 'register',
        code: '',
        pwd: '',
        verificationToken: '',
        repwd: "",
        uname: '',
        inviteCode: '',
        headerPic: '',
        phoneType: ''
      }
    }
  },
  onLoad() {
    console.log(uni.$system)
    this.setPhoneType()
  },
  methods: {
    setPhoneType() {
      this.formData.phoneType = uni.$system.deviceModel;
    },
    //返回
    back: function () {
      uni.navigateBack({
        delta: 1,//返回层数，2则上上页
      })
    },
    //图像上传
    upload: function () {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          let token = uni.getStorageSync('token')
          uni.uploadFile({
            url: this.$config.me_base_url + '/api/user/upImg', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            header: { 'X-Access-Token': token },
            success: (uploadFileRes) => {
              let data = JSON.parse(uploadFileRes.data);
              console.log(data);
              if (data.code == 200) {
                this.headerPic = data.result.pictureUrl
                this.formData.headerPic = data.result.pictureUrl
              } else {
                pop(data.message, 2000)
              }
            }
          });
        }
      });

    },
    //获取验证码
    getCode: function () {
      const phone = this.formData.phone
      if (!checkPhone(phone)) {
        pop("请检查手机格式", 2000)
        return false
      }
      let prams = { phone: this.formData.phone, type: this.formData.type }
      getVCode(prams).then(res => {
        if (res.code == 200) {
          pop('发送成功', 1000)
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
          pop(res.message, 2000)
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
        code: this.formData.code,
      }
      checkCode(prams).then(res => {
        pop(res.message, 2000)
        if (res.code == 200) {
          this.isGetCode = 2
          this.formData.verificationToken = res.result.verificationToken
        }
      }).catch(err => {
        console.log(err)
      })
    },
    reg: function () {
      if (this.formData.pwd != this.formData.repwd) {
        pop('两次输入的密码不一致', 2000)
        return false
      }
      let prams = {
        phone: this.formData.phone,
        pwd: this.formData.pwd,
        verificationToken: this.formData.verificationToken,
        phoneType: this.formData.phoneType
      }
      regAndLogin(prams).then(res => {
        if (res.code == 200) {
          uni.setStorageSync('userInfo', res.result.user);
          uni.setStorageSync('token', res.result.token);
          this.$store.dispatch("initUserInfo");
          this.isGetCode = 3
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //跳过
    tiaoguo: function () {
      const urlMap = {
        ALL: '/pages/home/index/Index',
        LIUHE: '/pages/pages-liuhe/index',
        LUNTAN: '/pages/pages-luntan/index'
      }

      uni.reLaunch({
        url: urlMap[this.$config.station] // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    //设置资料
    setData: function () {
      let prams = {
        uname: this.formData.uname,
        inviteCode: this.formData.inviteCode,
        headImgUrl: this.formData.headerPic
      }
      if (prams.uname == '' && prams.inviteCode == '' && prams.headImgUrl == '') {
        this.tiaoguo()
        return
      }
      if ((prams.uname || prams.inviteCode) && prams.headImgUrl == '') {
        pop('请上传头像', 2000)
        return false;
      }
      updateUser(prams).then(res => {
        if (res.code == 200) {
          this.tiaoguo()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {

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

.step {
  position: absolute;
  color: #444;
  font-size: 30rpx;
  line-height: 42rpx;
  top: 88rpx;
  right: 54rpx;
}

.person-icon {
  margin-bottom: 46rpx;
}

.van-uploader {
  position: relative;
  display: inline-block;
}

.van-uploader__wrapper {
  display: flex;
  flex-wrap: wrap;
}

.person-icon .van-uploader__input-wrapper {
  height: 110rpx;
  line-height: 110rpx;
  color: #444;
  font-size: 30rpx;
}

.van-uploader__input-wrapper {
  position: relative;
}

.person-icon .van-uploader__input-wrapper image,
.person-icon .van-uploader__input-wrapper span {
  float: left;
}

.person-icon .van-uploader__input-wrapper image {
  width: 110rpx;
  height: 110rpx;
  margin-right: 30rpx;
  border-radius: 50%;
}
</style>
