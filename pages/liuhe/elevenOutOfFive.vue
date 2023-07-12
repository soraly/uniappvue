<template>
  <view class="elevenOutOfFive-board" :style="{ marginTop: safeHeight, height: windowHeight }">
    <mi-pai ref="mipai" @closeMiPai="closeMiPai" :your-betting-list="yourBettingList" :head-info="headInfo"
      :is-show-mi-pai="isShowMiPai"></mi-pai>
    <view class="top-header" v-if="isShowLive">
      <view class="live-container">
        <!--              &lt;!&ndash; 播放器显示区域 &ndash;&gt;-->
        <!--              <view class="dplayer-controller">-->

        <!--              </view>-->
        <!--              <lives @refreshVideo="refreshVideo" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"></lives>-->
        <!--              &lt;!&ndash;#ifdef APP_PLUS&ndash;&gt;-->
        <!--              <AppLives @refreshVideo="refreshVideo" v-if="isRefresh"></AppLives>-->
        <!--              &lt;!&ndash;#endif&ndash;&gt;-->
        <!--              &lt;!&ndash; 播放器显示区域 &ndash;&gt;-->
      </view>
    </view>
    <view class="top-header" v-else>
      <nav-bar :nav-bar-height="'80rpx'" :isBack="false" :left-width="180" :right-width="180" :title="''"
        :titleStyle="titleStyle" :font-color="titleStyle.color" :header-style="setNavBg()" class="nav-bar">
        <block slot="left">
          <view class="nav-title" @click="goBack">
            <uni-icons type="back" size="18" :color="titleStyle.color"></uni-icons>
            {{ title }}
          </view>
        </block>
        <block slot="right">
          <view class="nav-right">
            <view :class="refresh ? 'balance refresh' : 'balance'" @click="refreshBalance">
              <text class="balance-text" v-if="userInfo">{{ $store.state.appInfoStore.userInfo.userBalance }}</text>
              <text class="balance-text" style="color: #FFFFFF" v-else>{{ setAmount(0) }}</text>
              <image src="./../../static/img/liuhe/refresh.png" v-if="userInfo"></image>
            </view>
            <view class="menu" @click="onShowMenu">
              <uni-icons type="bars" color="#FFF" size="20"></uni-icons>
            </view>
          </view>
        </block>
      </nav-bar>
      <view class="board">
        <view class="mask" v-if="isShowMenu" @click="closeMenu"></view>
        <view class="show-menu" v-if="isShowMenu">
          <view class="show-menu-item">
            <view class="item-content">
              <view class="item-icon">
                <image :src="require('./../../static/img/liuhe/menu/user.png')"></image>
              </view>
              <view class="item-user" v-if="userInfo" @click="toUrl({ url: '/pages/liuhe/setting/userInfo' })">
                {{ userInfo.nickname || userInfo.userName }}
              </view>
              <view class="item-user" v-else @click="toLogin">
                {{ '登录/注册' }}
              </view>
            </view>
          </view>
          <view class="show-menu-item" v-for="(item, index) in menuList">
            <view class="item-content">
              <view class="item-icon">
                <image :src="item.imgPath"></image>
              </view>
              <view class="item-name" @click="toUrl(item)">
                {{ item.name }}
              </view>
              <view class="switch" v-if="item.isSwitch">
                <view class="custom-switch">
                  <view class="custom-switch-open" v-if="item.isOpen" @click="switch1Change(item, index)">
                    <image src="./../../static/img/liuhe/open.png"></image>
                  </view>
                  <view class="custom-switch-close" v-else @click="switch1Change(item, index)">
                    <image src="./../../static/img/liuhe/close1.png"></image>
                  </view>
                </view>
                <!--                    <switch :checked="item.isOpen" @change="switch1Change(item,index)" style="transform:scale(0.5)"/>-->
              </view>
            </view>
          </view>
        </view>
        <view class="board-content">
          <view class="board-content-item-left">
            <view class="top">
              <text v-if="this.headInfo.stampType === 3">{{ `第${headInfo.nextShorNo ? headInfo.nextShorNo : ''}期`
              }}</text>
              <text v-else>{{ `第${headInfo.shorNo ? headInfo.shorNo : ''}期` }}</text>
              <text class="status" @click="toAccount">走势</text>
            </view>
            <view class="ball-list">
              <view class="ball-list-item" v-if="headInfo.stampType === 2"
                v-for="(item, index) in this.headInfo.lotteryResult ? this.headInfo.lotteryResult.split(',') : []"
                :key="index">
                <view class="ball-num">
                  <text class="text">{{ item }}</text>
                </view>
              </view>
            </view>
            <view class="close-ball-list" v-if="headInfo.stampType === 3">
              <view class="close-ball-item" v-for="item in closeShowBall">
                <text class="ball-text">?</text>
              </view>
            </view>
            <view class="result-detail" v-if="headInfo.stampType === 2">
              {{ headInfo.resultDetail }}
            </view>
          </view>
          <view class="board-content-item">
            <view class="info">
              <view class="line1" v-if="isLive">
                <image src="../../static/img/liuhe/live.png" />
                <text class="live-text">正在直播</text>
              </view>
              <view class="line2">
                第<text>{{ headInfo.nextShorNo }}</text>期
              </view>
              <view class="line3">
                <text v-if="headInfo.stampType === 1">等待开盘中</text>
                <text v-if="headInfo.stampType === 2">截止</text>
                <text style="color: #FFFF00" v-if="headInfo.stampType === 3">封单中</text>
              </view>
              <view class="line4">{{ runtimes }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="confirm" background-color="#fff">
      <view class="confirm-box">
        <view class="confirm-div">
          <view class="header">
            确认投注
          </view>
          <view class="list-box">
            <view class="title">
              <view class="name">{{ title }}</view>
              <view class="period">{{ headInfo.nextNo }}期</view>
            </view>
            <scroll-view scroll-y class="list-row">
              <view class="list-item" v-for="(item, index) in orderList">
                <view class="played">
                  {{ item.methodName }}
                </view>
                <view class="number">
                  @[{{ item.name }}]
                </view>
                <view class="note-box">
                  <text class="note">{{ item.stakeCount }}注</text>
                  <text class="money">{{ setAmount(item.unitPrice) }}元</text>
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="count-box">
            <text>共</text>
            <text class="note-total">{{ orderTotal.count }}</text>
            <text>注</text>
            <text class="moeney-total">{{ setAmount(orderTotal.price) }}</text>
            <text>元</text>
          </view>
          <view class="btn-box">
            <button class="cancel" @click="cancelBtn">取消</button>
            <button v-if="headInfo.stampType === 3 || headInfo.stampType === 1" class="confirm-act-close">封单中</button>
            <button v-else class="confirm-act" @click="toBuyOrder" :disabled="isBetting">{{ isBetting ? "注单中" :
              "确认" }}</button>
          </view>
        </view>
      </view>
    </uni-popup>
    <view :class="isShowRecords ? 'history-div active' : 'history-div'">
      <Records :dataList="dataList" @setShowRecords="setShowRecords" :isShowRecords="isShowRecords"></Records>
    </view>
    <view class="tab">
      <view class="show-records" @click="setShowRecords">
        <image mode="widthFix" :src="isShowRecords ? hideImg : showImg"></image>
      </view>
      <view :class="current == item.value ? 'tab-item selected' : 'tab-item'" v-for="item in tabList" :key="item.value"
        @click="onSelectItem(item)">
        {{ item.label }}
      </view>
    </view>
    <view :class="isShowRecords ? 'tab-content active' : 'tab-content'" :style="setTabStyle">
      <view :class="isShowOrder ? 'bet-list active' : 'bet-list'" v-show="current == 1">
        <betting-area ref="betting" @showBuy="showBuy" @setOrders="setOrders" @selected="onTypeSelected"
          :playList="playList" @onSelectedType="onSelectedType" />
      </view>
      <view v-if="current == 2">
        <BetSlip ref="betSlip" :lotteryId="lotteryId" />
      </view>
      <view v-if="isLoadingChatRoom" v-show="current == 3">
        <view v-if="!userInfo" class="chat-room-unlogin">
          <view @click="toLogin"><span style="color: blue">登录</span>后开启此功能</view>
        </view>
        <view v-else-if="!chatRoomUrl"
          :style="`width: 100%;height: calc( ${windowHeight} - 326rpx - 76rpx );border:none;`">
          <view style="color: darkgrey;margin-top: 200rpx;text-align: center">聊天室已关闭</view>
        </view>
        <!--            <web-view v-else :fullscreen="false"  style="width: 100%;height: calc( var(--vh) - 326rpx - 76rpx )" :src="`https://vnlive.club/external/toChatRoom/v1?userId=${userInfo.id}`"></web-view>-->
        <web-view id="ifreme-chat-room" v-else-if="isLoadingChatRoom && chatRoomUrl" :fullscreen="false"
          :style="`width: 100%;height: calc( ${windowHeight} - 326rpx - 76rpx );border:none;`"
          :src="chatRoomUrl"></web-view>

      </view>

      <view :class="isShowOrder ? 'add-chart up' : 'add-chart'">
        <buy ref="buy" @toBuy="toBuy" :is-cart="menuList[4].isOpen" :orders="orderList" :carts="cartList" :total="total"
          :stampType="headInfo.stampType" :ballItem="ballItem" @closeBuy="closeBuy" @removeOrder="removeOrder"
          @setCustomAmount="setCustomAmount" :lotteryId="lotteryId"></buy>
      </view>
    </view>
    <show-modal :title="modalTitle" ref="isLogin" @submit="toLogin">
      <view slot="content" class="modal-content">
        您还没有登录账号，
        <view>是否立即前往登录？</view>
      </view>
    </show-modal>
    <show-modal :title="modalTitle" ref="show" @submit="clearCartToBack">
      <view slot="content" class="modal-content">
        有未投注彩票，退出将会清空，
        <view>是否退出？</view>
      </view>
    </show-modal>
    <uni-popup :title="'提示'" type="dialog" ref="result">
      <view class="error-modal">
        <view class="title">
          提示
        </view>
        <view class="content">
          {{ errorMsg }}
        </view>
        <view class="footer" @click="yes()">
          知道了
        </view>
      </view>
    </uni-popup>
    <balance-modal ref="balance"></balance-modal>
    <LeftMenu :lotteryId="lotteryId" ref="LeftMenu" />
    <AlertInjectLayer />
  </view>
</template>
<script>
import NavBar from "../../components/common/navBar/navBar";
import BallNumbers from "./common/numbers";
import WebSocketAlert from "./common/WebsocketAlert";
import BetSlip from "../../components/common/lottery/BetSlip";
import BettingArea from "./elevenOutOfFive/betting";
import Buy from "./common/buy";
import Records from "./elevenOutOfFive/records";
import BalanceModal from "./common/BalanceModal.vue"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import templateSelector from "@/config/templateMemSelector/ElevenOutOfFiveSelector.js"


import {
  getPlayList,
  getPlayMiniList,
  getLotteryStat,
  getRewardsInfo,
  buyOrder,
  list,
  getHistoryList,
  getChatRoomInfo
} from "../../utils/lottery/betting";
import { mapGetters } from "vuex";
import Playing from "../../utils/common/playing";
import ShowModal from "./common/showModal";
import MiPai from "./common/MiPai.vue";
import { websocetObj } from '@/utils/websocet/websocet.js';

// import Lives from '../../components/common/live/live'
//#ifdef APP_PLUS
import AppLives from '../../components/common/live/applive'
//#endif
import LeftMenu from './common/LeftMenu'
export default {
  components: {
    AlertInjectLayer,
    LeftMenu,
    Records,
    // UniCol,
    // UniRow,
    NavBar,
    BetSlip,
    BettingArea,
    Buy,
    BallNumbers,
    ShowModal,
    BalanceModal,
    MiPai,
    WebSocketAlert
    // Lives,
  },
  data() {
    return {
      modalTitle: "温馨提示",
      isShowMiPai: false,
      errorMsg: "",
      yourBettingList: [],
      isShowLive: false,
      dataList: [],
      isRefresh: true,
      title: "",
      safeHeight: "0px",
      windowHeight: "0px",
      systemInfo: "0px",
      isShowMenu: false,
      playing: new Playing(),
      titleStyle: {
        color: "#E6E9EB",
        fontSize: "32rpx"
      },
      closeShowBall: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        },
        {
          id: 5
        }
      ],
      navBg: require('./../../static/img/liuhe/five/header-bg.png'),
      numbers: ["05", "45", "49", "39", "12", "40", "10"],
      isShowRecords: false,
      showImg: require('./../../static/img/liuhe/show.png'),
      hideImg: require('./../../static/img/liuhe/hide.png'),
      isShowOrder: false,
      orders: [],
      tabList: [
        {
          label: '投注区',
          value: 1,
        },
        {
          label: '今日注单',
          value: 2,
        },
        {
          label: '聊天室',
          value: 3,
        },
      ],
      id: 0,
      current: 1,
      playList: [],
      lotteryStatus: {},
      headInfo: {
        shorNo: "",
        stampType: null,
        numberList: [],
        nextShorNo: "",
        nextNo: ""
      },
      total: {
        totalPrice: 0,
        stakeCount: 0,
      },
      methodName: "",
      runtimes: '',
      isCart: false,
      orderInfo: {},
      menuList: [
        {
          name: '最近开奖',
          isSwitch: false,
          url: '/pages/liuhe/elevenOutOfFive/recent_draws',
          imgPath: "./../../static/img/liuhe/menu/recent.png"
        },
        {
          name: '我的投注',
          isSwitch: false,
          url: '/pages/liuhe/history/index',
          imgPath: "./../../static/img/liuhe/menu/mine.png"
        },
        {
          name: '玩法说明',
          isSwitch: false,
          url: '/pages/liuhe/how_to_play',
          imgPath: "./../../static/img/liuhe/menu/explain.png"
        },
        {
          name: '走势图',
          isSwitch: false,
          url: '/pages/zxcount/liuhe',
          imgPath: "./../../static/img/liuhe/menu/chart.png"
        },
        {
          name: '购物车',
          isOpen: true,
          isSwitch: true,
          imgPath: "./../../static/img/liuhe/menu/cart.png"
        },
        {
          name: '快速投注',
          isOpen: false,
          isSwitch: true,
          imgPath: "./../../static/img/liuhe/menu/fast.png"
        },
        {
          name: '金额记忆',
          isOpen: false,
          isSwitch: true,
          imgPath: "./../../static/img/liuhe/menu/save.png"
        },
        {
          name: '咪牌',
          isOpen: false,
          isSwitch: true,
          imgPath: "./../../static/img/liuhe/menu/eye.png"
        },
      ],
      orderTotal: {
        count: 0,
        price: 0
      },
      cartList: [],
      userInfo: { nickname: "" },
      lotteryId: null,
      ballItem: {},
      refresh: false,
      isCloseBuy: false,
      times: null,
      pageSize: 120,
      isLive: false,

      //新增MR 避免打开页面立即加载聊天室和主进程抢网络资源。 用户点击菜单后再加载
      isLoadingChatRoom: false,
      chatRoomUrl: null,
      isBetting: false,//下注时按钮显示注单中，防止网络不好再次点击下注
    }
  },
  computed: {
    ...mapGetters(['orderList', "websocketTimeInterval", "inLotteryId"]),
    menuListStoregeKey() {
      return "menuList:" + this.lotteryId;
    },
    lotteryListKey() {
      return "lotteryList:" + this.lotteryId;
    },
  },
  onUnload() {
    clearInterval(this.times);
  },
  onReachBottom() {

  },
  onShow() {
    if (this.$refs.isLogin) {
      this.$refs.isLogin.close()
      this.userInfo = uni.getStorageSync('userInfo');
    }
    //购物车返回时会存入一个true的布尔值，这个位置用于取值，判断是在购物车返回时触发
    let cartBack = uni.getStorageSync('cartBack');
    if (cartBack) {
      //购物车返回时触发取消订单的选中，并设置值为false，这样解决了购物车返回清楚选中，也避免切换窗口时取消选中的bug
      this.$store.dispatch('setOrderList', [])
      uni.setStorageSync("cartBack", false)
    } else {
      console.error("cartBack undefined")
    }
    this.getCartList()
    this.isShowMenu = false
    // this.closeBuy()
  },
  onLoad(option) {
    ////console.log(option,uni.getStorageSync('lotteryNameTitle'));
    ////console.log(this.menuList);
    let _this = this;
    this.safeHeight = uni.$sys.safeArea.top + "px";
    this.windowHeight = uni.$sys.windowHeight + "px";
    uni.$on("onWindowResize", function (sizeInfo) {
      _this.windowHeight = sizeInfo.size.windowHeight + "px";
    });
    if (option.id) {//判断id进入后，获取数据
      this.lotteryId = option.id;
      if (this.inLotteryId != -1 && this.inLotteryId == this.lotteryId) {//未在其它区域清理 inlotteryId  先这样处理吧
        this.doCommitUpdateEventBySocket();
      }
      this.$store.commit("SET_GAME_INLOTTERYID", this.lotteryId);
      uni.$off("onGetGameInfo");
      uni.$on("onGetGameInfo", function (resultInfo) {
        _this.doUpdateHeaderInfoFromSocket(resultInfo.data)
      })
      let memLotteryListTemplate = templateSelector.getMemeLotteryByLotteryId(this.lotteryId);
      if (memLotteryListTemplate) {
        this.playList = memLotteryListTemplate;
      } else {
        console.error("当前游戏默认模板未录入，请前往memLiuheLotteryList.js 添加 lotteryId=" + this.lotteryId);
      }
      this.$nextTick(function () {
        _this.getPlayLists()
      });
      this.getHeadInfo();
    }
    //初始化基础信息
    this.initInfo();

    if (option.down) {
      uni.showToast({
        title: "投注成功",
        icon: "success"
      })
    }
    if (option.cancel == 0) {
      this.current = 2;
      pop("撤单成功", 1000);
    }
    if (option.isLive == 1) {
      this.isLive = true;
    }

    if (this.playing.getStorage(this.menuListStoregeKey)) {
      let list = this.playing.getStorage(this.menuListStoregeKey);
      list[0].url = this.menuList[0].url;
      list[1].url = this.menuList[1].url;
      list[3].url = this.menuList[3].url;
      this.playing.setStorage(this.menuListStoregeKey, list);
      this.menuList = this.playing.getStorage(this.menuListStoregeKey);
    } else {
      this.playing.setStorage(this.menuListStoregeKey, this.menuList);
    }
    if (option.records) {
      this.onSelectItem({ value: 2 })
    }

    uni.setNavigationBarTitle({
      title: this.title
    });
    this.id = option.id
    this.getLotteryStatus()
    this.lists();
    this.$nextTick(function () {
      _this.closeBuy();
      _this.$store.dispatch('setOrderList', [])
    })
    this.initChatRoomUrl();
  },

  methods: {
    initInfo() {
      this.systemInfo = uni.$sys;
      this.userInfo = uni.getStorageSync('userInfo');
      this.title = uni.getStorageSync('lotteryNameTitle').title;
      uni.hideTabBar()
      uni.$on('getLotteryMsg', this.getLotteryInfo)
      uni.$on('getWin', this.getLotteryInfo)
      uni.setNavigationBarTitle({
        title: this.title
      });
    },
    closeMiPai() {
      this.isShowMiPai = false;
    },
    yes() {
      this.isCloseBuy = false;
      this.$refs.result.close()
    },
    lists() {
      let prams = { 'pageSize': this.pageSize };
      prams.lotteryId = this.lotteryId
      getHistoryList(prams).then(res => {
        if (res.code == 200) {
          this.dataList = res.result
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
    toAccount() {
      uni.navigateTo({
        url: '/pages/zxcount/liuhe'
      })
    },
    toLogin() {
      uni.navigateTo({
        url: '/pages/liuhe/login'
      })
    },
    goBack() {
      if (this.cartList.length > 0) {
        this.$refs.show.show()
      } else {
        this.toHomePage();
      }
    },
    toHomePage() {
      this.$refs.LeftMenu.open()
    },
    clearCartToBack() {
      this.cartList = [];
      this.playing.setStorage('playingList', this.cartList)
      this.toHomePage();
    },
    setTabStyle() {
      return {
        height: this.systemInfo.windowHeight - this.systemInfo.statusBarHeight - 100 + 'px'
      }
    },
    setAmount(num) {
      return this.playing.setAmount(num, 2, '.', ',')
    },
    //从浏览器储存获取购物车list
    getCartList() {
      this.cartList = this.playing.getStorage('playingList') ? this.playing.getStorage('playingList') : [];
      if (this.cartList.length === 0 && this.orderList.length === 0) {
        this.isShowOrder = false;
      }
    },
    //额度刷新
    refreshBalance() {
      this.refresh = true
      this.$store.dispatch("updateUserBalanceFromServer")
    },
    //跳转
    toUrl(item) {
      if (!this.userInfo) {
        this.$refs.isLogin.show();
        return
      }
      if (item.name === "走势图") {
        uni.showToast({
          title: "敬请期待",
          icon: "none"
        })
        return
      }
      uni.navigateTo({
        url: item.url + "?id=" + this.id
      })
    },
    //设置倒计时
    setRewardsTimeOut(time) {
      // time = time + 1;
      // this.times = setInterval(() => {
      //   time -= 1;
      //   this.runtimes = this.playing.timestampToDate(time);
      //   if (time < 0 || time === 0) {
      //     clearInterval(this.times);
      //   }
      // }, 1000)
      let _this = this;
      this.runtimes = this.playing.timestampToDate(time);
      //调用清理定时器 避免多域执行 保证单任务
      clearInterval(this.times);
      let roundTime = 0;
      let lastTimerDate = Date.now();
      var sendCondRun = function (useSecend) {
        time -= useSecend;
        //避免出现-1的情况
        _this.runtimes = _this.playing.timestampToDate(time < 0 ? 0 : time);
        if (time < 0 || time === 0) {
          clearInterval(_this.times);
          _this.doCommitUpdateEventBySocket();
          return;
        }
        if (_this.headInfo && Date.now() + _this.websocketTimeInterval >= _this.headInfo.nextTime) {
          clearInterval(_this.times);
          _this.doCommitUpdateEventBySocket();
          return;
        }
      }
      this.times = setInterval(() => {
        let nowDate = Date.now();
        let frameTime = nowDate - lastTimerDate;
        roundTime += frameTime;
        lastTimerDate = nowDate;
        if (roundTime > 1000) {
          roundTime = roundTime % 1000;//取出余数 经历精准
          sendCondRun(Math.ceil(roundTime / 1000));
        }
      }, 100);

    },
    onSelectItem(item) {
      if (!this.checkOpenChatRoom(item)) return;
      this.current = item.value;
      this.closeBuy();
    },
    checkOpenChatRoom(item) {
      if (item.value == 3) {
        if (this.userInfo.userType == 'demo' || !this.userInfo) {
          this.$refs.isLogin.show();
          return false;
        }
        if (this.isLoadingChatRoom == false) {
          this.isLoadingChatRoom = true;
        }
      }
      return true;
    },

    setNavBg() {
      return {
        height: "40px",
        backgroundImage: `url(${this.navBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: 'transparent',
      }
    },
    setShowRecords() {
      this.isShowRecords = !this.isShowRecords;
    },
    //获取玩法
    getPlayLists() {

      // getPlayMiniList({lotteryId:this.lotteryId}).then(res=>{
      //   if (res.code === 200) {
      //     console.log("play mini list",JSON.stringify(res.result));
      //   }
      // });
      getPlayList({ lotteryId: this.lotteryId }).then(res => {
        if (res.code === 200) {
          this.playList = res.result;
        } else {
          uni.showToast({
            title: res.message,
            icon: 'error'
          })
        }
      })
    },
    //获取彩票状态
    getLotteryStatus() {
      getLotteryStat().then(res => {
        if (res.code === 200) {
          uni.setStorageSync('lotteryStatus', res.result)
        }
      })
    },
    getBettingList() {
      list({
        type: 1,
        lotteryNo: this.headInfo.lotteryNo,
        lotteryId: this.lotteryId
      }).then(res => {
        if (res.code === 200) {
          this.yourBettingList = res.result.page.records
        }
      })
    },
    //ws头部信息更新
    getLotteryInfo(e) {
      let data = e.data;
      // console.log(">>>>>>>>>",data);
      console.log("getLotteryInfo");
      let obj = JSON.parse(data.msgTxt);
      if (data.source === 2) {
        if (obj.lotteryId == this.lotteryId) {
          console.log(obj)
          this.headInfo = obj;
          clearInterval(this.times);
          this.setRewardsTimeOut(this.headInfo.closeTimeStamp)
          //stampType为3是封单中，为1是封盘中，1和3都不能下注，1 封盘段 2 购彩段 3封单(关盘)段
          if (this.headInfo.lotteryNo < obj.lotteryNo && this.menuList[7].isOpen && this.headInfo.stampType !== 3) {
            this.getBettingList();
            if (this.isShowMiPai) {
              this.$refs.mipai.reset()
            } else {
              this.isShowMiPai = true;
              this.$refs.mipai.init();
            }
          }
        }
      } else if (data.source === 3 && this.playing.getStorage('isWin')) {
        clearInterval(this.times);
        this.setRewardsTimeOut(this.headInfo.closeTimeStamp)
      }
    },
    //获取头部开奖信息
    getHeadInfo() {
      getRewardsInfo({ lotteryId: this.lotteryId }).then(res => {
        // ////console.log(res);
        this.headInfo = res.result;
        if (res.result.stampType === 1) {
          this.isCloseBuy = true;
        }
        this.setRewardsTimeOut(this.headInfo.closeTimeStamp)
        this.playing.setStorage('lotteryNo', { lotteryNo: res.result.nextNo });
      })
    },

    showBuy() {
      this.isShowOrder = true;
      console.log("showBuy")
    },

    /**
     * 处理设置订单
     */
    setOrders(data) {
      this.isShowOrder = false;
      let { selectedIds, ball, ballChildren, ballItem } = data;
      this.ballItem = ballItem;
      // console.log("ball.minNum",ball.minNum)
      // if (ball.minNum === 1 || ball.groupOrder) {
      //   this.isShowOrder = this.orderList.length > 0;
      // } else {
      //   this.isShowOrder = this.orderList.length >= ball.minNum;
      // }
      this.$refs.buy.getHistoryAmount();
      this.total = {
        stakeCount: 0,
        totalPrice: 0
      }
      let arr = [];
      if (!this.orderList.length) return null
      this.orderList.forEach(item => {
        if (item.content) {
          let newArr = item.content.split(',');
          // 组合选择情况下 ballChildren 只传入某一个列表的值 所以有错误 建议吧逻辑查分到组件内处理order要么同意在此处理
          if(!item.unRnameFromBallChildren){
            ballChildren.forEach(b => {
              newArr.forEach(n => {
                if (b.id == n) {
                  arr.push(b.name)
                  item.name = arr.toString();
                }
              })
            })
          };
          this.isShowOrder = item.stakeCount > 0 ? true : false;
          this.total.stakeCount = item.stakeCount;
          this.total.totalPrice = item.totalPrice;
        } else {
          //todo:已经简化代码，修改逻辑，此处可暂时注释待多个版本测试没问题后，可删除 20230617
          // ballChildren.forEach(b => {
          //   if (b.id == item.playId) {
          //     item.name = b.name;
          //   }
          // })
          this.isShowOrder = this.orderList.length >= ball.minNum;
          this.total.stakeCount += item.stakeCount;
          this.total.totalPrice += item.totalPrice;
        }
      })
      this.$store.dispatch('setOrderList', this.orderList)
    },
    //下注接口
    buy() {
      this.orderList.forEach(item => {
        item.chaseNum = 0;
        delete item.code; // true
      })
      let param = {
        "lotteryId": this.lotteryId,
        "lotteryNo": this.headInfo.nextNo,
        "orderList": this.orderList,
      }
      buyOrder(param).then(res => {
        if (res.code === 200) {
          this.$refs.confirm.close();
          this.refreshBalance()
          this.playing.removeStorage('playingList');
          uni.navigateTo({
            url: '/pages/liuhe/betting_results?lotteryNo=' + param.lotteryNo + '&lotteryId=' + this.lotteryId
          })
        } else if (res.code === 774) {
          this.$refs.confirm.close();
          if (this.playing.getStorage('userInfo').userType == 'demo') {
            uni.$emit('showPop', { refName: 'AlertTestMsg', })
          } else {
            this.$refs.balance.open();
          }
        } else if (res.code === 701) {
          this.errorMsg = res.message;
          this.$refs.result.open()
        } else {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    },
    toBuyOrder() {
      this.isBetting = true;//下注时打开注单开关
      if (this.menuList[5].isOpen) {//快速投注下单不跳转
        this.orderList.forEach(item => {
          item.chaseNum = 0;
          delete item.code; // true
        })
        let param = {
          "lotteryId": this.lotteryId,
          "lotteryNo": this.headInfo.nextNo,
          "orderList": this.orderList,
        }
        buyOrder(param).then(res => {
          if (res.code === 200) {
            this.isBetting = false;//拿到结果后关闭开关
            this.refreshBalance()
            this.playing.removeStorage('playingList');
            this.orderList = [];
            this.closeBuy();
            this.$store.dispatch('setOrderList', [])
            this.cancelBtn();
            uni.showToast({
              title: "投注成功",
              icon: "success"
            })
          } else if (res.code === 774) {
            this.$refs.confirm.close();
            if (this.playing.getStorage('userInfo').userType == 'demo') {
              uni.$emit('showPop', { refName: 'AlertTestMsg', })
            } else {
              this.$refs.balance.open();
            }
          } else if (es.code === 701) {
            this.errorMsg = res.message;
            this.$refs.result.open()
          } else {
            uni.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      } else {
        this.buy();
      }
    },
    cancelBtn() {
      this.$refs.confirm.close("center");
    },

    //前往购买
    toBuy(obj) {
      ////console.log(this.orderList,obj);
      if (this.headInfo.stampType === 1) {
        this.isCloseBuy = true;
      }
      if (this.userInfo) {
        this.orderTotal = {//打开前清空一次
          count: 0,
          price: 0
        }
        this.orderList.map(item => {
          ////console.log(item);
          if (item.unitPrice === 0) {
            item.unitPrice = 1
          }
          if (obj.unitPrice === "") {
            obj.unitPrice = 1
          }
          item.unitPrice = Number(obj.unitPrice);
          item.totalPrice = Number(item.unitPrice) * Number(item.stakeCount);
          this.orderTotal.count += item.stakeCount;
          this.orderTotal.price += item.stakeCount * item.unitPrice;
        });
        if (this.menuList[4].isOpen) {
          let code = '';
          if (this.orderList[0]) {
            this.playing.setStorage(this.orderList[0].code, this.orderList);
            code = this.orderList[0].code;
          }
          uni.navigateTo({
            url: '/pages/liuhe/cart?code=' + code + '&id=' + this.lotteryId
          })
        } else {
          this.$refs.confirm.open("center");
        }
      } else {
        this.$refs.isLogin.show();
      }
    },
    //closeCartWin(){
    //this.isShowOrder = this.cartList.length > 0;
    //},
    //玩法总种类切换
    onTypeSelected(item) {
      this.closeBuy()
    },
    //二级顶部切换
    onSelectedType() {
      this.closeBuy()
    },
    setCustomAmount(amount) {
      this.playing.setUnitPrice(amount)
    },
    //关闭购物车窗口
    closeBuy() {
      if (this.headInfo.lotteryTypeId === 30) {
        if (this.$refs.betting) {
          this.$refs.betting.reset()
        }
      }
      this.$store.dispatch('setOrderList', []);
      if (this.cartList.length > 0) {
        return
      }
      this.isShowOrder = false;
    },
    //滑动删除orders的一个item
    removeOrder(index) {
      let orders = this.orderList;
      orders = orders.filter((item, i) => i !== index);
      console.log(orders);
      if (orders.length === 0) {
        this.isShowOrder = false;
      }
      this.$store.dispatch('setOrderList', orders);
    },
    switch1Change(item, index) {
      let msg = '';
      if (index === 4) {
        if (this.cartList.length > 0) {
          uni.showToast({
            title: '购物车有订单时无法关闭',
            icon: "none"
          })
          return
        }
        this.menuList[index].isOpen = !item.isOpen;
        this.playing.setStorage(this.menuListStoregeKey, this.menuList);
        if (this.menuList[index].isOpen) {
          msg = "购物车开启";
        } else {
          msg = "购物车关闭";
        }
      } else if (index === 5) {
        this.menuList[index].isOpen = !item.isOpen;
        this.playing.setStorage(this.menuListStoregeKey, this.menuList);
        if (this.menuList[index].isOpen) {
          msg = "快速投注开启";
        } else {
          msg = "快速投注关闭";
        }
      } else if (index === 6) {
        this.menuList[index].isOpen = !item.isOpen;
        this.playing.setStorage(this.menuListStoregeKey, this.menuList);
        if (this.menuList[index].isOpen) {
          msg = "记忆投注金额开启";
        } else {
          msg = "记忆投注金额关闭";
          this.playing.removeStorage('amount');
        }
      } else if (index === 7) {
        this.menuList[index].isOpen = !item.isOpen;
        this.playing.setStorage(this.menuListStoregeKey, this.menuList);
        if (this.menuList[index].isOpen) {
          msg = "咪牌开启";
        } else {
          msg = "咪牌关闭";
          this.playing.removeStorage('amount');
        }
      }
      uni.showToast({
        title: msg,
        icon: "none"
      })
      ////console.log(this.menuList);
    },
    onShowMenu() {
      this.isShowMenu = !this.isShowMenu;
      this.menuList = this.playing.getStorage(this.menuListStoregeKey) ? this.playing.getStorage(this.menuListStoregeKey) : this.menuList;
      ////console.log(this.menuList);
    },
    closeMenu() {
      this.isShowMenu = false;
    },
    /**
     * websocket 新增区域
     * */
    doUpdateHeaderInfoFromSocket(webscoektMessageData) {
      let content = webscoektMessageData.msgTxt;
      if (!content) return console.error("websocket push message error . msgTxt faild");
      try {
        content = JSON.parse(content);
      } catch (e) {
        return console.error("websocket push message error . msgTxt JSON parse error");
      }
      // console.log("set headInfo", content)
      if (this.headInfo.lotteryNo < content.lotteryNo && this.menuList[7].isOpen && content.stampType !== 3) {
        this.getBettingList();
        if (this.isShowMiPai) {
          this.$refs.mipai.reset()
        } else {
          this.isShowMiPai = true;
          this.$refs.mipai.init();
        }
      }
      this.headInfo = content;
      if (content.stampType === 1 && content.msgDetail) {
        this.isCloseBuy = true;
      }
      this.setRewardsTimeOut(this.headInfo.closeTimeStamp)
      this.playing.setStorage('lotteryNo', { lotteryNo: content.nextNo });
    },
    doCommitUpdateEventBySocket() {
      let socketInitStruct = { event: "getGameInfo", lotteryId: this.lotteryId };
      websocetObj.sendMsg(socketInitStruct);
    },

    /**
     * 获取聊天室链接参数
     */
    initChatRoomUrl() {
      let _this = this;
      getChatRoomInfo({ lotteryId: this.lotteryId }).then((res) => {
        _this.chatRoomUrl = res.result;
      });
      // this.chatRoomUrl = `https://vnlive.club/external/toChatRoom/v1?userId=${10000000 + this.userInfo.id % 10000}`;//"http://192.168.0.106:8082/#/?appKey=i6a5mjyqii0lak7w92&time=123456789&secret=fcbdb3612cefcf9cd3022009478a738a&userId=10005248&roomId=CHAT_8f79c34dbd71475ea6559fe15c72ebee";
    }
  }
}

</script>
<style lang="scss" scoped>
.nav-bar:before {
  content: "";
  width: 100%;
  height: 80rpx;
  background: linear-gradient(90deg, #00638d 30%, #0a3c77);
  position: absolute;
  z-index: -1
}

.elevenOutOfFive-board {
  overflow: hidden;
  position: relative;
  //height: var(--vh);
  display: flex;
  flex-direction: column;

  .error-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 54rpx;
    gap: 30rpx;
    width: 540rpx;
    height: 380rpx;
    background: #FFFFFF;
    border-radius: 10rpx;

    .title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      gap: 10rpx;
      width: 500rpx;
      height: 60rpx;
      border-bottom: 1rpx solid #DDDDDD;
      flex: none;
      order: 0;
      flex-grow: 0;
      font-size: 32rpx;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #9A9A9A;
    }

    .content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 30rpx 0 50rpx;
      gap: 10rpx;
      width: 406rpx;
      height: 160rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #222222;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10rpx 74rpx;
      gap: 20rpx;
      background: #FF9900;
      border-radius: 264rpx;
      font-size: 26rpx;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #FFFFFF;
    }
  }

  .modal-content {
    font-size: 28rpx;
    text-align: center;
    letter-spacing: -1rpx;
    color: #333333;
    height: 179rpx;
    padding-top: 79rpx;
  }

  .confirm-div {
    width: 540rpx;
    height: 874rpx;
    padding: 20rpx 38rpx;

    .header {
      width: 100%;
      text-align: center;
      height: 60rpx;
      border-bottom: 2rpx solid #E6E6E6;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 40rpx;
      color: #9A9A9A;
    }

    .list-box {
      padding-top: 20rpx;
      height: 660rpx;

      .title {
        display: flex;
        justify-content: space-between;

        .name {
          font-weight: 400;
          font-size: 28rpx;
          line-height: 39rpx;
          color: #333333;
        }

        .period {
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
          text-align: right;
          color: #9A9A9A;
        }
      }

      .list-row {
        padding-top: 30rpx;
        height: 500rpx;

        .list-item {
          margin-bottom: 20rpx;

          .played {
            font-weight: 400;
            font-size: 28rpx;
            line-height: 39rpx;
            color: #333333;
          }

          .number {
            font-weight: 400;
            font-size: 25rpx;
            line-height: 35rpx;
            color: #39788D;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .note-box {
            font-weight: 400;
            font-size: 28rpx;
            line-height: 39rpx;
            color: #333333;

            .note {
              margin-right: 24rpx;
            }
          }
        }
      }

    }

    .count-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64rpx;
      line-height: 64rpx;
      border-top: 2rpx solid #E6E6E6;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 34rpx;
      text-align: center;
      color: #000000;

      .note-total,
      .moeney-total {
        margin: 0 8rpx 0 8rpx;
        color: #FF9900;
      }
    }

    .btn-box {
      display: flex;
      justify-content: space-evenly;

      .cancel,
      .confirm-act {
        border-radius: 264rpx;
        height: 60rpx;
        width: 200rpx;
        text-align: center;
        color: #FFFFFF;
        line-height: 60rpx;
      }

      .cancel {
        background: #8CB2C9;
      }

      .confirm-act {
        background: #FF9900;
      }

      .confirm-act-close {
        border-radius: 264rpx;
        height: 60rpx;
        width: 200rpx;
        text-align: center;
        color: #FFFFFF;
        line-height: 60rpx;
        background: #CCCCCC;
      }
    }

  }

  .top-header {
    .live-container {
      width: 100%;
      height: 326rpx;
      background: #000000;

      .video {
        height: 100%;
      }
    }

    .nav-title {
      font-weight: 500;
      font-size: 32rpx;
      letter-spacing: -1rpx;
      color: #E6E9EB;
    }

    .nav-right {
      display: flex;

      .balance {
        display: flex;
        justify-content: center;

        .balance-text {
          font-weight: 400;
          font-size: 26rpx;
          text-align: right;
          letter-spacing: -0.5rpx;
          color: #FFFF99;
        }

        image {
          width: 36rpx;
          height: 36rpx;
        }
      }

      .balance.refresh {
        image {
          animation: mymove 1s infinite;
          /*Safari 和 Chrome:*/
          -webkit-animation: mymove 5s infinite;
        }
      }

      @keyframes mymove {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      .menu {
        height: 40rpx;
        width: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .board:before {
      content: "";
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #00638d 30%, #0a3c77);
      position: absolute;
      z-index: -1
    }

    .board {
      background-image: url("./../../static/img/liuhe/five/bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      height: 245rpx;
      box-sizing: border-box;

      .board-content {
        display: flex;
        width: 100%;
        height: 245rpx;

        .board-content-item-left {
          width: 543rpx;
          flex: 2;

          .top {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 35.5rpx 0;

            text {
              font-size: 26rpx;
            }
          }
        }

        .board-content-item {
          flex: 1;
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
        }
      }

      .mask {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 480px;
        margin: auto;
        height: calc(var(--vh) - 40px);
        z-index: 11;
      }

      .show-menu {
        position: absolute;
        right: 0;
        top: 0;
        width: 270rpx;
        background: #FFF;
        padding: 0 4rpx 0 4rpx;
        z-index: 11;

        .show-menu-item {
          height: 80rpx;
          width: 100%;
          line-height: 80rpx;
          border-bottom: 2rpx solid #F1F1F1;
          font-size: 28rpx;
          color: #535353;

          .item-content {
            display: flex;

            .item-name {
              width: 118rpx;
            }

            .item-user {
              width: 200rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .switch {
              width: 45rpx;

              .custom-switch {
                margin-left: 36rpx;

                .custom-switch-close {
                  width: 45rpx;
                  height: 30rpx;
                }

                .custom-switch-open {
                  width: 45rpx;
                  height: 30rpx;
                }

                image {
                  width: 100%;
                  height: 100%;
                }
              }
            }

            .item-icon {
              line-height: 80rpx;
              height: 80rpx;
              width: 40rpx;
              margin: 0 15rpx 0 12rpx;
              display: flex;
              justify-content: center;
              align-items: center;

              image {
                width: 40rpx;
                height: 40rpx;
              }
            }
          }
        }
      }

      .ball-list {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        // margin-left: 87.19rpx;
        justify-content: center;
        align-items: center;

        .ball-list-item {
          position: relative;
          width: 73.72rpx;
          height: 80rpx;

          .ball-num {
            text {
              background: linear-gradient(180deg, #FFFFFF 23.02%, #b5ceee 78.57%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
              // text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.25);
              font-size: 30rpx;
              font-weight: bold;
            }

            position: absolute;
            width: 73.72rpx;
            height: 80rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url("./../../static/img/liuhe/ssc/ball.png");
            background-position: center;
            background-size: 100% 100%;
          }
        }

      }

      .close-ball-list {
        display: flex;
        width: 100%;
        justify-content: center;
        padding: 0 21rpx 0 21rpx;

        .close-ball-item {
          background-image: url("./../../static/img/liuhe/ssc/ball.png");
          background-position: center;
          background-size: 100% 100%;
          font-size: 28rpx;
          width: 73.72rpx;
          height: 80rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;

          text {
            background: linear-gradient(180deg, #FFFFFF 23.02%, #b5ceee 78.57%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            // text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.25);
            font-size: 30rpx;
            font-weight: bold;
          }
        }

        .close-ball-item-add {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8rpx;

          image {
            width: 40rpx;
            height: 40rpx;
          }
        }
      }

      .result-detail {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        // margin-left: 87.19rpx;
        justify-content: center;
        align-items: center;
        font-size: 26rpx;
        text-align: center;
        letter-spacing: -0.5px;
        color: rgba(255, 255, 255, 0.6);
      }

      .top {
        color: #fff;
        font-size: 28rpx;
        text-align: center;

        // padding: 42.5rpx;
        .status {
          border: 2rpx solid #fff;
          border-radius: 26rpx;
          padding: 2rpx 10rpx;
          margin-left: 28rpx;
          font-size: 24rpx;
        }
      }

      .info {
        font-size: 28rpx;
        color: #fff;
        padding-top: 32rpx;
        text-align: center;

        .line1 {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 7rpx;

          .live-text {
            color: #F5A225;
            font-weight: 400;
            font-size: 22.5rpx;
            /* identical to box height */

            text-align: center;
            letter-spacing: -1rpx;
            margin-left: 7.5rpx;
          }

          image {
            width: 41rpx;
            height: 36rpx;
          }
        }

        .line2 {
          font-size: 26rpx;

          text {
            margin: 0 8rpx 0 8rpx;
          }
        }

        .line3 {
          color: #416B9C;
          font-size: 26rpx;
        }

        .line4 {
          letter-spacing: -0.5px;
          /*text-shadow: 0 10rpx 0 #000000;*/
          font-weight: 500;
          font-size: 50rpx;
          margin-bottom: 38rpx;
          width: 200rpx;
        }
      }
    }
  }

  .history-div {
    height: 0;
    overflow-y: scroll;
    transition: .3s;
  }

  .history-div.active {
    height: 640rpx;
    transition: .3s;
  }

  .tab {
    display: flex;
    position: relative;
    width: 100%;
    border-bottom: 2rpx solid #0099CC;

    .show-records {
      position: absolute;
      width: 100%;
      height: 24rpx;
      top: -12rpx;
      display: flex;
      justify-content: center;

      //left: 50%;
      //transform: translate(-50%, 0);
      //background: #333333;
      image {
        width: 150rpx;
      }
    }

    .tab-item {
      flex: 1;
      text-align: center;
      height: 74rpx;
      line-height: 74rpx;
      background-color: #DEEAFA;
      font-size: 28rpx;
      color: #458198;
      font-weight: 400;
    }

    .tab-item.selected {
      font-weight: 500;
      font-size: 30rpx;
      color: #03536E;
      background-image: linear-gradient(to bottom, #FEFEFF, #DFEBFB);
    }
  }

  .tab-content.active {
    height: calc(100% - 500px);
    transition: .3s;
  }

  .tab-content {
    height: 100%;
    transition: .3s;
    display: flex;
    flex-direction: column;

    .bet-list {
      //height: 100%;
      background: #deeafa;
      flex: 1;
      height: 100%;
    }

    .bet-list.active {
      //height: calc(var(--vh) - 730rpx);
    }

    .add-chart.up {
      height: fit-content;
      width: 100%;
      // position: absolute;
      //  bottom: 0;
      // z-index: 2;
      //transition: .3s;
    }

    .add-chart {
      //bottom: -262rpx;
      height: 0rpx;
      width: 100%;
      // position: absolute;
      transition: all .3s linear;
      overflow: hidden;
    }

  }

}

.chat-room-unlogin {
  margin-top: 200rpx;
  text-align: center;
  font-size: 24rpx;
  color: grey;
}
</style>
