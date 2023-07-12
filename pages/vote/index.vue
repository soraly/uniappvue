<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">

    <!--顶部导航栏-->
    <nav-bar :left-width="40" :right-width="40" :headerStyle="headerStyle">
      <view class="input-view" slot="title" style="  font-size: 16px;">{{ lotteryName + title }}</view>
    </nav-bar>
    <!--切换位置-->
    <view class="tab">
      <view class="tab-box">
        <view :class="isActive == 0 ? 'tab-item active' : 'tab-item'" @click="isActive = 0">图片猜测</view>
        <view :class="isActive == 1 ? 'tab-item active' : 'tab-item'" @click="isActive = 1">视频猜测</view>
      </view>
    </view>
    <!--年月份-->
    <view class="m-tabs-years">
      <view class="m-tabs-years-bd">
        <span v-for="(item, index) in yearList" :key="index" @click="selectYears(item)"
          :class="item.id == years ? 'act' : ''">
          {{ item.name }}
        </span>
      </view>
    </view>
    <!--期数-->
    <view class="m-tabs-period-home van-row">
      <view class="m-tabs-period">
        <view class="m-tabs-period-bd">
          <span v-for="(item, index) in periodList" :key="index" :class="period == item.guessId ? 'act' : ''"
            @click="selectPeriod(item)">{{ item.name }}</span>
        </view>
      </view>
      <view class="van-dropdown-menu">
        <view class="van-dropdown-menu__bar">
          <view role="button" tabindex="0" class="van-dropdown-menu__item">
            <span class="van-dropdown-menu__title" @click.stop="isShow = !isShow">
              <view class="van-ellipsis">{{ periodName ? periodName : '请选择' }}
                <uni-icons v-if="isShow === false" type="bottom" size="12" color="#fff"></uni-icons>
                <uni-icons v-else type="top" size="12" color="#fff"></uni-icons>
              </view>
            </span>
          </view>
        </view>
      </view>
      <view class="van-dropdown-box" v-show="isShow">
        <view class="van-dropdown-box-in" @click.stop="">
          <view class="dropdown-body">
            <view style="text-align: center; padding: 20rpx 0;">
              <view class="van-col van-col--6" v-for="(item, index) in periodList" :key="index"
                @click.stop="selectPeriod(item)">
                <span :class="period == item.guessId ? 'act' : ''">{{ item.name }}</span>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--开奖内容区域-->
    <view class="picture-content">
      <!--开奖号区域-->
      <view class="border-box" v-if="lotteryObj.id && lotteryObj.isFit">
        <lottery :lotteryDetail="lotteryObj">
          <template v-slot:header>
            <view class="body-hd-2">{{ lotteryObj.year }}年 第{{ lotteryObj.period }}期</view>
          </template>
          <template v-slot:lottery></template>
          <template v-slot:footer><span></span></template>
        </lottery>
      </view>
      <!--图片文本-->
      <view v-show="isActive == 0">
        <view class="title">{{ detailObj.pictureTitle }}</view>
        <view class="text">
          <rich-text :nodes="detailObj.pictureContent"></rich-text>
        </view>
      </view>
      <!--视频文本-->
      <view v-show="isActive == 1">
        <view class="title">{{ detailObj.videoTitle }}</view>
        <view class="text">
          <rich-text :nodes="detailObj.videoContent"></rich-text>
        </view>
      </view>
    </view>
    <!--图片区域-->
    <view class="media" v-if="isActive == 0">
      <image style="width:85%;background: #fff;padding: 0px 7% 0px 8%;" v-for="(item, index) in detailObj.pictureList"
        :index="index" :src="item.pictureUrl"></image>
    </view>
    <!--视频-->
    <cover-view class="media" v-else style="width: 100%;background: #fff;">
      <cover-view style="width: 90%;margin: auto;" v-if="showVideo">
        <video style="width:85%;background: #fff;padding: 0px 7% 0px 8%;" id="myVideo" :autoplay="true" :poster="poster"
          :src="detailObj.videoUrl" controls></video>
      </cover-view>
    </cover-view>
    <!--投票区域-->
    <view class="vote-home-bd" v-show="isOpen" v-if="detailObj.voteResult">
      <uni-row class="vote-list">
        <uni-col class="vote-list-item" :span="12" v-for="(item, index) in detailObj.voteResult">
          <view class="col-td">
            <span class="name">{{ item.animalName }}</span>
            <label class="proportion">
              <i :style="'width:' + item.rate + '%;'"></i>
              <span>{{ item.rate }}%</span>
            </label>
            <span class="num-piao">{{ item.voteCount }}票</span>
          </view>
        </uni-col>
      </uni-row>
      <!--按钮部分-->
      <view class="ft-btns">
        <view class="van-row">
          <view class="van-col van-col--7" style="padding-right: 13.3333px;">
            <span @click="details(detailObj.previousPeriodId)">上一期</span>
          </view>
          <view class="van-col van-col--10" style="padding-left: 6.66667px; padding-right: 6.66667px;">
            <label @click="openVote">投票</label>
          </view>
          <view class="van-col van-col--7" style="padding-left: 13.3333px; padding-right: 1.77636e-15px;">
            <span @click="details(detailObj.nextPeriodId)">下一期</span>
          </view>
        </view>
      </view>
      <view style="clear: both"></view>
    </view>
    <!--投票显示隐藏按钮-->
    <view class="open-hide">
      <span class="open" @click="isOpen = !isOpen">
        <uni-icons v-if="isOpen" custom-prefix="iconfont" type="shangjiantou" size="12" color="#fff"></uni-icons>
        <uni-icons v-else custom-prefix="iconfont" type="jiantouxia" size="12" color="#fff"></uni-icons>
        <label>{{ isOpen ? '收起投票' : '展开投票' }}</label>
      </span>
    </view>
    <view style="clear: both"></view>
    <!--相关数据-->
    <view style="height: 16px;" class="v-interaction">
      <view class="interaction">
        <view class="van-row">
          <view class="van-col van-col--18">
            <span class="tool-item">
              <uni-icons class="icon" type="hand-up-filled" size="16" v-if="detailObj.thumbUp == 0"></uni-icons>
              <uni-icons class="icon act" type="hand-up-filled" size="16" v-else></uni-icons>
              {{ " " }}{{ detailObj.thumbUpCount | moneyFormat }}点赞
            </span>
            <span class="tool-item">
              <uni-icons v-if="detailObj.comment == 0" class="icon" custom-prefix="iconfont" type="pinglun"
                size="16"></uni-icons>
              <uni-icons v-else class="icon act" custom-prefix="iconfont" type="pinglun" size="16" color="#07c160"
                style="margin-right: 5px"></uni-icons>
              {{ " " }}{{ detailObj.commentCount | moneyFormat }}评论
            </span>
            <!---->
            <span class="tool-item">
              <uni-icons class="icon" type="star" size="16" v-if="detailObj.collect == 0"></uni-icons>
              <uni-icons class="icon act" type="star-filled" size="16" v-else></uni-icons>
              {{ " " }}{{ detailObj.collectCount | moneyFormat }}收藏
            </span>
          </view>
          <view class="van-col van-col--6">
            <view class="right-text">{{ detailObj.clickCount | moneyFormat }}次阅读</view>
          </view>
        </view>
      </view>
    </view>
    <!--广告区域-->
    <view class="v-interaction">
      <ads :listPicture="listPicture"></ads>
    </view>
    <!--评论区域-->
    <comment @setIsLoadMore="setIsLoadMore" ref="comment" :relatedId="period" :type="8"></comment>
    <!--底部悬浮-->
    <view class="tool-bottom">
      <view class="tool-bottom-body">
        <uni-row>
          <uni-col :span="16">
            <span class="left" @click="replyComment">
              <label for="commentInput">想说点什么...</label>
            </span>
          </uni-col>
          <uni-col :span="8">
            <uni-row class="right-item">
              <uni-col :span="8">
                <uni-icons color="#888" class="icon" type="hand-up" size="18" v-if="detailObj.thumbUp == 0"
                  @click="thumbUp()"></uni-icons>
                <uni-icons class="icon act" type="hand-up-filled" size="18" v-else @click="thumbUp()"></uni-icons>
                <div class="label">{{ detailObj.thumbUpCount | moneyFormat }}</div>
              </uni-col>
              <uni-col :span="8">
                <uni-icons color="#888" class="icon" type="star" size="18" v-if="detailObj.collect == 0"
                  @click="collect"></uni-icons>
                <uni-icons class="icon act" type="star-filled" size="18" v-else @click="collect"></uni-icons>
                <div class="label">{{ detailObj.collectCount | moneyFormat }}</div>
              </uni-col>
              <uni-col :span="8">
                <image @click="fenxiang" class="img" src="../../static/img/index/fenxiang.png"></image>
                <div @click="fenxiang" class="label">分享</div>
              </uni-col>
            </uni-row>
          </uni-col>
        </uni-row>
      </view>
    </view>
    <!--投票弹窗-->
    <uni-popup ref="vote" type="dialog" background-color="#fff" mask-background-color="rgba(0,0,0,.7)">
      <vote @closeVote="closeVote" @openPopup="openPopup" :year="detailObj.year" :period="detailObj.period"
        :voteResult="detailObj.voteResult" :type="8" :relatedId="detailObj.id">
      </vote>
    </uni-popup>
    <!-- 分享 -->
    <uni-popup class="share" ref="share" type="share" safeArea backgroundColor="#fff">
      <share @closefx="closefx"></share>
    </uni-popup>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--评论弹窗-->
    <uni-popup ref="comentPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <reply-comment ref="replyComment" @closeComent="closeComent" :commentId="0" :relatedId="detailObj.id"
          :commentType="8">
        </reply-comment>
      </view>
    </uni-popup>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <AlertInjectLayer />
  </view>
