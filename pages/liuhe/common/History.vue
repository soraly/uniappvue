<template>
  <view>
    <view class="list-box history-header">
      <uni-row class="list-row">
        <uni-col :span="8" class="list-col">
          <view class="left">
            <span>期号</span>
          </view>
        </uni-col>
        <uni-col :span="16" class="list-col">
          <view class="right">
            <span>开奖号码</span>
          </view>
        </uni-col>
      </uni-row>
    </view>
    <scroll-view :scroll-top="scrollTop"
               :scroll-with-animation="true"
               scroll-y="true" class="history-box" @scrolltoupper="upper" @scroll="scroll">
    <view class="list-box">
      <view :class="index % 2 === 0 ? 'list-box-item' : 'list-box-item other'" v-for="(item,index) in dataList">
          <view class="left">
            <span>第{{ item.shorNo }}期</span>
          </view>
          <view class="right number-box">
            <numbers :numbers="item.numberList" :addStyle="{height: '37rpx',width: '37rpx'}"></numbers>
            <view class="show-Shengxiao">
              <view class="show-Shengxiao-item" :key="k" v-for="(i,k) in item.numberList" v-if="k != item.numberList.length-1">{{i.shengXiao}}</view>
              <view class="show-Shengxiao-item"></view>
              <view class="show-Shengxiao-item">{{item.numberList[item.numberList.length - 1].shengXiao}}</view>
            </view>
          </view>
      </view>
      <view class="top-btn" @click="top" v-show="isShowRecords">
        <image src="/static/img/top.png"></image>
      </view>
    </view>
  </scroll-view>
  </view>
</template>

<script>
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import {getHistoryList} from "../../../utils/lottery/betting";
import Numbers from "./numbers";

export default {
  name: "History",
  components: {Numbers, UniCol, UniRow},
  props:{
    dataList:{

    },
    isShowRecords:{
      type:Boolean,
      default:false
    }
  },
  watch:{

  },
  data(){
    return{
      // lotteryId:"",
      pageSize:120,
      scrollTop:0,
      old: {
        scrollTop: 0
      }
    }
  },
  // mounted(opt){
  //   // this.lotteryId = opt.id;
  //   // this.lists()
  // },
  methods:{
    scroll: function(e) {
      this.old.scrollTop = e.detail.scrollTop
    },
    top(){
      this.scrollTop = this.old.scrollTop
      this.$nextTick(function() {
        this.scrollTop = 0
      });
      this.$emit("setShowRecords")
    },
    upper: function(e) {
      console.log(e)
    },

  }
}
</script>

<style lang="scss" scoped>
.history-header{
  background: #DEEAFA;
  height: 60rpx;
  line-height: 60rpx;
  border-bottom: 2rpx solid #0099CC;
  //position: fixed;
  width: 100%;
  //z-index: 1;
  .list-row{
    display: flex;
    .left{
      margin-left: 30rpx;
    }
    span{
      color: #458198;
      font-weight: 400;
      font-size: 30rpx;
      line-height: 36rpx;
      text-align: center;
    }
  }
}
.history-box{
  height: 640rpx;
  .list-box{
    //margin-top: 60rpx;
    height: 116rpx;
    line-height: 116rpx;
    border-bottom: 2rpx solid #B5D4E6;
    .list-box-item.other{
      background: #DEEAFA;
    }
    .list-box-item{
      display: flex;
      height: 116rpx;
      box-sizing: border-box;
      background: #CCDBEE;
      .left{
        font-size: 26rpx;
        color: #458198;
        width: 232rpx;
        display: flex;
        justify-content: center;
      }
      .right{
        width: 100%;
        .show-Shengxiao{
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 20rpx 0 20rpx;
          .show-Shengxiao-item{
            font-size: 28rpx;
            width: 58rpx;
            height: 36rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #03536E;
          }
        }
      }
    }
    .list-row{
      &:nth-child(2n+1){
        background: #CCDBEE;
      }
      &:nth-child(2n){
        background: #DEEAFA;
      }
      .list-col{
        .left{
          span{
            color: #458198;
            font-weight: 400;
            font-size: 26rpx;
            line-height: 31rpx;
            text-align: center;
          }
        }
        .number-box{
          padding-top: 10rpx;
          .show-Shengxiao{
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 20rpx 0 20rpx;
            .show-Shengxiao-item{
              font-size: 28rpx;
              width: 58rpx;
              height: 36rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #03536E;
            }
          }
        }
      }
    }
    .top-btn{
      position: fixed;
      right: 0;
      top: 50%;
      image{
        height: 58rpx;
        width: 58rpx;
      }
    }
  }

}
</style>
