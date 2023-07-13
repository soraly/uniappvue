<template>
    <view>
        <scroll-view class="lottery-page" :scroll-y="isScrollY" :scroll-top="scrollTop" :enable-flex="true"
            :scroll-with-animation="false" @scroll="scroll" :style="{ marginTop: safeHeight }"
            :data-scrollTop="scrollTop + '>' + oldScrollTop">
            <nav-bar :title="title" :titleStyle="titleStyle" :isBack="false" :headerStyle="headerStyle" :leftWidth="160">
                <block slot="left">
                    <view class="avatar" v-if="isLogin">
                        <template @click="toUserInfo">
                            <image @click="goToUrl('/pages/liuhe/setting/userInfo')"
                                :src="userInfo.headImgUrl || detailLogo">
                            </image>
                            <view class="username" v-if="isEnd && $store.state.appInfoStore.userInfo.userBalance > 1000">
                                {{ parseFloat($store.state.appInfoStore.userInfo.userBalance).toLocaleString() }}
                            </view>
                            <u-count-to class="username" :decimals="2" :start-val="0"
                                :end-val="$store.state.appInfoStore.userInfo.userBalance" @end="isEnd = true"
                                v-else-if="!userInfoLoading"></u-count-to>
                        </template>
                        <uni-icons type="loop" size="18" color="#fff" :class="{ loading: userInfoLoading }"
                            @click="freshUserBanlance"></uni-icons>
                    </view>
                    <view v-else class="login" @click="toLogin">登录/注册</view>
                </block>
                <block slot="right">
                    <view class="gift">
                        <view class="shiwan" v-if="!isLogin" @click="testLogin">试玩</view>
                    </view>
                </block>
            </nav-bar>
            <!--轮播图区域-->
            <view class="caculation-top-box">
                <view class="banner-box" :style="{ height: bannerBoxHeight }">
                    <view class="back-row"></view>
                    <view class="top-box">
                        <view class="top-item">
                            <view class="carousel-div">
                                <uni-swiper-dot :info="carousel" :current="current" :dots-styles="dotsStyles"
                                    field="content" :mode="'dot'">
                                    <swiper class="swiper-box" @change="change" :interval="3000" :circular="true"
                                        :autoplay="true">
                                        <swiper-item v-for="(item, index) in carousel" :key="index">
                                            <view class="swiper-item">
                                                <image :src="item.img" :mode="'widthFix'" @click="openLink(item)"></image>
                                            </view>
                                        </swiper-item>
                                    </swiper>
                                </uni-swiper-dot>
                                <view class="online-box">在线：{{ $store.state.playingStore.onlineNum }}</view>
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

                <!-- 公告 -->
                <view class="notice-box">
                    <view class="notice">
                        <!-- <uni-icons type="sound" size="24" color="#1794FF"></uni-icons> -->
                        <image src="/static/img/liuhe/index/yinliang.png" style="width: 40rpx;
