<template>
  <view class="my-feedback" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <view slot="right" @click="toFeedback" class="feedback-text">我要反馈</view>
    </NavBar>
    <view class="feedback-list" v-if="feedbackList.length > 0">
      <view class="feedback-list-item" v-for="(item, index) in feedbackList" :key="index" @click="toDetail(item)">
        <view class="top-part">
          <uni-row>
            <uni-col :span="18">
              <text class="title">标题：</text>
              <text class="title">{{ item.title }}</text>
            </uni-col>
            <uni-col :span="6">
              <text :class="item.status == 0 ? 'status red' : 'status green'">{{ item.status == 0 ? '未处理' : '已处理'
              }}</text>
            </uni-col>
          </uni-row>
        </view>
        <view class="bottom-part">
          <uni-row>
            <uni-col :span="16">
              <view class="content-text" style="display: flex;">
                <text class="content" style="white-space: nowrap;">内容：</text>
                <text class="content" style="overflow: hidden; text-overflow: ellipsis;white-space: nowrap;">{{
                  item.description }}</text>
              </view>
            </uni-col>
            <uni-col :span="8">
              <text class="date">{{ item.updateTime }}</text>
            </uni-col>
          </uni-row>
        </view>
      </view>
    </view>
    <Empty v-else></Empty>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import Empty from "@/components/common/empty/empty.vue";
import { getFeedbackList } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "myFeedback",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar,
    Empty
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "我的反馈",
      feedbackList: [],
      pageNum: 1,
      over: false
    }
  },
  onShow() {
    this.feedbackList = [];
    this.loadFeedback()
  },
  onReachBottom() {
    if (this.over === false) {
      this.pageNum++
      this.loadFeedback()
    } else {
      return
    }
  },
  methods: {
    //前往我要反馈
    toFeedback() {
      this.feedbackList = [];
      this.pageNum = 1;
      uni.navigateTo({
        url: "/pages/user/setting/feedback"
      })
    },
    //反馈详情
    toDetail(item) {
      console.log(item)
      this.feedbackList = [];
      this.pageNum = 1;
      uni.navigateTo({
        url: '/pages/user/myFeedback/feedbackDetail?id=' + item.id
      })
    },
    //获取用户反馈列表
    loadFeedback() {
      getFeedbackList({ pageNum: this.pageNum }).then(res => {
        if (res.code === 200) {
          if (res.result.records.length < 10) {
            this.over = true
          }
          this.feedbackList = this.feedbackList.concat(res.result.records)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-feedback {
  background-color: #fff;
  height: var(--vh);
}

.feedback-text {
  font-size: 28rpx;
}

.feedback-list {
  background: #fff;
  padding: 20rpx;
  position: relative;

  &::before {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    content: " ";
    pointer-events: none;
    top: 0;
    border-top: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }

  .feedback-list-item {
    border: 2rpx solid #ddd;
    box-shadow: 0 0 6rpx 0 #ddd;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    margin-bottom: 15rpx;

    .top-part {
      .title {
        font-weight: bold;
        font-size: 28rpx;
      }

      .status {
        color: rgb(7, 193, 96);
        float: right;
        font-size: 28rpx;
      }

      .status.red {
        color: rgb(255, 51, 17);
      }

      .status.green {
        color: rgb(7, 193, 96);
      }
    }

    .bottom-part {
      color: #333333;
      font-size: 28rpx;

      .content-text {
        overflow: hidden;
      }

      .date {
        float: right;
      }
    }
  }
}
</style>
