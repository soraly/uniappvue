<template>
  <view>
    <view class="list-box history-header">
      <view class="list-row">
        <view class="list-col">
          <view class="date">
            <span>期号</span>
          </view>
        </view>
        <view class="list-col">
          <view class="num">
            <span>开奖号码</span>
          </view>
        </view>
        <view class="list-col">
          <view class="item">
            <span>和值</span>
          </view>
        </view>
        <view class="list-col">
          <view class="item">
            <span>大小</span>
          </view>
        </view>
        <view class="list-col">
          <view class="item">
            <span>单双</span>
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
            <span>{{ item.shorNo }}期</span>
          </view>
          <view class="right">
            <view class="number-box">
              <view class="ball" :style="setBallStyle(ball)" v-for="ball in setBalls(item.lotteryResult)">
              </view>
              <view class="desc">
                {{setBalls(item.lotteryResult)[0] + ' ' + setBalls(item.lotteryResult)[1] + ' ' + setBalls(item.lotteryResult)[2]}}
              </view>
            </view>
          </view>
          <view class="item">
            <span>{{setData(item.resultDetail,0)}}</span>
          </view>
          <view class="item">
            <span>{{setData(item.resultDetail,1)}}</span>
          </view>
          <view class="item">
            <span>{{setData(item.resultDetail,2)}}</span>
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
    setData(str,index){
      let arr = str.split(' ');
      return arr[index];
    },
    setBallStyle(num){
      return {
        backgroundImage: `url(./../../static/img/liuhe/kuaisan/${num}.png)`,
        backgroundPosition: "center",
        backgroundSize: "100% 100%"
      }
    },
    setBalls(str){
      return str.split(',')
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
      height: 60rpx;
      .date{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150rpx;
        height: 100%;
      }
      .num{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300rpx;
        height: 100%;
      }
      .item{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100rpx;
        height: 100%;
      }
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
      .left{
        font-size: 26rpx;
        color: #458198;
        width: 150rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .right{
        width: 300rpx;
        box-sizing: border-box;
        .number-box{
          height: 100%;
          display: flex;
          align-items: center;
        .ball{
          height: 53rpx;
          width: 52.31rpx;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          text{
            font-weight: 600;
            font-size: 26rpx;
            background: linear-gradient(180deg, #FFFFFF 23.02%, #C0D6F1 78.57%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.25);
          }
        }
      }
      .desc{
        color: #03536E;
        font-size: 25rpx;
        display: block;
        margin-left: 20rpx;
      }
      }
      .item{
        font-size: 26rpx;
        color: #458198;
        width: 100rpx;
        display: flex;
        justify-content: center;
        align-items: center;
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
