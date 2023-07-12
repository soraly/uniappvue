<template>
  <view class="toolbox-warp1" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="lover-body" style="">
      <notice :content="content" :styleContent="styleContent"></notice>
      <view class="start-btn-box">
        <view class="start-btns">
          <p>求生肖：</p>
          <view class="start-btn" v-if="SxStr.length == 0" @click="startSx">开始</view>
          <view class="start-btn disabled" v-else>{{ SxStr }}</view>
        </view>
        <view class="start-btns">
          <p>求尾数：</p>
          <view class="start-btn" v-if="WsStr.length == 0" @click="startWs">开始</view>
          <view class="start-btn disabled" v-else>{{ WsStr }}</view>
        </view>
      </view>
      <view class="bottom-body">
        <view class="top-ty">
          <p>
            <span v-for="(item, index) in SxArr">{{ item }}</span>
          </p>
          <p>
            <span v-for="(item, index) in WsArr">{{ item }}</span>
          </p>
        </view>
        <view class="center-ty"></view>
        <image mode="widthFix" src="../../static/img/toolbox/person.png" class="bottom-person"></image>
      </view>
    </view>
    <view class="picker-box" v-show="sxShow">
      <view class="picker">
        <picker-items ref="shengxiao" :list="firstArr" :type="1" @closeSx="closeSx" :prize="SxPrize"></picker-items>
      </view>
    </view>
    <view class="picker-box" v-show="wsShow">
      <view class="picker">
        <picker-items ref="weishu" :list="secondArr" :type="2" @closeSx="closeSx" :prize="WsPrize"></picker-items>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import PickerItems from "../../components/common/picker/pickerItems";
import { forecast } from "../../utils/toolbox/index"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "secret",
  components: {
    AlertInjectLayer,
    NavBar,
    Notice,
    PickerItems
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '天机测算',
      content: '天机泄露啦!所求何事,让诸葛丞相为您卜一卦,祝您六合彩顺风顺水。',
      styleContent: {
        'font-size': '24rpx',
        'margin-top': '6rpx',
        'line-height': '28rpx',
        'text-align': 'left',
        'box-sizing': 'border-box',
        padding: '0 20rpx'
      },
      sxShow: false,
      SxArr: ['?', "?", "?"],
      SxStr: '',
      SxPrize: [],
      firstArr: [
        ['马', '鼠', '虎', '龙', '鸡', '蛇', '猴', '羊', '猪', '牛', '兔', '狗'],
        ['马', '鼠', '虎', '龙', '鸡', '蛇', '猴', '羊', '猪', '牛', '兔', '狗'],
        ['马', '鼠', '虎', '龙', '鸡', '蛇', '猴', '羊', '猪', '牛', '兔', '狗']
      ],
      wsShow: false,
      WsArr: ['?', "?", "?"],
      WsStr: '',
      WsPrize: [],
      secondArr: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      visible: true,
      indicatorStyle: `height: 50px;`
    }
  },
  methods: {
    startSx() {
      this.sxShow = true
      let i;
      let firstArr = this.firstArr
      firstArr.forEach((item, index) => {
        this.SxPrize.forEach((val, key) => {
          let k = item.indexOf(val);
          item.splice(k, 1)
        })
        i = Math.floor(Math.random() * item.length)
        this.SxPrize.push(item[i])
      })
      this.$refs.shengxiao.startRoll()
    },
    startWs() {
      this.wsShow = true
      let i;
      let secondArr = this.secondArr
      secondArr.forEach((item, index) => {
        this.WsPrize.forEach((val, key) => {
          let k = item.indexOf(val);
          item.splice(k, 1)
        })
        i = Math.floor(Math.random() * item.length)
        this.WsPrize.push(item[i])
      })
      this.$refs.weishu.startRoll()
    },
    closeSx(type) {
      if (type == 1) {
        this.sxShow = false
        this.SxArr = this.SxPrize
        this.SxStr = this.SxArr.join(" ")
      } else {
        this.wsShow = false
        this.WsArr = this.WsPrize
        this.WsStr = this.WsArr.join(" ")
      }
      this.forecast(type)
    },
    forecast(type = 1) {
      let prams = {
        jpushId: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
      }
      if (type == 1) {
        prams.animals = this.SxPrize.join(',')
      } else {
        prams.tailNumbers = this.WsPrize.join(',')
      }
      forecast(prams).then(res => {

      }).catch(err => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lover-body {
  margin-top: 12rpx;
  position: relative;
  height: calc(100% - 12rpx);
  background: #fff;
  padding: 20rpx 24rpx;
  box-sizing: border-box;

  .start-btn-box {
    display: flex;
    justify-content: space-between;
    padding: 0 58rpx;
    margin: 148rpx 0 100rpx;

    .start-btns {
      width: 206rpx;
      text-align: center;
      font-size: 32rpx;

      p {
        color: #5d2828;
        line-height: 44rpx;
        margin-bottom: 20rpx;
      }

      .start-btn {
        height: 78rpx;
        line-height: 78rpx;
        background: #e85755;
        color: #fff;
      }

      .disabled {
        background: #d0d0d0;
      }
    }

  }

  .bottom-body {
    .top-ty {
      height: 178rpx;
      width: 346rpx;
      border-radius: 50%;
      text-align: center;
      padding-top: 32rpx;
      background: #e85755;
      box-sizing: border-box;
      margin-left: calc(50% - 40rpx);

      p {
        line-break: 58rpx;
        color: #fff;
        font-size: 42rpx;

        span {
          margin-right: 16rpx;
        }
      }
    }

    .center-ty {
      width: 56rpx;
      height: 18rpx;
      border-radius: 50%;
      background: #e85755;
      margin-left: 50%;
      margin-top: 20rpx;
    }
  }

  image {
    display: block;
    width: 232rpx;
    margin-top: 40rpx;
    margin-left: calc(50% - 116rpx);
  }
}

.picker-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: transparent;
  z-index: 2;

  .picker {
    width: 60%;
    position: absolute;
    top: calc(50% - 0.9rem);
    left: 20%;
    background-image: linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, .8));
    overflow: hidden;
    height: 216rpx;

    .picker-view {
      height: 216rpx;
      font-size: 48rpx;
    }
  }
}</style>