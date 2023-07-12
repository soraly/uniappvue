<template>
  <view :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <uni-popup ref="dialog" type="dialog" background-color="#fff">
      <uni-popup-dialog message="成功消息" :duration="2000" :before-close="true" @close="close" title=" " confirmText="立即退出"
        cancelText="再考虑一下" @confirm="confirm">
        <view slot="default" class="logout-text">是否要退出登录？</view>
      </uni-popup-dialog>
    </uni-popup>
    <uni-list>
      <uni-list-item showArrow rightText="更换头像" clickable @click="update">
        <view slot="header" class="avatar">
          <image :src='userInfo.headImgUrl' />
        </view>
      </uni-list-item>
      <uni-list-item showArrow :rightText="userInfo.nickname" title="我的昵称" clickable @click="toNickname"></uni-list-item>
      <uni-list-item title="更换手机号" showArrow link to="/pages/user/setting/phone"></uni-list-item>
      <uni-list-item title="修改密码" showArrow link to="/pages/user/setting/changePassword"></uni-list-item>
      <uni-list-item title="意见反馈" showArrow link to="/pages/user/setting/feedback"></uni-list-item>
      <uni-list-item title="关于我们" showArrow link to="/pages/user/setting/aboutUs"></uni-list-item>
    </uni-list>
    <button class="logout-btn" @click="logout">退出登录</button>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { logout } from "@/utils/common/index.js";
import NavBar from "../../../components/common/navBar/navBar";
import UniFilePicker from "../../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker";
import { config } from "../../../config/config";
import { uploadImg, updateAvatar, info } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    UniFilePicker,
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      title: "设置",
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      nickname: "186****142616355",
      avatarPath: "",
    }
  },
  onLoad() {

  },
  computed:{
    userInfo(){
      return this.$store.state.appInfoStore.userInfo||nll;
    }
  },

  onShow() {
    this.isLogin = global.isLogin()
    if (this.isLogin) {
      this.getUserInfo()
    }
  },
  methods: {
    update() {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          const uploadTask = uni.uploadFile({
            url: config.me_base_url + '/api/user/upImg',
            header: { 'X-Access-Token': uni.getStorageSync('token') },
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {},
            success: (uploadFileRes) => {
              let res = JSON.parse(uploadFileRes.data);
              this.avatarPath = res.result.pictureUrl
              updateAvatar({
                uname: this.userInfo.nickname,
                headImgUrl: this.avatarPath
              }).then(res => {
                console.log(res);
                if (res.code === 200) {
                  this.getUserInfo()
                  uni.showToast({
                    title: res.message,
                  })
                }
              })
            }
          });

          uploadTask.onProgressUpdate((res) => {
            console.log('上传进度' + res.progress);
            console.log('已经上传的数据长度' + res.totalBytesSent);
            console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

            // // 测试条件，取消上传任务。
            // if (res.progress > 50) {
            //   uploadTask.abort();
            // }
          });
        }
      });

    },

    toNickname() {//前往我的昵称
      uni.navigateTo({
        url: "/pages/user/setting/nickname",
      })
    },
    confirm() {
      logout().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$store.dispatch("userLoginOut");
          uni.reLaunch({
            url: "/pages/home/index/Index"
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
    close() {
      console.log('用户点击取消');
      this.$refs.dialog.close()
    },
    logout() {//退出登录
      this.$refs.dialog.open()
      // uni.showModal({
      //   title: '',
      //   content: '是否退出登录',
      //   cancelText:'在考虑一下',
      //   confirmText:'退出',
      //   confirmColor:'rgb(7, 193, 96)',
      //   success: function (res) {
      //     if (res.confirm) {

      //     } else if (res.cancel) {
      //       console.log('用户点击取消');
      //     }
      //   }
      // });


    }
  }
}
</script>

<style lang="scss" scoped>
.logout-btn {
  margin-top: 14px;
  text-align: center;
  height: 48px;
  line-height: 48px;
  color: #f54545;
  font-size: 16px;
  background: #fff;
}

.logout-text {
  font-size: 32rpx;
  color: #333;
  text-align: center;
  line-height: 44rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;

  image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
