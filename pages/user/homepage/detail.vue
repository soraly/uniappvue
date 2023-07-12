<template>
  <view class="detail-home" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :content="content" :is-show-right="isShowRight" :header-style="headerStyle"
      :font-color="fontColor" :bg-color="bgColor" :title-style="titleStyle">
    </NavBar>
    <view class="releasedetail-body">
      <h4>{{ info.title }}</h4>
      <view class="detail">
        <span class="tag examine">{{ info.status == 0 ? '审核中' : '审核失败' }}</span>
        <span class="time">{{ info.createTime }}</span>
      </view>
      <view class="desc">
        <rich-text :nodes="info.description"></rich-text>
      </view><!---->
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { detail } from '../../../utils/forum/index.js'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "homepage",
  AlertInjectLayer,
  components: {
    NavBar,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "帖子详情",
      content: "...",
      isShowRight: true,
      headerStyle: {
        backgroundColor: "#fff"
      },
      titleStyle: {
        color: "rgb(51, 51, 51)"
      },
      fontColor: "rgb(51, 51, 51)",
      bgColor: "#fff",
      articleId: 0,
      info: {}
    }
  },
  onLoad(option) {
    this.articleId = option.id
    this.detail()
  },
  methods: {
    detail: function () {
      let prams = { articleId: this.articleId }
      detail(prams).then(res => {
        this.info = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-home {
  background: #fff;
  height: var(--vh);
}

.releasedetail-body {
  background: #fff;
  min-height: calc(var(--vh) - 104rpx);
  margin-top: 12rpx;
  padding: 14rpx 26rpx;

  h4 {
    color: 38rpx;
    line-height: 52rpx;
    color: #333;
    margin-bottom: 14rpx;
    word-break: break-all;
  }

  .detail {
    height: 34rpx;
    line-height: 34rpx;

    .tag {
      display: inline-block;
      width: 120rpx;
      height: 34rpx;
      line-height: 34rpx;
      font-size: 24rpx;
      text-align: center;
      border-radius: 20rpx;
    }

    .examine {
      background: #f9dddd;
      color: #917676;
    }

    .time {
      float: right;
      color: #888;
      font-size: 24rpx;
      position: relative;
    }
  }

  .desc {
    font-size: 28rpx;
    line-height: 40rpx;
    color: #333;
    margin-top: 18rpx;
  }
}
</style>
