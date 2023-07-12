<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="luck-body">
      <image mode="widthFix" src="../../static/img/toolbox/luck/luck-title.png" class="luck-title"></image>
      <view class="result-box">
        <image mode="widthFix" src="../../static/img/toolbox/luck/luck-top.png"></image><!---->
        <span v-for="(item, index) in numberList" :class="setClass(item.color)">{{ item.number }}</span>
      </view>
      <view class="luck-content">
        <image mode="widthFix" src="../../static/img/toolbox/luck/luck-round.png" :class="{ 'active': isTurn }"></image>
        <span @click="prizeWheel">点击开始</span>
      </view>
      <image mode="widthFix" src="../../static/img/toolbox/luck/luck-person.png" class="luck-person"></image>
      <image mode="widthFix" src="../../static/img/toolbox/luck/luck-women.png" class="luck-women"></image>
      <image mode="widthFix" src="../../static/img/toolbox/luck/luck-coin.png" class="luck-money"></image>
      <image mode="widthFix" src="../../static/img/toolbox/luck/luck-sjx.png" class="luck-j"></image>
      <view class="footer-text">提示：幸运摇奖用模拟开奖，系统将自动摇出幸运号码</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import { prizeWheel } from "../../utils/toolbox/index"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "luck",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '幸运摇奖',
      isTurn: false,
      list: [],
      numberList: [],
      timer: null
    }
  },
  methods: {
    setClass(type) {
      if (type == 1) {
        return 'red'
      } else if (type == 2) {
        return 'green'
      } else if (type == 3) {
        return 'blue'
      } else {
        return 'add'
      }
    },
    async prizeWheel() {
      let prams = {}
      if (this.isTurn) {
        return false
      }
      await prizeWheel(prams).then(res => {
        this.list = res.result.animalList
        this.startTurn()
      }).catch(err => {
        console.log(err)
      })
    },
    startTurn() {
      this.isTurn = true
      this.numberList = []
      var i = 0;
      this.timer = setInterval(() => {
        //TODO
        this.numberList.push(this.list[i])
        if (i == 5) {
          this.numberList.push({
            'color': 0,
            'number': '+'
          })
        }
        if (i >= 6) {
          clearInterval(this.timer)
          this.isTurn = false
        }
        i++
      }, 1000);
    },

  }
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  height: 94vh;
  background: #f8f8f8;
}

.luck-body {
  position: relative;
  height: calc(100% - 12rpx);
  margin-top: 12rpx;
  background: #fff;
  background-image: linear-gradient(180deg, #f17124, #f3591e);
  padding: 20rpx 24rpx;
  box-sizing: border-box;

  .luck-title {
    display: block;
    width: 296rpx;
    margin: 34rpx auto 0 auto;
  }

  .result-box {
    margin-top: 60rpx;
    height: 256rpx;
    background-size: cover;
    padding: 104rpx 60rpx 0;
    position: relative;
    box-sizing: border-box;

    image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    @keyframes toright {
      0% {
        transform: translate(-60px);
        opacity: 0;
      }

      100% {
        transform: translate(0);
        opacity: 1;
      }
    }

    span {
      float: left;
      width: 12.5%;
      position: relative;
      z-index: 2;
      height: 56rpx;
      text-align: left;
      font-size: 24rpx;
      color: #333;
      line-height: 60rpx;
      text-indent: 12rpx;
      animation: toright .6s ease-in-out;
    }

    .red {
      background: url('../../static/img/toolbox/luck/1.png') no-repeat;
      background-size: contain;
    }

    .blue {
      background: url('../../static/img/toolbox/luck/2.png') no-repeat;
      background-size: contain;
    }

    .green {
      background: url('../../static/img/toolbox/luck/3.png') no-repeat;
      background-size: contain;
    }

    .add {
      text-indent: 0;
      width: 8%;
      color: #fff;
      font-size: 48rpx;
      transform: none;
      animation: none;
      top: 0;
    }
  }

  .luck-content {
    position: absolute;
    bottom: 129PX;
    left: 50%;
    z-index: 1;
    transform: translate(-50%);

    image {
      display: block;
      width: 253PX;
      margin: 0 auto;
    }

    .active {
      transition: all 8s;
      transform: rotate(12turn);
    }

    span {
      position: absolute;
      width: 74PX;
      height: 74PX;
      text-align: center;
      padding: 10PX;
      font-weight: 700;
      color: #f5822b;
      border-radius: 50%;
      border: 8rpx solid #f17124;
      box-sizing: border-box;
      font-size: 16PX;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .luck-person {
    width: 65PX;
    position: absolute;
    bottom: 64PX;
    left: 20PX;
  }

  .luck-women {
    width: 104PX;
    position: absolute;
    bottom: 64PX;
    right: 8PX;
  }

  .luck-money {
    width: 61PX;
    position: absolute;
    bottom: 50PX;
    left: 85PX;
  }

  .luck-j {
    width: 125PX;
    position: absolute;
    bottom: 95PX;
    left: 50%;
    transform: translate(-50%);
  }

  .footer-text {
    position: absolute;
    width: 94%;
    color: #fff;
    font-size: 24rpx;
    text-align: center;
    line-height: 34rpx;
    bottom: 34rpx;
    box-sizing: border-box;
  }
}
</style>