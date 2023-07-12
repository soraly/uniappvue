<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :title="title">
      <!--      <block slot="left">
        <uni-icons type="back" color="#000" size="16" style="margin-left: 10px"/>
      </block>-->
    </nav-bar>
    <!--列表-->
    <div role="feed" class="forum-bd van-list">
      <ul class="forum-list">
        <z-paging :height="'90vh'" ref="paging" v-model="dataList" @query="listLatest" :refresher-enabled="true"
          :hide-empty-view="true" :empty-view-center="true" :empty-view-text="'暂无数据'" :hide-no-more-inside="true"
          :empty-view-img="'/static/img/wu.png'" :fixed="false" :empty-view-style="{ 'margin-bottom': '170px' }"
          :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
          :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
          <li v-for="(item, index) in dataList">
            <view class="user-info-box" @click="homepage(item)">
              <view class="user-img">
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
                </view><!---->
              </view>
              <img v-if="item.highQuality == 1" src="../../static/img/forum/jin.png" class="icon">
            </view>
            <view class="title van-row" @click="detail(item)">
              <view class="van-col van-col--3">
                <label>{{ item.period }}</label>
              </view>
              <view class="van-col van-col--20">
                <view class="txt van-ellipsis">
                  <span v-if="item.top == 1" class="up">「顶」</span>
                  {{ item.title }}
                </view>
              </view>
            </view>
            <view class="text van-multi-ellipsis--l3" @click="detail(item)">
              {{ item.description }}
            </view>
            <view class="img-box">
              <view class="images">
                <view class="img-box-1 van-row">
                  <view class="van-col van-col--8" v-for="(val, key) in item.pictureList"
                    @click="previewImg(item.pictureList, val)">
                    <fast-lazy-load :radius="'8rpx'" :src="val" :width="'100%'" :height="'180rpx'" mode="heightFix">
                      <template v-slot:loading>
                        <image class="lazy-image" :src="loadingImg"></image>
                      </template>
                      <template v-slot:error>
                        <image class="lazy-image" :src="loadingImg"></image>
                      </template>
                    </fast-lazy-load>
                  </view>
                </view><!----><!----><!---->
              </view>
            </view>
            <view class="tool-ft van-row">
              <view class="van-col van-col--8">
                <uni-icons type="hand-up" size="15"></uni-icons>
                <span class="num">{{ item.thumbUpCount | moneyFormat }}</span>
              </view>
              <view class="van-col van-col--8">
                <uni-icons type="eye" size="15"></uni-icons>
                <span class="num">
                  {{ item.clickCount | moneyFormat }}
                </span>
              </view>
              <view class="van-col van-col--8">
                <uni-icons custom-prefix="iconfont" type="comment" size="15"></uni-icons>
                <span class="num">{{ item.commentCount | moneyFormat }}</span>
              </view>
            </view>
          </li>
          <empty v-if="dataList.length == 0"> </empty>
        </z-paging>
      </ul>

      <div class="van-list__placeholder"></div>
    </div>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <AlertInjectLayer />
  </view>
</template>

<script>
import { userPublish } from '../../utils/forum/index.js'

import empty from "@/components/common/empty/empty.vue";
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import NavBar from "../../components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "history",
  components: {
    AlertInjectLayer, empty, cusPreviewImg, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '历史帖子',
      loadingImg: '/static/img/zw.png',
      userId: 0,
      type: 3,
      speak: 0,
      sort: 0,
      lotteryType: 1,
      pageNum: 0,
      pageSize: 10,
      dataList: [],
      ImgList: []
    }
  },
  onLoad(option) {
    this.userId = option.userId
    this.lotteryType = option.lotteryType
    uni.setNavigationBarTitle({
      title: this.title
    });
    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 23) {
          this.loadingImg = item.url
          throw Error();
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    //图片弹窗
    previewImg: function (imgList, url) { // 点击预览图片
      this.ImgList = imgList
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    detail: function (item) {
      const that = this
      item.read = 1
      uni.navigateTo({
        url: 'detail?id=' + item.articleId + '&type=' + item.type,
        success: function (res) {
          res.eventChannel.emit('argParams', {
            lotteryType: that.lotteryType
          })
        }
      })
    },
    //用户主页
    homepage: function (item) {
      uni.navigateTo({
        url: "/pages/user/homepage/homepage?userId=" + item.userId
      })
    },
    listLatest: function (pageNo, pageSize = 10) {
      this.pageNum = pageNo
      let prams = {
        lotteryType: this.lotteryType,
        type: this.type,
        sort: this.sort,
        speak: this.speak,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        toUserId: this.userId
      }
      userPublish(prams).then(res => {
        this.$refs.paging.complete(res.result.records);
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style scoped>
.forum-bd {
  padding: 16rpx 16rpx 0 16rpx;
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

.user-img {
  display: inline-block;
  position: relative;
  padding-left: 48px;
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
  height: 34rpx;
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

.forum-list li .title {
  font-size: 28rpx;
  padding: 14rpx 20rpx;
  display: flow-root;
}

.forum-list li .title label {
  background-color: #07c160;
  color: #fff;
  font-size: 24rpx;
  padding: 0 10rpx;
  border-radius: 8rpx;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.forum-list li .title .txt {
  font-weight: 700;
  max-width: 100%;
  display: inline-block;
  position: relative;
}

.forum-list li .title .txt .up {
  color: #07c160;
}

.forum-list li .text {
  font-size: 26rpx;
  line-height: 40rpx;
  padding: 0 20rpx;
  margin-bottom: 10rpx;
  clear: both;
}

.van-multi-ellipsis--l3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.forum-list li .img-box {
  padding: 0 20rpx;
}

.images .img-box-1 .image-body,
.images .img-box-2 .image-body,
.images .img-box-3 .image-body {
  height: 180rpx;
  border-radius: 8rpx;
}

.images .image-body {
  margin-bottom: 10rpx;
  position: relative;
}

.van-image {
  position: relative;
  display: inline-block;
}

.images .image-body .van-image__img {
  border-radius: 8rpx;
  overflow: hidden;
}

.forum-list li .tool-ft {
  clear: both;
  border-top: 2rpx solid #eee;
  text-align: center;
  padding-top: 20rpx;
  display: flow-root;
}

.forum-list li .tool-ft .num {
  font-weight: 500;
  font-size: 28rpx;
  margin-left: 6rpx;
}

.lazy-image {
  max-width: 80rpx;
  max-height: 80rpx;
  width: 50%;
  height: 50%;
}</style>