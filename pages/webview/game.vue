<template>
  <view>
    <view class="back-box">
      <view class="left">
        <view class="home-img" @click="backHome">
          <image src="/static/img/liuhe/home.png"></image>
          <text class="back-text">返回平台</text>
        </view>
      </view>
      <view class="right">
        <view class="balance">
          <view class="blance-text">平台余额:{{ balance.userBalance }}</view>
          <view class="btn" @click="out">转入余额</view>
        </view>
      </view>
    </view>
    <view v-if="$store.state.appInfoStore.configs && $store.state.appInfoStore.configs.isDebug && false" class="debug-box"
      @click="updateDebugBoxStatu">
      <view class="btn-debug-show-url" v-if="!debugBoxShow">
        DEBUG
      </view>
      <view class="btn-debug-show-url-content" v-if="debugBoxShow">
        {{ systemInfo.screenHeight }}
        {{ systemInfo.windowHeight }}
      </view>
    </view>
    <view name="webview-box" :style="{ height: webViewHeight,background:'#ffffff' }">
      <web-view :style="{ height: webViewHeight, marginTop: '90rpx' }" v-if="isShow" :src="url"></web-view>
      <image v-if="isShow&&!pageLoaded" class="load-image" src="/static/img/loading_action_01.gif"></image>
    </view>

    <!--    <movable-area class="area">
      <movable-view class="home" direction="all" :inertia="true" @change="onChange" :x="x" :y="y">
        <view class="title">
          <view>返</view>
          <view>回</view>
          <view>大</view>
          <view>厅</view>
        </view>
        <image @click="backHome" src="/static/home.png"></image>
      </movable-view>
    </movable-area>-->

    <AlertInjectLayer />
  </view>
</template>

<script>
import { getUserBalance, rollIn, exit, rollOut } from "../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
  },
  name: "game",
  data() {
    return {
      url: '',
      platformId: '',
      backPath: '',
      x: 0,
      y: 0,
      isShow: false,
      debugBoxShow: false,
      pageLoaded:false,
      balance: {
        userBalance: '0.00'
      },
      winHeight: 0,
    }
  },
  computed: {
    webViewHeight() {
      let winHeight = this.winHeight;
      console.log("winHeight",winHeight);
      return `calc( ${winHeight}px - 90rpx )`;
    },
    systemInfo() {
      return uni.getSystemInfoSync();
    }
  },
  onLoad(item) {
    // alert(item.url);
    let _this = this;
    this.winHeight = uni.getSystemInfoSync().windowHeight;
    this.url = decodeURIComponent(item.url);
    this.platformId = item.platformId
    this.backPath = item.backPath || '/pages/liuhe/index'
    this.getBalance();
    uni.$on("onWindowResize", function (sizeInfo) {
      _this.winHeight = sizeInfo.size.windowHeight;
    });

    this.isShow=true;
	//#ifdef H5
      this.$nextTick(function () {
        let iframes = document.getElementsByTagName("iframe");
        let iframe=iframes[0];
        iframe.addEventListener("load", function () {
          //代码能执行到这里说明已经载入成功完毕了
          _this.pageLoaded=true;
        }, false);
      })
    //#endif
	
    // 传入需要跳转的链接 使用web-view标签进行跳转
  },
  methods: {


    back() {
      uni.switchTab({
        url: this.backPath,
        fail: () => {
          uni.redirectTo({
            url: this.backPath,
          });
        }
      })
    },
    onChange: function (e) {
      this.x = e.detail.x
      this.y = e.detail.y
    },
    getBalance() {
      getUserBalance().then(res => {
        this.balance = res.result
      }).catch(err => {
        console.log(33333)
        console.log(err)
      })
    },
    backHome() {
      let prams = {
        platformId: this.platformId
      }
      // rollIn(prams).then(res => {
      //   this.back()
      // }).catch(err => {
      //   console.log(err)
      // })
      exit(prams).then(res => {
        this.back()
      }).catch(err => {
        console.log(err)
      })
    },
    out() {
      let prams = {
        platformId: this.platformId
      }
      rollOut(prams).then(res => {
        if (res.code == 200) {
          pop("转入成功", 2000)
          this.getBalance()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    updateDebugBoxStatu() {
      this.debugBoxShow = !this.debugBoxShow;
    }
  }
}
</script>

<style>
	.uni-async-loading{
		background: red;
	}
</style>

<style lang="scss" scoped>
  .load-image{
    width: 196rpx;
    height: 156rpx;
    position: fixed;
    top: 730rpx;
    left: calc( 50% - 80rpx );
  }

.area {
  width: 100vw;
  height: 89vh;
}

.home {
  position: fixed;
  right: 108rpx;
  top: 45rpx;
  z-index: 200000;
  display: flex;
  width: 150rpx;

  .title {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 24rpx;
    text-align: center;
    color: #FFFFFF;

    view {
      transform: rotate(90deg);
    }
  }

  image {
    height: 124rpx;
    width: 124rpx;
  }
}

.back-box {
  height: 90rpx;
  background: #FFFFFF;
  width: 100%;
  max-width: 480px;
  top: env(safe-area-inset-top);
  z-index: 10;
  display: flex;
  align-items: center;

  .left {
    width: 50%;

    .home-img {
      display: flex;
      align-items: center;

      image {
        height: 70rpx;
        width: 70rpx;
        margin-right: 5rpx;
        margin-left: 20rpx;
      }

      .back-text {
        font-weight: 400;
        font-size: 24rpx;
        color: #222222;
      }
    }
  }

  .right {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .balance {
      display: flex;
      align-items: center;

      .blance-text {
        font-weight: 400;
        font-size: 24rpx;
        text-align: center;
        color: #000000;
        margin-right: 20rpx;
      }

      .btn {
        width: 133rpx;
        height: 50rpx;
        background: linear-gradient(180deg, #FFDAA3 0%, #FF9900 100%);
        border-radius: 50rpx;
        margin-right: 20rpx;
        font-weight: 400;
        font-size: 24rpx;
        line-height: 50rpx;
        text-align: center;
        color: #FFFFFF;
      }
    }
  }
}


.debug-box {
  position: fixed;
  top: 100rpx;
  /*background: skyblue;*/
  z-index: 999;
  max-width: 480px;
  word-break: break-all;

  .btn-debug-show-url {
    margin-left: 10px;
    background: #2f85dd;
    font-size: 12px;
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    box-sizing: border-box;
    border-radius: 40rpx;
    text-align: center;
    font-weight: bold;
    color: white;
    border: 2px solid gainsboro;
  }

  .btn-debug-show-url-content {
    background: skyblue;
  }
}
</style>