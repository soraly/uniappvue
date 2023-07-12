<template>
  <view class="help" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="title">{{ info.title }}</view>
    <view class="content">
      <mp-html :content="info.content" />
    </view>
    <view class="fg">
      <view class="line"></view>
      <view class="text">解答对您有帮助吗？</view>
      <view class="line"></view>
    </view>
    <view class="hand">
      <view class="item" @click="setAnswer(1)">
        <uni-icons type="hand-up" size="26" :color="info.answer === 1 ? '#d43345' : ''" />
        <text class="text">有帮助 {{ info.haveHelpAmount }}</text>
      </view>
      <view class="item" @click="setAnswer(-1)">
        <uni-icons type="hand-down" size="26" :color="info.answer === -1 ? '#d43345' : ''" />
        <text class="text">没帮助 {{ info.noHelpAmount }}</text>
      </view>
      <AlertInjectLayer />
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { details, answer } from "../../../utils/lottery/help";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "detail",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "常见问题",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      id: 0,
      info: {}
    }
  },
  onLoad(option) {
    this.id = option.id
    this.getInfo()
  },
  methods: {
    async setAnswer(type) {
      const res = await answer({
        id: parseInt(this.id),
        answer: type,
      })
      if (res.code === 200) {
        //接口暂未返回统计数值 后续可和后端讨论优化 暂时以服务器detail刷新数值
        this.info.answer = type
        this.getInfo(true);
      }
    },
    getInfo() {
      let prams = { id: this.id }
      details(prams).then(res => {
        if (res.code == 200) {
          this.info = res.result;
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
.help {
  font-family: 'PingFang SC';
  background: #fff;

  .title {
    margin-top: 34rpx;
    padding: 0 28rpx 0 28rpx;
    font-weight: 400;
    font-size: 30rpx;
    color: #222222;
  }

  .content {
    padding: 12rpx 28rpx 0;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
  }

  .fg {
    display: flex;
    margin: 50rpx 45rpx 0;
    align-items: center;
    justify-content: center;

    .line {
      width: 194rpx;
      height: 1px;
      background: #E7E7E7;
    }

    .text {
      font-weight: 400;
      font-size: 22rpx;
      color: #999999;
      margin: 0 29.5rpx;
    }
  }

  .hand {
    display: flex;
    justify-content: center;
    align-items: center;

    .item {
      padding: 30rpx 60rpx;
      display: flex;
      align-items: center;
      font-size: 22rpx;
      color: #999999;

      .text {
        margin-left: 10rpx;
      }
    }
  }
}
</style>