<template>
  <view class="mint-tab-container-item">
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" show-scrollbar="true"
      scroll-with-animation="true" @scrolltolower="lower">
      <!--顶部导航栏-->
      <view class="header-box">
        <div class="header">
          <view class="box-bg">
            <uni-nav-bar :height="46">
              <block slot="left">
                <uni-icons @click="back" type="back" color="#666" size="16" style="font-weight: bold;margin-left: 10px" />
              </block>
              <view class="input-view" style="font-size:16px">{{ title }}</view>
              <block slot="right">
                <view class="uni-list-cell-db">
                  <picker :value="0" :range="yearList" @change="bindTimeChange">
                    <uni-icons type="calendar" color="#07c160" size="18"
                      style="width:15px;height:15px;margin-right:10px;" />
                  </picker>
                </view>
              </block>
            </uni-nav-bar>
          </view>
        </div>
      </view>
      <view style="padding: 10px 0px;">
        <view class="new-van-tabs van-tabs van-tabs--card">
          <view class="van-tabs__wrap">
            <view role="tablist" class="van-tabs__nav van-tabs__nav--card">
              <view role="tab" aria-selected="true"
                :class="item.lotteryType == lotteryType ? 'van-tab van-tab--active' : 'van-tab'"
                v-for="(item, index) in tabData" @click="toggle(item)">
                <span class="van-tab__text van-tab__text--ellipsis">{{ item.text }}</span>
              </view>
            </view>
          </view>
          <div class="van-tabs__content"><!----><!----></div>
        </view>
      </view>
      <!---->
      <view class="prize-list">
        <view class="bd-box">
          <view role="feed" class="van-list">
            <view class="van-row">
              <view class="van-col van-col--12" v-for="(item, index) in ListVideo" @click="play(item)">
                <view class="item">
                  <view class="image">
                    <image :src="item.pictureUrl" style="height: 200rpx;width: 100%" :lazy-load="true"></image>
                  </view>
                  <view class="text">{{ item.videoTitle }}</view>
                </view>
              </view>
            </view>
            <div class="van-list__placeholder"></div>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" style="width: 100%">
      <view style="width: 100vw;height: var(--vh)">
        <pay ref="videoOb" class="popup-widh" :lotteryRecordId="lotteryRecordId" :id="videoId" :videourl="videourl"
          :videoTitle="videoTitle" :lotteryType="lotteryType" :year="year" :poster="poster" @playcolse="playcolse">
        </pay>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { videoList, listYear } from "../../utils/live/index"
import Pay from "../../components/common/play/Pay";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "playback",
  components: {
    AlertInjectLayer, Pay
  },
  data() {
    const date = new Date();
    return {
      title: '开奖回放',
      lotteryType: uni.getStorageSync('lotteryType'),
      tabData: [
        {
          lotteryType: 1,
          text: "香港六合彩",
          url: 'https://zhibo.chong0123.com:777/hk.html'
        },
        {
          lotteryType: 2,
          text: "澳门六合彩",
          url: 'https://zhibo.2020kj.com:777/ac.html'
        }
      ],
      years: date.getFullYear(),    //默认年份,
      startDate: (date.getFullYear() - 4) + '',
      endDate: (date.getFullYear()) + '',
      scrollTop: 0,
      pageSize: 10,
      pageNum: 1,
      ListVideo: [],
      isLoadMore: false,
      lotteryRecordId: 0,
      videoId: 0,
      videourl: '',
      videoTitle: '',
      poster: '',
      detail: null,
      year: 0,
      yearList: []
    }
  },
  onLoad(option) {
    this.videoList()
    this.lotteryType = parseInt(option.lotteryType)
    this.listYear()
  },
  methods: {
    //返回
    back: function () {
      backPage()
    },
    //年列表获取
    listYear: function () {
      let prams = { lotteryType: this.lotteryType }
      listYear(prams).then(res => {
        this.yearList = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //时间选择
    bindTimeChange: function (e) {
      this.years = this.yearList[e.detail.value]
      this.pageNum = 1;
      this.ListVideo = [];
      this.videoList()
    },
    //选项卡切换
    toggle: function (item) {
      this.lotteryType = item.lotteryType
      this.pageNum = 1;
      this.ListVideo = []
      this.videoList()
      this.listYear()
    },
    //加载更多
    lower: function (e) {
      if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.pageNum += 1
        this.videoList()
      }
    },
    videoList: function () {
      let prams = {
        lotteryType: this.lotteryType,
        year: this.years,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      videoList(prams).then(res => {
        this.ListVideo.push(...res.result.records)
        this.isLoadMore = false
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
    }
  }
}
</script>

<style scoped>
.header-box,
.header.box-bg {
  height: 46px;
}

.scroll-Y {
  height: var(--vh);
}

.van-tabs {
  position: relative;
}

.van-tabs--card>.van-tabs__wrap {
  height: 30px;
}

.new-van-tabs .van-tabs__nav--card {
  border-color: #07c160;
}

.van-tabs__nav--card {
  box-sizing: border-box;
  height: 30px;
  margin: 0 16px;
  border: 1px solid #ee0a24;
  border-radius: 2px;
}

.van-tabs__nav {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  background-color: #fff;
  -webkit-user-select: none;
  user-select: none;
}

.new-van-tabs .van-tabs__nav--card .van-tab {
  color: #07c160;
  font-size: 24rpx;
  border-color: #07c160;
}

.van-tab--active {
  font-weight: 500;
}

.van-tab__text--ellipsis {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.van-tab {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 4px;
  color: #646566;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.new-van-tabs .van-tabs__nav--card .van-tab.van-tab--active {
  background-color: #07c160;
  color: #fff;
}

.prize-list {
  background: #fff;
  padding: 10rpx 30rpx;
  height: inherit;
}

.prize-list .bd-box .item {
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx 0 hsl(0deg 0% 63% / 50%);
}

.prize-list .bd-box .item .image {
  height: 200rpx;
  position: relative;
}

.prize-list .bd-box .item .text {
  font-size: 24rpx;
  text-align: center;
  padding: 20rpx 0;
}

.van-col:nth-child(odd) {
  padding-right: 10px;
}

.van-col:nth-child(even) {
  padding-left: 10px;
}
</style>
