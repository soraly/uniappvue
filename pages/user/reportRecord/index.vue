<template>
  <view class="report-records" :style="{ marginTop: safeHeight }">
    <NavBar :title="title">
      <text slot="right" @click="toReport" class="report">我要举报</text>
    </NavBar>
    <view class="reports-list" v-if="records.length > 0">
      <view class="list-item" v-for="(item, index) in records" @click="toReportDetail(item)">
        <view class="top">
          <uni-row>
            <uni-col span="18">
              <view class="left">
                帖子标题：<text>{{ item.title }}</text>
              </view>
            </uni-col>
            <uni-col span="6">
              <view :class="setStasusClass(item.status)">
                {{ setStatusText(item.status) }}
              </view>
            </uni-col>
          </uni-row>
        </view>
        <view class="bottom">
          <uni-row>
            <uni-col :span="16">
              <view class="left">
                举报理由：<text>{{ item.reason }}</text>
              </view>
            </uni-col>
            <uni-col :span="8">
              <view class="right">
                {{ item.createTime }}
              </view>
            </uni-col>
          </uni-row>
        </view>
      </view>
      <uni-load-more :status="status" @clickLoadMore="loadMore" :contentText="contentText"></uni-load-more>
    </view>
    <empty v-else> </empty>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { reportList } from "@/utils/user/index";
import Empty from "@/components/common/empty/empty.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "report",
  components: {
    AlertInjectLayer,
    NavBar,
    Empty
  },
  onLoad() {
    this.getReportRecords()
  },
  onReachBottom() {
    if (this.status === "no-more") {
      return
    }
    console.log("上拉")
    this.loadMore()
  },

  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "举报记录",
      records: [],
      pageNum: 1,
      status: 'more',//more, loading, no-more
      contentText: {
        contentdown: '查看更多',
        contentrefresh: '加载中',
        contentnomore: '没有更多'
      }
    }
  },
  methods: {
    setStatusText(status) {
      switch (status) {
        case 0:
          return "审核中"
        case 2:
          return "审核拒绝"
        case 1:
          return "审核成功"
      }
    },
    setStasusClass(status) {
      switch (status) {
        case 0:
          return "right doing"
        case 2:
          return "right fail"
        case 1:
          return "right done"
      }
    },
    loadMore() {
      this.pageNum++
      this.getReportRecords()
    },
    //跳转我要举报
    toReport() {
      uni.navigateTo({
        url: "/pages/forum/index"
      })
    },
    getReportRecords() {
      reportList({ pageNum: this.pageNum }).then(res => {
        if (res.code === 200) {
          console.log(this.records)
          if (res.result.records.length < 10) {
            this.status = "no-more"
          }
          this.records = this.records.concat(res.result.records)
        }
      })
    },
    //前往举报详情
    toReportDetail(item) {
      uni.navigateTo({
        url: '/pages/user/reportRecord/reportDetail?id=' + item.id
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.report-records {
  background-color: #fff;
  height: var(--vh);
}

.report {
  color: rgb(7, 193, 96);
  font-size: 28rpx;
}

.reports-list {
  padding: 16rpx;
  position: relative;

  &::before {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    content: " ";
    pointer-events: none;
    top: 0;
    left: 0;
    border-top: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }

  .list-item {
    border: 2rpx solid #ddd;
    box-shadow: 0 0 6rpx 0 #ddd;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    margin-bottom: 15rpx;

    .top {
      // height: 50rpx;
      line-height: 50rpx;
      position: relative;

      .left {
        // position: absolute;
        // top: 8rpx;
        // left: 8rpx;
        font-weight: bold;
        font-size: 28rpx;
      }

      .right {
        // position: absolute;
        // top: 8rpx;
        // right: 8rpx;
        float: right;
        font-size: 28rpx;
      }

      .right.doing {
        color: rgb(0, 90, 160);
      }

      .right.done {
        color: rgb(7, 193, 96);
      }

      .right.fail {
        color: rgb(255, 51, 17);
      }
    }

    .bottom {

      // height: 60rpx;
      // position: relative;
      .left {
        // position: absolute;
        // top: 8rpx;
        // left: 8rpx;
        // padding-left: 8rpx;
        font-size: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 50rpx;
      }

      .right {
        // position: absolute;
        // top: 8rpx;
        // right: 8rpx;
        float: right;
        line-height: 50rpx;
        font-size: 28rpx;
      }
    }
  }
}
</style>
