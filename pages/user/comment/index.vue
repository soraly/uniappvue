<template>
  <view class="comment-box" :style="{ marginTop: safeHeight }">
    <nav-bar title="我的评论" is-back></nav-bar>
    <view class="comment-box-body">
      <view class="tab">
        <view v-for="(item, index) in tabArr" :key="index"
          :class="item.value === activeTab.value ? 'active-tab-item' : ''" class="tab-item" @click="handleTab(item)">
          {{ item.label }}
        </view>
      </view>
      <view class="content">
        <template v-if="this.list.length > 0">
          <view v-for="(item, index) in list" :key="index" class="list-item" @click="toDetail(item)">
            <view class="top">
              <view class="img">
                <image style="width: 84rpx; height: 84rpx; border-radius: 50%" :src="item.headPic"></image>
              </view>
              <view class="info">
                <view class="username">{{ item.username }}</view>
                <view class="createTime">{{ item.createTime }}</view>
              </view>
            </view>
            <view class="bottom" @click="handleTo(item)">
              <view class="qs">
                <uni-row>
                  <uni-col span="18">
                    <view class="label">{{ item.title }}</view>
                  </uni-col>
                  <uni-col span="6">
                    <view class="tags">
                      <view :class="getClass(item.lotteryType)">
                        <image style="width: 30rpx; height: 30rpx; border-radius: 50%"
                          :src="getTypeIcon(item.lotteryType)">
                        </image>
                        {{ getLotteryType(item.lotteryType) }}
                      </view>
                    </view>
                  </uni-col>
                </uni-row>
              </view>
              <view class="comment-list">
                <view v-for="(commentItem, commentIndex) in item.commentList" :key="commentIndex"
                  class="comment-list-item">
                  <view class="info">
                    <image style="width: 50rpx; height: 50rpx; border-radius: 50%" :src="commentItem.headPic"></image>
                    <view class="username">{{ commentItem.username }}</view>
                    <view class="create-time">{{
                      commentItem.createTime
                    }}</view>
                  </view>
                  <view class="content">
                    {{ commentItem.content }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
        <empty v-else> </empty>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Empty from "@/components/common/empty/empty.vue";
import NavBar from '@/components/common/navBar/navBar.vue';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

import { myComment } from "@/utils/comment/index.js";
export default {
  components: {
    AlertInjectLayer, Empty, NavBar
  },
  props: {},
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      activeTab: {
        label: "发现",
        value: 2,
      },
      list: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      over: false,
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
    };
  },
  onLoad() {
    this.myComment();
  },
  onReachBottom() {
    if (this.over === false) {
      this.page.pageNum++
      this.myComment()
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
          return "tag hk"
        case 2:
          return "tag mo"
        case 3:
          return "tag tw"
        case 4:
          return "tag sn"
      }
    },
    handleTab(item) {
      if (this.activeTab === item) {
        return false;
      }
      this.activeTab = item;
      this.myComment(true);
    },
    back() {
      uni.navigateBack();
    },
    handleTo(item) {
      console.log("点击评论的澳门按钮跳转", item);
    },
    myComment(reload) {
      myComment({
        type: this.activeTab.value,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }).then((res) => {
        if (res.code === 200) {
          if (res.result.records.length < 10) {
            this.over = true
          }
          this.list = res.result.records
        }
      });
    },
    toDetail(item) {
      console.log("item:::", item);
      uni.setStorageSync('lotteryType', item.lotteryType);
      if (this.activeTab.value == 1) {
        let url = '/pages/picture/detail?id=' + item.relatedId
        uni.navigateTo({
          url: url,
        })
      } else if (this.activeTab.value == 8) {
        let url = '/pages/vote/index?id=' + item.relatedId
        uni.navigateTo({
          url: url,
        })
      } else {
        let url = '/pages/forum/detail?id=' + item.relatedId + '&type=' + this.activeTab.value;
        uni.navigateTo({
          url: url,
        })
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.list-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  background-color: #fff;
  position: relative;

  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }

  &>.top {
    display: flex;
    align-items: center;
    height: 84rpx;
    gap: 0 20rpx;

    &>.img {
      width: 84rpx;
      height: 84rpx;
    }

    &>.info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      .username {
        font-size: 28rpx;
        color: #333;
      }

      .createTime {
        font-size: 24rpx;
        color: #888;
      }
    }
  }

  &>.bottom {
    display: flex;
    flex-direction: column;

    &>.qs {
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      margin: 18rpx 0;
      height: 44rpx;

      .label {
        color: #333;
        font-size: 32rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .tags {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tag {
        padding: 0 10rpx;
        height: 44rpx;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #fff;
        background-color: #07c160;
        display: flex;
        align-items: center;
      }

      .tag.mo {
        background-color: #07c160;
      }

      .tag.tw {
        background-color: #0755c1;
      }

      .tag.hk {
        background-color: #c10707;
      }

      .tag.sn {
        background-color: #b907c1;
      }
    }

    &>.comment-list {
      background: #f4f4f4;
      padding: 14rpx 30rpx;

      &>.comment-list-item {
        display: flex;
        flex-direction: column;
        margin-bottom: 14rpx;

        &>.info {
          display: flex;
          height: 50rpx;
          align-items: center;
          gap: 0 12rpx;
          font-size: 24rpx;

          &>.username {
            color: #07c160;
          }

          &>.create-time {
            color: #888;
          }
        }

        &>.content {
          line-height: 40rpx;
          font-size: 28rpx;
          padding: 0 58rpx;
          word-break: break-all;
        }
      }
    }
  }
}

.comment-box-body {
  width: 100%;
  height: calc(100% - 58px);
  position: absolute;
  display: flex;
  flex-direction: column;

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

  &>.tab {
    display: flex;
    align-items: center;
    background-color: #fff;

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

  &>.content {
    margin-top: 12rpx;
    flex: 1;
  }
}</style>
