<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }" @click="isShow = false">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :title="title">
      <block slot="left">
        <uni-icons @click="back" type="back" color="#000" size="16" style="margin-left: 10px;text-align: right" />
      </block>
    </nav-bar>
    <view class="customfixed">
      <view class="sticky-body">
        <!--年月份-->
        <view class="m-tabs-years">
          <view class="m-tabs-years-bd">
            <span v-for="(item, index) in yearList" :key="index" @click="selectYears(item)"
              :class="item.id == info.years ? 'act' : ''">
              {{ item.name }}
            </span>
          </view>
        </view>
        <!--期数-->
        <view class="m-tabs-period-home van-row">
          <view class="m-tabs-period">
            <view class="m-tabs-period-bd">
              <span v-for="(item, index) in periodList" :key="index" :class="pictureId == item.pictureId ? 'act' : ''"
                @click="selectPeriod(item)">{{ item.name }}</span>
            </view>
          </view>
          <view class="van-dropdown-menu">
            <view class="van-dropdown-menu__bar">
              <view role="button" tabindex="0" class="van-dropdown-menu__item">
                <span class="van-dropdown-menu__title" @click.stop="isShow = !isShow">
                  <view class="van-ellipsis">{{ selectText }}
                    <uni-icons v-if="isShow === false" type="bottom" size="12" color="#fff"></uni-icons>
                    <uni-icons v-else type="top" size="12" color="#fff"></uni-icons>
                  </view>
                </span>
              </view>
            </view>
          </view>
          <view class="van-dropdown-box" v-show="isShow" :style="{ marginTop: safeHeight }">
            <view class="van-dropdown-box-in" @click.stop="">
              <view class="dropdown-body">
                <view class="van-col van-col--6" v-for="(item, index) in periodList" :key="index"
                  @click.stop="selectPeriod(item)">
                  <span :class="pictureId == item.pictureId ? 'act' : ''">{{ item.name }}</span>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--彩票区域-->
    <view class="border-box" v-if="lottery.id && lottery.isFit">
      <lottery :lotteryDetail="lottery">
        <template v-slot:header>
          <view class="body-hd-2">{{ lottery.year }}年 第{{ lottery.period }}期</view>
        </template>
        <template v-slot:lottery></template>
        <template v-slot:footer><span></span></template>
      </lottery>
    </view>
    <!-- 投票区域 -->
    <view>
      <view class="vote-box"
        style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
        <view class="ms-bd-vote">
          <view class="van-row">
            <view class="van-col van-col--12" style="padding-right: 15rpx;" v-for="(item, index) in info.voteResult"
              :key="index">
              <view class="vote-num">{{ item.voteCount }}票</view>
              <view class="vote-item">
                <span class="left">{{ item.animalName }}</span>
                <view class="bd-rate">
                  <span class="bd-rate-color" :style="'width: ' + item.rate + '%;'"></span>
                </view>
                <span class="right">{{ item.rate }}%</span>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Lottery from '../../components/common/lottery/Lottery'
