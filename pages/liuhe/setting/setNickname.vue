<template>
  <view class="setting" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <view class="title">给自己取一个喜欢的昵称</view>
    <view class="input-box">
      <input class="uni-input" v-model="nickname" :placeholder='"请勿以手机号/真实姓名为昵称"' />
      <view class="tips">只能输入中文、英文、数字（2-10字符）</view>
    </view>
    <view class="btn-box" @click="confirmBtn">确定</view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { updateUsername } from "../../../utils/user/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "setNickname",
  components: {
    AlertInjectLayer, NavBar
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
      nickname: '',
    }
  },
  methods: {
    confirmBtn() {//提交表单
      if (this.nickname == '') {
        pop("请输入昵称", 2000)
        return false
      }
      updateUsername({ uname: this.nickname }).then(res => {
        if (res.code === 200) {
          uni.$emit('setSucc', { msg: "设置成功" })
          backPage()
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
.setting {
  background: #FFFFFF;
  min-height: var(--vh);
  font-family: 'PingFang SC';

  .title {
    height: 95rpx;
    font-weight: 500;
    font-size: 26rpx;
    line-height: 95rpx;
    text-align: center;
    color: #222222;
  }

  .input-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .uni-input {
      height: 100rpx;
      width: 680rpx;
      border-radius: 50rpx;
      background: #F5F5F5;
      border: 2rpx solid #E9E9E9;
    }

    .tips {
      margin-top: 29rpx;
      font-weight: 500;
      font-size: 22rpx;
      text-align: center;
      color: #999999;
    }
  }

  .btn-box {
    height: 90rpx;
    width: 705rpx;
    border-radius: 50rpx;
    margin: 59rpx auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #16A7FB;
    font-weight: 500;
    font-size: 32rpx;
    color: #FFFFFF;
  }
}
</style>