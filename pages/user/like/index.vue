<template>
  <view class="my-like" :style="{ marginTop: safeHeight }">
    <nav-bar :title="title"></nav-bar>
    <view class="tab-box">
      <view class="tab">
        <view v-for="(item, index) in tabArr" :key="index"
          :class="item.value === activeTab.value ? 'active-tab-item' : ''" class="tab-item" @click="handleTab(item)">
          {{ item.label }}
        </view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="like-body">
      <view class="my-like-list" v-if="records.length > 0">
        <view class="my-like-list-item" v-for="(item, index) in records" @click="pictureDetail(item)">
          <view class="top">
            <uni-row>
              <uni-col :span="4">
                <view class="avatar">
                  <image :src='item.headPic' />
                </view>
              </uni-col>
              <uni-col :span="20">
                <view class="info">
                  <view>{{ item.username }}</view>
                  <view class="date">{{ item.createTime }}</view>
                </view>
              </uni-col>
            </uni-row>
          </view>
          <view class="bottom">
            <uni-row>
              <uni-col :span="12">
                <view class="img-title">
                  {{ item.title ? item.title : "暂无标题" }}
                </view>
              </uni-col>
              <uni-col :span="12">
                <view :class="getClass(item.lotteryType)">
                  <image style="width: 30rpx; height: 30rpx; border-radius: 50%" :src="getTypeIcon(item.lotteryType)">
                  </image>
                  {{ getLotteryType(item.lotteryType) }}
                </view>
              </uni-col>
            </uni-row>
          </view>
        </view>
      </view>
      <empty v-else> </empty>
    </scroll-view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { myThumbUp } from "../../../utils/user";
import Empty from "@/components/common/empty/empty.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "like",
  components: {
    AlertInjectLayer, NavBar, Empty
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "我的点赞",
      activeTab: {
        label: "发现",
        value: 2,
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      over: false,
      records: [

      ],
      tabArr: [
        {
          label: "发现",
          value: 2,
        },
        {
          label: "幽默猜测",
          value: 8,
        },
        {
          label: "高手论坛",
          value: 3,
        },
        {
          label: "资料大全",
          value: 4,
        },
        {
          label: "六合图库",
          value: 1,
        },
      ],
    }
  },
  onLoad() {
    this.getMyThumbUp()
  },
  onReachBottom() {
    if (this.over === false) {
      this.page.pageNum++
      this.getMyThumbUp()
    } else {
      return
    }
  },
  methods: {
    getLotteryType(type) {
      switch (type) {
        case 1:
          return "香港"
        case 2:
          return "澳门"
        case 3:
          return "台湾"
        case 4:
          return "新加坡"
      }
    },
    getTypeIcon(type) {
      switch (type) {
        case 1:
          return "/static/img/menu/act-2.png"
        case 2:
          return "/static/img/menu/act-1.png"
        case 3:
          return "/static/img/menu/act-3.png"
        case 4:
          return "/static/img/menu/act-4.png"
      }
    },
    getClass(type) {
      switch (type) {
        case 1:
          return "lottery-type hk"
        case 2:
          return "lottery-type mo"
        case 3:
          return "lottery-type tw"
        case 4:
          return "lottery-type sg"
      }
    },
    //图库详情
    pictureDetail(item) {
      console.log("item:::", item);
      uni.setStorageSync('lotteryType', item.lotteryType);
      if (item.type == 1) {
        let url = '/pages/picture/detail?id=' + item.relatedId
        uni.navigateTo({
          url: url,
        })
      } else if (item.type == 8) {
        let url = '/pages/vote/index?id=' + item.relatedId
        uni.navigateTo({
          url: url,
        })
      } else {
        let url = '/pages/forum/detail?id=' + item.relatedId + '&type=' + item.type;
        uni.navigateTo({
          url: url,
        })
      }
    },
    //获取我的点赞
    getMyThumbUp() {
      myThumbUp({
        type: this.activeTab.value,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }).then(res => {
        console.log(res)
        if (res.result.records.length < 10) {
          this.over = true
        }
        this.records = this.records.concat(res.result.records)
      })
    },
    handleTab(item) {
      this.records = [];
      this.page.pageNum = 1
      if (this.activeTab === item) {
        return false;
      }
      this.activeTab = item;
      this.getMyThumbUp()
    },
  }
}
</script>

<style lang="scss" scoped>
.my-like {
  background-color: #fff;
  height: var(--vh);
}

.tab-box {
  position: relative;
  height: 100rpx;

  &>.tab {
    display: flex;
    align-items: center;
    background-color: #fff;
    height: 100rpx;
    position: absolute;
    width: 100%;
    top: 0;

    .active-tab-item {
      color: #07c160;
      font-weight: 500;
    }

    &>.tab-item {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 28rpx;
      text-align: center;
    }
  }
}

.like-body {
  width: 100%;
  height: calc(100% - 58px);
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 2rpx 0;

  // background-color: #fff;
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


  &>.content {
    flex: 1;
  }

  .my-like-list {
    .my-like-list-item {
      padding: 28rpx;
      color: #323233;
      background-color: #fff;
      margin: 2rpx 0;
      border-bottom: 1px solid #ebedf0;

      .top {
        .avatar {
          height: 84rpx;
          width: 84rpx;
          border-radius: 50%;

          image {
            height: 100%;
            width: 100%;
            border-radius: 50%;
          }
        }

        .info {
          height: 84rpx;

          .date {
            font-size: 24rpx;
            line-height: 34rpx;
            color: #888;
          }
        }
      }

      .bottom {
        margin: 18rpx 0;
        color: #333;
        line-height: 44rpx;
        font-size: 32rpx;

        .img-title {
          // display: -webkit-box;
          color: #333;
          line-height: 44rpx;
          font-size: 32rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          // -webkit-box-orient: vertical;
          // width: 100%;
        }

        .lottery-type {
          float: right;
          margin-right: 12rpx;
          padding: 4rpx 10rpx;
          color: #fff;
          border-radius: 30rpx;
          font-size: 24rpx;
          display: flex;
          align-items: center;
        }

        .lottery-type.mo {
          background-color: #07c160;
        }

        .lottery-type.tw {
          background-color: #0755c1;
        }

        .lottery-type.hk {
          background-color: #c10707;
        }

        .lottery-type.sg {
          background-color: #b907c1;
        }
      }
    }
  }
}
</style>