height: 34rpx;"></image>
                        <view class="text">
                            <u-notice-bar mode="horizontal" color="#1794FF" :list="noticeInfoTexts"
                                :volume-icon="false"></u-notice-bar>
                        </view>
                        <view class="kf" @click="goToUrl('/pages/user/service/index')">
                            <image src="/static/img/liuhe/index/kefu.png"></image>
                            <text class="text">客服</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="lottery-box">
                <view class="lottery-row">
                    <view id="nav-div" class="nav-div" :class="{ isTop: isTop }">
                        <scroll-view class="nav-scroll" scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation
                            @scroll="handleScroll">
                            <view id="nav-row" class="nav-row">
                                <view ref="refCategorys" v-for="(item, index) in nav" class="nav-item"
                                    :class="{ 'active': select == index }" @click="selectNav(index, item)">
                                    <image class="nav-image" mode="heightFix"
                                        :src="item.imgs.length ? select == index ? item.imgs[1] : item.imgs[0] : ''" />
                                    <view :class="{ 'nav-text': select - 1 != index }">{{ item.name }}</view>
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                    <view v-if="distanceX > 0" class="load-text">{{ loadText }}</view>
                    <view class="menu" :style="{ position: 'relative', left: `${distanceX}px` }" :class="{ isTopH: isTop }">
                        <!-- <view class="menu" :style="{ position: 'relative', left: `${distanceX}px` }" :class="{ isTopH: isTop }"
                        @touchstart="onTouchStartScroll" @touchmove="onTouchMoveScroll" @touchend="onTouchEndScroll"> -->
                        <view class="lottery_bg lottery lotterys data-box" name="lottery_01"
                            v-if="category.dataType == '0'">
                            <view :class="{
                                'firstClass': item.firstClass,
                                'afterClass': item.afterClass,
                                'four-item-box': item.styleType == '2',
                                'one-item-box': item.styleType == '3'
                            }" v-for="(item, index) in data">
                                <lottery-list @openLoginPop="openLoginPop" v-if="item.styleType == '1'" :data="item.data">
                                </lottery-list>
                                <FourItem @openLoginPop="openLoginPop" v-else-if="item.styleType == '2'" :data="item.data">
                                </FourItem>
                                <OneItem @openLoginPop="openLoginPop" v-else :data="item.data"></OneItem>
                            </view>
                        </view>
                        <view class="category-item" :class="{
                            template4: category.styleType == '4',
                            template3: category.styleType == '3' || category.styleType == '2',
                            template2: category.styleType == '1',
                        }" v-else-if="category.dataType == '3' || category.dataType == '4'">
                            <CategoryItem class="data-type3" v-if="!isLoadMore" @collectSuccess="collectSuccess"
                                :isShow="true" :item="item" v-for="(item, index) in data" />
                        </view>
                        <view v-else class="lottery"
                            :class="{ lottery_bg: category.styleType != 2, categorys: category.styleType == 2, lotterys: category.styleType != 2 }"
                            name="lottery_02" :isTop="isTop" :isTopNav="isTopNav">
                            <Category ref="cate" @openLoginPop="openLoginPop" @scrolltoupper="scrolltoupper"
                                :data-height="'calc(var(--vh) - 92rpx - 60rpx - 180rpx)'" :isTop="isTop"
                                :gameCategoryId="category.dataCategoryId" :isShow="true" v-if="category.styleType == 2"
                                :data="data" />
                            <view class="lottery-list-box" v-else>
                                <lottery-list @openLoginPop="openLoginPop" v-for="(item, index) in data"
                                    :data="item.lotteries" :isShow="true" :title="item.typeName + '系列'"
                                    v-if="item.typeName"></lottery-list>
                            </view>
                            <!--      <recommend v-else-if="category.styletype == 2" :data="item.dataList"></recommend>-->
                            <!--      <Electron @openLoginPop="openLoginPop" v-else :data="item.dataList" />-->

                        </view>
                        <topicon :startPostion="isHand ? 2 : 3" :iconWidth="110" :iconHeight="100"
                            iconPath="/static/img/top2.png" :marginBottom="0" :marginTop="50" :marginLeft="10"
                            :marginRight="10" @tapIcon="top" v-show="isTopNav && category.styleType == 2"></topicon>
                        <!-- <view class="goTop" :class="{ left: isHand }" v-show="isTopNav && category.styleType == 2"
                            @click="top">
                            <image src="/static/img/top.png"></image>
                        </view> -->
                        <view class="loding" v-if="isLoadMore">
                            <image src="/static/img/liuhe/load.gif"></image>
                            <text class="text">正在加载更多数据...</text>
                        </view>

                        <empty img="/static/img/img_none_jl 1.png" size="400"
                            style="height: fit-content;margin-top: 200rpx;" v-else-if="!isLoadMore && !data.length"></empty>
                    </view>
                    <view v-if="distanceX < 0" class="load-text load-text-right">{{ loadText }}</view>
                </view>
            </view>
            <!--底部导航栏-->
            <view class="footer">
                <component :is="componentTabbar" :current="componentTabbar === 'TabBarAll' ? '2' : '0'" />
            </view>


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

            <TestLogin ref="testLogin"></TestLogin>

        </scroll-view>
        <HomePop v-if="$config.station !== 'ALL'" />
        <alert-inject-layer></alert-inject-layer>
    </view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";
import TabBarLiuhe from '@/components/Tabbar/Liuhe'
import TabBarAll from "@/components/common/tabbar/TabBar";
import TestLogin from "@/components/common/PopItem/TestLogin";
import Empty from '@/components/common/empty/empty'

import LotteryList from "@/pages/liuhe/common/LotteryList";
import OneItem from "@/pages/liuhe/common/OneItem";
import FourItem from "@/pages/liuhe/common/FourItem";
import Recommend from "@/pages/liuhe/common/Recommend";
import Category from "@/pages/liuhe/common/Category";
import CategoryItem from "@/pages/liuhe/common/CategoryItem";
import HomePop from "@/pages/liuhe/common/HomePop";

import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

import { advertList, notice, demoLogin } from "@/utils/common/index";
import { categories, categoryData } from "@/utils/lottery/betting";
import { init, userNewlyPlay } from "@/utils/lottery/mine";
import { style2GameCollectList } from "@/utils/lottery/list"
import Playing from '@/utils/common/playing';
import topicon from '@/components/gwh-backTopIcon/gwh-backTopIcon.vue'
import { config } from '@/config/config.js'

