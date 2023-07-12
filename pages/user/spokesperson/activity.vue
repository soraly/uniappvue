<template>
  <view class="activity-rule" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="title-img">
      <image :src="src" />
    </view>
    <view class="activity-rule-body">
      <view class="activity-rule-box">
        <view class="title">申请门槛</view>
        <view class="bd">
          <view v-for="(item, index) in rules.applyConditionList">{{ index + 1 }}.{{ item }}</view>
        </view>
      </view>
      <view class="activity-rule-box">
        <view class="title">代理人享受福利待遇</view>
        <view class="bd">
          <view v-for="(item, index) in rules.rewardList">{{ index + 1 }}.{{ item }}</view>
        </view>
      </view>
      <view class="activity-rule-box">
        <view class="title">代言人基础标准</view>
        <view class="bd">
          <view v-for="(item, index) in rules.baseStandardList">{{ index + 1 }}.{{ item }}</view>
        </view>
      </view>
      <view class="activity-rule-box">
        <view class="title">有效拉新标准（下级）</view>
        <view class="bd">
          <view v-for="(item, index) in rules.availableNewUserList">{{ index + 1 }}.{{ item }}</view>
        </view>
      </view>
      <view class="activity-rule-box">
        <view class="title">工资奖励机制</view>
        <view class="bd">
          <view v-for="(item, index) in rules.salaryList">{{ index + 1 }}.{{ item }}</view>
        </view>
      </view>
      <view class="activity-rule-box">
        <view class="title">兑换彩金返佣准则</view>
        <view class="bd">
          <view v-for="(item, index) in rules.brokerageList">{{ index + 1 }}.{{ item }}</view>
        </view>
      </view>
    </view>
    <view class="activity-rule-btn">
      <view class="new-sub-btn" @click="toApply">立即申请代言人</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { getActiveRule, applySpoke } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "activity",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '活动规则',
      src: "/static/img/user/hdgz.png",
      rules: {
        applyConditionList: [],
        availableNewUserList: [],
        baseStandardList: [],
        brokerageList: [],
        rewardList: [],
        salaryList: []
      },
    }
  },
  onReady() {
    this.getRules()
  },
  methods: {
    //获取活动规则
    getRules() {
      getActiveRule().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.rules = res.result
        }
      })
    },
    //申请代言人
    setApply() {
      applySpoke().then(res => {
        uni.showToast({
          title: res.message,
          icon: "none"
        })
      })
    },
    toApply() {//点击申请按钮
      this.setApply()

    },
  }
}
</script>

<style lang="scss" scoped>
.activity-rule {
  background: linear-gradient(151deg, #b32b98, #f8484a 35%, #e9379e 57%, #ef4373);
  min-height: var(--vh);

  .title-img {
    text-align: center;
    padding: 40rpx 0;

    image {
      width: 344rpx;
      height: 84rpx;
    }
  }

  .activity-rule-body {
    padding: 0 30rpx;

    .activity-rule-box {
      color: #333333;
      font-size: 28rpx;
      margin-bottom: 32rpx;
      background: #fff;
      box-shadow: inset 0 0 8rpx 4rpx #feeb9d;
      border-radius: 32rpx;
      padding: 30rpx;

      .title {
        font-size: 30rpx;
        color: #434343;
        margin-bottom: 18rpx;
      }

      .bd {
        font-size: 26rpx;
        color: #434343;
        line-height: 46rpx;
      }
    }
  }

  .activity-rule-btn {
    padding: 60rpx;

    .new-sub-btn {
      background-image: url("@/static/img/user/yqhybtn.png");
      background-size: 100% 100%;
      height: 116rpx;
      line-height: 116rpx;
      text-align: center;
      font-weight: 600;
      color: #fff;
      font-size: 36rpx;
    }
  }

}
</style>