</template>

<script>
import Comment from "../../components/common/comment/Comment";
import { listYear, listPeriod, detail } from "../../utils/vote/index.js"
import { lotteryDetail, listSpreadByType, advertList } from "../../utils/common/index.js"
import { collect, thumbUp } from "../../utils/user/index.js"
import { period } from "../../utils/lottery/index"


import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import Lottery from '../../components/common/lottery/Lottery'
import Ads from '../../components/common/ad/Ad'
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import ReplyComment from "../../components/common/comment/ReplyComment";
import Login from "../../components/common/login/Login";
import Share from "../../components/common/share/Share";
import Vote from "../../components/common/vote/Vote";
import NavBar from "../../components/common/navBar/navBar";
import MyVideo from "../../components/common/video/MyVideo";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    Comment,
    Lottery,
    Ads,
    cusPreviewImg,
    ReplyComment,
    Login,
    Share,
    Vote,
    NavBar,
    MyVideo
  },
  data() {
    const date = new Date();
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      title: "幽默竞猜",
      lotteryName: '',
      lotteryType: 1,
      scrollTop: 0,
      isLoadMore: false,
      isActive: 0,
      isShow: false,
      showVideo: true,//是否显示视频
      isOpen: false,
      listPicture: [],
      current: 0,
      years: date.getFullYear(),    //默认年份
      yearList: [],  //年列表
      period: 0,     //当前期数
      periodName: '',  //期数名称
      periodList: [],  //期数列表
      detailObj: {},    //相关数据
      lotteryObj: {},   //开奖信息
      ImgList: [],
      poster: '/static/img/zw.png'
    }
  },
  onLoad(option) {
    uni.setNavigationBarTitle({
      title: this.title
    });
    if (option.id) {
      this.period = option.id
    }
    this.lotteryType = uni.getStorageSync('lotteryType') || 1
    if (this.lotteryType == 1) {
      this.lotteryName = '香港'
    } else if (this.lotteryType == 2) {
      this.lotteryName = '澳门'
    } else if (this.lotteryType == 3) {
      this.lotteryName = '台湾'
    } else {
      this.lotteryName = '新加坡'
    }
    this.listYear()
    this.listSpreadByType()
  },
  onReachBottom() {
    this.lower()
    console.log(1111)
  },
  methods: {

    //轮播图获取
    listSpreadByType: function () {
      let prams = {
        projectType: 1,
        code: 3,
      }
      advertList(prams).then(res => {
        this.listPicture = res.result
      }).catch(err => {

      })
    },
    //轮播图事件
    change(e) {
      this.current = e.detail.current
    },
    //获取年
    listYear: function () {
      let prams = { lotteryType: uni.getStorageSync('lotteryType') };
      listYear(prams).then(res => {
        this.yearList = res.result
        this.listPeriod()
      }).catch(err => {
        console.log(err)
      })
    },
    //选择年
    selectYears: function (item) {
      this.years = item.id
      this.listPeriod(1)
    },
    //获取期
    listPeriod: function (type = 0) {
      let prams = { year: this.years, platform: uni.getStorageSync('lotteryType') };
      listPeriod(prams).then(res => {
        if (this.period == 0 || type > 0) {
          this.period = res.result[0].guessId
        }
        this.periodList = res.result
        this.detail()
      }).catch(err => {
        console.log(err)
      })
    },
    //选择期
    selectPeriod: function (item) {
      this.period = item.guessId
      this.periodName = item.name
      this.isShow = false
      this.detail()
    },
    //根据其
    details: function (period) {
      if (!period) {
        pop("暂无数据")
        return false
      }
      this.period = period
      this.detail()
    },
    //获取文章信息
    detail: function () {
      let prams = { id: this.period };
      detail(prams).then(res => {
        if (res.result) {
          this.detailObj = res.result
          this.title = this.detailObj.title
          this.years = this.detailObj.year
          this.lottery(this.detailObj.year + "" + this.detailObj.number)
          this.$refs.comment.restComment()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取开奖信息
    lottery: function (id) {
      let prams = {
        lotteryType: uni.getStorageSync('lotteryType'),
        number: this.detailObj.number,
        year: this.detailObj.year,
      }
      period(prams).then(res => {
        this.lotteryObj = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //打开登录界面
    openPopup: function () {
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
    },
    //分享弹窗
    fenxiang: function () {
      this.$refs.share.open()
    },
    //关闭分享
    closefx: function () {
      this.$refs.share.close()
    },
    //投票
    openVote: function () {
      this.$refs.vote.open()
    },
    //关闭投票
    closeVote: function () {
      this.$refs.vote.close()
      this.detail()
    },
    //加载更多
    lower: function () {
      if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.$refs.comment.listLatest()
      }
    },
    setIsLoadMore: function () {
      this.isLoadMore = false
    },
    //打开评论
    replyComment: function () {
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
      this.showVideo = false
      this.$refs.comentPopup.open('right')
    },
    //关闭评论
    closeComent: function () {
      this.$refs.comentPopup.close()
      this.$refs.comment.restComment()
      this.showVideo = true
      this.detail()
    },
    //点赞接口
    thumbUp: function () {
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
      let prams = { relatedId: this.detailObj.id, type: 8, createTime: this.detailObj.createTime }
      thumbUp(prams).then(res => {
        uni.showToast({
          title: res.message,
          duration: 2000,
          icon: 'none'
        })
        if (res.code == 200) {
          this.detailObj.thumbUp = 1
          this.detailObj.thumbUpCount++
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //收藏
    collect: function () {
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
      let prams = { relatedId: this.detailObj.id, type: 8 }
      collect(prams).then(res => {
        if (res.code == 200) {
          this.detailObj.collect = res.result
          if (res.result == 1) {
            this.detailObj.collectCount++
          } else {
            this.detailObj.collectCount--
          }
        }
        pop(res.message, 2000)
      }).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>

<style scoped>
.mint-tab-container-item {
  background: #fff;
}

.header-box,
.header,
.box-bg {
  height: 46px;
}

.header {
  z-index: 5;
  border-bottom: 2rpx solid #ebedf0;
}

.scroll-Y {
  height: var(--vh);
}

.tab {
  width: 100%;
  padding-bottom: 30rpx;
  padding-top: 22rpx;
  height: 42rpx;
}

.tab-box {
  display: flex;
  justify-content: center;
  height: 30px;
  margin: 0 16px;
}

.tab-box .tab-item {
  width: 100%;
  border: 1px solid #07c160;
  text-align: center;
  line-height: 28px;
  font-size: 24rpx;
  color: #07c160;
}

.tab-box .tab-item.active {
  background: #07c160;
  color: #fff;
}

.m-tabs-years {
  overflow-x: auto;
  background-color: #fff;
}

.m-tabs-years .m-tabs-years-bd {
  height: 76rpx;
  white-space: nowrap;
  min-width: 100%;
  overflow: hidden;
  padding-left: 28rpx;
}

.m-tabs-years .m-tabs-years-bd span {
  border: 1Px solid #a9a9a9;
  border-radius: 30rpx;
  width: 110rpx;
  height: 40rpx;
  text-align: center;
  line-height: 36rpx;
  font-size: 24rpx;
  margin: 20rpx 28rpx 0 0;
  display: inline-block;
}

.m-tabs-years .m-tabs-years-bd span.act {
  border: 1px solid #07c160;
  background: #07c160;
  color: #fff;
}

.m-tabs-period-home {
  border-top: 1Px solid #f8f8f8;
  background-color: #fff;
  position: relative;
  display: flex;
  justify-content: space-between;
}

.m-tabs-period {
  overflow-x: auto;
  width: 70%;
}

.m-tabs-period .m-tabs-period-bd {
  height: 60rpx;
  white-space: nowrap;
  min-width: 100%;
}

.m-tabs-period .m-tabs-period-bd span {
  width: 150rpx;
  text-align: center;
  font-size: 24rpx;
  margin-top: 18rpx;
  display: inline-block;
}

.m-tabs-period .m-tabs-period-bd span.act {
  color: #07c160;
}

.m-tabs-period-home .van-dropdown-menu {
  height: 30Px;
  width: 28%;
  text-align: center;
  display: flex;
  margin-right: 10rpx;
  justify-content: center;
}

.van-dropdown-menu__bar {
  width: 58px;
  height: 22px;
  line-height: 22px;
  margin-top: 8rpx;
  background: #07c160;
  border-radius: 15px;
}

.van-dropdown-menu__title {
  font-size: 12px;
  color: #fff;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.van-dropdown-box {
  position: absolute;
  top: 31px;
  width: 100%;
  height: calc(var(--vh) - 175px);
  background-color: rgba(0, 0, 0, .7);
  z-index: 1;
}

.van-dropdown-box-in {
  width: 100%;
  max-height: 80%;
  background-color: #fff;
  overflow-y: auto;
}


.dropdown-body .van-col {
  display: inline-block;
  width: 25%;
  text-align: center;
}

.dropdown-body .van-col span {
  display: inline-block;
  width: 160rpx;
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 4rpx;
  border: 1px solid #a9a9a9;
  text-align: center;
  margin-bottom: 20rpx;
  font-size: 13Px;
}

.dropdown-body .van-col span.act {
  border: 1px solid #07c160;
  color: #07c160;
}

.picture-content {
  padding: 20rpx 32rpx 10rpx;
  border-top: 8rpx solid #f8f8f8;
  background: #fff;
}

.picture-content .border-box {
  padding: 10rpx;
}

.picture-content .border-box .body-hd-2 {
  text-align: center;
  color: #07c160;
  margin-top: -10rpx;
  padding-bottom: 16rpx;
  font-size: 28rpx;
}

.picture-content .title {
  color: #000;
  font-size: 34rpx;
  text-align: center;
  padding: 10rpx 0 20rpx 0;
}

.picture-content .text {
  line-height: 44rpx;
}

.summary {
  font-size: 14px;
  color: #333333;
}

.vote-home-bd {
  padding: 0 32rpx;
  margin-top: 40rpx;
}

.vote-list {
  overflow: hidden;
}

.vote-list .vote-list-item:nth-child(odd) {
  padding-right: 24rpx;
}

.vote-list .vote-list-item {
  margin-bottom: 34rpx;
}

.van-col--12 {
  width: 50%;
}

.van-col {
  float: left;
  box-sizing: border-box;
  min-height: 1px;
}

.vote-list .col-td {
  display: flex;
}

.vote-list-item:nth-child(odd) {
  padding-right: 24rpx !important;
}

.vote-list-item:nth-child(2n) {
  padding-left: 24rpx !important;
}

.vote-list .name {
  margin-right: 10rpx;
  font-size: 28rpx;
}

.vote-list .proportion {
  flex: 1;
  display: flex;
  width: 100%;
  height: 32rpx;
  border: 1px solid #07c160;
  font-size: 10px;
  border-radius: 8px;
  text-align: right;
  position: relative;
}

.vote-list .proportion i {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 50%;
  background: #07c160;
  border-radius: 7px;
  top: -0.1px;
  height: 32rpx;
}

.vote-list .proportion span {
  position: absolute;
  right: 4px;
  top: 5rpx;
  line-height: 14px;
}

.vote-list .num-piao {
  text-align: right;
  font-size: 12px;
  color: #7e7e7e;
  line-height: 32rpx;
  min-width: 90rpx;
}

.ft-btns {
  margin-bottom: 30rpx;
  display: flow-root;
}

.van-col--7 {
  width: 29.16666667%;
}

.van-col {
  float: left;
  box-sizing: border-box;
  min-height: 1px;
}

.van-col--10 {
  width: 41.66666667%;
}

.ft-btns label,
.ft-btns span {
  height: 64rpx;
  display: inline-block;
  width: 100%;
  background: #e2e2e2;
  color: #8c8c8c;
  font-size: 24rpx;
  text-align: center;
  line-height: 64rpx;
  border-radius: 40rpx;
}

.ft-btns label {
  background: #07c160;
  color: #fff;
}

.open-hide {
  height: 70rpx;
  background: #fff;
  margin-bottom: 20rpx;
  text-align: center;
}

.open-hide span {
  width: 206rpx;
  height: 46rpx;
  background-image: url("../../static/img/shuqi.png");
  background-size: 100% 100%;
  display: inline-block;
  line-height: 46rpx;
  font-size: 24rpx;
  color: #fff;
  position: relative;
}

.v-interaction {
  padding: 0 32rpx;
  margin-bottom: 20rpx;
}

.interaction {
  position: relative;
}

.van-col--18 {
  width: 75%;
}

.interaction .tool-item {
  margin-right: 30rpx;
  color: #888;
  font-size: 13px;
}

.tool-item .icon {
  color: #888 !important;
}

.tool-item .act {
  color: #07c160 !important;
}

.van-col--6 {
  width: 25%;
}

.interaction .right-text {
  text-align: right;
  font-size: 12Px;
  color: #666;
  padding-top: 6rpx;
}


.tool-bottom {
  position: fixed;
  height: 50px;
  width: 100%;
  max-width: 480px;
  bottom: 0;
}

.tool-bottom-body {
  background-color: #fff;
  max-width: 480px;
  margin: 0 auto;
  border-top: 2rpx solid #eee;
  padding: 0 20rpx;
  height: 50px;
}

.tool-bottom .left {
  width: 100%;
  height: 34Px;
  background-color: #f1f1f1;
  border-radius: 40rpx;
  display: inline-block;
  margin-top: 8Px;
  color: silver;
  text-align: left;
  line-height: 34Px;
}

.left label {
  margin-left: 30rpx;
  font-size: 24rpx;
  display: block;
}

.right-item {
  text-align: center;
  margin-top: 16rpx;
}

.right-item .icon {
  font-size: 18px;
}

.right-item .act {
  color: #07c160 !important;
}

.right-item .img {
  width: 15Px;
  height: 15Px;
}

.right-item .label {
  font-size: 24rpx;
  color: #666;
}
</style>
