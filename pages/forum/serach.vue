<template>
  <view class="mint-tab-container-item"
    :style="'margin-top:' + safeHeight + ';height:calc(var(--vh) - ' + safeHeight + ')'">
    <!--顶部导航栏-->
    <nav-bar :is-back="true">
      <!--      <block slot="left">
        <uni-icons type="back" color="#000" size="16" style="margin-left: 10px"/>
      </block>-->
      <block slot="title">
        <view class="input-view" style="color:#000;font-size: 32rpx">{{ title }}</view>
      </block>
    </nav-bar>
    <view class="search-hd">
      <view class="van-search van-search--show-action" style="background: rgb(255, 255, 255);">
        <view class="van-search__content van-search__content--round">
          <view class="van-cell van-cell--borderless van-field">
            <view class="van-field__left-icon">
              <uni-icons type="search" size="16" style="font-size: 32rpx"></uni-icons>
            </view>
            <view class="van-cell__value van-cell__value--alone van-field__value">
              <view class="van-field__body">
                <input type="search" v-model="keyword" placeholder-style="color:#c8c9cc" placeholder="请输入搜索的标题或作者"
                  class="van-field__control" />
                <uni-icons v-show="keyword.length > 0" @click="keyword = ''" custom-prefix="iconfont"
                  type="cuowuguanbiquxiao-yuankuang" size="16" style="position: absolute;right: 0;color: #c4bfbf;">
                </uni-icons>
              </view>
            </view>
          </view>
        </view>
        <view role="button" tabindex="0" class="van-search__action" @click="search">
          <view class="search-btn">搜索</view>
        </view>
      </view>
    </view>
    <!--列表-->
    <view class="van-pull-refresh">
      <view class="van-pull-refresh__track" style="transition-duration: 0ms;">
        <view class="van-pull-refresh__head"></view><!----><!---->
        <view role="feed" class="van-list" aria-busy="true">
          <ul class="forum-list" v-show="dataList.length > 0">
            <z-paging ref="paging" :height="'85vh'" v-model="dataList" @query="listLatest" :refresher-enabled="false"
              :hide-empty-view="true" :empty-view-center="true" :empty-view-text="'暂无数据'" :hide-no-more-inside="true"
              :fixed="false">
              <li v-for="(item, index) in dataList">
                <view class="user-info-box">
                  <view class="user-img block">
                    <view class="left-image">
                      <view class="van-image van-image--round">
                        <img :src="item.headPic" class="van-image__img">
                      </view><!---->
                    </view>
                    <view class="user-info">
                      <view class="name">
                        {{ item.username }}
                        <span class="reportInfo"></span>
                      </view>
                      <view class="time">{{ item.createTime }}</view>
                    </view>
                    <view class="read" v-show="item.read == 1">已读</view>
                  </view>
                </view>
                <view class="title van-row" @click="detail(item)">
                  <view class="van-col van-col--3">
                    <label>{{ item.period }}</label>
                  </view>
                  <view class="van-col van-col--19">
                    <view class="txt van-ellipsis">
                      {{ item.title }}
                    </view>
                  </view>
                  <view class="hot van-col van-col--2" v-if="item.highQuality == 1">
                    <img src="../../static/img/forum/jin.png" class="icon">
                  </view>
                </view>
                <view class="text" @click="detail(item)">
                  <view class="van-ellipsis" v-for="(val, key) in item.descriptionList" :key="key">
                    {{ val }}
                  </view>
                </view><!---->
                <view class="tool-ft van-row">
                  <view class="van-col van-col--8">
                    <uni-icons type="hand-up" size="15"></uni-icons>
                    <span class="num">{{ item.thumbUpCount | moneyFormat }}</span>
                  </view>
                  <view class="van-col van-col--8">
                    <uni-icons type="eye" size="16"></uni-icons>
                    <span class="num">{{ item.clickCount | moneyFormat }}</span>
                  </view>
                  <view class="van-col van-col--8">
                    <uni-icons custom-prefix="iconfont" type="comment" size="15"></uni-icons>
                    <span class="num">{{ item.commentCount | moneyFormat }}</span>
                  </view>
                </view>
              </li>
            </z-paging>
          </ul>
          <view class="van-list__placeholder"></view>
        </view>
        <view class="empty-box" style="margin-top: 145px;" v-show="dataList.length < 1">
          <view>
            <image src="/static/img/forum/ku.png"></image>
          </view>
          <p>没有找到您想要的</p>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { listLatest } from '../../utils/forum/index.js'
