<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
      <block slot="right">
        <image src="/static/img/forum/search.png" style="width:32rpx;height:32rpx;margin-right:40rpx;" @click="serach">
        </image>
        <image src="/static/img/forum/fabu.png" @click="fabu" style="width:32rpx;height:32rpx;margin-right:40rpx;">
        </image>
      </block>
    </NavBar>
    <scroll-view :style="'height:calc(var(--vh) - ' + safeHeight + ')'" :scroll-top="scrollTop" scroll-y="true"
      class="scroll-Y" show-scrollbar="true" lower-threshold="700" scroll-with-animation="true" @scrolltolower="lower"
      @scroll="scroll">
      <!--广告公告栏-->
      <view class="forum-body-hd">
        <view class="forum-body-item">
          <label class="label">广告</label>
          <!--          <uni-link v-if="adInfo.length > 0" :showUnderLine="false" color="#333"  class="text" :href="adInfo[0].jumpUrl || ''" text="">
          </uni-link>-->
          <text v-if="adInfo.length > 0" class="text" @click="openAd(adInfo[0])" style="color: #333;font-size: 28rpx;">{{
            adInfo[0].content }}</text>
        </view>
        <view class="border"></view>
        <view class="forum-body-item">
          <label class="label">公告</label>
          <text style="color: #333;font-size: 28rpx;">{{ noticeInfo ? noticeInfo.noticeContent : '' }} </text>
        </view>
      </view>
      <!--导航栏-->
      <view class="nav-box" style="height: 258rpx">
        <view id="nav" :class="isTop == 1 ? 'tab-div-top tab-div' : 'tab-div'"
          :style="isTop == 1 ? 'marginTop:' + safeHeight : ''">
          <view class="tab-box">
            <view class="nav">
              <view v-for="(item, index) in navList" :key="index"
                :class="lotteryType == item.lotteryType ? 'nav-item active' : 'nav-item'" @click="selectLottery(item)">
                {{ item.name }}
              </view>
            </view>
          </view>
          <view class="title-tab-box">
            <view v-for="(item, index) in speakList" :key="index"
              :class="speak == index ? 'title-tab-item active' : 'title-tab-item'" @click="selectSpeak(index)">
              {{ item }}
            </view>
          </view>
          <view class="sort-box">
            <span v-for="(item, index) in sortList" :key="index" :class="sort == index ? 'act' : ''"
              @click="selectSort(index)">
              {{ item }}
            </span>
            <span :class="sort == -1 ? 'act' : ''" @click="sort = -1">
              规则
            </span>
          </view>
        </view>
      </view>
      <!--列表-->
      <view class="forum-body-bd">
        <view role="feed" class="van-list" v-show="sort >= 0" style="">
          <ul class="forum-list" v-if="list.length > 0">
            <li v-for="(item, index) in list" :key="index">
              <view class="user-info-box">
                <view class="user-img" @click="homepage(item)">
                  <view class="left-image">
                    <view class="van-image van-image--round">
                      <img :src="item.headPic" class="van-image__img">
                    </view>
                  </view>
                  <view class="user-info">
                    <view :class="item.vip == 1 ? 'name red' : 'name'">
                      {{ item.username }}
                      <image v-for="(val, key) in item.medalList" :key="key" :src="val" lazy-load="true"></image>
                      <span class="reportInfo"></span>
                    </view>
                    <view class="time">{{ item.updateTime }}</view>
                  </view>
                </view>
              </view>
              <view class="forumflow" @click="concern(item)">
                <span v-if="item.concern == 0">+ 关注</span>
                <span v-else>已关注</span>
              </view>
              <view class="title van-row" @click="detail(item)">
                <view class="slabel van-col van-col--3">{{ item.period }}</view>
                <view class="van-col van-col--21">
                  <view class="van19  van-ellipsis">
                    <span class="up" v-if="item.top == 1">
                      <image src="../../static/img/forum/zd.png" style="width: 25px;" mode="widthFix"></image>
                    </span>
                    <span v-if="item.highQuality == 1">
                      <image src="../../static/img/forum/jin.png" style="width: 25px;" class="icon" mode="widthFix">
                      </image>
                    </span>
                    <view class="formtitle" :style="item.read == 1 ? 'color: rgb(153, 153, 153);' : ''">
                      {{ item.title }}
                    </view>
                    <view class="reads" v-show="item.read == 1">已读</view>
                  </view>
                </view>
              </view>
              <view style="clear: both"></view>
              <view class="text" :style="item.read == 1 ? 'color: rgb(153, 153, 153);' : ''" @click="detail(item)">
                <view class="van-ellipsis" v-for="(val, key) in item.descriptionList" :key="key">
                  {{ val }}
                </view>
              </view>
              <view class="img-box">
                <view class="images">
                  <view class="img-box-3 van-row">
                    <view class="van-col van-col--8" v-for="(val, key) in item.pictureList.slice(0, 3)"
                      @click="previewImg(item.pictureList, val)">
                      <view class="image-body">
                        <fast-lazy-load :radius="'8rpx'" :src="val" :width="'100%'" :height="'180rpx'" mode="aspectFill">
                          <template v-slot:loading>
                            <image class="lazy-image" :src="loadingImg"></image>
                          </template>
                          <template v-slot:error>
                            <image class="lazy-image" :src="loadingImg"></image>
                          </template>
                        </fast-lazy-load>
                        <div v-if="key == 2 && item.pictureList.length > 3" class="length">共{{ item.pictureList.length }}张
                        </div>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view style="clear: both"></view>
              <view class="tool-ft tom-col van-row">
                <view class="van-col van-col--6">
                  <uni-icons type="hand-up" size="15"></uni-icons>
                  <span class="num">{{ item.thumbUpCount | moneyFormat }}</span>
                </view>
                <view class="van-col van-col--6">
                  <uni-icons type="eye" size="15"></uni-icons>
                  <span class="num">
                    {{ item.clickCount | moneyFormat }}
                  </span>
                </view>
                <view class="van-col van-col--6">
                  <uni-icons custom-prefix="iconfont" type="comment" size="15"></uni-icons>
                  <span class="num">{{ item.commentCount | moneyFormat }}</span>
                </view>
                <view class="ntool van-col van-col--6">
                  <view>
                    <image :src="'/static/img/menu/' + item.lotteryType + '.png'" alt=""></image>
                    <span class="num">{{ lotteryName(item.lotteryType) }}</span>
                  </view>
                </view>
              </view>
            </li>
          </ul>
          <empty v-else></empty>
          <view class="van-list__placeholder"></view>
        </view>
        <view class="rule-text" v-show="sort == -1">
          <mp-html :content="ruleText" />
        </view>
      </view>
      <uni-load-more :status="status"></uni-load-more>
    </scroll-view>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--悬浮菜单栏-->
    <fab></fab>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Fab from "../../components/common/fab/Fab";
