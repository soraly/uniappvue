<template>
  <view class="tan-pop" style="">
    <view class="t-myheader">
      系统公告
    </view>
    <swiper autoplay="false" :indicator-dots="true" indicator-color="#ebedf0"
            indicator-active-color="rgb(7, 193, 96)"
            class="swiper-box">
      <swiper-item v-for="(item ,index) in list" :key="index">
        <view class="swiper-item">
          <view class="t-title">{{item.title}}</view>
          <view class="t-time">{{item.createTime}}</view>
          <view class="t-content">
            {{item.startTime +' - '+ item.endTime}}
            <br/>
            {{item.content}}
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="t-footer">
      <span @click="bindSee(0)"> 关闭</span>
      <span @click="bindSee(1)" class="bindSee"> 不再提醒</span>
    </view>
  </view>
</template>

<script>
import {popu} from '../../../utils/home/index.js';

export default {
  name: "placard",
  /*props:{
    list:{
      type:Array,
      default:[],
    }
  },*/
  data(){
    return{
      current:0,
      list:[],
    }
  },
  mounted(){
    this.getPop()
  },
  methods:{
    getPop(){
      popu().then(res=>{
        this.list = res.result
      }).catch(err=>{
        console.log(err)
      })
    },
    bindSee(status=0){
      this.$emit("bindSee",status)
    },
  }
}
</script>

<style lang="scss" scoped>
.tan-pop{
  width: 530rpx;
  min-height: 800rpx;
  background-color: #fff;
  .t-myheader{
    width: 200rpx;
    background: #07c160;
    margin: auto;
    color: #fff;
    height: 60rpx;
    align-items: center;
    text-align: center;
    display: flex;
    justify-content: center;
    font-size: 32rpx;
  }
  .swiper-box{
    height: 700rpx;
    .swiper-item{
      .t-title{
        color: #000;
        font-weight: 700;
        margin-bottom: 20rpx;
        margin-top: 20rpx;
        text-align: center;
        display: flex;
        justify-content: center;
        font-size: 32rpx;
      }
      .t-time{
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 28rpx;
        color: #999;
      }
      .t-content{
        padding: 0 20rpx;
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 28rpx;
        color: #333;
      }
    }
  }
  .t-footer{
    display: flex;
    align-items: center;
    height: 100rpx;
    line-height: 100rpx;
    :first-child {
      color: #999;
      border-right: 2rpx solid #eee;
    }
    span{
      width: 50%;
      color: #07c160;
      text-align: center;
      height: 100%;
    }
  }
}
</style>