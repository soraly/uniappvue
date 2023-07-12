<template>
  <view class="site-announce" :style="{ marginTop: safeHeight }">
    <NavBar>
      <view slot="title" class="bar-tool">
        <uni-row>
          <uni-col :span="12">
            <view :class="current === 1 ? 'site-text act' : 'site-text'" @click="onSwitch(1)">公告</view>
          </uni-col>
          <uni-col :span="12">
            <view :class="current === 2 ? 'site-text act' : 'site-text'" @click="onSwitch(2)">站内消息</view>
          </uni-col>
        </uni-row>
      </view>
    </NavBar>
    <view class="announcement" v-if="current === 1">
      <z-paging style="background: #fff;margin-top: 14rpx;height: calc(var(--vh) - 92rpx - 32rpx)" ref="paging"
        v-model="announcements" @query="getNoticeList" :refresher-enabled="false" :hide-no-more-inside="false"
        :fixed="false">
        <view class="announcement-list" v-if="(announcements.length > 0)">
          <view class="list-item" v-for="(item, index) in announcements">
            <view class="van-cell__value van-cell__value--alone">
              <uni-row>
                <uni-col :span="24">
                  <view class="gg-title">{{ item.title }}</view>
                </uni-col>
                <!--              <uni-col span="4">
                  <text :class="getClass(item.status)">{{item.statusStr}}</text>
                </uni-col>-->
              </uni-row>
              <view class="gg-content">
                <view>尊敬的会员：</view>
                {{ item.noticeContent }}
              </view>
              <view class="bottom-time">
                发布时间: {{ item.createTime }}
              </view>
            </view>
          </view>
        </view>
        <empty v-else></empty>
      </z-paging>
    </view>
    <view class="message" v-if="current === 2">
      <view class="message-list" v-if="(messages.length > 0)">
        <view class="list-item van-cell" v-for="(item, index) in messages" :key="index">
          <view class="van-cell__value van-cell__value--alone">
            <view class="cell-top">
              <uni-row>
                <uni-col :span="4">
                  <view class="cell-top-img">
                    <image :src="item.headPic ? item.headPic : '/static/img/user/Frame21.png'" />
                  </view>
                </uni-col>
                <uni-col :span="20">
                  <view class="cell-top-text">
                    <view class="title">{{ item.title }}</view>
                    <view class="date">{{ item.createTime }}</view>
                  </view>
                </uni-col>
              </uni-row>
            </view>
            <view class="content-box has-read">
              <view class="content-msg">{{ item.content }}</view>
            </view>
          </view>
          <view class="line"></view>
        </view>
      </view>
      <empty v-else> </empty>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import empty from "@/components/common/empty/empty.vue";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import { listByPage, messageList } from "../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "announcement",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar,
    empty
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      current: 1,
      announcements: [],
      stop: false,
      messages: [],
      pageNum: 1
    }
  },
  onLoad() {
    this.getMessageList()
  },
  onReachBottom() {
    this.pageNum++
    if (this.stop) {
      return
    }
    this.$refs.paging.reload()
    this.getMessageList()
  },
  methods: {
    getClass(status) {
      if (status == 1) {
        return "over doing"
      } else {
        return "over done"
      }
    },
    //加载公告
    getNoticeList(pageNo, pageSize = 10) {
      let prams = {
        pageNum: pageNo,
        pageSize: pageSize,
      }
      listByPage().then(res => {
        if (res.code === 200) {
          this.announcements = res.result.records
        }
      })
    },
    //加载站内信
    getMessageList() {
      messageList({ pageNum: this.pageNum }).then(res => {
        if (res.code === 200) {
          if (res.result.records.length < 10) {
            this.stop = true
          }
          this.messages = this.messages.concat(res.result.records)
        }
      })
    },
    onSwitch(key) {
      this.current = key;
    }
  }
}
</script>

<style lang="scss" scoped>
.site-announce {
  .bar-tool {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: #323233;
    font-weight: 500;
    font-size: 32rpx;

    .site-text {
      color: #07c160;
      border: 2rpx solid #07c160;
      line-height: 56rpx;
      width: 140rpx;
      text-align: center;
    }

    .site-text.act {
      background: #07c160;
      color: #fff;
    }
  }

  .announcement {
    padding: 16rpx;

    .announcement-list {
      .list-item {
        margin-bottom: 16rpx;
        background: #fff;
        padding: 16rpx 0 0;

        .van-cell__value {
          position: relative;
          overflow: hidden;
          color: #969799;
          text-align: right;
          vertical-align: middle;
          word-wrap: break-word;
        }

        .van-cell__value--alone {
          color: #323233;
          text-align: left;

          .over {
            color: #a4a4a4;
            position: absolute;
            right: 0;
            top: 0;
            font-size: 28rpx;
            line-height: 36rpx;
            border-radius: 4rpx;
            width: 100rpx;
            height: 36rpx;
            text-align: center;
          }

          .over.doing {
            background-color: #07c160;
            color: #fff;
          }

          .over.done {
            background: #dfdfdf;
          }
        }

        .gg-title {
          color: #333;
          padding: 0 24rpx;
          font-size: 36rpx;
          line-height: 50rpx;
          margin-bottom: 8rpx;
        }

        .gg-content {
          color: #555;
          font-size: 24rpx;
          line-height: 34rpx;
          padding: 0 24rpx 4rpx;
        }

        .bottom-time {
          padding: 16rpx 24rpx;
          font-size: 24rpx;
          color: #888;
          line-height: 34rpx;
          border-top: 0.02rem solid #c6c6c6;
        }
      }
    }
  }

  .message {
    .message-list {
      margin-top: 16rpx;

      .list-item {
        // padding: 18rpx 28rpx 24rpx;
        background: #fff;
        padding: 16rpx 0 0;
        border-bottom: 1px solid #ebedf0;

        .van-cell__value {
          position: relative;
          overflow: hidden;
          color: #969799;
          text-align: right;
          vertical-align: middle;
          word-wrap: break-word;
          width: 100%;
        }

        .van-cell__value--alone {
          color: #323233;
          text-align: left;
        }

        .cell-top {}

        .content-box {
          margin-top: 20rpx;
          color: #333;
          line-height: 40rpx;
          font-size: 28rpx;
          color: #666;

          .content-msg {
            width: 100%;
          }
        }
      }

      .van-cell {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: 20rpx 32rpx;
        overflow: hidden;
        color: #323233;
        font-size: 28rpx;
        line-height: 48rpx;
        background-color: #fff;

        .cell-top-img {
          height: 84rpx;
          width: 84rpx;
          margin-right: 20rpx;
          border-radius: 50%;
          overflow: hidden;

          image {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .cell-top-text {
          .title {
            font-size: 28rpx;
            line-height: 40rpx;
            color: #333;
            margin-bottom: 6rpx;
          }

          .date {
            font-size: 24rpx;
            line-height: 34rpx;
            color: #888;
          }
        }
      }
    }
  }
}
</style>
