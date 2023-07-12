<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar>
      <view class="input-view" style="font-size: 16px" slot="title">{{ title }}</view>
    </nav-bar>
    <!--直播-->
    <view class="live-box" :style="{ height: liveHeight + 'px' }">
      <view id="live" class="live">
        <view class="tab" v-if="this.lotteryType < 3">
          <view v-for="(item, index) in tabData"
            :class="lotteryType == item.lotteryType ? 'tab-item tab-act' : 'tab-item'" :key="index" @click="toggle(item)">
            {{ item.text }}
          </view>
        </view>
        <!--直播视频-->
        <view class="zhibo">
          <view class="video-box" v-if="lotteryType < 3">
            <view class="dkj" v-show="isShow && showType == 1">
              <text>{{ lotteryType == 1 ? '香港六合彩' : '澳门六合彩' }}揽珠直播时间为开奖日{{ liveInfo.startTime }}-{{ liveInfo.endTime
              }}(北京时间)，</text>
              <text>敬请查看</text>
              <text style="padding-top: 20px" @click="shuaxin">点击刷新</text>
            </view>
            <view v-show="isShow && showType == 3">
              <image @click="downLoad" style="width: 100%" mode="widthFix" src="../../static/frame.png"></image>
            </view>
            <view class="video" v-if="isShow && showType == 2">
              <!-- 播放器显示区域 -->
              <!--#ifndef H5-->
              <lives @refreshVideo="refreshVideo" v-if="isRefresh" :src="liveInfo.live"></lives>
              <!--#endif-->
              <!--#ifdef APP_PLUS-->
              <AppLives @refreshVideo="refreshVideo" v-if="isRefresh" :src="liveInfo.live"></AppLives>
              <!--#endif-->
              <!-- 播放器显示区域 -->
            </view>
          </view>
          <view class="video-box" v-else>
            <view class="dkj" v-show="isShow">
              <text>暂无直播</text>
            </view>
          </view>
          <view class="open-hide" @click="zhankai">
            <text class="">
              <i></i>
              <label>{{ isShow ? '收起直播' : '展开直播' }}</label>
            </text>
          </view>
        </view>
        <view class="th">
          <view class="border-box">
            <lottery :lotteryDetail="lastLottery" :listStyle="{ 'position': 'none', 'border': '0px', }">
              <template v-slot:header></template>
              <template v-slot:lottery></template>
              <template v-slot:footer></template>
            </lottery>
          </view>
        </view>
      </view>
    </view>
    <!--视频回放-->
    <view class="prize-list" v-if="this.lotteryType < 3">
      <view class="hd-box van-row">
        <view class="van-col van-col--12">
          <text class="title">开奖回放</text>
        </view>
        <view class="van-col van-col--12" style="text-align: right;">
          <text class="right" @click="more">更多开奖回放&gt;&gt;</text>
        </view>
      </view>
      <view class="bd-box">
        <view class="van-row">
          <view class="van-col van-col--12" @click="play(item)" v-for="(item, index) in videoLists" :key="index">
            <view class="item">
              <view class="image">
                <view class="van-image" style="width: 100%; height: 100%;">
                  <img :src="item.pictureUrl" class="van-image__img" style="object-fit: cover;" />
                </view>
              </view>
              <view class="text">{{ item.videoTitle }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view style="clear: both"></view>
    <!--列表-->
    <view class="ms-list" v-for="(item, index) in lastLotteryList" :key="index">
      <view class="bd">
        <text>{{ item.year }}
          <label>第{{ item.period }}期</label>
          推荐
        </text>
      </view>
      <view class="ft">
        <ul>
          <li v-for="(val, key) in item.detailList" :key="key">
            <view class="van-row">
              <view class="van-col van-col--20">
                <text>{{ val.name }}</text>
                <text>:</text>
                <text class="ft-col" v-for="(v, k) in val.valueList">{{ v }}</text>
              </view>
              <view class="van-col van-col--4" style="text-align: right;">
                <text class="ft-right" v-if="val.right == 1">中奖</text>
              </view>
            </view>
          </li>

        </ul>
      </view>
    </view>
    <!--弹出层-->
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" style="width: 100%">
      <view style="width: 100vw;height: var(--vh)">
        <pay ref="video" class="popup-widh" :lotteryRecordId="lotteryRecordId" :id="videoId" :videourl="videourl"
          :videoTitle="videoTitle" :lotteryType="lotteryType" :year="year" :poster="poster" @playcolse="playcolse"></pay>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import TabBar from "../../components/common/tabbar/TabBar";
import NavBar from "../../components/common/navBar/navBar.vue";
import Fab from "../../components/common/fab/Fab";
import Pay from "../../components/common/play/Pay";
import Lottery from '../../components/common/lottery/Lottery'
//#ifndef H5
import Lives from '../../components/common/live/live'
//#endif
//#ifdef APP_PLUS
import AppLives from '../../components/common/live/applive'
//#endif
import { videoList, lotteryDetail, live } from "../../utils/live/index.js";
import { lastLotteryRecordWithCalculate } from "../../utils/lottery/index.js"
import Vote from "../../components/common/vote/Vote";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "Live",
  components: {
    AlertInjectLayer,
    Vote,
    Pay,
    TabBar,
    Fab,
    Lottery,
    //#ifndef H5
    Lives,
    //#endif
    NavBar,
    //#ifdef APP_PLUS
    AppLives
    //#endif
  },
  data() {
    let date = new Date();
    return {
      title: '开奖现场',
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      isShow: false,
      showType: 1,
      lotteryType: uni.getStorageSync('lotteryType') ? uni.getStorageSync('lotteryType') : 1,
      videoId: 0,
      videoTitle: '',
      videourl: '',
      poster: '',
      detail: null,
      lotteryRecordId: 0,
      liveHeight: 0,
      prams: {
        lotteryType: 1,//彩票类型
        year: date.getFullYear(),    //默认年份
        pageSize: 4, //分页条数
        pageNum: 1,  //分页
      },
      tabData: [
        {
          lotteryType: 1,
          text: "香港六合彩",
        },
        {
          lotteryType: 2,
          text: "澳门六合彩",
        }
      ],
      isRefresh: true,
      videoLists: [],
      lastLotteryList: [],
      //开奖信息
      lastLottery: {}, //最后一次开奖信息
      year: 0,
      liveInfo: {},
    }
  },
  onLoad() {
    this.VideoList()
    this.lastLotteryRecord()
    this.shuaxin()
  },
  methods: {
    //选项卡切换
    toggle: function (item) {
      this.lotteryType = item.lotteryType
      this.lastLotteryRecord()
      this.VideoList()
      this.shuaxin()
    },
    //返回
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    more: function () {
      uni.navigateTo({
        url: "playback?lotteryType=" + this.lotteryType // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    zhankai: function () {
      this.isShow = !this.isShow
      this.$nextTick(() => {
        this.setHeight();
      });
    },
    downLoad: function () {
      //TODO 其它方式实现此处应该标记 避免后续打包出现问题
      //#ifdef H5
      window.open(this.liveInfo.targetUrl)
      //#endif
    },
    //刷新
    shuaxin: function () {
      this.isRefresh = false
      let prams = { lotteryType: this.lotteryType }
      const that = this
      live(prams).then(res => {
        this.liveInfo = res.result
        this.isRefresh = true
        if (this.liveInfo.live && this.liveInfo.timer >= 0) {
          this.showType = 2;
          this.timer = setInterval(() => {
            //TODO
            this.liveInfo.timer--
            console.log(this.liveInfo.timer)
            if (this.liveInfo.timer <= 0) {
              that.showType = 3
              // clearTimeout(this.timer)
              clearInterval(that.timer);
            }
          }, 1000);
        } else if (this.liveInfo.targetUrl && this.liveInfo.timer <= 0) {
          this.showType = 3;
        } else {
          this.showType = 1;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    refreshVideo() {
      this.isRefresh = false
      setTimeout(() => {
        this.isRefresh = true
      }, 500);
    },
    //开奖回放
    VideoList: function () {
      let prams = this.prams
      prams.lotteryType = this.lotteryType
      console.log(prams)
      videoList(prams).then(res => {
        this.videoLists = res.result.records
      }).catch(err => {
        console.log(err)
      })
    },
    //开奖信息
    lastLotteryRecord: function () {
      let prams = { lotteryType: this.lotteryType }
      console.log(prams)
      lastLotteryRecordWithCalculate(prams).then(res => {
        this.lastLottery = res.result
        this.lastLotteryList = res.result.recommendList
        this.$nextTick(() => {
          this.setHeight();
        });
      }).catch(err => {
        console.log(err)
      })
    },
    //获取详情
    lotteryDetail: function () {
      let prams = {
        id: this.lotteryRecordId
      }
      lotteryDetail(prams).then(res => {
        this.detail = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    play: function (item) {
      this.videoId = item.id
      this.videoTitle = item.videoTitle
      this.lotteryRecordId = item.period
      this.videourl = item.videoUrl
      this.year = item.year
      this.poster = item.pictureUrl
      console.log(this.videoId, this.videoTitle, this.lotteryRecordId, this.videourl)
      this.$refs.popup.open("right")
    },
    playcolse: function () {
      console.log(22)
      this.$refs.popup.close()
    },
    videoErrorCallback(e) {
      console.error('live-player error:', e.detail.errMsg)
    },
    setHeight() {
      let element = "#live";
      let query = uni.createSelectorQuery().in(this);
      query.select(element).boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          console.log(res[0].height)
          this.liveHeight = res[0].height;
        }
      });
    },
  }
}
</script>

<style scoped>
.live {
  position: fixed;
  top: 45px;
  background: #f6f6f6;
  width: 100%;
  max-width: 480px;
  z-index: 20;
  overflow: hidden;
}

.live .tab {
  border: 1px solid #07c160;
  display: flex;
  border-radius: 2px;
  height: 28px;
  line-height: 28px;
  background: #fff;
  margin: 8px 16px 0px 16px;
  font-size: 24rpx;
}

.live .tab .tab-item {
  width: 50%;
  text-align: center;
  color: #07c160;
  height: 28px;
}

.live .tab .tab-act {
  background-color: #07c160;
  color: #fff;
}

.live .th {
  padding: 10px;
}

.border-box {
  padding: 16rpx !important;
  background: #fff !important;
}

.prize-list {
  background: #fff;
  padding: 10px 15px;
}

.prize-list .hd-box {
  padding-bottom: 10rpx;
}

.prize-list .hd-box .van-col--12 {
  width: 50%;
}

.van-row .van-col:nth-of-type(2n+1) {
  padding-right: 10px;
}

.van-row .van-col:nth-of-type(2n) {
  padding-left: 10px;
}

.prize-list .hd-box .title {
  font-size: 26rpx;
  font-weight: 500;
}

.prize-list .hd-box .right {
  font-size: 26rpx;
  color: #07c160;
  font-weight: 500;
}

.bd-box {
  display: inline-block;
  width: 100%;
  background: #fff;
}

.bd-box .van-row .van-col--12 {
  width: 50%;
}

.van-col {
  float: left;
  box-sizing: border-box;
  min-height: 1px;
}

.prize-list .bd-box .item {
  margin-top: 15px;
  box-shadow: 0 3px 10px 0 hsl(0deg 0% 63% / 50%);
}

.prize-list .bd-box .item .image {
  height: 200rpx;
}

.van-image {
  display: inline-block;
}

.prize-list .bd-box .item .image img {
  width: 100%;
  height: 100%;
}

.prize-list .bd-box .item .text {
  font-size: 12px;
  text-align: center;
  height: 33px;
  line-height: 33px;
}

.ms-list .bd {
  font-size: 15px;
  padding: 5px 15px;
  background: #eaf4fe;
}

.ms-list .bd label {
  color: #07c160;
  margin-left: 5px;
}

.ms-list .ft {
  background: #fff;
  padding: 16rpx 26rpx;
  font-size: 24rpx;
  line-height: 48rpx;
}

.ms-list .ft ul li {
  overflow: hidden;
}

.ms-list .ft ul li .van-row .van-col--20 {
  width: 83.33333333%;
}

.ms-list .ft ul li .van-row .van-col {
  float: left;
  box-sizing: border-box;
  min-height: 1px;
}

.ms-list .ft li .van-row .ft-col {
  margin-left: 5px;
}

.ms-list .ft li .van-row .van-col--4 {
  width: 16.66666667%;
}

.ms-list .ft li .van-row .van-col .ft-right {
  font-size: 12px;
  background: red;
  color: #fff;
  border-radius: 55px;
  padding: 0 4px;
}

.ft ul li:last-child {
  color: #07c160;
}

.popup-widh {
  width: 100vw;
}

.zhibo {
  width: 100%;
  padding-top: 26rpx;
}

.open-hide {
  height: 70rpx;
  text-align: center;
}

.open-hide text {
  width: 206rpx;
  height: 46rpx;
  background-image: url('../../static/img/shuqi.png');
  background-size: 100% 100%;
  display: inline-block;
  line-height: 46rpx;
  font-size: 24rpx;
  color: #fff;
  position: relative;
}

.dkj {
  height: 230px;
  background: #3a3a3a;
  color: red;
  text-align: center;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
