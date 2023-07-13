<template>
    <scroll-view class="lottery-page" :scroll-y="isScrollY" :scroll-top="scrollTop" :enable-flex="true"
        :scroll-with-animation="true" @scroll="scroll" :style="{ marginTop: safeHeight }">
        <nav-bar :fontColor="'#FFFFFF'" :title="title" :titleStyle="titleStyle" :isBack="!showTabBar"
            :headerStyle="headerStyle">
        </nav-bar>
        <view class="search">
            <view class="search-item">
                <uni-search-bar
                    style="padding: 0;box-shadow: 0px -4rpx 4rpx rgba(66, 175, 153, 0.25);height: 60rpx;border-radius: 10rpx;"
                    v-model="name" @confirm="search" @clear="clear" :searchHeigth="'60rpx'" :radius="10"
                    :iconStyle="{ padding: '0 0 0 16rpx' }"
                    :placeholderStyle="'font-size: 24rpx;color: rgba(37, 98, 86, 0.75);margin-left:0;font-weight: 400;'"
                    placeholder="搜索" cancelButton="none" bgColor="#FFFFFF">
                    <uni-icons slot="searchIcon" color="rgba(37, 98, 86, 0.75)" style="font-size: 34rpx;font-weight: 400;"
                        size="18" type="search" />
                </uni-search-bar>
            </view>
        </view>
        <!--轮播图区域-->
        <view class="banner-box" :style="{ height: bannerBoxHeight }">
            <view class="back-row"></view>
            <view class="top-box">
            </view>
        </view>


        <view class="lottery-box">
            <view class="lottery-row">
                <view id="nav-div" class="nav-div" :class="{ isTop: isTop }">
                    <scroll-view class="nav-scroll" scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation>
                        <view id="nav-row" class="nav-row">
                            <view v-for="(item, index) in nav" class="nav-item" :class="{ 'active': select == index }"
                                @click="selectNav(index, item)">
                                <image class="nav-image" mode="heightFix"
                                    :src="item.imgs.length ? select == index ? item.imgs[1] : item.imgs[0] : ''" />
                                <view :class="{ 'nav-text': select - 1 != index }">{{ item.name }}</view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view v-if="distanceX > 0" class="load-text">{{ loadText }}</view>
                <view class="menu"
                    :style="{ paddingBottom: !showTabBar ? '10rpx' : '110rpx', position: 'relative', left: `${distanceX}px` }"
                    :class="{ isTopH: isTop }">
                    <view class="lottery_bg lottery lotterys data-box" name="lottery_01" v-if="category.dataType == '0'"
                        style="margin-top: 3px;">
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
                    <view class="category-item"
                        :class="{ template3: category.dataType == '4', template4: category.dataType == '3' }"
                        v-else-if="category.dataType == '3' || category.dataType == '4'">
                        <CategoryItem v-if="!isLoadMore" @collectSuccess="collectSuccess" :isShow="true" :item="item"
                            v-for="(item, index) in data" />
                    </view>
                    <view v-else class="lottery"
                        :class="{ lottery_bg: category.styleType != 2, categorys: category.styleType == 2, lotterys: category.styleType != 2 }"
                        name="lottery_02">
                        <Category ref="cate" @openLoginPop="openLoginPop" @scrolltoupper="scrolltoupper"
                            :data-height="'calc(var(--vh) - 92rpx - 60rpx - 120rpx)'" :isTop="isTopNav"
                            :gameCategoryId="category.dataCategoryId" :isShow="true" v-if="category.styleType == 2"
                            :data="data" :name="name" />
                        <view class="lottery-list-box" v-else>
                            <lottery-list @openLoginPop="openLoginPop" v-for="(item, index) in data" :data="item.lotteries"
                                :isShow="true" :title="item.typeName + '系列'" v-if="item.typeName"></lottery-list>
                        </view>
                    </view>
                    <view class="goTop" v-show="isTopNav && category.styleType == 2" @click="top">
                        <image src="/static/img/top.png"></image>
                    </view>
                    <view class="loding" v-if="isLoadMore">
                        <image src="/static/img/liuhe/load.gif"></image>
                        <text class="text">正在加载更多数据...</text>
                    </view>

                    <empty v-else-if="!isLoadMore && !data.length"></empty>
                </view>
                <view v-if="distanceX < 0" class="load-text load-text-right">{{ loadText }}</view>
            </view>
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

        <TabBar :current="1" v-if="showTabBar" />
        <TestLogin ref="testLogin"></TestLogin>
        <AlertInjectLayer />
    </scroll-view>
</template>
  
<script>
import NavBar from "@/components/common/navBar/navBar";
import TabBar from '@/components/Tabbar/Liuhe'
import TestLogin from "@/components/common/PopItem/TestLogin";
import Empty from '@/components/common/empty/empty'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

import LotteryList from "@/pages/liuhe/common/LotteryList";
import OneItem from "@/pages/liuhe/common/OneItem";
import FourItem from "@/pages/liuhe/common/FourItem";
import Recommend from "@/pages/liuhe/common/Recommend";
import Category from "@/pages/liuhe/common/CategoryGame";
import CategoryItem from "@/pages/liuhe/common/CategoryItem";
import HomePop from "@/pages/liuhe/common/HomePop";

