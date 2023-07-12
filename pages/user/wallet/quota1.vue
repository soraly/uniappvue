<template>
  <view class="wallet-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="top-box">
      <view class="money">{{ balance }}</view>
      <view class="title">我的钱包（元）</view>
      <view class="hs-btn" @click="rollInAll()">
        一键回收到我的钱包
      </view>
    </view>
    <view class="list-row">
      <view class="list-col" v-for="(item, index) in list">
        <view class="left">
          <view class="title">{{ item.platformName }}</view>
          <view class="desc">{{ "" }}</view>
        </view>
        <view class="right">
          <view class="coin">{{ item.amount }}</view>
          <view class="btn" @click="rollInOne(item, index)">
            <view class="refsh">
              <image :class="{ run: all || (isRef && curr == index) }" src="/static/img/user/wallet/refshs.png"></image>
            </view>
            <view class="text">刷新</view>
          </view>
        </view>
      </view>
      <AlertInjectLayer />
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import { initQuota, rollIn } from "../../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "quota",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "额度回收",
      headerStyle: {
        backgroundColor: "#03536E"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      balance: 0,
      list: [],
      curr: 0,
      isRef: false,
      all: false,
      isRoll: false
    }
  },
  onLoad(option) {
    this.getInit()
  },
  onShow() {
  },
  methods: {
    getInit() {
      initQuota().then(res => {
        console.log(res)
        this.balance = res.result.balance
        this.list = res.result.list
      }).catch(err => {
        console.log(err)
      })
    },
    rollInAll() {
      this.all = true
      this.rollInBack()
    },
    rollInOne(item, index) {
      this.isRef = true
      this.curr = index
      this.rollInBack(item)
    },
    rollInBack(item = null) {
      uni.hideToast()
      if (this.isRoll) {
        pop("正在回收中...", 2000)
        return false
      }
      let prams = {}
      if (item) {
        prams.platformId = item.platformId
      }
      uni.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      });
      this.isRoll = true
      rollIn(prams).then(res => {
        this.isRoll = false
        this.isRef = false
        this.all = false
        if (res.code == 200) {
          this.balance = res.result.balance
          if (res.result.list.length > 1) {
            this.list = res.result.list
          } else {
            item.amount = res.result.list[0].amount
          }
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wallet-box {
  height: var(--vh);
  background: #f6f6f6;
  font-family: 'PingFang SC';
  font-style: normal;

  .top-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    height: 293rpx;
    background: linear-gradient(180deg, #03536E 0%, #049C97 100%);

    .money {
      font-style: normal;
      font-weight: 500;
      font-size: 48rpx;
      line-height: 67rpx;
      color: #FFFF99;
      margin-top: 19.5rpx;
    }

    .title {
      font-weight: 500;
      font-size: 28rpx;
      color: #FFFFFF;
      margin-top: 19.5rpx;
    }

    .hs-btn {
      margin-top: 33rpx;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 630rpx;
      height: 90rpx;
      background: #36ACA9;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      text-align: center;
      color: #FFFFFF;
    }
  }

  .list-row {
    .list-col {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 110rpx;
      background: #FFFFFF;
      border-bottom: 1px solid #DDDDDD;

      .left {
        width: 60%;

        .title {
          font-weight: 400;
          font-size: 30rpx;
          color: #444444;
          margin-left: 20rpx;
        }

        .desc {
          font-weight: 500;
          font-size: 25.5rpx;
          display: flex;
          align-items: center;
          color: #CCCCCC;
        }
      }

      .right {
        width: 35%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .coin {
          width: 20%;
          font-weight: 400;
          font-size: 24rpx;
          text-align: center;
          color: #FF0000;
        }

        .btn {
          width: 80%;
          box-sizing: border-box;
          /* 自动布局 */
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 164rpx;
          height: 60rpx;
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          border-radius: 50rpx;
          margin-right: 20rpx;

          .refsh {
            display: flex;
            align-items: center;
            justify-content: center;

            image {
              height: 40rpx;
              width: 40rpx;
            }

            .run {
              animation: rotate 1s linear infinite;
            }
          }

          .text {
            margin-left: 8rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #666666;
          }
        }
      }
    }
  }
}

@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(270deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
