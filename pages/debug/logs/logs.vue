<template>
  <view>
    <view class="top-header">
      <nav-bar :nav-bar-height="'80rpx'" :isBack="false" :left-width="180" :right-width="180" :title="''">
        <block slot="left">
          <view class="nav-title" @click="goBack">
            返回
          </view>
        </block>
      </nav-bar>
    </view>
    <scroll-view scroll-y="true" class="scroll">
      <view class="box">
        <view class="title">HTTP日志</view>
        <view class="body">
          <view class="row" v-for="log in httpLogs">
            <view class="row-key">{{log.logName}}:</view>
            <view class="row-value">消耗<span style="color: #01ff2a">{{log.useTime}}</span>(毫秒)|{{log.startDate}}请求。</view>
          </view>
        </view>
      </view>


    </scroll-view>


  </view>
</template>

<script>
  import NavBar from "@/components/common/navBar/navBar";

  export default {
    components:{
      NavBar
    },
    data() {
      return {
        debugLocalStoreNumber: 0,

      }
    },

    onShow() {

    },

    computed: {
      httpLogs() {
        let list = uni.getStorageSync("mem:debug:logs");
        if (!list) return [];
        return list;
      }
    },

    methods: {
      goBack() {
        uni.switchTab({
          url:"/pages/user/index"
        })
      },

      copy(text) {
        uni.setClipboardData({
          data: String(text)
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll{
    height: calc( 100vh - 80rpx );
    width: 100%;
    background: #cbd0c6;
  }
  .box {
    margin: 10px;
    background: #f3f9c5;
    border-radius: 5px;
    padding: 5px;

    .title {
      width: 100%;
      line-height: 24px;
      height: 24px;
      font-size: 14px;
      background: #afefed;
      color: black;
      text-align: center;
      font-weight: bold;
    }

    .row {
      padding: 3px;
      display: flex;

      .row-key {
        background: #cdcdcd;
        width: 40%;
        text-align: right;
        border-radius: 5px 0px 0px 5px;
        padding: 3px;
        font-size: 24rpx;
      }

      .row-value {
        background: #9CA1AC;
        word-break: break-all;
        width: 60%;
        text-align: left;
        padding: 3px;
        color: white;
        overflow: scroll;
        font-size: 24rpx;
      }
    }
  }
</style>
ssss