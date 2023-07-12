<template>
  <uni-popup ref="balance" background-color="#fff">
    <view class="balance-box">
      <view class="image-item">
        <image src="../../../static/img/liuhe/cart/money.png"></image>
      </view>
      <view class="tips">您的账户余额不足</view>
      <view class="tips-desc">请充值后完成投注</view>
      <view class="btn-box">
        <view class="give-up" @click="closeModal">放弃投注</view>
        <view class="recharge" @click="toCharge">立即充值</view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  methods:{
    closeModal(){
      this.$refs.balance.close();
    },
    toCharge(){
      uni.navigateTo({
        url:'/pages/pay/index'
      })
    },
    open(){
      this.$refs.balance.open("center");
    }
  }
}
</script>
<style lang="scss" scoped>
.balance-box{
  width: 620rpx;
  padding: 40rpx;
  .image-item{
    margin-top: 36rpx;
    margin-bottom: 42rpx;
    display: flex;
    justify-content: center;
    image{
      height: 160rpx;
      width: 160rpx;
    }
  }
  .tips{
    width: 100%;
    height: 48rpx;
    font-size: 34rpx;
    line-height: 48rpx;
    text-align: center;
    color: #222222;
  }
  .tips-desc{
    height: 36rpx;
    line-height: 36rpx;
    text-align: center;
    color: #999999;
    font-size: 26rpx;
  }
  .btn-box{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 53rpx;
    .give-up{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10rpx;
      gap: 10rpx;

      width: 260rpx;
      height: 70rpx;

      background: #FFFFFF;
      border: 1rpx solid #119999;
      border-radius: 50rpx;

      /* Inside auto layout */

      flex: none;
      order: 0;
      flex-grow: 0;
      color: #119999;
      font-size: 28rpx;
      margin-right: 10rpx;
    }
    .recharge{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10rpx;
      gap: 10rpx;

      width: 260rpx;
      height: 70rpx;

      background: #3881A8;
      border-radius: 50rpx;

      /* Inside auto layout */

      flex: none;
      order: 1;
      flex-grow: 0;
      font-size: 28rpx;
      color: #fff;
      margin-left: 10rpx;
    }
  }
}


</style>
