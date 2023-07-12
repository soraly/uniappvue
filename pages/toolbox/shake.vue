<template>
  <view class="toolbox-warp1" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="shake-body" style="">
      <notice :content="content" :styleContent="styleContent"></notice>
      <view v-if="!accelerometer" class="tips">首次进入请手动点击摇一摇</view>
      <view class="shake-img-box">
        <image v-if="isGet" mode="widthFix" src="../../static/img/toolbox/shake-bk.png" class="shake-img"></image>
        <image v-else mode="widthFix" src="../../static/img/toolbox/shake.png" class="shake-img"
          @click="friendShake(true)">
        </image>
        <view v-show="isGet" class="shake-num-list">
          <span v-for="(item, index) in numberList" :class="getClass(item.color)">{{ item.number }}</span>
        </view>
      </view>
      <view class="footer-text">提示：每期只能进行一次摇一摇</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import { shake } from "../../utils/toolbox/index"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "shake",
  components: {
    AlertInjectLayer,
    NavBar,
    Notice
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '摇一摇',
      content: '试试您的手气到底多准!只要摇一摇，就能算出专属您的本期特码!',
      styleContent: {
        'font-size': '24rpx',
        'margin-top': '6rpx',
        'line-height': '28rpx',
        'text-align': 'left',
        'box-sizing': 'border-box',
        padding: '0 20rpx'
      },
      isGet: false,
      numberList: [],
      // 是否成功开启监听加速度
      accelerometer: false,
    }
  },
  onLoad() {
    this.startAccelerometer();
  },
  methods: {
    getClass(color) {
      if (color == 1) {
        return 'red'
      } else if (color == 2) {
        return 'blue'
      } else {
        return 'green'
      }
    },
    // 开启监听加速度
    startAccelerometer() {
      let _this = this;
      return new Promise((resolve, reject) => {
        uni.startAccelerometer({
          success() {//开启成功后也要 添加监听的呀
            _this.accelerometer = true;
            _this.friendShake();
            resolve()
          },
          fail(res) {
            uni.showModal({
              title: "开启监听加速度失败",
              content: res.errMsg
            })
            _this.accelerometer = false
            reject(res)
          }
        })
      })
    },
    async friendShake() {
      let _this = this;
      if (!_this.accelerometer) {
        // 点击按钮 授权 并且手动触发结果
        await this.startAccelerometer();
        // return  _this.shakeReq()
      }
      uni.onAccelerometerChange(async (res) => {
        // 自己根据自己的力度调节 变量大小 满足自己设定的值后触发自己的逻辑
        if (Math.abs(res.x) > 30 || Math.abs(res.y) > 30 || Math.abs(res.z) > 30) {
          // 进入判断后 相当于摇一摇成功
          _this.shakeReq()
        }
      });
    },
    shakeReq() {
      let prams = {
        jpushId: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
        create: 1,
      }
      shake(prams).then(res => {
        this.numberList = res.result.numberList
        this.isGet = true
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.toolbox-warp1 {
  height: 94vh;

  .shake-body {
    position: relative;
    min-height: calc(100% - 12rpx);
    background: #fff;
    padding: 8rpx 24rpx 20rpx;
    width: 100%;
    margin-top: 12rpx;
    box-sizing: border-box;
    margin-bottom: 100px;

    .tips {
      font-size: 20rpx;
      color: red;
      text-align: center;
      margin-top: 10rpx;
    }

    .shake-img-box {
      margin-top: 204rpx;
      position: relative;

      .shake-img {
        display: block;
        margin: 0 auto;
        width: 450rpx;
      }

      .shake-num-list {
        position: absolute;
        text-align: center;
        height: 68rpx;
        width: 100%;
        top: 50%;
        margin-left: 3%;
        transform: translateY(-50%);

        span {
          display: inline-block;
          height: 68rpx;
          width: 68rpx;
          font-size: 24rpx;
          color: #333;
          line-height: 72rpx;
          text-indent: 16rpx;
          margin-right: 40rpx;
          text-align: left;
          color: #fff;
        }

        .red {
          background: url('@/static/img/qiu/1.png');
          background-size: contain;
        }

        .blue {
          background: url('@/static/img/qiu/2.png');
          background-size: contain;
        }

        .green {
          background: url('@/static/img/qiu/3.png');
          background-size: contain;
        }
      }
    }

    .footer-text {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #333;
      font-size: 24rpx;
      text-align: center;
      line-height: 34rpx;
      bottom: 34rpx;
      box-sizing: border-box;
    }
  }
}
</style>