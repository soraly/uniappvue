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
    <scroll-view :scroll-top="scrollTop" :scroll-with-animation="true" scroll-y="true" class="history-box"
      @scrolltoupper="upper" @scroll="scroll">
      <view class="list-box">
        <view :class="index % 2 === 0 ? 'list-box-item' : 'list-box-item other'" v-for="(item, index) in dataList">
          <view class="left">
            <span>{{ item.shorNo }}期</span>
          </view>
          <view class="right">
            <view class="number-box">
              <view class="ball" v-for="ball in setBalls(item.lotteryResult)">
                {{ ball }}
              </view>
            </view>
            <view class="desc">
              {{ item.resultDetail }}
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
import { getHistoryList } from "../../../utils/lottery/betting";

export default {
  name: "History",
  components: {},
  props: {
    dataList: {

    },
    isShowRecords: {
      type: Boolean,
      default: false
    }
  },
  watch: {

  },
  data() {
    return {
      // lotteryId:"",
      pageSize: 120,
      scrollTop: 0,
      old: {
        scrollTop: 0
      }
    }
  },
  // mounted(opt){
  //   // this.lotteryId = opt.id;
  //   // this.lists()
  // },
  methods: {
    setBalls(str) {
      return str.split(',')
    },
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop
    },
    top() {
      this.scrollTop = this.old.scrollTop
      this.$nextTick(function () {
        this.scrollTop = 0
      });
      this.$emit("setShowRecords")
    },
    upper: function (e) {
      console.log(e)
    },

  }
}
</script>

<style lang="scss" scoped>
.history-header {
  background: #DEEAFA;
  height: 60rpx;
  line-height: 60rpx;
  border-bottom: 2rpx solid #0099CC;
  //position: fixed;
  width: 100%;

  //z-index: 1;
  .list-row {
    display: flex;
    justify-content: flex-start;

    .list-col {
      display: flex;
      justify-content: center;
      align-items: center;
      // width: 33.3%;
    }

    .left {
      margin-left: 30rpx;
      // width: 40%;
      width: 200rpx;
    }

    .right {
      // margin-right: 75rpx;
    }

    span {
      color: #03536E;
      font-weight: 400;
      font-size: 25rpx;
      line-height: 36rpx;
      text-align: center;
    }
  }
}

.history-box {
  height: 640rpx;

  .list-box {
    //margin-top: 60rpx;
    //height: 116rpx;
    //line-height: 116rpx;
    border-bottom: 2rpx solid #B5D4E6;

    .list-box-item.other {
      background: #DEEAFA;
    }

    .list-box-item {
      display: flex;
      justify-content: flex-start;
      box-sizing: border-box;
      background: #CCDBEE;
      width: 100%;
      height: rpx;
      line-height: 80rpx;

      .left {
        font-size: 26rpx;
        margin-left: 30rpx;
        color: #458198;
        width: 200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .right {
        display: flex;
        justify-content: flex-start;
        flex-flow: row wrap;

        .number-box {
          // padding-top: 10rpx;
          display: flex;
          flex-flow: row wrap;
          align-content: flex-start;
          width: 100%;
          padding-left: 50rpx;
          gap: 0 20rpx;

          .ball {
            height: 35rpx;
            width: 30rpx;
            line-height: 60rpx;
            text-align: center;
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            font-size: 24rpx;
            color: #444;
          }
        }

        .desc {
          margin: 10rpx 0 10rpx 0;
          padding-left: 50rpx;
          color: #D7213B;
          font-family: "PingFang SC";
          font-size: 25rpx;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.375rpx;
        }
      }



      .right {
        width: 100%;
      }
    }

    .list-row {
      &:nth-child(2n+1) {
        background: #CCDBEE;
      }

      &:nth-child(2n) {
        background: #DEEAFA;
      }

      .list-col {
        .left {

          span {
            color: #458198;
            font-weight: 400;
            font-size: 26rpx;
            line-height: 31rpx;
            text-align: center;
          }
        }
      }
    }

    .top-btn {
      position: fixed;
      right: 0;
      top: 50%;

      image {
        height: 58rpx;
        width: 58rpx;
      }
    }
  }

}
</style>