import { detail } from '../../utils/picture/index.js'
import { period } from '../../utils/lottery/index.js'
import NavBar from "../../components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "voteDetails",
  components: {
    AlertInjectLayer, Lottery, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '投票记录',
      selectText: '请选择',
      isShow: false,
      pictureId: 0,
      yearList: [],
      periodList: [],
      info: {},
      lottery: {},
    }
  },
  onLoad(option) {
    this.pictureId = parseInt(option.pictureId)
    this.detail()
    uni.setNavigationBarTitle({
      title: this.title
    });
  },
  methods: {
    back: function () {
      backPage()
    },
    //选择期
    async selectPeriod(item) {
      this.pictureId = item.pictureId
      await this.detail()
      this.selectText = "第" + this.info.period + "期"
      this.isShow = false
    },
    //详情
    async detail() {
      let prams = { pictureId: this.pictureId }
      await detail(prams).then(res => {
        this.yearList = res.result.yearList
        this.periodList = res.result.periodList
        this.info = res.result
        this.period()
        this.recommendPicture()
      }).catch(err => {
        console.log(err)
      })
    },
    //根据期数获取彩票信息
    period: function () {
      let prams = {
        lotteryType: uni.getStorageSync('lotteryType'),
        number: this.info.period,
        year: this.info.year,
      }
      period(prams).then(res => {
        this.lottery = res.result
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style scoped>
.mint-tab-container-item {
  font-family: PingFang SC;
}

.scroll-Y {
  height: var(--vh);
  background: #fff;
}

.header-box,
.header {
  height: 46px;
  border-bottom: 1px solid #ebedf0;
}

.rht1 {
  margin-right: 32rpx;
}

.rht {
  color: #07c160;
  font-family: PingFang SC;
  font-size: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rht span {
  height: 34rpx;
  line-height: 34rpx;
}

.rht * {
  display: inline-block;
}

.rht1 .icons {
  background-image: url('../../static/img/picture/lis.png');
  background-size: 100% 100%;
  height: 36rpx;
  width: 36rpx;
}

.rht2 .icons {
  background-image: url('../../static/img/picture/pl.png');
  background-size: 100% 100%;
  height: 36rpx;
  width: 36rpx;
}

.customfixed {
  height: 69px;
}

.sticky-body {
  max-width: 480px;
  width: 100vw;
  margin: 0px auto;
  background-color: #fff;
  position: fixed;
  z-index: 4;
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
  border-radius: 40rpx;
  width: 110rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
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
  height: 60rPx;
  width: 28%;
  text-align: center;
  display: flex;
  margin-right: 10rpx;
  justify-content: center;
}

.van-dropdown-menu__bar {
  width: 116rpx;
  height: 44rpx;
  line-height: 44rpx;
  margin-top: 10rpx;
  background: #07c160;
  border-radius: 30rpx;
}

.van-dropdown-menu__title {
  font-size: 24rpx;
  color: #fff;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.van-dropdown-box {
  position: fixed;
  top: calc(136rpx + 45px);
  width: 100%;
  max-width: 480px;
  height: calc(var(--vh) - 150rpx);
  background-color: rgba(0, 0, 0, .7);
  z-index: 1;
}

.van-dropdown-box-in {
  width: 100%;
  max-height: 1100rpx;
  background-color: #fff;
  overflow-y: auto;
}

.dropdown-body {
  background: #fff;
  overflow: hidden;
  padding: 20rpx 0;
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
  border-radius: 6rpx;
  border: 1px solid #a9a9a9;
  text-align: center;
  margin-bottom: 20rpx;
  font-size: 26rpx;
}

.dropdown-body .van-col span.act {
  border: 1px solid #07c160;
  color: #07c160;
}

.body-hd-2 {
  text-align: center;
  color: #07c160;
  margin-top: -10rpx;
  padding-bottom: 16rpx;
}

.vote-box {
  display: inline-block;
  background: #fff;
}

.imgPos {
  background: #fff;
}

.ms-bd-img {
  text-align: center;
  background: #f9f9f9;
}

.ms-bd-img img {
  width: auto;
  width: 100%;
}

.ms-bd-vote {
  padding: 40rpx 20rpx;
  font-size: 24rpx;
  display: inline-block;
}

.ms-bd-vote .vote-num {
  text-align: center;
  margin-bottom: 16rpx;
}

.ms-bd-vote .vote-item {
  margin-bottom: 40rpX;
  position: relative;
}

.ms-bd-vote .vote-item .left,
.ms-bd-vote .vote-item .right {
  position: absolute;
  font-size: 24rpx;
  top: -4rpx;
}

.ms-bd-vote .bd-rate {
  background: #ebeae8;
  height: 20rpx;
  position: relative;
  margin-left: 30rpx;
  margin-right: 96rpx;
}

.ms-bd-vote .bd-rate .bd-rate-color {
  background: #07c160;
  height: 20rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.ms-bd-vote .vote-item .right {
  right: 0;
}
</style>