import NavBar from "../../components/common/navBar/navBar.vue"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "serach",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '查询助手',
      scrollTop: 0,
      type: 0,
      speak: 0,
      sort: 0,
      lotteryType: 0,
      isLoadMore: false,
      dataList: [],
      keyword: '',
      pageNum: 0,
      pageSize: 10
    }
  },
  onLoad(option) {
    /*this.lotteryType = option.lotteryType*/
    uni.setNavigationBarTitle({
      title: this.title
    });
  },
  methods: {
    back: function () {
      backPage()
    },
    //加载更多
    lower: function (e) {
      if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.pageNum += 1
      }
    },
    detail: function (item) {
      const that = this
      uni.navigateTo({
        url: 'detail?id=' + item.articleId + '&type=' + item.type + "&createTime=" + item.createTime,
        success: function (res) {
          res.eventChannel.emit('argParams', {
            lotteryType: that.lotteryType
          })
        }
      })
    },
    //搜索
    search: function () {
      this.$refs.paging.reload()
    },
    listLatest: function (pageNo, pageSize = 10) {
      this.pageNum = pageNo
      if (this.keyword == '') {
        return false
      }
      let prams = {
        title: this.keyword,
        lotteryType: this.lotteryType,
        type: this.type,
        sort: this.sort,
        speak: this.speak,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      listLatest(prams).then(res => {
        this.$refs.paging.complete(res.result.records);
        console.log(this.list)
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style scoped>
.mint-tab-container-item {
  background: #fff;
}

.search-hd .van-search {
  background: #f8f8f8 !important;
  padding: 14rpx 24rpx;
}

.van-search,
.van-search__content {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.van-search {
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 12px;
  background-color: #fff;
}

.search-hd .van-search .van-search__content {
  background-color: #fff;
}

.van-search__content--round {
  border-radius: 999px;
}

.van-search__content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-left: 12px;
  background-color: #f7f8fa;
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

.van-field__value {
  overflow: visible;
}

.van-cell__value--alone {
  color: #323233;
  text-align: left;
  width: 100%;
}

.van-cell__value {
  position: relative;
  overflow: hidden;
  color: #969799;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
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
  height: 24px;
}

.van-field__control[type=search] {
  -webkit-appearance: none;
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

.van-search__action {
  padding: 0 8px;
  color: #323233;
  font-size: 14px;
  line-height: 34px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.van-pull-refresh {
  background: #fff;
}

.van-pull-refresh {
  overflow: hidden;
  user-select: none;
}

.van-pull-refresh__track {
  position: relative;
  height: 100%;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
}

.van-pull-refresh__head {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50px;
  overflow: hidden;
  color: #969799;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
  -webkit-transform: translateY(-100%);
  transform: translateY(-100%);
}

.empty-box {
  text-align: center;
}

.empty-box image {
  width: 128rpx;
  height: 128rpx;
}

.empty-box p {
  text-align: center;
  color: #a0a0a0;
  font-size: 32rpx;
  line-height: 44rpx;
  margin-top: 28rpx;
}

.forum-list li {
  padding: 20rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;
  border: 2rpx solid #eee;
}

.forum-list li .user-info-box {
  padding: 0 20rpx 30rpx 20rpx;
  position: relative;
}

.user-img.block {
  display: block;
}

.user-img {
  display: inline-block;
  position: relative;
  padding-left: 48Px;
}

.user-img .left-image {
  position: absolute;
  left: 0;
  top: 0;
}

.user-img .left-image .van-image {
  width: 72rpx;
  height: 72rpx;
}

.van-image--round {
  overflow: hidden;
  border-radius: 50%;
}

.van-image {
  position: relative;
  display: inline-block;
}

.van-image--round img {
  border-radius: inherit;
}

.van-image__error,
.van-image__img,
.van-image__loading {
  display: block;
  width: 100%;
  height: 100%;
}

.user-img .user-info .name {
  padding: 4px 0 3px 0;
  margin-right: 10rpx;
  font-style: normal;
  font-weight: 700;
  font-size: 28rpx;
  color: #999;
}

.user-img .user-info .name .reportInfo {
  padding: 4px 0 3px 0;
  margin-right: 10rpx;
  font-size: 15px;
  color: #ec0808;
}

.user-img .user-info .time {
  font-size: 12px;
  color: #888;
}

.user-img .read {
  position: absolute;
  width: 88rpx;
  height: 48rpx;
  color: #fff;
  text-align: center;
  line-height: 48rpx;
  right: 0;
  top: 0;
  background-color: #07c160;
  border-radius: 0 8rpx 0 16rpx;
}

.forum-list li .title {
  font-size: 28rpx;
  padding: 14rpx 20rpx;
}

.forum-list li .title label {
  background-color: #07c160;
  color: #fff;
  font-size: 24rpx;
  padding: 0 10rpx;
  border-radius: 8rpx;
}

.forum-list li .title .txt {
  font-weight: 700;
  max-width: 100%;
  display: inline-block;
  position: relative;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.forum-list li .title .hot {
  position: relative;
}

.forum-list li .title .hot .icon {
  width: 32rpx;
  position: absolute;
  top: -4rpx;
}

.forum-list li .text {
  clear: both;
  font-size: 26rpx;
  line-height: 40rpx;
  padding: 0 20rpx;
  margin-bottom: 10rpx;
}

.forum-list li .tool-ft {
  border-top: 2rpx solid #eee;
  text-align: center;
  padding-top: 20rpx;
  display: flow-root;
}

.forum-list li .tool-ft .num {
  font-weight: 500;
  font-size: 28rpx;
  margin-left: 6rpx;
}</style>