export default {
    name: "index",
    components: {
        HomePop,
        topicon,
        NavBar,
        TabBarLiuhe,
        TabBarAll,
        TestLogin,
        LotteryList,
        OneItem,
        FourItem,
        Recommend,
        Category,
        CategoryItem,
        Empty,
        AlertInjectLayer
    },
    data() {
        return {
            componentTabbar: 'TabBarAll',
            componentTabbarMap: {
                'ALL': 'TabBarAll',
                'LIUHE': 'TabBarLiuhe'
            },
            playing: new Playing(),
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: '购彩大厅',
            headerStyle: {
                backgroundColor: '#1794FF',
            },
            objHeight: {
                header: 0,
                nav: 0
            },
            titleStyle: {
                'font-weight': 500,
                'font-size': '32rpx',
                'line-height': '45rpx',
                'color': '#FFFFFF'
            },
            msg: '',
            // isLogin: false,
            detailLogo: '', //默认图
            bannerBoxHeight: '',
            onlineNum: 0, //在线人数
            carousel: [], //轮播图
            current: 0,
            dotsStyles: { //轮播图指示点样式
                width: 3,
                height: 3,
                bottom: 5,
                backgroundColor: 'rgba(235, 237, 240, 0.5)',
                border: '0px rgba(235, 237, 240, 0.5) solid',
                color: '#fff',
                selectedBackgroundColor: 'rgba(255, 255, 153, 0.9)',
                selectedBorder: '0px rgba(255, 255, 153, 0.9) solid'
            },
            isTest: 0,
            //公告
            noticeInfo: [],
            noticeInfoTexts: [],
            category: {},
            isScrollY: true,
            isTop: 0,
            scrollTop: 0,
            oldScrollTop: 0,
            isTopNav: 0,
            select: 0,
            nav: [],
            history: [],
            data: [],
            debugTopScroll: 0,
            demoUserInfo: {},
            userInfoLoading: false,
            isEnd: false,
            isLoadMore: false,
            loadText: '',
            isChangeData: false,
            startX: 0,
            moveX: 0,
            distanceX: 0,
            scrollLeft: 0,
            scrollWidth: 500,

            memCaculationTopHeight: -1,
            isHand: false,
            lastFreshBalanceNum: 0,
        }
    },
    onPageScroll(res) {
        this.debugTopScroll = res.top;
    },
    computed: {
        //是否登录
        isLogin() {
            return this.$store.state.appInfoStore.userInfo != null;
        },
        userInfo() {
            return this.$store.state.appInfoStore.userInfo;
        },

        //菜单
        menus() {
            const data = [
                {
                    icon: '/static/img/liuhe/index/cun.png',
                    name: '充值',
                    islogin: true,
                    url: '/pages/pay/index'
                },
                {
                    icon: '/static/img/liuhe/index/qu.png',
                    name: '提现',
                    islogin: true,
                    url: '/pages/withdraw/index'
                },
                {
                    icon: '/static/img/liuhe/index/dating.png',
                    name: '游戏大厅',
                    islogin: false,
                    url: '/pages/liuhe/list'
                },
                {
                    icon: '/static/img/liuhe/index/jilu.png',
                    name: '优惠',
                    islogin: false,
                    url: '/pages/liuhe/activity/index'
                },
                {
                    icon: '/static/img/liuhe/index/qianbao.png',
                    name: '钱包',
                    islogin: true,
                    url: '/pages/user/wallet/index'
                },
            ]
            if (config.station !== 'ALL') {
                return data.filter(item => item.name !== '游戏大厅')
            }
            return data
        }

    },
    watch: {
        '$route.path': {
            handler() {
                this.isHand = this.playing.getStorage('isHand')
            },
            immediate: true
        },
        select() {
            //this.top()
        }
    },
    methods: {
        _onShow() {
            // this.isLogin = global.isLogin()
            if (isLogin()) {
                this.getInit()
                this.GetGameCollectList()
            }
            if (this.msg) {
                pop(this.msg, 2000)
                this.msg = ''
            }
            this.$nextTick(function () {
                this.getHight()
            })
            this.top()
        },
        _onLoad(option) {
            this.componentTabbar = this.componentTabbarMap[config.station || 'ALL']
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.documentElement.style.setProperty('--scrollbar-display', 'none');
            } else {
                document.documentElement.style.setProperty('--scrollbar-display', 'block');
            }
            uni.hideTabBar()
            uni.$on('emitParams', data => {
                this.msg = data.msg
            })
            this.isTest = option.istest ? option.istest : 0
            if (this.isTest && !isLogin()) {
                this.testLogin()
            }
            this.setConfig()
            this.getAd()
            this.getCategories()
            this.getNotice()

        },
        onTouchStartScroll(event) {
            this.startX = event.touches[0].clientX;
        },
        onTouchMoveScroll(event) {
            this.moveX = event.touches[0].clientX;
            this.distanceX = (this.moveX - this.startX) / 10;
            const absDistanceX = Math.abs(this.distanceX)
            if (this.distanceX > 0 && this.select === 0 || this.distanceX < 0 && this.select === this.nav.length - 1) {
                this.isChangeData = false
                return
            }
            if (absDistanceX > 10 && absDistanceX < 20) {
                this.loadText = `继续${this.distanceX > 0 ? '右' : '左'}拉加载${this.distanceX > 0 ? '左' : '右'}一个分类`
                this.isChangeData = false
            } else if (absDistanceX > 15) {
                this.loadText = `松开加载${this.distanceX > 0 ? '左' : '右'}一个分类`
                this.isChangeData = true
            }
        },
        onTouchEndScroll() {
            if (this.isChangeData) {
                if (this.distanceX > 0) {
                    this.select--
                    this.scrollLeft -= 50
                } else if (this.distanceX < 0) {
                    this.select++
                    this.scrollLeft += 50
                }
                this.selectNav(this.select, this.nav[this.select])
            }

            this.distanceX = 0;
            this.startX = 0;
            this.loadText = ''
            this.isChangeData = false
        },
        // getUserInfo() {
        //刷新用户剩余金额
        freshUserBanlance() {
            let _this = this;

            // this.userInfo = uni.getStorageSync('userInfo');
            _this.userInfoLoading = true
            //超时处理
            let timeOutTicker = setTimeout(function () {
                _this.userInfoLoading = false
            }, 2000);
            this.$store.dispatch("updateUserBalanceFromServer").then(function (result) {
                _this.isEnd = false;
                clearTimeout(timeOutTicker);
                setTimeout(() => {
                    _this.userInfoLoading = false
                }, 500);
            })

        },
        goToUrl(url) {
            uni.navigateTo({ url: url })
        },
        toDemoLogin() {
            let _this = this;
            demoLogin().then(res => {
                if (res.code == 200) {
                    this.demoUserInfo = res;
                    uni.setStorageSync('userInfo', res.result.user);
                    uni.setStorageSync('token', res.result.token);
                    // this.isLogin = true;
                    // this.userInfo = res.result.user;
                    _this.$store.dispatch("initUserInfo");
                }
            })
        },
        setConfig() {
            let configData = uni.getStorageSync('config')
            try {
                configData.forEach((item, index) => {
                    if (item.type == 24) {
                        this.detailLogo = item.url
                        throw Error();
                    }
                })
            } catch (err) {
            }
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
            this.scrollTop = this.oldScrollTop;
            //当视图渲染结束 重新设置为0
            this.$nextTick(() => {
                this.isScrollY = true
                this.isTopNav = 0
                this.isTop = 0
                this.scrollTop = 0
            });
        },
        scrolltoupper() {
            this.isScrollY = true
            this.isTopNav = 0;
            this.top();
        },
        //滚动条监听
        scroll: function (e) {
            let headerH = this.objHeight.header
            let navH = this.objHeight.nav
            this.oldScrollTop = e.detail.scrollTop;
            const query = uni.createSelectorQuery().in(this).select('#nav-div');
            query.boundingClientRect(data => {
                if (data.top <= uni.getStorageSync('systemInfo').safeArea.top + 0 + headerH) {
                    this.isTop = 1;
                } else {
                    this.isTop = 0
                }
            }).exec();
            if (this.category.styleType == 2) {
                const nav = uni.createSelectorQuery().in(this).select('.data-box');
                nav.boundingClientRect(data => {
                    if (data.top <= uni.getStorageSync('systemInfo').safeArea.top + 0 + headerH + navH) {
                        this.isTopNav = 1
                        this.isScrollY = false
                    } else {
                        this.isTopNav = 0
                        this.isScrollY = true
                    }
                }).exec();
            }
        },
        //获取基础信息
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
        //试玩登录
        testLogin() {
            let _this = this;
            let sys = {}
            uni.getSystemInfo({
                success: function (res) {
                    sys = res
                }
            })
            let prams = {
                deviceId: sys.deviceId,
                phoneType: sys.deviceType
            }
            demoLogin(prams).then(res => {
                if (res.code == 200) {
                    uni.setStorageSync('userInfo', res.result.user);
                    uni.setStorageSync('token', res.result.token);
                    this.$refs.testLogin.showPop()
                    // this.isLogin = global.isLogin()
                    // this.userInfo = res.result.user
                    _this.$store.dispatch("initUserInfo");
                    return false
                } else {
                    pop(res.message, 2000)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //去登录页面
        toLogin() {
            uni.navigateTo({ url: "/pages/liuhe/login" })
        },
        toUserInfo() {
            uni.navigateTo({ url: "/pages/liuhe/setting/userInfo" })
        },
        //打开登录
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
        //获取广告图
        getAd() {
            let prams = {
                projectType: 2,
                code: 7,
            }
            advertList(prams).then(res => {
                if (res.code == 200) {
                    this.carousel = res.result
                } else {
                    pop(res.message, 2000)
                }
            }).catch(err => {
            })
        },
        //广告图切换事件
        change(e) {
            this.current = e.detail.current
        },
        //判断是否试玩登录
        isTestUser() {
            if (this.userInfo.userType == "demo") {
                uni.$emit('showPop', { refName: 'AlertTestMsg', })
                return false
            }
            return true
        },
        async toUrl(item) {
            if (!isLogin() && item.islogin == true) {
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

            if (item.name == "充值" || item.name == "提现" || item.name == "钱包") {
                if (!this.isTestUser()) return
            }

            if (item.name == '提现') {
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
        //获取公告
        getNotice() {
            let prams = {
                position: 4
            }
            notice(prams).then(res => {
                if (res.code == 200) {
                    this.noticeInfoTexts = res.result.map(item => item.noticeContent.replace(/\n/g, ""));
                    this.noticeInfo = res.result
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //获取菜单
        getCategories() {
            const data = uni.getStorageSync('categories') || []
            if (data.length) {
                this.nav = data
                this.category = this.nav[0]
                this.getCategoryData()
                categories().then(res => {
                    const imgs = [
                        [require('@/static/img/liuhe/index/category/0_0.png'), require('@/static/img/liuhe/index/category/0_1.png')],
                        '',
                        [require('@/static/img/liuhe/index/category/2_0.png'), require('@/static/img/liuhe/index/category/2_1.png')],
                        [require('@/static/img/liuhe/index/category/3_0.png'), require('@/static/img/liuhe/index/category/3_1.png')],
                        [require('@/static/img/liuhe/index/category/4_0.png'), require('@/static/img/liuhe/index/category/4_1.png')],
                        [require('@/static/img/liuhe/index/category/5_0.png'), require('@/static/img/liuhe/index/category/5_1.png')],
                        [require('@/static/img/liuhe/index/category/6_0.png'), require('@/static/img/liuhe/index/category/6_1.png')],
                        [require('@/static/img/liuhe/index/category/7_0.png'), require('@/static/img/liuhe/index/category/7_1.png')],
                        [require('@/static/img/liuhe/index/category/8_0.png'), require('@/static/img/liuhe/index/category/8_1.png')],
                        [require('@/static/img/liuhe/index/category/9_0.png'), require('@/static/img/liuhe/index/category/9_1.png')],
                    ]
                    res.result.forEach(item => {
                        item.imgs = imgs[item.id] || []
                    });
                    uni.setStorageSync('categories', res.result)
                    this.nav = res.result
                }).catch(err => {
                    console.log(err)
                })
            } else {
                categories().then(res => {
                    const imgs = [
                        [require('@/static/img/liuhe/index/category/0_0.png'), require('@/static/img/liuhe/index/category/0_1.png')],
                        '',
                        [require('@/static/img/liuhe/index/category/2_0.png'), require('@/static/img/liuhe/index/category/2_1.png')],
                        [require('@/static/img/liuhe/index/category/3_0.png'), require('@/static/img/liuhe/index/category/3_1.png')],
                        [require('@/static/img/liuhe/index/category/4_0.png'), require('@/static/img/liuhe/index/category/4_1.png')],
                        [require('@/static/img/liuhe/index/category/5_0.png'), require('@/static/img/liuhe/index/category/5_1.png')],
                        [require('@/static/img/liuhe/index/category/6_0.png'), require('@/static/img/liuhe/index/category/6_1.png')],
                        [require('@/static/img/liuhe/index/category/7_0.png'), require('@/static/img/liuhe/index/category/7_1.png')],
                        [require('@/static/img/liuhe/index/category/8_0.png'), require('@/static/img/liuhe/index/category/8_1.png')],
                        [require('@/static/img/liuhe/index/category/9_0.png'), require('@/static/img/liuhe/index/category/9_1.png')],
                    ]
                    res.result.forEach(item => {
                        item.imgs = imgs[item.id] || []
                    });
                    uni.setStorageSync('categories', res.result)
                    this.nav = res.result
                    this.category = this.nav[0]
                    this.getCategoryData()
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        handleScroll(e) {
            this.scrollWidth = e.detail.scrollWidth
            this.scrollLeft = e.detail.scrollLeft
        },
        //选择菜单
        selectNav(index, item) {
            // let sIndex = 0
            // if (this.select < index) {
            //     sIndex = index === this.nav.length - 1 ? this.nav.length - 1 : index + 1
            // } else {
            //     sIndex = index === 0 ? 0 : index - 1
            // }
            // const sIndexData = this.$refs.refCategorys[sIndex].$el.getBoundingClientRect()
            // let x = sIndexData.x
            // let width = sIndexData.width
            // const query = uni.createSelectorQuery().in(this);
            // query.select('.lottery-page').boundingClientRect(data => {
            //     x -= data.left
            //     if (x + 20 > data.width) {
            //         this.scrollLeft += x + 10 - data.width + width
            //     } else if (x < 0) {
            //         this.scrollLeft += x - 10
            //     }
            // }).exec();

            const { x, width } = this.$refs.refCategorys[index].$el.getBoundingClientRect()

            const query = uni.createSelectorQuery().in(this);
            query.select('.lottery-page').boundingClientRect(data => {
                const left = x - data.left + index * 5
                if (left < data.width / 2 && this.scrollLeft > 0) {
                    this.scrollLeft -= width + 10
                } else if (left > data.width / 2 && this.scrollLeft + data.width < this.scrollWidth) {
                    this.scrollLeft += width + 10
                }
            }).exec();


            this.select = index
            this.category = item;
            if (this.category.styleType != 2) {
                this.isTopNav = 0;
                this.data = []
                this.isScrollY = true;
                if (this.isTop) {
                    this.resetPageMenuInNavTop();
                }
            }


            if (item.dataType === '3') {
                this.getHistory()
            } else if (item.dataType === '4') {
                this.GetGameCollectList()
            } else {
                this.getCategoryData();
            }


        },
        GetGameCollectList() {
            this.isLoadMore = true
            const data = uni.getStorageSync('categoryData') || {}
            if (data[this.category.id]) {
                this.data = data[this.category.id]
                this.isLoadMore = false
            } else {
                style2GameCollectList().then(res => {
                    this.data = res.result
                    const data = uni.getStorageSync('categoryData') || {}
                    data[this.category.id] = res.result
                    uni.setStorageSync('categoryData', data)
                    this.isLoadMore = false
                }).catch(err => {

                })
            }
        },
        resetPageMenuInNavTop() {
            let _this = this;
            if (!this.isTop) return;
            if (this.memCaculationTopHeight != -1) {
                this.scrollTop = this.oldScrollTop;
                this.$nextTick(function () {
                    _this.scrollTop = _this.memCaculationTopHeight;
                })
            };
            const query = uni.createSelectorQuery().in(this).select('.caculation-top-box');
            query.boundingClientRect(data => {
                _this.memCaculationTopHeight = data.height;
                _this.scrollTop = this.oldScrollTop;
                _this.$nextTick(function () {
                    _this.scrollTop = _this.memCaculationTopHeight;
                })
            }).exec();
        },

        collectSuccess(item) {
            uni.setStorageSync('gameListByPlatformCateId', {})
            uni.setStorageSync('categoryData', {})
        },
        //获取历史玩的
        getHistory() {
            this.isLoadMore = true
            const data = uni.getStorageSync('categoryData') || {}
            if (data[this.category.id]) {
                this.data = data[this.category.id]
                this.isLoadMore = false
            }
            userNewlyPlay().then(res => {
                if (res.code == 200) {
                    this.data = res.result.map(item => {
                        return {
                            ...item,
                            logo: item.icon,
                            id: item.data?.gameId,
                            platformId: item.data?.platformId,
                            code: item.data?.code,
                            platformCateId: item.data?.platformCateId
                        }
                    })
                    const data = uni.getStorageSync('categoryData') || {}
                    data[this.category.id] = this.data
                    uni.setStorageSync('categoryData', data)
                    this.isLoadMore = false
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getuserNewlyPlay() {

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
            let url = '';
            if (item.lotteryTypeId == 4) {
                let isLive = item.isLive ? 1 : 0
                url = '/pages/liuhe/liuhePlaying?id=' + item.lotteryId + "&isLive=" + isLive
            } else if (item.lotteryTypeId == 29) {
                url = '/pages/liuhe/airship?id=' + item.lotteryId
            } else if (item.lotteryTypeId == 28) {
                url = '/pages/liuhe/kuaisan?id=' + item.lotteryId
            } else {
                url = '/pages/liuhe/shishicai?id=' + item.lotteryId
            }
            uni.navigateTo({
                url: url,
                success: function (res) {
                    res.eventChannel.emit('argParams', {
                        id: that.id
                    })
                }
            })
        },
        //获取彩票列表
        getCategoryData() {
            const data = uni.getStorageSync('categoryData') || {}
            if (data[this.category.id]) {
                this.data = data[this.category.id]
            }
            let prams = {
                'categoryId': this.category.id
            };
            categoryData(prams).then(res => {
                if (res.code == 200) {
                    const imgs = {
                        '0_0': [require('@/static/img/liuhe/index/category/c_0_0_0.png'), require('@/static/img/liuhe/index/category/c_0_0_1.png')]
                    }
                    res.result.forEach(item => {
                        item.imgs = imgs[item.id] || []
                    });
                    res.result.forEach((item, k) => {
                        if (item.styleType === 1) {
                            if (k === 0) {
                                item.firstClass = true
                            }
                            if (k === res.result.length - 1) {
                                item.afterClass = true
                            }
                            if (k > 0 && item.styleType !== res.result[k - 1].styleType) {
                                item.firstClass = true
                            }
                            if (k < res.result.length - 1 && item.styleType !== res.result[k + 1].styleType) {
                                item.afterClass = true
                            }
                        }
                    });
                    this.data = res.result
                    const data = uni.getStorageSync('categoryData') || {}
                    data[this.category.id] = res.result
                    uni.setStorageSync('categoryData', data)
                }
            }).catch(err => {
                console.log(err)
            })
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
        goList() {
            uni.navigateTo({
                url: "./list"
            })
        },
    }
}
</script>

<style lang="scss" scoped>
:root {
    --scrollbar-display: 'block'
}

/deep/ .input-view {
    margin: auto 0;
}

.lottery-list-box {
    .top-mask {
        height: 98px;
        top: 0px;
        background: #eff6fe;
        position: fixed;
        z-index: 1;
        width: calc(100vw);
        max-width: calc(480px);
    }
}

.lottery-page {
    height: var(--vh);
    font-family: 'PingFang SC';

    /deep/ {
        .uni-navbar__header-btns-right {
            width: fit-content !important;
        }
    }

    //导航栏用户名
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
            max-width: 180rpx;
            width: fit-content;
            margin: 0 16rpx;
            font-size: 30rpx !important;
            color: #FFFF99 !important;
            overflow: hidden;
            /*超出隐藏*/
            text-overflow: ellipsis;
            /*隐藏后添加省略号*/
            white-space: nowrap;
            /*强制不换行*/
        }

        .loading {
            animation: rotation 3s infinite linear;
        }

        @keyframes rotation {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
    }

    //未登录样式
    .login {
        font-weight: 400;
        font-size: 30rpx;
        color: #FFFFFF;
    }

    //导航栏右侧
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

    //轮播图
    .banner-box {
        height: auto;
        position: relative;

        .back-row {
            height: 256rpx;
            background: #1794ff;
        }

        .top-box {
            position: absolute;
            top: 0;
            width: 100%;

            .top-item {
                margin: 0px;

                .carousel-div {
                    position: relative;
                    padding: 0rpx;
                    height: 256rpx;

                    .swiper-box {
                        height: 256rpx;

                        .swiper-item {
                            height: 100%;
                            padding: 0rpx;
                            background: #1794ff;
                            vertical-align: center;
                            // border-radius: 10rpx;

                            image {
                                width: 100%;
                                height: 100%;
                                // border-radius: 10rpx;
                            }
                        }
                    }

                    .online-box {
                        position: absolute;
                        height: 40rpx;
                        line-height: 38rpx;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 100rpx;
                        font-style: normal;
                        font-size: 24rpx;
                        color: #FFFFFF;
                        top: 20rpx;
                        right: 20rpx;
                        padding: 5rpx 20rpx;
                    }
                }

                .menu-div {
                    display: flex;
                    margin-top: 20rpx;

                    .menu-row {
                        display: flex;
                        flex: 1;
                        justify-content: space-between;
                        padding: 0rpx 45rpx;

                        .menu-col {
                            .menus-item {
                                text-align: center;

                                .img {
                                    background: #FFFFFF;
                                    border-radius: 20rpx;
                                    width: 96rpx;
                                    height: 96rpx;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    margin: auto;
                                    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.2);

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

    // 公告
    .notice-box {
        padding: 20rpx;
        padding-bottom: 0;

        .notice {
            background: #FFFFFF;
            border-radius: 50rpx;
            display: flex;
            align-items: center;
            padding: 10rpx 20rpx;

            .text {
                flex: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                /deep/ .u-notice-bar {
                    padding: 0 !important;
                }
            }

            .kf {
                display: flex;
                align-items: center;

                image {
                    height: 48rpx;
                    width: 48rpx;
                    margin-left: 10rpx;
                }

                .text {
                    font-weight: 500;
                    font-size: 25rpx;
                    color: #999;
                    margin-left: 10rpx;
                }
            }
        }
    }

    //游戏区域
    .lottery-box {
        display: flex;
        flex-direction: column;

        .lottery-row {
            .nav-div {
                padding: 0 20rpx;

                scroll-view ::v-deep {
                    &::-webkit-scrollbar {
                        display: var(--scrollbar-display);
                        height: 0;
                    }

                    &::-webkit-scrollbar-thumb {
                        border-radius: 10rpx;
                        box-shadow: inset 0 0 5rpx #bebebe !important;
                        background: #bebebe !important;
                    }

                    &:hover::-webkit-scrollbar {
                        height: 10rpx !important;
                    }
                }

                .nav-row {
                    display: flex;
                    padding: 20rpx 0;
                    padding-bottom: 10rpx;

                    .nav-item {
                        width: 110rpx;
                        height: 90rpx;
                        margin-right: 10rpx;
                        display: flex;
                        flex-shrink: 0;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-size: 24rpx;
                        color: #1794FF;
                        background: #fff;
                        box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
                            0rpx 1rpx 2rpx 0rpx rgba(0, 0, 0, 0.10),
                            0rpx 3rpx 3rpx 0rpx rgba(0, 0, 0, 0.09),
                            0rpx 6rpx 4rpx 0rpx rgba(0, 0, 0, 0.05),
                            0rpx 11rpx 4rpx 0rpx rgba(0, 0, 0, 0.01),
                            0rpx 17rpx 5rpx 0rpx rgba(0, 0, 0, 0.00);
                        border-radius: 10px;

                        .nav-image {
                            max-width: 50rpx;
                            height: 44rpx;
                        }

                        .nav-text {
                            margin-top: 5rpx;
                        }
                    }

                    .active {
                        background: linear-gradient(180deg, #20B5FA 0%, #059ED9 100%);
                        color: #FFFFFF;
                    }
                }
            }

            .isTop {
                position: sticky;
                top: 92rpx;
                padding: 0 20rpx;
                margin-bottom: 20rpx;
                z-index: 12;
                background: #fff;
            }

            .menu {
                padding: 0 20rpx;
                padding-bottom: 10rpx;
                overflow: hidden;

                .lottery_bg {
                    border-radius: 10rpx;
                }

                .category-item {
                    display: grid;
                    gap: 20rpx;
                    padding-bottom: 20rpx;
                }

                .template4 {
                    grid-template-columns: repeat(4, 1fr);
                }

                .template3 {
                    grid-template-columns: repeat(3, 1fr);
                }

                .template2 {
                    grid-template-columns: repeat(2, 1fr);
                }

                .loding {
                    background: #EFF6FE;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    image {
                        width: 100rpx;
                        height: 100rpx;
                    }

                    .text {
                        font-weight: 400;
                        font-size: 24rpx;
                        color: #555555;
                    }
                }

                .data-box {
                    display: flex;
                    flex-direction: column;

                    .one-item-box,
                    .lottery-list-box,
                    .four-item-box {
                        margin: 10rpx 0;
                    }

                    .firstClass {
                        margin-top: 10rpx;
                    }

                    .afterClass {
                        margin-bottom: 10rpx;
                    }
                }
            }

            .load-text {
                font-weight: 400;
                font-size: 24rpx;
                color: #555555;
                text-align: center;
                writing-mode: tb-rl;
                position: fixed;
                top: 60%;
                left: 10rpx;
                z-index: 1;
            }

            .load-text-right {
                right: 10rpx;
            }

            .lotteryDiv {
                height: calc(var(--vh) - 92rpx - 60rpx - 50px);
            }

            .goTop {
                position: absolute;
                right: 20rpx;
                bottom: 46px;
                z-index: 20;

                image {
                    height: 58rpx;
                    width: 58rpx;
                }
            }

            /deep/ .icon {
                border-radius: 10rpx;
            }

            .left {
                left: 10px;
            }
        }
    }

    .isTopH {
        min-height: calc(var(--vh) - 92rpx - 60rpx);
        position: relative;
    }

    .xufu {
        height: calc(var(--vh) - 92rpx - 50px);
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

    .footer {
        height: 50px;
    }

    .data-type3 {
        width: 162.5rpx;
        height: 212.5rpx;

        /deep/ .list-item {
            width: 162.5rpx;

            .image {
                width: 162.5rpx;
                height: 162.5rpx;
            }
        }
    }
}
</style>
