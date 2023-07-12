<template>
  <view>
    <view class="list-box history-header">
      <view class="list-row">
        <view class="list-col">
          <view class="left">
            <span>期号</span>
          </view>
        </view>
        <view class="list-col">
          <view class="center">
            <span>开奖号码</span>
          </view>
        </view>
      </view>
    </view>
    <scroll-view :scroll-top="scrollTop"
                 :scroll-with-animation="true"
                 scroll-y="true" class="history-box" @scrolltoupper="upper" @scroll="scroll">
      <view class="list-box">
        <view :class="index % 2 === 0 ? 'list-box-item' : 'list-box-item other'" v-for="(item,index) in dataList">
          <view class="left">
            <span>第{{ item.shorNo }}期</span>
          </view>
          <view class="number-box">
            <view class="ball-item" v-for="(ball, index) in setBalls(item.lotteryResult)">
              <view class="ball">
              <text>{{ball}}</text>
            </view>
            <text class="ball-symbol" v-if="index !== 2">+</text>
            <text class="ball-symbol" v-else>=</text>
            </view>

            <view class="ball" :class="setResultBalls(item.resultDetail)[1] === '1' ? 'ball-red': ( setResultBalls(item.resultDetail)[1] === '2' ? 'ball-blue' : ( setResultBalls(item.resultDetail)[1] === '3' ? 'ball-green' : 'ball-gray' ) )">
              <text class="text">{{setResultBalls(item.resultDetail)[0]}}</text>
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

export default {
  name: "History",
  components: {},
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
    setBalls(str){
      return str && str.split(',') || ""
    },
    setResultBalls(str) {
      return str && str.split(" ") || "";
    },
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
    justify-content: space-between;
    .list-col{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40%;
    }
    .list-col:last-of-type {
      width: 60%;
    }
    .left{
      // margin-left: 30rpx;
    }
    .right{
      // margin-right: 75rpx;
    }
    span{
      color: #03536E;
      font-weight: 400;
      font-size: 25rpx;
      line-height: 36rpx;
      text-align: center;
    }
  }
}
.history-box{
  height: 640rpx;
  .list-box{
    //margin-top: 60rpx;
    //height: 116rpx;
    //line-height: 116rpx;
    border-bottom: 2rpx solid #B5D4E6;
    .list-box-item.other{
      background: #DEEAFA;
    }
    .list-box-item{
      display: flex;
      box-sizing: border-box;
      background: #CCDBEE;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      .left{
        font-size: 26rpx;
        color: #458198;
        width: 232rpx;
        display: flex;
        justify-content: center;
      }
      .number-box{
        padding-top: 10rpx;
        display: flex;
        width: 500rpx;
        align-items: center;
        justify-content: center;
        .ball-item {
          display: flex;
          align-items: center;
          .ball-symbol {
            color: #83AFD9;
          }
        }
        .ball{
          background-image: url("./../../../static/img/liuhe/ssc/ball.png");
          background-position: center;
          background-size: 100% 100%;
          height: 60rpx;
          width: 55.29rpx;
          line-height: 60rpx;
          text-align: center;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          &.ball-red {
            background-image: url("./../../../static/img/liuhe/pcEgg/ball-red.png");
          }
          &.ball-blue {
            background-image: url("./../../../static/img/liuhe/pcEgg/ball-blue.png");
          }
          &.ball-green {
            background-image: url("./../../../static/img/liuhe/pcEgg/ball-green.png");
          }
          &.ball-gray {
            background-image: url("./../../../static/img/liuhe/pcEgg/ball-gray.png");
          }
          text{
            font-weight: 600;
            font-size: 14px;
            background: linear-gradient(180deg, #FFFFFF 23.02%, #b7cfee 78.57%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            font-weight: bold;
			    transform: scale(0.9);
			    display: block;
			// text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.25);
          }
        }
      }
      .desc{
        color: #03536E;
        font-size: 25rpx;
      }
      .right{
        width: 100%;
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