import Login from "../../components/common/login/Login";
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import mpHtml from '../../components/mp-html/mp-html'
import Empty from '../../components/common/empty/empty'
import { listLatest, ruleContent } from '../../utils/forum/index.js'
import { concern } from '../../utils/user/index.js'
import { advertList, buttonInfo, noticeList } from '../../utils/common/index.js'
import { notice } from '../../utils/common/index'
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, Login, Fab, cusPreviewImg, mpHtml, Empty, NavBar,
  },
  data() {
    return {
      headerStyle: {
        backgroundColor: "#07c160"
      },
      fontColor: "#ffffff",
      titleStyle: {
        color: "#ffffff"
      },
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '高手论坛',
      scrollTop: 0,
      isTop: 0,           //吸附判断
      loadingImg: '/static/img/zw.png',
      old: {
        scrollTop: 0,
        myScroll: 0,
      },
      status: 'more',    //触底加载状态
      isLoadMore: false,
      lotteryType: 0,
      speak: 0,
      sort: 0,
      navList: [
        { lotteryType: 0, name: '全部' },
        { lotteryType: 2, name: '澳彩' },
        { lotteryType: 1, name: '港彩' },
        { lotteryType: 3, name: '台彩' },
        { lotteryType: 4, name: '新彩' }
      ],
      sortList: ['综合', '精华', '最多赞', '最新'],
      speakList: ['全部主题', '图解小组'],
      toUserId: 0,
      userId: 0,
      articleId: 0,
      pageNum: 1,//页码
      pageSize: 10,  //每页数量
      type: 3,
      list: [],
      ImgList: [],
      //广告
      adInfo: [],
      //公告
      noticeInfo: {},
      //规则
      ruleText: null,
      msg: '',
    }
  },
  onLoad(option) {
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.listLatest()
    this.buttonInfo()
    this.noticeList()
    this.ruleContent()
    uni.$on('emitParams', data => {
      this.msg = data.msg
    })
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.$nextTick(function () {
      this.navY()
    })
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
  onShow() {
    if (this.msg) {
      pop(this.msg, 2000)
      this.msg = ''
    }
  },
  methods: {
    //返回
    back: function () {
      uni.navigateBack()
    },
    openAd(item) {
      openUrl(item)
    },
    navY: function () {
      /*下次 DOM 更新时，找到某个控件，再进行复杂计算并确定其高度后*/
      const query = uni.createSelectorQuery().in(this).select('.nav-box');
      query.boundingClientRect(data => {
        console.log(data.top)
        this.old.myScroll = data.top;
      }).exec();
    },
    detail: function (item) {
      const that = this
      item.read = 1
      uni.navigateTo({
        url: 'detail?id=' + item.articleId + '&type=' + item.type + "&createTime=" + item.createTime,
        success: function (res) {
          res.eventChannel.emit('argParams', {
            lotteryType: that.lotteryType
          })
        }
      })
    },
    lotteryName: function (lotteryId) {
      let lotteryName = ''
      this.navList.forEach((item, index) => {
        if (item.lotteryType == lotteryId) {
          lotteryName = item.name
          return
        }
      })
      return lotteryName
    },
    //加载更多
    lower: function (e) {
      if (!this.isLoadMore && this.sort >= 0) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.pageNum++
        this.listLatest()
      }
    },
    //滚动条监听
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop
      if ((this.old.scrollTop) >= this.old.myScroll) {
        this.isTop = 1
      } else {
        this.isTop = 0
      }
    },
    listLatest: function () {
      let prams = {
        lotteryType: this.lotteryType,
        type: this.type,
        sort: this.sort,
        speak: this.speak,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      listLatest(prams).then(res => {
        this.list.push(...res.result.records)
        this.isLoadMore = false
        console.log(this.list)
      }).catch(err => {
        console.log(err)
      })
    },
    //文章规则
    ruleContent: function () {
      let prams = {}
      ruleContent(prams).then(res => {
        this.ruleText = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //选择彩票
    selectLottery: function (item) {
      this.lotteryType = item.lotteryType
      this.pageNum = 1;
      this.list = [];
      this.listLatest()
    },
    selectSpeak: function (index) {
      this.speak = index
      this.pageNum = 1;
      this.list = [];
      this.listLatest()
    },
    selectSort: function (index) {
      this.sort = index
      this.pageNum = 1;
      this.list = [];
      this.listLatest()
    },
    serach: function () {
      uni.navigateTo({
        url: '/pages/forum/serach?lotteryType=' + this.lotteryType
      })
    },
    //用户主页
    homepage: function (item) {
      uni.navigateTo({
        url: "/pages/user/homepage/homepage?userId=" + item.userId
      })
    },
    fabu: function () {
      let lastTime = uni.getStorageSync('addForum');
      if (!isLogin()) {
        uni.$emit('showPop', {
          refName: 'AlertMsg',
          data: {
            title: '提示',
            content: '您还没有登录账号，\n是否立即前往登录？'
          },
          confirm: () => {
            uni.navigateTo({
              url: "/pages/liuhe/login"
            })
          },
        })
        return false
      }
      let nowTime = new Date().getTime();
      if ((nowTime - lastTime) / 1000 < 60) {
        pop('1分钟内禁止连续发帖', 2000)
        return false
      }
      uni.navigateTo({
        url: '/pages/forum/add'
      })
    },
    //关注接口
    concern: function (item) {
      let token = uni.getStorageSync('token');
      if (!token) {
        uni.$emit('showPop', {
          refName: 'AlertMsg',
          data: {
            title: '提示',
            content: '您还没有登录账号，\n是否立即前往登录？'
          },
          confirm: () => {
            uni.navigateTo({
              url: "/pages/liuhe/login"
            })
          },
        })
        return false
      }
      let prams = { userId: item.userId }
      concern(prams).then(res => {
        uni.showToast({
          title: res.message,
          duration: 2000,
          icon: 'none'
        })
        if (res.code == 200) {
          item.concern = !item.concern
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //图片弹窗
    previewImg: function (imgList, url) { // 点击预览图片
      this.ImgList = imgList
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    //广告
    buttonInfo: function () {
      /*let prams = {typeCode:2}
      buttonInfo(prams).then(res=>{
        this.adInfo = res.result
      }).catch(err=>{
        console.log(err)
      })*/
      let prams = {
        projectType: 1,
        code: 6,
      }
      advertList(prams).then(res => {
        this.adInfo = res.result
      }).catch(err => {

      })
    },
    //公告
    noticeList: function () {
      let prams = { position: 2 }
      notice(prams).then(res => {
        this.noticeInfo = res.result[0]
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.mint-tab-container-item {
  background: #f8f8f8;
}

.header-box,
.header,
.box-bg {
  height: 55px;
}

.forum-body-hd {
  color: #fff;
  height: 158rpx;
  margin: 0px 20rpx;
  background: #fff;
  border-radius: 10rpx;
}

.forum-body-item {
  padding: 20rpx 20rpx 20rpx 30rpx;
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.forum-body-item .label {
  color: #07c160;
  margin-right: 20rpx;
}

.forum-body-item .text {
  color: #333;

}

.border {
  border-bottom: 1px solid #e8e8e8;
  margin: 0 40rpx;
}

.tab-div-top {
  position: fixed;
  z-index: 1;
  background: #f8f8f8;
  width: 100%;
  top: 46px;
  max-width: 480px;
}

.tab-box {
  padding: 10rpx;
}

.nav {
  box-sizing: border-box;
  height: 60rpx;
  margin: 10rpx 32rpx;
  border: 1px solid #07c160;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-around;
  background: #fff;
}

.nav .nav-item {
  width: 20%;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  border-right: 1px solid;
  border-color: #07c160;
  font-size: 24rpx;
  color: #07c160;
}

.nav .nav-item:last-child {
  border: 0px;
}

.nav .nav-item.active {
  background-color: #07c160;
  color: #fff;
}

.title-tab-box {
  height: 80rpx;
  display: flex;
  align-items: center;
  flex-direction: row;
  text-align: center;
  margin-bottom: 10rpx;
}

.title-tab-box .title-tab-item {
  width: 50%;
  font-size: 32rpx;
  color: #999;
  font-weight: 700;
}

.title-tab-box .title-tab-item.active {
  color: #07c160;
}

.sort-box {
  background-color: #fff;
  padding: 20rpx 20rpx 10rpx 20rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
}

.sort-box span {
  display: inline-block;
  margin-right: 40rpx;
  color: #797979;
}

.sort-box span.act {
  color: #07c160;
}

.forum-body-bd {
  padding: 0 20rpx;
}

.forum-list li {
  padding: 20rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;
  border: 1px solid #eee;
  position: relative;
}

.forum-list li .user-info-box {
  padding: 0 20rpx 20rpx;
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

.user-img .user-info .name.red {
  color: red !important;
}

.user-img .user-info .name {
  padding: 4px 0 3px 0;
  margin-right: 5px;
  font-style: normal;
  font-weight: 700;
  font-size: 28rpx;
  color: #999;
}

.user-img .user-info .name image {
  width: 28rpx;
  height: 28rpx;
  vertical-align: text-top;
}

.user-img .user-info .name .reportInfo {
  padding: 4px 0 3px 0;
  margin-right: 10rpx;
  font-size: 30rpx;
  color: #ec0808;
}

.user-img .user-info .time {
  font-size: 12px;
  color: #888;
}

.forum-body-bd .forumflow {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  width: 112rpx;
  height: 56rpx;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #333;
  font-weight: 400;
  font-size: 28rpx;
}

.forum-list li .title {
  font-size: 28rpx;
  padding: 12rpx 20rpx;
  display: flow-root;
}

.forum-list li .slabel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 16rpx;
  min-width: 62rpx;
  height: 40rpx;
  background: #07c160;
  border-radius: 8rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #fff;
  line-height: 40rpx;
}

.van-col {
  float: left;
  box-sizing: border-box;
  min-height: 2rpx;
}

.van-col--21 {
  width: 87.5%;
}

.van19 {
  display: flex !important;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.van19 image {
  height: 40rpx !important;
  margin: 0 8rpx;
}

.formtitle {
  font-size: 32rpx;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 40rpx;
}

.reads {
  margin-left: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 8rpx;
  width: 64rpx;
  height: 40rpx;
  background: rgba(231, 22, 7, .1);
  border-radius: 4rpx;
  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx;
  color: #e71607;
}

.forum-list li .text {
  font-size: 26rpx;
  line-height: 40rpx;
  padding: 0 20rpx;
  margin-bottom: 10rpx;
}

.forum-list li .img-box {
  padding: 0 20rpx;
}

.van-col--8 {
  width: 33.33333333%;
}

.images .img-box-1 .image-body,
.images .img-box-2 .image-body,
.images .img-box-3 .image-body {
  height: 180rpx;
  border-radius: 10rpx;
}

.images .image-body {
  margin-bottom: 10rpx;
  position: relative;
}

.images .image-body .van-image__img {
  border-radius: 10rpx;
  overflow: hidden;
}

.forum-list li .tool-ft {
  border-top: 2rpx solid #eee;
  text-align: center;
  padding-top: 20rpx;
  display: flex;
}

.forum-body-bd .tom-col .van-col {
  height: 48rpx;
  padding: 8rpx;
}

.forum-list li .tool-ft .num {
  font-weight: 500;
  font-size: 28rpx;
  margin-left: 6rpx;
}

.van-col--6 {
  width: 25%;
}

.forum-body-bd .ntool {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.forum-body-bd .ntool uni-view {
  background: #f5f5f5;
  padding: 8rpx;
  display: flex;
  align-items: center;
}

.forum-body-bd .ntool image {
  width: 30rpx;
  height: 30rpx;
}

.rule-text {
  background: #fff;
  padding: 20rpx;
  word-break: break-all;
}

.lazy-image {
  max-width: 80rpx;
  max-height: 80rpx;
  width: 50%;
  height: 50%;
}

.length {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .2);
  text-align: center;
  color: #fff;
  padding-top: 68rpx;
  font-size: 28rpx;
}
</style>