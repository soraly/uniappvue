<template>
  <view class="nickname-warp" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :isBack="isBack"></NavBar>
    <view class="nickname-form">
      <uni-forms :modelValue="userInfo">
        <uni-forms-item class="item">
          <input type="text" v-model="userInfo.nickname" placeholder-style="color: #c9c9cb;" placeholder="输入您的昵称" />
        </uni-forms-item>
      </uni-forms>
      <button class="btn primary-btn" @click="submitForm">保存</button>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { updateUsername } from "../../../utils/user";
import NavBar from "../../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      title: "修改昵称",
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      userInfo: {
        userName: ""
      },
    }
  },
  onReady() {
    this.isLogin = global.isLogin()
    if (this.isLogin) {
      this.userInfo = uni.getStorageSync('userInfo');
    }
  },

  methods: {
    back() {//返回
      uni.navigateBack()
    },
    submitForm() {//提交表单
      updateUsername({ uname: this.userInfo.nickname }).then(res => {
        console.log(res);
        if (res.code === 200) {
          uni.setStorageSync('userInfo', this.userInfo)
          uni.showToast({
            title: '昵称修改成功',
          })
          uni.navigateBack()
        } else if (res.code === 500) {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nickname-warp {
  background-color: #F8F8F8;
}

.nickname-form {
  margin-top: 12rpx;

  .item {
    background-color: #fff;
    padding: 10px 16px;
    overflow: hidden;
    color: #323233;
    font-size: 28rpx;
    line-height: 48rpx;
    height: 48rpx;
  }

  .primary-btn {
    margin-top: 22px;
  }

  .btn.primary-btn {
    width: calc(100% - 22px);
    background: #07c160;
    margin-top: 80rpx;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    border-radius: 20px;
  }
}</style>
