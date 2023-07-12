<template>
  <view class="total-box" :class="{'total-show':isShow}">
    <view class="left">
      <view class="img">
        <image src="/static/img/user/accountlog/coin.png"></image>
      </view>
      <view class="text">合计</view>
    </view>
    <view class="right" :class="total.length > 2 ? '' :'center'">
      <view class="list-row">
        <view class="list-item" v-for="(item,index) in total">
          <view class="title">{{ item.title }}</view>
          <view class="money">{{ item.amount }}</view>
        </view>
        <view class="click-btn" @click="isShow = !isShow" v-if="total.length > 4">
          <image v-if="isShow" src="/static/img/user/accountlog/down.png"></image>
          <image v-else src="/static/img/user/accountlog/up.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "common",
  props:{
    total:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      isShow:false
    }
  }
}
</script>

<style lang="scss" scoped>
.total-box{
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  max-width: 480px;
  background: #FFF2DF;
  height: 120rpx;
  z-index: 20;
  animation: 0.3s;
  .left{
    width: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25rpx;
    .img{
      image{
        height: 50rpx;
        width: 50rpx;
      }
    }
    .text{
      font-weight: 400;
      font-size: 25rpx;
      text-align: center;
      color: #222222;
    }
  }
  .center{
    align-items: center;
  }
  .right{
    width: 85%;
    display: flex;
    overflow: hidden;
    .list-row{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .list-item{
        width: 40%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 32rpx;
        height: 60rpx;
        animation: 0.3s;
        .title{
          font-weight: 400;
          font-size: 20rpx;
          line-height: 28rpx;
          color: #B8A68B;
        }
        .money{
          font-weight: 500;
          font-size: 24rpx;
          line-height: 34rpx;
          color: #666633;
        }
      }
      .click-btn{
        position: absolute;
        z-index: 111;
        right: 25rpx;
        top:23rpx;
        image{
          height: 20rpx;
          width: 36rpx;
        }
      }
    }
  }
}
.total-show{
  height: auto;
  animation: 0.3s;
}
</style>