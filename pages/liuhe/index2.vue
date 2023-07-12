<template>
    <scroll-view class="lottery-page" :scroll-y="isScrollY" :scroll-top="scrollTop" :enable-flex="true"
        :scroll-with-animation="true" @scroll="scroll" :style="{ marginTop: safeHeight }">
        <nav-bar :title="title" :titleStyle="titleStyle" :isBack="false" :headerStyle="headerStyle" :leftWidth="110">
            <block slot="left">
                <view class="avatar" v-if="isLogin" @click="toUserInfo">
                    <image :src="userInfo.headImgUrl || detailLogo"></image>
                    <span class="username">{{ userInfo.nickname || userInfo.userName }}</span>
                </view>
                <view v-else class="login" @click="toLogin">登录/注册</view>
            </block>
            <block slot="right">
                <view class="gift">
                    <view class="shiwan" v-if="!isLogin" @click="testLogin">试玩</view>
                    <uni-icons @click="goList" type="search" style="font-size: 48rpx;color: #FFFFFF"></uni-icons>
                </view>
            </block>
        </nav-bar>
        <!--轮播图区域-->
        <view class="banner-box" :style="{ height: bannerBoxHeight }">
            <view class="back-row"></view>
            <view class="top-box">
                <view class="top-item">
                    <view class="carousel-div">
                        <uni-swiper-dot :info="carousel" :current="current" :dots-styles="dotsStyles" field="content"
                            :mode="'dot'">
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
        <!--公告-->
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
        </view>
        <view class="lottery-box">
            <view class="lottery-row">
                <view id="nav-div" class="nav-div">
                    <view id="nav-row" class="nav-row" :class="{ isTop: isTop }">
                        <view v-for="(item, index) in nav" :class="select == index ? 'nav-item active' : 'nav-item'"
                            @click="selectNav(index, item)">
                            <view :class="{ 'nav-text': select - 1 != index }">{{ item.name }}</view>
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
                <view class="menu" :class="{ isTopH: isTop }">
                    <view class="lottery lotterys" name="lottery_01" v-if="category.dataType == '0'"
                        style="margin-top: 3px;">
                        <view v-for="(item, index) in data">
                            <lottery-list @openLoginPop="openLoginPop" v-if="item.styleType == '1'" :data="item.data">
                            </lottery-list>
                            <FourItem @openLoginPop="openLoginPop" v-else-if="item.styleType == '2'" :data="item.data">
                            </FourItem>
                            <OneItem @openLoginPop="openLoginPop" v-else :data="item.data"></OneItem>
                        </view>
                    </view>
                    <view v-else class="lottery"
                        :class="{ categorys: category.styleType == 2, lotterys: category.styleType != 2 }"
                        name="lottery_02">
                        <!-- <view v-if="isTop" class="top-mask"></view> -->
                        <Category ref="cate" @openLoginPop="openLoginPop" @scrolltoupper="scrolltoupper"
                            :data-height="'calc(var(--vh) - 92rpx - 60rpx - 50px)'" :isTop="isTopNav"
                            :gameCategoryId="category.dataCategoryId" :isShow="false" v-if="category.styleType == 2"
                            :data="data" />
                        <view class="lottery-list-box" v-else>

                            <lottery-list v-for="(item, index) in data" :data="item.lotteries" :isShow="true"
                                :title="item.typeName + '系列'" v-if="item.typeName"></lottery-list>
                        </view>
                        <!--      <recommend v-else-if="category.styletype == 2" :data="item.dataList"></recommend>-->
                        <!--      <Electron @openLoginPop="openLoginPop" v-else :data="item.dataList" />-->

                    </view>
                    <view class="goTop" v-show="isTopNav && category.styleType == 2" @click="top">
                        <image src="/static/img/top.png"></image>
                    </view>
                </view>
            </view>
        </view>
        <!--底部导航栏-->
        <view class="footer">
            <tab-bar :current="'2'"></tab-bar>
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
        <AlertInjectLayer />
    </scroll-view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import TabBar from "../../components/common/tabbar/TabBar";
import TestLogin from "../../components/common/PopItem/TestLogin";

import LotteryList from "./common/LotteryList";
import OneItem from "./common/OneItem";
import FourItem from "./common/FourItem";
import Recommend from "./common/Recommend";
import Category from "./common/Category";
import HomePop from "./common/HomePop";

