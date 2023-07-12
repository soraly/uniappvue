<template>
  <uni-popup ref="testLogin" type="center">
    <view class="logout">
      <view class="img">
        <image src="/static/img/liuhe/coinLogin.png"></image>
      </view>
      <view class="msg">
        试玩登陆成功，试玩金额：2000.00
      </view>
      <view class="btn" @click="closePop">
        知道了
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "TestLogin",
  methods:{
    showPop(){
      this.$refs.testLogin.open()
    },
    closePop(){
      this.$refs.testLogin.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.logout{
  height: 385rpx;
  width: 540rpx;
  border-radius: 10rpx;
  background: #FFFFFF;
  .img{
    display: flex;
    justify-content: center;
    align-items: center;
    image{
      height: 130rpx;
      width: 118rpx;
      margin-top: 50rpx;
    }
  }
  .msg{
    margin: 38rpx 0 48rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #222222;
    text-align: center;
  }
  .btn{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: auto;
    width: 200rpx;
    height: 60rpx;
    background: #FF9900;
    border-radius: 30rpx;
    font-weight: 500;
    font-size: 30rpx;
    line-height: 60rpx;
    text-align: center;
    color: #FFFFFF;
  }
}
</style>