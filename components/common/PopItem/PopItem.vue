<template>
  <view class="pop-box">
    <view class="top">
      {{ msg }}
    </view>
    <view class="btn-box">
      <view class="forget" @click="forget">忘记密码?</view>
      <view class="retry" @click="retry">重试</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PopItem",
  props:{
    msg:{
      type:String,
      default:''
    }
  },
  methods:{
    forget(){
      uni.navigateTo({
        url:'/pages/user/service/index'
      })
    },
    retry(){
      this.$emit("retry");
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box{
  width: 640rpx;
  border-radius: 10rpx;
  background: #FFFFFF;
  font-family: 'PingFang SC';
  .top{
    height: 215rpx;
    padding: 0 50rpx;
    border-bottom: 1px solid #EBEBEB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 32rpx;
    color: #000000;
  }
  .btn-box{
    height: 100rpx;
    display: flex;
    .forget{
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 34rpx;
      color: #000000;
      border-right: 1px solid #EBEBEB;
    }
    .retry{
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 34rpx;
      color: #576B95;
    }
  }
}
</style>