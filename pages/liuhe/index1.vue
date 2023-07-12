<template>
  <view class="lottery-page" :style="{ marginTop: safeHeight, overflow: `${isTop ? 'hidden' : ''}` }">
    <nav-bar :isBack="false" :headerStyle="headerStyle" :leftWidth="110">
      <block slot="left">
        <view class="avatar" v-if="isLogin">
          <image :src="userInfo.headImgUrl"></image>
          <span class="username">{{ userInfo.nickname || userInfo.userName }}</span>
        </view>
        <view v-else class="login" @click="toLogin">登录/注册</view>
      </block>
      <view class="input-view" slot="title">{{ title }}</view>
      <block slot="right">
        <view class="gift">
          <view class="shiwan" v-if="!isLogin">试玩</view>
          <uni-icons @click="goList" type="search" style="font-size: 48rpx;color: #FFFFFF"></uni-icons>

          <!--          <image src="../../static/img/liuhe/index/gift.png"></image>-->
        </view>
      </block>
    </nav-bar>
    <view class="banner-box" :style="{ height: bannerBoxHeight }">
      <view class="back-row"></view>
      <view class="top-box">
        <view class="top-item">
          <view class="carousel-div">
            <uni-swiper-dot :info="carousel" :current="current" :dots-styles="dotsStyles" field="content" :mode="'dot'">
              <swiper class="swiper-box" @change="change" :interval="3000" :circular="true" :autoplay="true"
                style="height: 292rpx">
                <swiper-item v-for="(item, index) in carousel" :key="index" style="height: 292rpx">
                  <view class="swiper-item" style="height: 292rpx">
                    <image :src="item.img" :mode="'widthFix'" @click="openLink(item)"></image>
                  </view>
                </swiper-item>
              </swiper>
            </uni-swiper-dot>
            <view class="online-box">当前在线：{{ $store.state.playingStore.onlineNum }}</view>
          </view>
          <view class="menu-div">
            <view class="menu-row">
              <view class="menu-col" v-for="(item, index) in menus" :key="index" @click="toUrl(item)">
                <view class="menus-item">
                  <view class="img">
                    <image :src="item.icon"></image>
                  </view>
                  <span class="menus-name">{{ item.name }}</span>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="title-box">
      <view class="title-div">
        <view class="left">
          <image src="../../static/img/liuhe/index/gg.png"></image>
        </view>
        <view class="right">
          <view class="notice">
            <view class="notice-item" v-for="(item, index) in noticeInfo">
              {{ item.noticeContent }}
            </view>
          </view>
        </view>
      </view>
      <view id="nav-div" class="nav-div">
        <view id="nav-row" class="nav-row" :class="{ isTop: isTop }" :style="{ marginTop: safeHeight }">
          <view v-for="(item, index) in nav" :class="select == index ? 'nav-item active' : 'nav-item'"
            @click="selectNav(index, item)">
            <view :class="{ 'nav-text': select - 1 != index }">{{ item.name }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="history-box" v-if="history.length > 0">
      <view class="title-name">
        <image src="/static/img/liuhe/564.png"></image>
      </view>
      <view class="history-list">
        <view class="history-item" v-for="(item, index) in history" @click="detail(item)">
          <view class="image">
            <image :src="item.icon"></image>
          </view>
          <view class="name">{{ item.lotteryName }}</view>
        </view>
      </view>
    </view>
    <view class="lottery lotterys" v-if="category.dataType == '0'">
      <view v-for="(item, index) in data">
        <lottery-list @openLoginPop="openLoginPop" v-if="item.styleType == '1'" :data="item.data">
        </lottery-list>
        <FourItem @openLoginPop="openLoginPop" v-else-if="item.styleType == '2'" :data="item.data"></FourItem>
        <OneItem @openLoginPop="openLoginPop" v-else :data="item.data"></OneItem>
      </view>
    </view>
    <view class="lottery" :class="{ categorys: category.styleType == 2, lotterys: category.styleType != 2 }" v-else>
      <Category ref="cate" @openLoginPop="openLoginPop" :isTop="isTopNav" @onChangeScrollStatu="onChangeScrollStatu"
        :gameCategoryId="category.dataCategoryId" :isShow="false" v-if="category.styleType == 2" :data="data" />
      <lottery-list v-else-if="item.typeName" v-for="(item, index) in data" :data="item.lotteries" :isShow="true"
        :title="item.typeName + '系列'"></lottery-list>
      <!--      <recommend v-else-if="category.styletype == 2" :data="item.dataList"></recommend>-->
      <!--      <Electron @openLoginPop="openLoginPop" v-else :data="item.dataList" />-->

    </view>
    <view class="goTop" v-show="isTop" @click="top">
      <image src="/static/img/top.png"></image>
    </view>
    <!--    <view class="lottery" v-show="select == 0">
      <lottery-list :data="hotData"></lottery-list>
    </view>
    <view class="lottery" v-show="select == 1">
      <lottery-list v-for="(item,index) in lotteryData" :data="item.lotteries" :isShow="true" :title="item.typeName + '系列'"></lottery-list>
    </view>
    <view class="tuijian" v-show="select == 0">
      <recommend :data="Images"></recommend>
    </view>-->
    <!--    <view class="take-money-box">
      <image src="../../static/img/liuhe/index/take-money.png"></image>
    </view>

    <view class="model-box">
      <view class="model-div">
        <view class="app-item">
          <image src="../../static/img/liuhe/index/app.png"></image>
        </view>
        <view class="lines"></view>
        <view class="pc-item">
          <image src="../../static/img/liuhe/index/pc.png"></image>
        </view>
      </view>
    </view>-->


    <!--    <view class="down-div" v-if="isShow">
      <view class="down-box">
        <view class="down-row">
          <view class="down-col">
            <image class="down-img" src="../../static/img/liuhe/index/down-gift.png"></image>
          </view>
          <view class="down-col down-text-item">
            <span class="down-text">下载APP，体验更多精彩！</span>
          </view>
          <view class="down-col">
            <view class="down-btn">
              点击下载
            </view>
          </view>
          <view class="down-col" @click="closed">
            <image class="down-close" src="../../static/img/liuhe/index/close.png"></image>
          </view>
        </view>
      </view>
    </view>-->
    <!-- <view style="height: 100rpx;"> -->
    <tab-bar :current="'2'"></tab-bar>
    <!-- </view> -->

    <uni-popup ref="confirm" type="center" background-color="#fff">
      <view class="confirm-box">
        <view class="title">提示</view>
        <view class="notice">
          <text>您还没有设置资金密码，</text>
          <text>提现需先设置资金密码。</text>
        </view>
        <view class="btn-box">
          <view class="cancel-btn" @click="cancel">取消</view>
          <view class="confirm-btn" @click="confirm">确认</view>
        </view>
      </view>
    </uni-popup>

    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import TabBar from "../../components/common/tabbar/TabBar";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import LotteryList from "./common/LotteryList";
import OneItem from "./common/OneItem";
import FourItem from "./common/FourItem";
import Recommend from "./common/Recommend";
import Electron from "./common/Electron";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import {
  bottomImages,
  categoryData,
  lottery,
  categories
} from "../../utils/lottery/betting";
import {
  init,
  userNewlyPlay
} from "../../utils/lottery/mine";
import {
  advertList,
  notice
} from '../../utils/common/index'
import Category from "./common/Category";
export default {
  name: "index",
  components: {
    AlertInjectLayer,
    Category,
    UniCol,
    UniRow,
    NavBar,
    TabBar,
    LotteryList,
    OneItem,
    FourItem,
    Recommend,
    Electron
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      scrollTop: 0,
      canScrollY: true,
      objHeight: {
        header: 0,
        nav: 0
      },
      isTop: 0, //吸附判断
      oldScrollTop: 0,
      isTopNav: 0,
      title: '购彩大厅',
      headerStyle: {
        backgroundColor: '#025F8D',
      },
      detailLogo: '../../static/img/user/Frame21.png',
      onlineNum: 0,
      current: 0,
      carousel: [],
      dotsStyles: {
        width: 4,
        height: 4,
        bottom: 17,
        backgroundColor: 'rgba(235, 237, 240, 0.5)',
        border: '0px rgba(235, 237, 240, 0.5) solid',
        color: '#fff',
        selectedBackgroundColor: 'rgba(255, 255, 153, 0.9)',
        selectedBorder: '0px rgba(255, 255, 153, 0.9) solid'
      },
      menus: [{
        icon: '../../static/img/liuhe/index/cun.png',
        name: '存款充值',
        islogin: true,
        url: '/pages/pay/index'
      },
      {
        icon: '../../static/img/liuhe/index/qu.png',
        name: '取款提现',
        islogin: true,
        url: '/pages/withdraw/index'
      },
      {
        icon: '../../static/img/liuhe/index/dating.png',
        name: '游戏大厅',
        islogin: false,
        url: './list'
      },
      {
        icon: '../../static/img/liuhe/index/jilu.png',
        name: '优惠活动',
        islogin: false,
        url: ''
      },
      /*{icon:'../../static/img/liuhe/index/jilu.png',name:'购彩记录',islogin:false,url:'/pages/liuhe/history/index'},*/
      {
        icon: '../../static/img/liuhe/index/qianbao.png',
        name: '钱包管理',
        islogin: true,
        url: '/pages/user/wallet/index'
      },
      ],
      select: 0,
      nav: [],
      categoryId: 1,
      category: {},
      bannerBoxHeight: '',
      isShow: true,
      isLogin: false,
      userInfo: {},
      data: [],
      lotteryData: [],
      Images: [],
      msg: '',
      status: 0,
      noticeInfo: [],
      detailLogo: '',
      history: [],

      debugHeight: 0,
      debugInnerHeight: 0
    }
  },

  onPageScroll(res) {
    console.log(res)
    if (!this.category || this.category.styleType != 2) {
      return;
    }
    if (this.isTop) return;
    let _this = this;
    uni.createSelectorQuery().in(this).select(".title-box").boundingClientRect(res => {
      if (res.top < 40) {
        _this.isTopNav = 1;
        _this.isTop = 1
      }
    }).exec();
    let systemInfo = uni.getSystemInfoSync();
    this.debugHeight = systemInfo.screenHeight + ":" + systemInfo.windowHeight + ":" + systemInfo.statusBarHeight + ":" + systemInfo.navigationBarHeight;
  },

  onLoad(option) {
    let _this = this;
    uni.hideTabBar()
    this.$nextTick(function () {
      this.getHight()
    })
    this.isLogin = global.isLogin()
    if (!this.isLogin) {
      this.userInfo = {
        'headImgUrl': this.detailLogo,
        "nickname": "试玩用户"
      };
    } else {
      this.userInfo = uni.getStorageSync('userInfo');
    }
    uni.$on('emitParams', data => {
      this.msg = data.msg
    })

    uni.$on("page-incontent-scroll", (inScroll) => {
      if (inScroll) {
        _this.canScrollY = false;
        _this.scrollTop = 0;
      }
    })

    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 24) {
          this.detailLogo = item.url
          throw Error();
        }
      })
    } catch (err) { }
    this.getCategories()
    if (isLogin()) {
      this.getInit()
    }
    this.getBottomImages()
    this.getLottery()
    this.getAd()
    this.getNotice()
    this.getHistory();
  },
  onShow() {
    if (isLogin()) {
      console.log(1111)
      this.isLogin = isLogin()
      this.getInit()
      this.userInfo = uni.getStorageSync('userInfo');
    }
    if (this.msg) {
      pop(this.msg, 2000)
      this.msg = ''
    }
  },
  methods: {



    onChangeScrollStatu(status) {

      let _this = this;
      if (status == 0) {
        this.doStopFillCommentScroll();
      }
    },
    doStopFillCommentScroll() {
      this.isTopNav = 0;
      this.isTop = 0;
      uni.pageScrollTo({
        scrollTop: 0
      })
    },

    getHight() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.top-box').boundingClientRect(data => {
        this.bannerBoxHeight = data.height + 'px';
      }).exec();
      query.select('.header-box').boundingClientRect(data => {
        this.objHeight.header = data.height;
      }).exec();
      query.select('#nav-row').boundingClientRect(data => {
        this.objHeight.nav = data.height;
      }).exec();
    },
    top() {
      let _this = this;
      this.scrollTop = this.oldScrollTop;
      //当视图渲染结束 重新设置为0
      this.$nextTick(() => {
        _this.doStopFillCommentScroll();
      });
    },
    openLink(item) {
      //#ifdef H5
      window.location.href = item.jumpUrl
      //#endif
      //#ifdef H5
      plus.runtime.openURL(item.jumpUrl); //成功跳转了
      //#endif
    },
    logout() {
      this.isLogin = false
    },
    toLogin() {
      uni.navigateTo({
        url: "/pages/liuhe/login"
      })
    },
    async toUrl(item) {
      if (!this.isLogin && item.islogin == true) {
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
      if (item.name == '取款提现') {
        if (this.status == 0) {
          return false
        }
        if (this.status == 2) {
          this.$refs.confirm.open()
          return false
        } else if (this.status == 3) {
          uni.navigateTo({
            url: "/pages/user/bank/bind"
          })
          return false
        }
      }
      let url = item.url
      uni.navigateTo({
        url: url
      })
    },
    goList() {
      uni.navigateTo({
        url: "./list"
      })
    },
    openLoginPop() {
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
    change(e) {
      this.current = e.detail.current
    },
    selectNav(index, item) {
      this.data = []
      this.select = index
      this.category = item
      this.getCategoryData();
      if (item.styleType != 2) {
        this.doStopFillCommentScroll();
      }

    },
    closed() {
      this.isShow = false
    },
    getCategories() {
      categories().then(res => {
        this.nav = res.result
        this.category = this.nav[0]
        console.log(this.category)
        this.getCategoryData()
      }).catch(err => {
        console.log(err)
      })
    },
    getCategoryData() {
      let prams = {
        'categoryId': this.category.id
      };
      categoryData(prams).then(res => {
        this.data = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    getLottery() {
      lottery().then(res => {
        this.lotteryData = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    getAd() {
      /*let prams = {type:12};
      wheelAdvertList(prams).then(res=>{
        this.carousel = res.result.advertList
      }).catch(err => {
        console.log(err)
      })*/
      let prams = {
        projectType: 2,
        code: 7,
      }
      advertList(prams).then(res => {
        this.carousel = res.result
      }).catch(err => {

      })
    },
    getBottomImages() {
      bottomImages().then(res => {
        this.Images = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    async getInit() {
      if (this.isLogin) {
        await init().then(res => {
          if (res.code == 200) {
            this.status = res.result.status
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getNotice() {
      let prams = {
        position: 4
      }
      notice(prams).then(res => {
        this.noticeInfo = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    getHistory() {
      if (this.isLogin) {
        userNewlyPlay().then(res => {
          this.history = res.result
        }).catch(err => {
          console.log(err)
        })
      }
    },
    cancel() {
      this.$refs.confirm.close()
    },
    confirm() {
      this.cancel()
      uni.navigateTo({
        url: "/pages/user/pwd/set_pwd"
      })
    },
    //加载更多 作废
    lower: function (e) {
      if (this.category.dataType != '0' && this.category.styleType == 2) {
        this.$refs.cate.loadMore()
      }
    },
    //滚动条监听
    scroll: function (e) {
      let headerH = this.objHeight.header
      let navH = this.objHeight.nav
      this.oldScrollTop = e.detail.scrollTop;
      const query = uni.createSelectorQuery().in(this).select('#nav-div');
      query.boundingClientRect(data => {
        if (data.top <= uni.getStorageSync('systemInfo').safeArea.top + 0 + headerH) {
          this.isTop = 1
        } else {
          this.isTop = 0
        }
      }).exec();
      const nav = uni.createSelectorQuery().in(this).select('.lottery');
      nav.boundingClientRect(data => {
        if (data.top <= uni.getStorageSync('systemInfo').safeArea.top + 0 + headerH + navH) {
          this.isTopNav = 1
        } else {
          this.isTopNav = 0
        }
      }).exec();
    },
    detail(item) {
      /*if(!isLogin()){
        this.$emit("openLoginPop")
        return false
      }*/
      const that = this
      let name = item.name || item.lotteryName
      uni.setStorageSync('lotteryNameTitle', {
        title: name
      });
      let isLive = item.isLive ? 1 : 0
      if (item.lotteryTypeId == 4) {
        let isLive = item.isLive ? 1 : 0
        uni.navigateTo({
          url: '/pages/liuhe/liuhePlaying?id=' + item.lotteryId + "&isLive=" + isLive,
          success: function (res) {
            res.eventChannel.emit('argParams', {
              id: that.id
            })
          }
        })
      } else {
        uni.navigateTo({
          url: '/pages/liuhe/shishicai?id=' + item.lotteryId,
          success: function (res) {
            res.eventChannel.emit('argParams', {
              id: that.id
            })
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.lottery-page {
  font-family: 'PingFang SC';
  background: #EFF6FE;
  // z-index: 5;
  // position: fixed;
  max-width: 480px;
  height: var(--vh);

  .avatar {
    height: 100%;
    display: flex;
    align-items: center;

    image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 10rpx;
    }

    .username {
      width: 120rpx;
      margin-left: 16rpx;
      font-size: 30rpx;
      color: #FFFFFF;
      overflow: hidden;
      /*超出隐藏*/
      text-overflow: ellipsis;
      /*隐藏后添加省略号*/
      white-space: nowrap;
      /*强制不换行*/
    }
  }

  .login {
    font-weight: 400;
    font-size: 30rpx;
    color: #FFFFFF;
  }

  .input-view {
    font-weight: 400;
    font-size: 32rpx;
    line-height: 45rpx;
    color: #FFFFFF;
  }

  .gift {
    height: 100%;
    display: flex;
    align-items: center;

    .shiwan {
      font-size: 32rpx;
      color: #FFFFFF;
      margin-right: 10rpx;
    }

    image {
      width: 50rpx;
      height: 50rpx;
    }
  }

  .banner-box {
    height: auto;
    position: relative;

    .back-row {
      height: 140rpx;
      background: #025F8D;
    }

    .top-box {
      position: absolute;
      top: 0;
      width: 100%;

      .top-item {
        background: #FFFFFF;
        margin: 0px 22rpx;
        border-radius: 8rpx;

        .carousel-div {
          position: relative;
          padding: 4rpx;

          .swiper-box {
            .swiper-item {
              padding: 4rpx;
              border-radius: 10rpx;

              image {
                width: 100%;
                border-radius: 10rpx;
              }
            }
          }

          .online-box {
            position: absolute;
            width: 189rpx;
            height: 40rpx;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 103rpx;
            font-style: normal;
            font-weight: 500;
            font-size: 24rpx;
            color: #FFFFFF;
            top: 20rpx;
            right: 10rpx;
            padding: 0 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .menu-div {
          display: flex;
          margin-top: 20rpx;

          .menu-row {
            display: flex;
            flex: 1;
            justify-content: space-between;
            padding: 0rpx 30rpx 20rpx;

            .menu-col {
              .menus-item {
                .img {
                  background: #FFFFFF;
                  border-radius: 20rpx;
                  width: 96rpx;
                  height: 96rpx;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: auto;
                  box-shadow: 0 0px 3px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.2);

                  image {
                    width: 80rpx;
                    height: 80rpx;
                  }
                }

                span {
                  font-weight: 400;
                  font-size: 24rpx;
                  line-height: 34rpx;
                  color: #03536E;
                  margin-top: 14rpx;
                }
              }
            }
          }
        }
      }

    }
  }

  .title-box {
    .title-div {
      margin: 0px 22rpx 16.5rpx;
      padding-top: 26.5rpx;
      display: flex;

      .left {
        width: 15%;
        display: flex;
        align-items: center;

        image {
          height: 25rpx;
          width: 104rpx;
        }
      }

      .right {
        width: 84%;
        font-weight: 400;
        font-size: 25rpx;
        line-height: 35rpx;
        color: #3881A8;
        overflow: hidden;
        white-space: nowrap;

        .notice {
          animation: move 50s linear infinite;
          height: 100%;
          align-items: center;
          display: inline-block;

          .notice-item {
            display: inline-block;
            line-height: 40rpx;
            margin-right: 594rpx;

            &:last-child {
              /*margin-right: 0;*/
            }
          }
        }
      }
    }

    .nav-div {
      background: #FFFFFF;
      height: 60rpx;
      border-radius: 10rpx 10rpx 0 0;
      margin: 0 20rpx;

      .nav-row {
        display: flex;
        height: 60rpx;
        border-radius: 10rpx 10rpx 0 0;
        border-bottom: 2px solid #0099CC;

        .nav-item {
          width: 100%;
          height: 60rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 400;
          font-size: 28rpx;
          color: #0DA5E3;

          .nav-text {
            width: 100%;
            text-align: center;
            border-right: 1px solid #0DA5E3;
          }

          &:last-child {
            border-top-right-radius: 10rpx;

            .nav-text {
              border-right: 0px solid #0DA5E3;
            }
          }

          &:first-child {
            border-top-left-radius: 10rpx;
          }
        }

        .active {
          background: linear-gradient(180deg, #20B5FA 0%, #059ED9 100%);
          color: #FFFFFF;
        }
      }

      .isTop {
        position: fixed;
        top: 92rpx;
        width: calc(100vw - 40rpx);
        max-width: calc(480px - 40rpx);
        background: #ffffff;
        z-index: 12;
      }
    }
  }

  .history-box {
    display: flex;
    padding: 20rpx 0rpx 0rpx 20rpx;

    .title-name {
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 28rpx;
        height: 110rpx;
      }
    }

    .history-list {
      overflow-x: scroll;
      display: flex;

      .history-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 20rpx;

        .image {
          image {
            height: 98rpx;
            width: 98rpx;
          }
        }

        .name {
          font-size: 18rpx;
          line-height: 25rpx;
          text-align: center;
          color: #2E7B6C;
          white-space: nowrap;
        }
      }
    }
  }

  .lottery {
    border-radius: 10rpx;
    margin: 0px 20rpx;
  }

  .categorys {
    margin: 0;
  }

  .lotterys {
    margin: 20rpx;
    border-radius: 10rpx;
    background: #ffffff;
  }

  .tuijian {
    margin: 24rpx 20rpx 0 20rpx;
  }

  .take-money-box {
    position: fixed;
    bottom: 16%;
    right: 0;

    image {
      height: 157rpx;
      width: 78rpx;
    }
  }

  .model-box {
    margin: 24rpx 20rpx 24px;

    .model-div {
      display: flex;
      justify-content: space-evenly;
      background: #FFFFFF;
      border-radius: 8rpx;
      align-items: center;

      image {
        height: 130rpx;
        width: 240rpx;
        margin: 20rpx;
      }

      .lines {
        height: 50px;
        width: 1px;
        background-color: #E7E7E7;
      }
    }
  }

  .down-div {

    /*height: 93rpx;*/
    .down-box {
      position: fixed;
      bottom: 50px;
      height: 93rpx;
      width: 100%;
      max-width: 480px;
      background-image: url("../../static/img/liuhe/index/down.png");
      background-size: cover;
      background-repeat: repeat-x;
      animation: animatedBackground 2s linear infinite;

      .down-row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        .down-col {
          .down-img {
            height: 79rpx;
            width: 100rpx;
          }

          .down-text {
            font-style: normal;
            font-weight: 400;
            font-size: 26rpx;
            line-height: 36rpx;
            color: #FFFFFF;
          }

          .down-btn {
            height: 44rpx;
            width: 130rpx;
            background: #FF9900;
            text-align: center;
            margin-top: 32rpx;
            font-weight: 400;
            font-size: 26rpx;
            line-height: 40rpx;
            color: #FFFFFF;
          }

          .down-close {
            height: 33rpx;
            width: 33rpx;
            margin-top: 36rpx;
          }
        }

        .down-text-item {
          margin-top: 26rpx;
        }
      }

    }
  }

  .confirm-box {
    height: 339rpx;
    width: 540rpx;
    border-radius: 10rpx;
    padding: 20rpx 54rpx 20rpx 54rpx;

    .title {
      height: 80rpx;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 80rpx;
      text-align: center;
      color: #9A9A9A;
      border-bottom: 2rpx solid #E6E6E6;
    }

    .notice {
      height: 160rpx;
      font-weight: 400;
      font-size: 28rpx;
      text-align: center;
      color: #333333;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .btn-box {
      display: flex;
      color: #FFFFFF;
      font-weight: 400;
      font-size: 26rpx;

      .cancel-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60rpx;
        width: 200rpx;
        border-radius: 264rpx;
        padding: 10rpx 74rpx;
        background: #8CB2C9;
        margin-right: 20rpx;
      }

      .confirm-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60rpx;
        width: 200rpx;
        border-radius: 264rpx;
        padding: 10rpx 74rpx;
        background: #FF9900;
        margin-left: 20rpx;
      }
    }
  }

  .goTop {
    position: fixed;
    right: 20rpx;
    bottom: 46px;
    z-index: 20;

    image {
      height: 58rpx;
      width: 58rpx;
    }
  }
}

.lottery-page.height {}

.lottery-page.safari-height {
  height: var(--vh);
}

@media (min-width : 480px) and (max-width : 3000px) {
  @keyframes animatedBackground {
    from {
      background-position: -480px 0;
    }

    to {
      background-position: 0 0;
    }
  }
}

@media (max-width : 480px) {
  @keyframes animatedBackground {
    from {
      background-position: -750rpx 0;
    }

    to {
      background-position: 0 0;
    }
  }
}

@keyframes move {
  from {
    transform: translateX(0);
    /*div多宽就写多宽*/
  }

  to {
    transform: translateX(-200%);
  }
}
</style>
