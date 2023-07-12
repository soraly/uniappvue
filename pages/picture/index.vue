<template>
  <view class="mint-tab-container-item">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :title="title"></nav-bar>
    <!--搜索栏目-->
    <view class="search-hd" :style="{ marginTop: safeHeight }">
      <view class="van-search van-search--show-action" style="background: rgb(255, 255, 255);">
        <view class="van-search__content van-search__content--round">
          <view class="van-cell van-cell--borderless van-field">
            <view class="van-field__left-icon" @click="show_">
              <view class="left-icon">
                <view class="v-popover open">
                  <view class="trigger" style="display: inline-block;" aria-describedby="popover_12efzoxuh0">
                    &nbsp;{{ colorText }}&nbsp; ▾
                  </view>
                </view>
              </view>
            </view>
            <view class="van-cell__value van-cell__value--alone van-field__value">
              <view class="van-field__body">
                <input v-model="prams.keyword" :placeholder-style="'color: #d3d4d6;font-size:28rpx;font-weigth:700'"
                  type="search" placeholder="搜索" class="van-field__control">
                <uni-icons v-show="prams.keyword.length > 0" @click="prams.keyword = ''" custom-prefix="iconfont"
                  type="cuowuguanbiquxiao-yuankuang" size="16" style="position: absolute;right: 0;color: #c4bfbf;">
                </uni-icons>
              </view>
            </view>
          </view>
        </view>
        <view id="popover_12efzoxuh0" v-show="isShow" tabindex="0" class="tooltip popover vue-popover-theme open" style=""
          x-placement="bottom-start">
          <view class="wrapper">
            <view class="tooltip-inner popover-inner" style="position: relative;">
              <view>
                <ul class="down-ul">
                  <li @click="setColor('彩色', 1)" style="border-bottom: 1px solid rgb(221, 221, 221);">彩色</li>
                  <li @click="setColor('黑白', 0)">黑白</li>
                </ul>
              </view>
              <view data-v-8859cc6c="" tabindex="-1" class="resize-observer">
                <object aria-hidden="true" tabindex="-1" type="text/html" data="about:blank"></object>
              </view>
            </view>
            <view class="tooltip-arrow popover-arrow" style="left: 13px;"></view>
          </view>
        </view>
        <view role="button" tabindex="0" class="van-search__action" @click="search">
          <view class="search-btn">搜索</view>
        </view>
      </view>
    </view>
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" show-scrollbar="true" :scroll-into-view="toView"
      scroll-with-animation="true" @scroll="scroll">
      <!--列表-->
      <view class="search-list">
        <view class="van-index-bar" v-if="list.length > 0">
          <view class="van-index-bar__sidebar">
            <span v-for="(item, index) in list" :key="index" @click="maodian(index)"
              :class="selectId == index ? 'van-index-bar__index van-index-bar__index--active' : 'van-index-bar__index'">
              {{ item.key }}
            </span>
          </view>
          <view v-for="(item, index) in list" :key="index" :id="'keys' + index">
            <view>
              <view class="van-index-anchor">
                <span class="search-list-title"><b>{{ item.key }}</b></span>
              </view>
            </view>
            <view class="van-cell" v-for="(val, key) in item.list" :key="key" @click="detail(val.pictureId)">
              <view class="van-cell__value van-cell__value--alone">
                <view>
                  {{ val.pictureName }}
                  <span class="number">{{ val.number }}</span>
                </view>
              </view>
            </view>
          </view>

        </view>
        <empty v-else></empty>
      </view>
    </scroll-view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { search } from '../../utils/picture/index.js'
