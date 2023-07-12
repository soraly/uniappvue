<template>
  <view class="detail" :style="{ marginTop: safeHeight }">
    <nav-bar :fontColor="'#FFFFFF'" :title="title" :titleStyle="titleStyle" :isBack="true" :headerStyle="headerStyle"
      :leftWidth="90">
    </nav-bar>
    <view class="info">
      <view class="title">
        <image src="/static/img/liuhe/notice/laba.png"></image>
        <view class="title-text">
          {{ info.title }}
        </view>
      </view>
      <view class="content">
        {{ info.content }}
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { msgDetails } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "msg",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '公告详情',
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
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
    getInfo() {
      let prams = {
        id: this.id
      };
      msgDetails(prams).then(res => {
        this.info = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  width: 708rpx;
  border-radius: 5rpx 5rpx 0px 0px;
  margin: 21rpx;
  background: #FFFFFF;

  .title {
    height: 75rpx;
    display: flex;
    align-items: center;

    image {
      height: 40rpx;
      width: 40rpx;
      margin: 0 16rpx;
    }

    .title-text {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 30rpx;
      text-align: center;
      color: #222222;

      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; // 默认不换行；
    }
  }

  .content {
    box-sizing: border-box;
    /* 自动布局 */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 676rpx;
    background: #FFFFFF;
    border-top: 1px solid #ECECEC;
    padding: 34rpx 20rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #666666;

  }
}
</style>