import { advertList, notice, demoLogin } from "../../utils/common/index";
import { categories, categoryData } from "../../utils/lottery/betting";
import { init, userNewlyPlay } from "../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
    name: "index",
    components: {
        AlertInjectLayer,
        NavBar,
        TabBar,
        HomePop,
        TestLogin,
        LotteryList,
        OneItem,
        FourItem,
        Recommend,
        Category,
    },
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: '购彩大厅',
            headerStyle: {
                backgroundColor: '#025F8D',
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
            isLogin: false,
            detailLogo: '', //默认图
            bannerBoxHeight: '',
            onlineNum: 0, //在线人数
            carousel: [], //轮播图
            current: 0,
            dotsStyles: { //轮播图指示点样式
                width: 4,
                height: 4,
                bottom: 17,
                backgroundColor: 'rgba(235, 237, 240, 0.5)',
                border: '0px rgba(235, 237, 240, 0.5) solid',
                color: '#fff',
                selectedBackgroundColor: 'rgba(255, 255, 153, 0.9)',
                selectedBorder: '0px rgba(255, 255, 153, 0.9) solid'
            },
            //菜单
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
                url: '/pages/liuhe/activity/index'
            },
            /*{icon:'../../static/img/liuhe/index/jilu.png',name:'购彩记录',islogin:false,url:'/pages/liuhe/history/index'},*/
            {
                icon: '../../static/img/liuhe/index/qianbao.png',
                name: '钱包管理',
                islogin: true,
                url: '/pages/user/wallet/index'
            },
            ],
            isTest: 0,
            //公告
            noticeInfo: [],
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
            demoUserInfo: {}
        }
    },
    onLoad(option) {
        uni.hideTabBar()
        uni.$on('emitParams', data => {
            this.msg = data.msg
        })
        this.isLogin = global.isLogin()
        this.isTest = option.istest ? option.istest : 0
        if (this.isTest && !this.isLogin) {
            this.testLogin()
        }
        this.setConfig()
        this.getAd()
        this.getCategories()
    },
    onPageScroll(res) {
        console.log(res)
        this.debugTopScroll = res.top;
    },

    onShow() {
        this.isLogin = global.isLogin()
        if (this.isLogin) {
            this.userInfo = uni.getStorageSync('userInfo');
            this.getInit()
            this.getHistory()
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
    methods: {
        toDemoLogin() {
            demoLogin().then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.demoUserInfo = res;
                    uni.setStorageSync('userInfo', res.result.user);
                    uni.setStorageSync('token', res.result.token);
                    this.isLogin = true;
                    this.userInfo = res.result.user;
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
                    this.isTop = 1
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
                    this.isLogin = global.isLogin()
                    this.userInfo = res.result.user
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

            if (item.name == "存款充值" || item.name == "取款提现" || item.name == "钱包管理") {
                if (!this.isTestUser()) return
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
        //获取公告
        getNotice() {
            let prams = {
                position: 4
            }
            notice(prams).then(res => {
                if (res.code == 200) {
                    this.noticeInfo = res.result
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //获取菜单
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
        //选择菜单
        selectNav(index, item) {
            this.select = index
            this.category = item
            console.log("selectNav", item);
            if (this.category.styleType != 2) {
                this.isTopNav = 0;
                this.data = []
                this.isScrollY = true;
            } else {

            }
            this.getCategoryData();
        },
        //获取历史玩的
        getHistory() {
            userNewlyPlay().then(res => {
                if (res.code == 200) {
                    this.history = res.result
                }
            }).catch(err => {
                console.log(err)
            })
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
            let prams = {
                'categoryId': this.category.id
            };
            categoryData(prams).then(res => {
                if (res.code == 200) {
                    this.data = res.result
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
    background: #EFF6FE;

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
            height: 140rpx;
            background: #025F8D;
        }

        .top-box {
            position: absolute;
            top: 0;
            width: 100%;

            .top-item {
                background: #FFFFFF;
                margin: 0px;
                // border-radius: 8rpx;

                .carousel-div {
                    position: relative;
                    padding: 0rpx;

                    .swiper-box {
                        .swiper-item {
                            padding: 0rpx;
                            // border-radius: 10rpx;

                            image {
                                width: 100%;
                                // border-radius: 10rpx;
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

    //公共区域
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
    }

    //游戏区域
    .lottery-box {
        display: flex;
        flex-direction: column;

        .lottery-row {
            .nav-div {
                // background: #FFFFFF;
                // height: 60rpx;
                // border-radius: 10rpx 10rpx 0 0;
                // margin: 0 20rpx;
                width: calc(100vw - 40rpx);
                max-width: calc(480px - 40rpx);
                top: 92rpx;
                z-index: 10;
                padding-left: 20rpx;
                padding-right: 20rpx;

                .nav-row {
                    display: flex;
                    height: 60rpx;
                    // border-radius: 10rpx 10rpx 0 0;
                    border-bottom: 2px solid #42AF99;

                    .nav-item {
                        width: 100%;
                        height: 60rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: 400;
                        font-size: 28rpx;
                        color: #0DA5E3;
                        background: #FFFFFF;

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
                    // background: #27fe1c;
                    width: calc(100vw - 0rpx);
                    max-width: calc(480px - 0rpx);
                    top: 46px;
                    z-index: 10;
                    margin-left: -20rpx;

                    .nav-item {
                        &:last-child {
                            border-top-right-radius: 0rpx;
                        }

                        &:first-child {
                            border-top-left-radius: 0rpx;
                        }
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
}
</style>
