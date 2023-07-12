<template>
  <view class="backroom-box" :style="{ marginTop: safeHeight }">
    <nav-bar title="违规记录" is-back></nav-bar>
    <view class="backroom-box-body">
      <view class="content">
        <view class="list-box">
          <template v-if="this.list.length > 0">
            <view v-for="(item, index) in list" :key="index" class="list-item">
              <view class="top">
                <view class="info">
                  <view class="createTime">{{ item.createTime }}</view>
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
      id: '',
      list: [],
      searchValue: "",
      pageNum: 1
    };
  },
  onLoad(option) {
    this.id = option.id;
    this.getList();
  },
  methods: {
    getList() {
      punish({ pageNum: this.pageNum, userId: this.id }).then(res => {
        if (res.code === 200) {
          this.list = this.list.concat(res.result.records)
          if (res.result.records.length === 0) {
            this.status = "no-more"
          }
        }
      })
    }
  },
};
</script>

<style lang="scss">
.list-item {
  display: flex;
  flex-direction: column;
  padding: 22rpx 32rpx;
  background-color: #fff;
  box-shadow: inset 0 2rpx 0 #ededed;

  &>.top {
    display: flex;
    align-items: center;
    height: 34rpx;
    margin-bottom: 12rpx;

    &>.info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      .createTime {
        font-size: 24rpx;
        color: #888;
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
      padding-top: 4rpx;
    }
  }
}
</style>
