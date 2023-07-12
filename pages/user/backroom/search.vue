<template>
  <view class="backroom-box" :style="{ marginTop: safeHeight }">
    <nav-bar title="小黑屋搜索" is-back></nav-bar>
    <view class="backroom-box-body">
      <view class="search">
        <uni-search-bar v-model="searchValue" placeholder="点击搜索作者或者标题..." cancelButton="always" cancelText="搜索"
          radius="50" bg-color="#fff" @confirm="search" @cancel="search" @clear="clear">
        </uni-search-bar>
      </view>
      <view class="content">
        <view class="list-box">
          <template v-if="this.list.length > 0">
            <view v-for="(item, index) in list" :key="index" class="list-item">
              <view class="top">
                <view class="img">
                  <image style="width: 84rpx; height: 84rpx; border-radius: 50%" :src="item.headPic"></image>
                </view>
                <view class="info">
                  <view class="username">{{ item.nickname }}</view>
                  <view class="createTime">{{ item.updateTime }}</view>
                </view>
                <view class="count">
                  <view class="menu" @click="toDetail(item)"> 共{{ item.punishTime }}违规 </view>
                </view>
              </view>
              <view class="bottom">
                <view class="content">
                  <view class="reason"><text class="title">违规理由：</text>{{ item.reason }}</view>
                  <view class="result">
                    <text class="title">处罚结果：</text>
                    <text v-if="item.punishDay > 0" style="color: red">禁言{{ item.punishDay }}天</text>
                    <text v-else style="color: #000; font-weight: bold">永久禁言</text>
                  </view>
                  <view v-if="item.punishDays > 0" class="result">
                    <text class="title">解封时间：</text>{{ item.endTime }}
                  </view>
                </view>
                <view class="tag">
                  <image style="width: 90rpx; height: 88rpx" src="/static/img/wg.png"></image>
                </view>
              </view>
            </view>
          </template>
          <empty v-else> </empty>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar.vue";
import empty from "@/components/common/empty/empty.vue";
import { info, punish } from '../../../utils/user';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  components: {
    AlertInjectLayer, NavBar, empty
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      list: [],
      searchValue: "",
      pageNum: 1
    };
  },
  onLoad() { },
  methods: {
    toDetail(item) {
      uni.navigateTo({
        url: '/pages/user/backroom/detail?id=' + item.userId
      });
    },
    getList(search = false) {
      punish({ pageNum: this.pageNum, nickname: this.searchValue }).then(res => {
        if (res.code === 200) {
          if (search) {
            this.list = res.result.records;
          } else {
            this.list = this.list.concat(res.result.records)
            if (res.result.records.length === 0) {
              this.status = "no-more"
            }
          }
        }
      })
    },
    search(val) {
      this.getList(true);
    },
  },
};
</script>

<style lang="scss">
.list-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  background-color: #fff;
  border-radius: 8rpx;

  &>.top {
    display: flex;
    align-items: center;
    height: 84rpx;
    gap: 0 20rpx;
    margin-bottom: 20rpx;

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

    &>.count {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: end;

      &>.menu {
        width: 146rpx;
        height: 40rpx;
        background: #fff;
        border: 2rpx solid rgba(255, 0, 0, 0.5);
        box-sizing: border-box;
        border-radius: 40rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        color: red;
        text-align: center;
      }
    }
  }

  &>.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &>.content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 28rpx;
      color: #000;
      min-height: 88rpx;

      & .title {
        font-weight: 700;
      }
    }
  }
}

.backroom-box-body {
  width: 100%;
  height: calc(100% - 58px);
  position: absolute;
  display: flex;
  flex-direction: column;

  &>.content {
    flex: 1;

    &>.list-box {
      display: flex;
      flex-direction: column;
      padding: 0 20rpx 20rpx 20rpx;
      gap: 20rpx 0;
    }
  }
}
</style>