import { advertList, notice, demoLogin } from "@/utils/common/index";
import { categories, categoryData } from "@/utils/lottery/list"
import { init, userNewlyPlay } from "@/utils/lottery/mine";
import { style2GameCollectList } from "@/utils/lottery/list"

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
        CategoryItem,
        Empty
    },
    props: {
        showTabBar: Boolean
    },
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: '游戏大厅',
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
            name: '',
            msg: '',
            isLogin: false,
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
            isLoadMore: false,
            loadText: '',
            isChangeData: false,
            startX: 0,
            moveX: 0,
            distanceX: 0,
            scrollLeft: 0
        }
    },
    onPageScroll(res) {
        this.debugTopScroll = res.top;
    },
    watch: {
        select() {
            this.top()
        }
    },
    methods: {
        _onLoad(option) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.documentElement.style.setProperty('--scrollbar-display', 'none');
            } else {
                document.documentElement.style.setProperty('--scrollbar-display', 'block');
            }
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
            this.getNotice()
        },
        _onShow() {
            this.isLogin = global.isLogin()
            if (this.isLogin) {
                this.userInfo = uni.getStorageSync('userInfo');
                this.getInit()
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
        getUserInfo() {
            this.userInfoLoading = true
            this.userInfo = uni.getStorageSync('userInfo');
            setTimeout(() => {
                this.userInfoLoading = false
            }, 500);
        },
        goToUrl(url) {
            uni.navigateTo({ url: url })
        },
        toDemoLogin() {
            demoLogin().then(res => {
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
        search() {
            this.getCategoryData()
        },
        clear() {
            this.name = ''
            this.getCategoryData()
        },
        //获取菜单
        getCategories() {
            const data = uni.getStorageSync('categoriesGame') || []
            if (data.length) {
                this.nav = data
                this.category = this.nav[0]
                this.getCategoryData()
                categories().then(res => {
                    const imgs = [
                        '',
                        [require('@/static/img/liuhe/index/category/0_0.png'), require('@/static/img/liuhe/index/category/0_1.png')],
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
                    uni.setStorageSync('categoriesGame', res.result)
                    this.nav = res.result
                }).catch(err => {
                    console.log(err)
                })
            } else {
                categories().then(res => {
                    const imgs = [
                        '',
                        [require('@/static/img/liuhe/index/category/0_0.png'), require('@/static/img/liuhe/index/category/0_1.png')],
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
                    uni.setStorageSync('categoriesGame', res.result)
                    this.nav = res.result
                    this.category = this.nav[0]
                    this.getCategoryData()
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        //选择菜单
        selectNav(index, item) {
            this.name = ''
            this.select = index
            this.category = item
            if (this.category.styleType != 2) {
                this.isTopNav = 0;
                this.data = []
                this.isScrollY = true;
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
            const data = uni.getStorageSync('categoryDataGame') || {}
            if (data[this.category.id]) {
                this.data = data[this.category.id]
                this.isLoadMore = false
            } else {
                style2GameCollectList().then(res => {
                    this.data = res.result
                    const data = uni.getStorageSync('categoryDataGame') || {}
                    data[this.category.id] = res.result
                    uni.setStorageSync('categoryDataGame', data)
                    this.isLoadMore = false
                }).catch(err => {

                })
            }
        },
        collectSuccess(item) {
            uni.setStorageSync('gameListByPlatformCateIdGame', {})
            uni.setStorageSync('categoryDataGame', {})
        },
        //获取历史玩的
        getHistory() {
            this.isLoadMore = true
            const data = uni.getStorageSync('categoryDataGame') || {}
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
                    const data = uni.getStorageSync('categoryDataGame') || {}
                    data[this.category.id] = this.data
                    uni.setStorageSync('categoryDataGame', data)
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
            uni.setStorageSync('lotteryNameTitleGame', {
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
                'categoryId': this.category.id,
                'name': this.name,
            };
            const data = uni.getStorageSync('categoryDataGame') || {}
            if (data[this.category.id]) {
                this.data = data[this.category.id]
            }
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
                    const data = uni.getStorageSync('categoryDataGame') || {}
                    data[this.category.id] = res.result
                    uni.setStorageSync('categoryDataGame', data)
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

/deep/ {
    .uni-navbar__header-container {
        justify-content: center;
    }

    .input-view {
        margin: auto 0;
    }
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
            max-width: 180rpx;
            width: fit-content;
            margin: 0 16rpx;
            font-size: 30rpx;
            color: #FFFFFF;
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

    .search {
        .search-item {
            padding: 30rpx 20rpx 0;
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
                        height: 10rpx !important;
                    }

                    &::-webkit-scrollbar-thumb {
                        border-radius: 10rpx;
                        box-shadow: inset 0 0 5rpx #bebebe !important;
                        background: #bebebe !important;
                    }
                }

                .nav-row {
                    display: flex;
                    padding: 10px 0;

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
                        color: #333;
                        background: #fff;
                        box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
                            0rpx 1rpx 2rpx 0rpx rgba(0, 0, 0, 0.10),
                            0rpx 4rpx 4rpx 0rpx rgba(0, 0, 0, 0.09),
                            0rpx 9rpx 5rpx 0rpx rgba(0, 0, 0, 0.05),
                            0rpx 15rpx 6rpx 0rpx rgba(0, 0, 0, 0.01),
                            0rpx 24rpx 7rpx 0rpx rgba(0, 0, 0, 0.00);
                        ;
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
                z-index: 1;
                background: #fff;
            }

            .menu {
                padding: 0 20rpx 110rpx;

                .lottery_bg {
                    border-radius: 10rpx;
                }

                .category-item {
                    display: grid;
                    gap: 30rpx;
                }

                .template3 {
                    grid-template-columns: repeat(3, 1fr);
                }

                .template4 {
                    grid-template-columns: repeat(4, 1fr);
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
}
</style>
  