import empty from '../../components/common/empty/empty'
import NavBar from "../../components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, empty, NavBar
  },
  data() {
    let date = new Date();
    return {
      title: '六合图库',
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      lotteryType: uni.getStorageSync('lotteryType'),
      isShow: false,
      show: 0,
      scrollTop: 0,
      colorText: '彩色',
      toView: 'keysA',
      selectId: 'A',
      prams: {
        color: 1,
        year: date.getFullYear(),    //默认年份
        lotteryType: uni.getStorageSync('lotteryType'),
        keyword: ''
      },
      list: []
    }
  },
  onLoad(option) {
    if (option.year) {
      this.prams.year = option.year
    }
    if (option.color) {
      this.prams.color = option.color
      if (this.prams.color == 0) {
        this.colorText = '黑白'
      }
    }
    if (this.lotteryType == 1) {
      this.title = '香港六合图库'
    } else if (this.lotteryType == 2) {
      this.title = '澳门六合图库'
    } else if (this.lotteryType == 3) {
      this.title = '台湾六合图库'
    } else {
      this.title = '新加坡六合图库'
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.search()
  },
  methods: {
    //返回
    back: function () {
      backPage()
    },
    show_: function () {
      this.isShow = !this.isShow
    },
    //滚动条监听
    scroll: function (e) {
      const query = uni.createSelectorQuery().in(this);
      for (let i = 0; i < this.list.length; i++) {
        query.select('#keys' + i).boundingClientRect(data => {
          if (data.top <= 0 + 94) {
            this.selectId = i
          }
        }).exec();
      }
    },
    //锚点跳转
    maodian: function (key) {
      this.toView = "keys" + key
      this.selectId = key
    },
    detail: function (id) {
      uni.navigateTo({
        url: "/pages/picture/detail?id=" + id // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    setColor: function (colorText, color) {
      this.colorText = colorText;
      this.prams.color = color
      this.isShow = !this.isShow
      this.search()
    },
    search: function () {
      let prams = this.prams
      prams.lotteryType = uni.getStorageSync('lotteryType')
      console.log(prams)
      search(prams).then(res => {
        this.list = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.mint-tab-container-item {
  background: #fff;
}

.header-box {
  height: 92rpx;
}

.search-hd {
  height: 48px;
}

.scroll-Y {
  height: calc(var(--vh) - 92rpx - 96rpx);
}

.search-hd .van-search {
  background: #eee !important;
  padding: 7px 12px;
  width: 100%;
  z-index: 12;
  top: 45px;
  max-width: 480px;
}

.van-search,
.van-search__content {
  display: flex;
}

.van-search {
  -webkit-box-align: center;
  align-items: center;
  box-sizing: border-box;
}

.search-hd .van-search .van-search__content {
  background-color: #fff;
}

.van-search__content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-left: 12px;
  background-color: #f7f8fa;
  border-radius: 2px;
}

.van-search__content--round {
  border-radius: 999px;
}

.van-search,
.van-search__content {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.search-hd .van-search .van-cell {
  padding: 6rpx 16rpx 6rpx 0;
}

.van-search .van-cell {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding: 5px 8px 5px 0;
  background-color: transparent;
}

.van-cell {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
}

.van-field__left-icon {
  margin-right: 4px;
}

.search-hd .left-icon {
  font-size: 12Px;
  color: #07c160;
  position: relative;
}

.tooltip {
  visibility: visible;
  position: absolute;
  will-change: transform;
  top: 10 rpx;
  left: 0px;
  transform: translate3d(50rpx, 70rpx, 0px);
}

.tooltip[aria-hidden=false] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

.tooltip[x-placement^=bottom] {
  margin-top: 10rpx;
}

.tooltip {
  z-index: 10000;
}

.wrapper {
  margin: 0 auto;
  width: 100%;
  background-color: #666;
  display: grid;
  place-items: center;
}

.tooltip.popover .popover-inner {
  background: #fff;
  color: #000;
  padding: 0;
  border-radius: 10rpx;
  box-shadow: 0 10rpx 20rpx rgb(0 0 0 / 10%);
}

.down-ul {
  padding: 10rpx;
}

.down-ul li {
  line-height: 70rpx;
  padding: 0 40rpx;
  color: #555;
  font-size: 28rpx;
}

.resize-observer[data-v-8859cc6c] {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0;
}

.resize-observer[data-v-8859cc6c] object {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.tooltip.popover .popover-arrow {
  border-color: #fff;
}

.tooltip[x-placement^=bottom] .tooltip-arrow {
  border-width: 0 10rpx 10rpx 10rpx;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -10rpx;
  left: calc(50% - 10rpx);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 10rpx;
  border-color: #000;
  z-index: 1;
}

.van-field__value {
  overflow: visible;
}

.van-cell__value--alone {
  color: #323233;
  text-align: left;
}

.van-cell__value {
  position: relative;
  overflow: hidden;
  color: #969799;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
}

.van-cell__title,
.van-cell__value {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

.van-field__body {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.search-hd .van-search .van-field__control {
  font-size: 28rpx;
}

.van-cell__value .van-field__body input {
  height: 24Px;
}

.van-field__control[type=search] {
  -webkit-appearance: none;
}

[type=search] {
  -webkit-appearance: textfield;
  outline-offset: -4rpx;
}

.van-field__control {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  color: #323233;
  line-height: inherit;
  text-align: left;
  background-color: transparent;
  border: 0;
  resize: none;
}

button,
input {
  overflow: visible;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}

button,
input,
select,
textarea {
  outline: none;
}

.van-search__action {
  padding: 0 8px;
  color: #323233;
  font-size: 14px;
  line-height: 34px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.search-hd .search-btn {
  color: #07c160;
  font-size: 30rpx;
}

@media screen and (min-width: 768px) {
  .van-index-bar__sidebar {
    right: auto !important;
    left: 50vw;
  }
}

.van-index-bar__sidebar {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 2;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  text-align: center;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.van-index-bar__index {
  padding: 0 8px 0 16px;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
}

.van-index-bar__index--active {
  color: #ee0a24;
}

.van-index-anchor {
  z-index: 1;
  box-sizing: border-box;
  padding: 0 16px;
  color: #323233;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
  background-color: transparent;
  background-color: #fff;
}

.search-list .search-list-title {
  color: #07c160;
  font-size: 32rpx;
}

.van-cell__value--alone {
  color: #323233;
  text-align: left;
}

.search-list .number {
  position: absolute;
  right: 10rpx;
  color: #07c160;
  padding: 0 30rpx;
  background: #f2f2f2;
  border-radius: 4rpx;
  font-size: 24rpx;
}

.empty-box {
  text-align: center;
  margin-top: 290rpx;
}

.empty-box img {
  width: 128rpx;
}

.empty-box p {
  text-align: center;
  color: #a0a0a0;
  font-size: 32rpx;
  line-height: 44rpx;
  margin-top: 28rpx;
}
</style>