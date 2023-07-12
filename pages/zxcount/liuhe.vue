<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :goHome="false" :title="title">
      <!--      <block slot="left">-->
      <!--        <uni-icons type="back" color="#666" size="18" style="font-weight: bold;margin-left: 10px"/>-->
      <!--      </block>-->
      <block slot="right">
        <view class="uni-list-cell-db">
          <text class="uni-subtitle">期数</text>
          <input class="uni-input" v-model="period" @blur="summary" @confirm="summary" />
        </view>
      </block>
    </nav-bar>
    <!--列表-->
    <view v-if="Object.keys(this.lists).length > 0">
      <view class="container-wrap">
        <view class="top-wrap">
          <h4>特码出现期数最多的号码</h4>
          <view class="color-wrap">
            <view v-for="(item, index) in lists.specialHotNumberList" :key="index" :class="classd[item.color - 1]">
              {{ item.number }}
            </view>
          </view>
        </view>
        <view class="top-wrap">
          <h4>特码当前遗漏期数最多的号码</h4>
          <view class="color-wrap">
            <view v-for="(item, index) in lists.specialColdNumberList" :key="index" :class="classd[item.color - 1]">
              {{ item.number }}
            </view>
          </view>
        </view>
        <view class="top-wrap">
          <h4>正码出现期数最多的号码</h4>
          <view class="color-wrap">
            <view v-for="(item, index) in lists.normalHotNumberList" :key="index" :class="classd[item.color - 1]">
              {{ item.number }}
            </view>
          </view>
        </view>
        <view class="top-wrap">
          <h4>正码当前遗漏期数最多的号码</h4>
          <view class="color-wrap">
            <view v-for="(item, index) in lists.normalColdNumberList" :key="index" :class="classd[item.color - 1]">
              {{ item.number }}
            </view>
          </view>
        </view>
      </view>
      <view class="container-wrap">
        <view class="bottom-wrap">
          <view class="title">特码出现期数最多的生肖</view>
          <view class="text">
            <view v-for="(item, index) in lists.specialHotAnimalList" :key="index">{{ item.name }}</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">特码当前遗漏期数最多的生肖</view>
          <view class="text">
            <view v-for="(item, index) in lists.specialColdAnimalList" :key="index">{{ item.name }}</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">正码出现期数最多的生肖</view>
          <view class="text">
            <view v-for="(item, index) in lists.normalHotAnimalList" :key="index">{{ item.name }}</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">正码当前遗漏期数最多的生肖</view>
          <view class="text">
            <view v-for="(item, index) in lists.normalColdAnimalList" :key="index">{{ item.name }}</view>
          </view>
        </view>
      </view>
      <view class="container-wrap">
        <view class="bottom-wrap">
          <view class="title">特码出现期数最多的生肖</view>
          <view class="text">
            <view v-for="(item, index) in lists.specialHotColorList" :key="index" :class="classd[item.key - 1]">{{
              item.value }}</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">特码当前遗漏期数最多的波色</view>
          <view class="text">
            <view v-for="(item, index) in lists.specialColdColorList" :key="index" :class="classd[item.key - 1]">{{
              item.value }}</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">正码出现期数最多的波色</view>
          <view class="text">
            <view v-for="(item, index) in lists.normalHotColorList" :key="index" :class="classd[item.key - 1]">{{
              item.value }}</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">正码当前遗漏期数最多的波色</view>
          <view class="text">
            <view v-for="(item, index) in lists.normalColdColorList" :key="index" :class="classd[item.key - 1]">{{
              item.value }}</view>
          </view>
        </view>
      </view>
      <view class="container-wrap">
        <view class="bottom-wrap">
          <view class="title">特码出现期数最多的尾数</view>
          <view class="text">
            <view v-for="(item, index) in lists.specialHotTailList" :key="index">{{ item.name }}尾</view>
          </view>
        </view>
        <view class="bottom-wrap">
          <view class="title">特码当前遗漏期数最多的尾数</view>
          <view class="text">
            <view v-for="(item, index) in lists.specialColdTailList" :key="index">{{ item.name }}尾</view>
          </view>
        </view>
      </view>
    </view>
    <empty v-else></empty>
    <!--底部-->
    <view class="footer">
      <count-fab :lotterytype="lotteryType"></count-fab>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import CountFab from "../../components/common/fab/CountFab"
import Empty from "../../components/common/empty/empty"
import NavBar from "../../components/common/navBar/navBar.vue"
import { summary } from "../../utils/zxcount";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "liuhe",
  components: {
    AlertInjectLayer, Empty, CountFab, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      lotteryType: 1,
      title: "六合统计",
      period: 100,
      lists: [],
      classd: ['red', 'blue', 'green']
    }
  },
  onLoad(option) {
    // #ifdef APP-NVUE
    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
    // #endif
    // #ifndef APP-NVUE
    const eventChannel = this.getOpenerEventChannel();
    // #endif
    eventChannel.on('argParams', function (data) {
      this.lotteryType = data.lotteryType
    })
    this.lotteryType = uni.getStorageSync('lotteryType')
    if (this.lotteryType == 1) {
      this.title = '香港' + this.title
    } else if (this.lotteryType == 2) {
      this.title = '澳门' + this.title
    } else if (this.lotteryType == 3) {
      this.title = '台湾' + this.title
    } else {
      this.title = '新加坡' + this.title
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.summary()
  },
  methods: {
    //返回
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },

    summary: function () {
      let prams = {
        period: this.period
      }
      summary(prams).then(res => {
        this.lists = res.result || []
        console.log()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.header-box,
.header,
.box-bg {
  height: 46px;
}

.input-view {
  font-size: 16px;
}

.uni-subtitle {
  font-size: 14px;
}

.container-wrap {
  box-sizing: border-box;
  padding: 12rpx 24rpx;
  margin-top: 12rpx;
  background: #fff;
}

.container-wrap .top-wrap {
  border-bottom: 1px solid #e1e1e1;
}

.top-wrap:first-of-type h4 {
  padding-top: 0;
}

.container-wrap .top-wrap h4 {
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #333;
  padding-top: 18rpx;
}

.container-wrap .top-wrap h4 {
  font-weight: 400;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #333;
  padding-top: 18rpx;
}

.container-wrap .color-wrap {
  padding: 26rpx 0 22rpx 0;
  display: flex;
  justify-content: space-between;
}

.color-wrap uni-view {
  text-align: center;
  height: 48rpx;
  width: 48rpx;
  line-height: 48rpx;
  font-size: 24rpx;
  text-indent: -2rpx;
}

.color-wrap .blue {
  background: url('@/static/img/qiu/2.png');
  background-size: cover;
}

.color-wrap .red {
  background: url('@/static/img/qiu/1.png');
  background-size: cover;
}

.color-wrap .green {
  background: url('@/static/img/qiu/3.png');
  background-size: cover;
}

.container-wrap .bottom-wrap {
  display: flex;
  padding: 5px 0;
}

.container-wrap .bottom-wrap .title {
  font-size: 24rpx;
}

.container-wrap .bottom-wrap>uni-view {
  flex: 1;
  color: #333;
  line-height: 42rpx;
}

.container-wrap .bottom-wrap .text {
  font-size: 30rpx;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}

.text .red {
  color: #f05a5a;
}

.text .blue {
  color: #2f85dd;
}

.text .green {
  color: #18cf32;
}

.footer {
  height: 85px;
}
</style>
