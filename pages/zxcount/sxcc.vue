<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true">
      <view class="input-view" slot="title">{{ title }}</view>
    </nav-bar>
    <!--列表-->


    <view class="mint-tab-container-item">
      <view class="tab-wrap">
        <view v-for="(item, index) in nvaList" :key="index" :class="isActive == index ? 'active' : ''"
          @click="isActive = index">
          {{ item }}
        </view>
      </view>
      <view class="container-wrap wrap2-1" v-show="isActive == 0">
        <view class="container2-wrap wrap2-1" v-for="(item, index) in colorList">
          <h4>{{ item.name }}</h4>
          <view class="color-wrap span-wrap">
            <view v-for="(val, key) in item.list">
              <span :class="classd[val.color - 1]">{{ val.number }}</span>
            </view>
          </view>
        </view>
      </view>
      <view class="container-wrap wrap2-2" v-show="isActive == 1">
        <view class="container2-wrap" v-for="(item, index) in shengxiaoList" :key="index">
          <view class="color-wrap span-wrap"><i>{{ item.name }}</i>
            <view v-for="(val, key) in item.list">
              <span :class="classd[val.color - 1]">{{ val.number }}</span>
            </view>
          </view>
        </view>
      </view>
      <view class="container-wrap wrap2-3" v-show="isActive == 2">
        <view class="container2-wrap" v-for="(item, index) in wuxingList">
          <h4>{{ item.name }}</h4>
          <view class="color-wrap span-wrap">
            <view v-for="(val, key) in item.list">
              <span :class="classd[val.color - 1]">{{ val.number }}</span>
            </view>
          </view>
        </view>
      </view>
      <view class="container-wrap wrap2-4" v-show="isActive == 3">
        <view class="container2-wrap" v-for="(item, index) in animalTypeList">
          <view class="animal">
            <span>{{ item.name }}</span>
            <span v-for="(val, key) in item.list" v-if="key == 0">{{ val }}</span>
            <span v-else>丶{{ val }}</span>
          </view>
        </view>
      </view>
    </view>
    <!--底部-->
    <view class="footer">
      <count-fab :lotterytype="lotteryType"></count-fab>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import CountFab from "../../components/common/fab/CountFab"
import { attrConstant } from "../../utils/zxcount";
import NavBar from "../../components/common/navBar/navBar.vue"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "sxcc",
  components: {
    AlertInjectLayer, CountFab, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      lotteryType: 1,
      title: "属性参照",
      period: 100,
      lists: [],
      classd: ['red', 'blue', 'green'],
      isActive: 0,
      nvaList: ["波色", '生肖', "五行", "家禽野兽"],
      animalTypeList: [],//家禽野兽
      colorList: [],//波色
      shengxiaoList: [],//生肖
      wuxingList: [],//五行
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
    this.attrConstant()
  },
  methods: {
    //返回
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    //列表请求
    attrConstant: function () {
      attrConstant().then(res => {
        let data = res.result
        this.animalTypeList = data.animalTypeList //家禽野兽
        this.colorList = data.colorList//波色
        this.shengxiaoList = data.shengxiaoList//生肖
        this.wuxingList = data.wuxingList//五行
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

.header-box {
  border-bottom: 2px solid #ebedf0;
}

.footer {
  height: 85px;
}

.mint-tab-container-item {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 100%;
}

.input-view {
  font-size: 16px;
}

.uni-subtitle {
  font-size: 14px;
}

.tab-wrap {
  display: flex;
  justify-content: space-between;
  line-height: 100rpx;
  height: 100rpx;
  font-size: 32rpx;
  color: #333;
  text-align: center;
  background: #fff;
}

.tab-wrap>uni-view {
  flex: 1;
}

.tab-wrap .active {
  color: #07c160;
}

.container-wrap {
  box-sizing: border-box;
  padding: 6px 12px;
  margin-top: 6px;
  background: #fff;
}

.container2-wrap {
  padding-bottom: 12rpx;
  border-bottom: 2rpx solid #e1e1e1;
}

.container2-wrap:first-of-type>h4 {
  padding-top: 0;
}

.container2-wrap>h4 {
  font-size: 24rpx;
  line-height: 34rpx;
  padding: 18rpx 0 26rpx;
  color: #333;
  font-weight: 400;
}

.container2-wrap .color-wrap {
  display: flex;
  flex-wrap: wrap;
}

.color-wrap>uni-view {
  width: 10%;
  text-align: left;
  margin-bottom: 10px;
}

.color-wrap .red {
  background: url("../../static/img/qiu/1.png");
  background-size: cover;
}

.color-wrap.span-wrap>uni-view>span.blue,
.color-wrap:not(.span-wrap)>uni-view.blue {
  background: url("../../static/img/qiu/2.png");
  background-size: cover;
}

.color-wrap.span-wrap>uni-view>span.green,
.color-wrap:not(.span-wrap)>uni-view.green {
  background: url("../../static/img/qiu/3.png");
  background-size: cover;
}

.color-wrap.span-wrap>uni-view>span {
  display: block;
}

.color-wrap.span-wrap>uni-view>span,
.color-wrap:not(.span-wrap)>uni-view {
  background-size: cover;
  text-align: center;
  height: 48rpx;
  width: 48rpx;
  line-height: 52rpx;
  font-size: 24rpx;
  text-indent: -2rpx;
}

.red {
  color: red;
}

.container-wrap.wrap2-2 .container2-wrap {
  padding: 12rpx 0;
}

.container-wrap.wrap2-2 {
  padding: 0 24rpx;
}

.container-wrap.wrap2-2 .container2-wrap .color-wrap>i {
  display: inline-block;
  margin-right: 20rpx;
  font-size: 30rpx;
  color: #333;
  font-style: normal;
}

.container-wrap.wrap2-2 .container2-wrap .color-wrap>uni-view {
  margin-bottom: 0;
}

.container2-wrap .color-wrap>uni-view {
  width: 10%;
  text-align: left;
  margin-bottom: 30rpx;
}

.container-wrap.wrap2-3 {
  padding: 0 24rpx;
}

.container-wrap.wrap2-3 .container2-wrap {
  padding: 24rpx 0 6rpx 0;
  position: relative;
}

.container-wrap.wrap2-3 .container2-wrap>h4 {
  position: absolute;
  top: 26rpx;
  width: 52rpx;
  font-size: 30rpx;
  left: 0;
  padding: 0;
}

.container-wrap.wrap2-3 .container2-wrap .color-wrap {
  width: calc(100% - 52rpx);
  margin-left: 52rpx;
}

.container-wrap.wrap2-3 .container2-wrap .color-wrap>uni-view {
  width: 12%;
}

.container-wrap.wrap2-4 {
  padding: 0 24rpx;
}

.container-wrap.wrap2-4 .container2-wrap {
  padding: 24rpx 0;
}

.container-wrap.wrap2-4 .container2-wrap .animal>span:first-of-type {
  font-size: 30rpx;
  margin-right: 52rpx;
}

.container-wrap.wrap2-4 .container2-wrap .animal>span {
  font-size: 30rpx;
  font-weight: 700;
}
</style>