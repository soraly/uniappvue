<template>
  <view class="medal-box" :style="{ marginTop: safeHeight }">
    <nav-bar title="我的勋章"></nav-bar>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" type="dialog">
      <view class="pop-medal-box">
        <view class="medal-img">
          <view class="medal-box">
            <image :src="detail.filePath" />
          </view>
          <view class="name">{{ detail.name }}</view>
        </view>
        <view class="text-box">
          <view class="title">领取条件</view>
          <view class="text">{{ detail.conditions }}</view>
        </view>
        <view class="text-box">
          <view class="title">奖励：{{ detail.rewardAmount }}</view>
          <view class="text">奖励成长值：+{{ detail.rewardScore }}</view>
          <view class="text">奖励小红花：</view>
          <view class="text">(有效期：{{ detail.remark }} )</view>
        </view>
        <view class="btn" v-if="detail.hasMedal === 0">去获得</view>
      </view>
    </uni-popup>
    <view class="medal-box-body">
      <template v-if="list.length > 0">
        <view v-for="(item, index) in list" :key="index" class="list-item" @click="openMedal(item)">
          <view class="img">
            <image style="width: 160rpx; height: 160rpx" :src="item.filePath"></image>
          </view>
          <view class="name">{{ item.name }}</view>
        </view>
      </template>
      <empty v-else></empty>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import empty from "@/components/common/empty/empty.vue";
import NavBar from '@/components/common/navBar/navBar.vue';
import { myMedal } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer, empty, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      list: [],
      detail: {}
    };
  },
  onLoad() {
    this.getMedalList();
  },
  methods: {
    getMedalList() {
      myMedal().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.result
        }
      })
    },
    openMedal(detail) {
      this.$refs.popup.open()
      this.detail = detail
    }
  },
};
</script>

<style lang="scss">
.medal-box {
  .pop-medal-box {
    width: 550rpx;
    padding: 40rpx 30rpx;
    border-radius: 32rpx;
    font-size: 28rpx;

    .medal-img {
      text-align: center;

      .medal-box {
        width: 160rpx;
        height: 160rpx;
        background: #eee;
        display: inline-block;
        border-radius: 50%;
        text-align: center;

        image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
          margin-top: 20rpx;
        }
      }

      .name {
        padding-top: 20rpx;
        font-weight: 400;
        font-size: 32rpx;
      }
    }

    .text-box {
      margin-top: 40rpx;

      .title {
        font-weight: 600;
        font-size: 32rpx;
      }

      .text {
        line-height: 40rpx;
        font-weight: 400;
        color: #666;
        padding-top: 10rpx;
      }
    }

    .btn {
      height: 80rpx;
      background: #ff4545;
      border-radius: 52rpx;
      text-align: center;
      font-weight: 600;
      font-size: 32rpx;
      line-height: 80rpx;
      color: #fff;
      margin-top: 40rpx;
    }
  }
}

.medal-box-body {
  padding-top: 60rpx;
  width: 100%;
  height: calc(100% - 58px);
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 40rpx 0;
  overflow: auto;
  background-color: #F8F8F8;

  &>.list-item {
    width: 33.3333%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &>.img {
      background: #e6e6e6;
      border-radius: 50%;
      display: flex;
      align-items: center;
    }

    &>.name {
      padding-top: 20rpx;
      overflow: hidden;
      font-size: 32rpx;
      font-weight: 400;
    }
  }
}</style>
