<template>
    <view class="mint-tab-container-item home-div" :style="{ marginTop: safeHeight }">
        <nav-bar :headerStyle="{ backgroundColor: '#fff' }" :isBack="false">
            <block slot="left">
                <uni-icons @click="tiaozhuan1('/pages/picture/index')" type="search" color="#666" size="16"
                    style="font-weight: bold;margin-left: 10px" />
            </block>
            <view class="input-view" slot="title">{{ title }}</view>
            <block slot="right">
                <image @click="fenxiang" src="/static/img/index/fenxiang.png"
                    style="width:13px;height:13px;margin-right:10px;"></image>
            </block>
        </nav-bar>
        <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" show-scrollbar="true"
            scroll-with-animation="true" lower-threshold="700" @scrolltolower="lower" @scroll="scroll">

            <!--轮播图-->
            <uni-swiper-dot :info="listPicture" :current="current" field="content" mode="dot" :dotsStyles="dotsStyles">
                <swiper :circular="true" :autoplay="true" class="swiper-box" @change="changeSwiper" style="height: 280rpx">
                    <swiper-item v-for="(item, index) in listPicture" :key="index">
                        <view class="swiper-item" :id="'content-wrap' + index">
                            <image mode="widthFix" :src="item.img" style="width: 100%;" @click="openAd(item)"></image>
                        </view>
                    </swiper-item>
                </swiper>
            </uni-swiper-dot>
            <view role="alert" class="van-notice-bar" style="color: rgb(51, 51, 51); background: rgb(255, 255, 255);"
                @click="xinxi">
                <uni-icons type="sound-filled" size="14"
                    style="margin-right: 5px; color: rgb(239, 81, 81); font-size: 28rpx;background: #fff;z-index: 10;padding-left: 16px;"></uni-icons>
                <view role="marquee" class="van-notice-bar__wrap">
                    <view class="van-notice-bar__content" v-for="(item, index) in noticeList">{{ item.noticeContent }}
                    </view>
                </view>
            </view>
            <!--滚动条消息-->
            <!--开奖号位置-->
            <view class="block-lottery">
                <ul class="platform-list">
                    <li v-for="(item, index) in lotteryTime" :key="index" @click="cutover(item, index)">
                        <view :class="lotterytype == item.lotteryType ? 'item-body act' : 'item-body'">
                            <view class="title"><b>{{ item.lotteryName }}</b></view>
                            <view class="time"><span>{{ item.lotteryTimeMilli | getTime }}开奖</span></view>
                        </view>
                    </li>
                </ul>
                <view class="border-bg"></view>
                <view class="border-box">
                    <view class="border-box-body" v-if="lastLottery">
                        <lottery :lotteryDetail="lastLottery" :listStyle="{}">
                            <template v-slot:header></template>
                            <template v-slot:lottery></template>
                            <template v-slot:footer></template>
                        </lottery>
                    </view>
                </view>
            </view>
            <!--导航-->
            <view class="category-tr">
                <view class="category-icon van-row">
                    <view v-for="(item, index) in menulist" :key="index" class="van-col van-col--6"
                        @click="tiaozhuan(item)">
                        <view class="icon-text">
                            <view>
                                <view class="icon-bg">
                                    <image :src="item.icon" style="width: 96rpx; height: 96rpx;"></image>
                                </view>
                            </view>
                            <view class="text">{{ item.text }}</view>
                        </view>
                    </view>

                </view>
            </view>
            <!--列表日期-->
            <!--      <view class="body-image">
                    <view :class=" isTop == 1 ? 'van-sticky van-sticky&#45;&#45;fixed' : 'van-sticky'" id="year">
                        <scroll-view scroll-left="100" class="scroll-view_H" scroll-x="true" scroll-with-animation="true" show-scrollbar="false">
                          <view class="scroll-view-item_year" v-for="(item ,index) in listYear" :key="index" @click="picture(item)">
                            <view>
                              <view :class="item.color == 0 ? 'icon-bg gray' : 'icon-bg'">
                                <uni-icons type="image" size="30" style="line-height: 80rpx;color: #fff;"></uni-icons>
                              </view>
                            </view>
                            <view class="text">{{ item.name }}</view>
                          </view>
                        </scroll-view>
                    </view>
                    &lt;!&ndash;列表&ndash;&gt;
                    <view role="feed" class="van-list" id="list">
                      <view class="van-col van-col&#45;&#45;12" style="padding-right: 5px;">
                        <view class="image-item" v-for="(item,index) in leftArr" :key="index" @click="pictureDetail(item)">
                          <fast-lazy-load :radius="'8rpx'" :src="item.pictureUrl" :width="'100%'" mode="widthFix">
                          </fast-lazy-load>
                          <view class="image-item-title">{{ item.pictureName }}</view>
                        </view>
                      </view>
                      <view class="van-col van-col&#45;&#45;12" style="padding-right: 5px;">
                        <view class="image-item" v-for="(item,index) in rightArr" :key="index" @click="pictureDetail(item)">
                          <fast-lazy-load :radius="'8rpx'" :src="item.pictureUrl" :width="'100%'" mode="widthFix">
                          </fast-lazy-load>
                          <view class="image-item-title">{{ item.pictureName }}</view>
                        </view>
                      </view>
                    </view>
                  </view>-->

            <!--导航栏-->
            <view :style="navHeight > 0 ? 'height:' + navHeight + 'px' : ''">
                <view id="nav" :class="isTop == 1 ? 'tab-div-top tab-div' : 'tab-div'"
                    :style="isTop == 1 ? 'marginTop:' + safeHeight : ''">
                    <view class="tab-box">
                        <view class="nav">
                            <view v-for="(item, index) in navList" :key="index"
                                :class="lotteryType == item.lotteryType ? 'nav-item active' : 'nav-item'"
                                @click="selectLottery(item)">
                                {{ item.name }}
                            </view>
                        </view>
                    </view>
                    <view class="sort-box">
                        <span v-for="(item, index) in sortList" :key="index" :class="sort == index ? 'act' : ''"
                            @click="selectSort(index)">
                            {{ item }}
                        </span>
                    </view>
                </view>
            </view>
            <!--列表-->
            <view class="forum-body-bd">
                <view role="feed" class="van-list" style="">
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
                                            <image v-for="(val, key) in item.medalList" :key="key" :src="val"
                                                lazy-load="true"></image>
                                            <span class="reportInfo"></span>
                                        </view>
                                        <div class="time">{{ item.updateTime }}</div>
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
                                            <image src="@//static/img/forum/zd.png" style="width: 25px;"></image>
                                        </span>
                                        <span v-if="item.highQuality == 1">
                                            <image src="@//static/img/forum/jin.png" style="width: 25px;" class="icon">
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
                            <view class="text" :style="item.read == 1 ? 'color: rgb(153, 153, 153);' : ''"
                                @click="detail(item)">
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
                                                <fast-lazy-load :radius="'8rpx'" :src="val" :width="'100%'"
                                                    :height="'180rpx'" mode="aspectFill">
                                                    <template v-slot:loading>
                                                        <image class="lazy-image" :src="loadingImg"></image>
                                                    </template>
                                                    <template v-slot:error>
                                                        <image class="lazy-image" :src="loadingImg"></image>
                                                    </template>
                                                </fast-lazy-load>
                                                <view v-if="key == 2 && item.pictureList.length > 3" class="length">共{{
                                                    item.pictureList.length }}张
                                                </view>
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
                                        <img :src="'../../static/img/menu/' + item.lotteryType + '.png'" alt="">
                                        <span class="num">{{ lotteryName(item.lotteryType) }}</span>
                                    </view>
                                </view>
                            </view>
                        </li>
                    </ul>
                    <empty v-else></empty>
                    <view class="van-list__placeholder"></view>
                </view>
            </view>


            <view style="clear: both"></view>


            <!--      <view style="padding-top: 200rpx;"></view>-->
        </scroll-view>
        <!--底部彩种-->
        <!--    <view class="ft-icon-text">
              <div v-for="(item,index) in lotteryTime" :key="index"
                   @click="cutover(item,index)"
                   :class="lotterytype == item.lotteryType ? 'ft-icon-text-item text-act-item-' + index : 'ft-icon-text-item text-item-' + index ">
                <image :src=" lotterytype == item.lotteryType ? '/static/img/menu/act-' + item.lotteryType + '.png' : '/static/img/menu/' + item.lotteryType + '.png' " style="width: 44rpx;height: 44rpx;">
                </image>
                <view class="ft-text">{{ item.lotteryName }}</view>
              </div>
            </view>-->
        <!-- 分享 -->
        <uni-popup class="share" ref="share" type="share" safeArea backgroundColor="#fff">
            <share @closefx="closefx"></share>
        </uni-popup>
        <!--底部-->
        <view style="height: 55px">
            <component :is="componentTabbar" current="0" />
        </view>
        <!--悬浮菜单栏-->
        <fab></fab>
        <!--图片弹窗-->
        <cus-previewImg ref="cusPreviewImg" :list="ImgList" />

        <!--首页弹窗-->
        <!--        <uni-popup ref="placard" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
            <view style="width:100%">
                <placard @bindSee="bindSee"></placard>
            </view>
        </uni-popup>-->
        <HomePop />
        <AlertInjectLayer />
    </view>
</template>
<script>
import TabBarLuntan from '@/components/Tabbar/Luntan'
import TabBarAll from "@/components/common/tabbar/TabBar";
import NavBar from "@/components/common/navBar/navBar.vue";
import Fab from "@//components/common/fab/Fab";
import Share from "@//components/common/share/Share";
import Lottery from '@//components/common/lottery/Lottery'
import Empty from '@//components/common/empty/empty'
import Login from "@//components/common/login/Login";
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import Placard from "@//components/common/placard/placard";
import { home, list } from '@//utils/home/index.js';
import { lastLotteryRecord } from "@//utils/lottery/index.js"
import { listLatest } from '@//utils/forum/index.js'
import { concern } from '@//utils/user/index.js'
import { notice, advertList } from '@//utils/common/index'
import HomePop from "@/pages/liuhe/common/HomePop";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import { config } from '@/config/config.js'

export default {
    name: "Index",
    components: {
        AlertInjectLayer,
        TabBarLuntan,
        TabBarAll,
        Fab,
        Share,
        Lottery,
        Empty,
        Login,
        cusPreviewImg,
        NavBar,
        Placard,
        HomePop
    },
    data() {
        return {
            componentTabbar: 'TabBarAll',
            componentTabbarMap: {
                'ALL': 'TabBarAll',
                'LUNTAN': 'TabBarLuntan'
            },
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            current: 0,
            scrollTop: 0,
            loadingImg: '/static/img/zw.png',
            title: '六合图库',
            swiperHeight: 180,
            old: {
                scrollTop: 0,
                myScroll: 0,
            },
            navHeight: 0,
            curr: 0,
            isTop: 0,           //吸附判断
            status: 'more',    //触底加载状态
            page: 1,           //记录当前页码
            lotterytype: 2,     //彩票
            lotteryType: 0,     //
            isLoadMore: false,  //是否加载中
            //公告
            noticeList: '',
            //轮播图
            listPicture: [],
            //彩票类型
            lotteryTime: [],
            //菜单栏
            menulist: [
                {
                    icon: '/static/img/index/kaijiangxianchang.png',
                    text: '开奖直播',
                    // #ifdef APP-PLUS
                    url: '/pages/applive/Live',//打包app解开此行注释
                    // #endif
                    // #ifdef H5
                    url: '/pages/live/Live',//打包h5解开此行注释
                    // #endif
                    type: 1,
                },
                {
                    icon: '/static/img/index/jiaoliudating.png',
                    text: '高手论坛',
                    url: '/pages/forum/index',
                    type: 1,
                },
                {
                    icon: '/static/img/index/ziliaodaquan.png',
                    text: '资料大全',
                    url: '/pages/data/Index/Index',
                    type: 1,
                },
                {
                    icon: '/static/img/index/chaxunzhushou.png',
                    text: '查询助手',
                    url: '/pages/cxzs/index',
                    type: 1,
                },
                {
                    icon: '/static/img/index/ymjc.png',
                    text: '幽默猜测',
                    url: '/pages/vote/index',
                    type: 1,
                },
                {
                    icon: '/static/img/index/liuhetuku.png',
                    text: '六合图库',
                    url: '/pages/picture/index?show=1',
                    type: 1,
                },
                {
                    icon: '/static/img/index/zixuntongji.png',
                    text: '资讯统计',
                    url: '/pages/zxcount/liuhe',
                    type: 1,
                },
                {
                    icon: '/static/img/index/gongjubaoxiang.png',
                    text: '工具宝箱',
                    url: '/pages/toolbox/index',
                    type: 1,
                },
            ],
            dotsStyles: {
                bottom: 10,
                backgroundColor: 'rgb(235,237,240,0.7)',
                selectedBackgroundColor: 'white',
                selectedBorder: 'white'
            },
            //年份
            listYear: [],
            sortList: ['综合', '精华', '最多赞', '最新'],
            navList: [
                { lotteryType: 0, name: '全部' },
                { lotteryType: 2, name: '澳彩' },
                { lotteryType: 1, name: '港彩' },
                { lotteryType: 3, name: '台彩' },
                { lotteryType: 4, name: '新彩' }
            ],
            sort: 0,
            //列表
            leftArr: [],
            rightArr: [],
            list: [],
            ImgList: [],
            //开奖信息
            lastLottery: {}, //最后一次开奖信息
        }
    },
    methods: {
        _onLoad() {
            this.componentTabbar = this.componentTabbarMap[config.station || 'ALL']
            let _this = this;
            this.getSystem()
            uni.setNavigationBarTitle({
                title: this.title
            });
            this.lotterytype = uni.getStorageSync('lotteryType') ? uni.getStorageSync('lotteryType') : 1
            uni.setStorageSync('lotteryType', this.lotterytype);
            this.home();
            this.yearY()
            this.$nextTick(() => {
                this.setSwiperHeight();
            });
            this.listLatest()
            this.getNotice()

            // rewirte @mrz 此部分逻辑不通
            // 假设网络卡顿而当前页面又是立即加载 则此部分为空 不会在执行
            // let configData = uni.getStorageSync('config')
            // configData.forEach((item,index)=>{
            //     if(item.type == 23){
            //         this.loadingImg = item.url
            //     }
            //     if(item.type == 21){
            //         this.title = item.url
            //         uni.setNavigationBarTitle({
            //             title: this.title
            //         });
            //     }
            // })
            uni.$off("on-homepage-freshbyconfig");
            uni.$on("on-homepage-freshbyconfig", () => {
                _this.freshUIByConfigData();
            });
            this.freshUIByConfigData();
        },
        _onShow() {
            uni.hideTabBar()
            this.lotterytype = uni.getStorageSync('lotteryType') ? uni.getStorageSync('lotteryType') : 1
            this.getAdvertList()
            /*this.$nextTick(function () {
                let bindSee = this.getCache('bindSee')
                if (!bindSee) {
                    this.$refs.placard.open("center")
                }
            })*/
        },
        //从 服务器读取config 信息之后刷新页面
        freshUIByConfigData() {
            let configData = uni.getStorageSync('config');
            if (!configData) return console.warn("config data is not loaded");
            configData.forEach((item, index) => {
                if (item.type == 23) {
                    this.loadingImg = item.url
                }
                if (item.type == 21) {
                    this.title = item.url
                    uni.setNavigationBarTitle({
                        title: this.title
                    });
                }
            })
        },


        //获取设备信息
        getSystem() {
            uni.getSystemInfo().then(res => {
                uni.$system = res[1];
            })
        },
        bindSee(status = 0) {
            if (status == 1) {
                this.setCache('bindSee', 1, 60 * 60 * 1000);
            }
            this.$refs.placard.close()
        },
        /**
         *
         * @param {缓存key} key
         * @param {需要存储的缓存值} value
         * @param {过期时间，默认0表示永久有效} expire
         */
        setCache(key, value, expire = 0) {
            let obj = {
                data: value, //存储的数据
                time: Date.now() / 1000, //记录存储的时间戳
                expire: expire //记录过期时间，单位秒
            }
            uni.setStorageSync(key, JSON.stringify(obj))
        },
        /**
         *
         * @param {缓存key} key
         */
        getCache(key) {
            let val = uni.getStorageSync(key)
            if (!val) {
                return null
            }
            val = JSON.parse(val)
            if (val.expire && Date.now() / 1000 - val.time > val.expire) {
                uni.removeStorageSync(key)
                return null
            }
            return val.data
        },
        yearY: function () {
            this.$nextTick(function () {
                /*下次 DOM 更新时，找到某个控件，再进行复杂计算并确定其高度后*/
                uni.createSelectorQuery().select('#nav').boundingClientRect(res => {
                    this.old.myScroll = res.top - 50 + uni.getStorageSync('systemInfo').safeArea.top;
                    this.navHeight = res.height
                }).exec();
            });
        },
        openAd(item) {
            openUrl(item)
        },
        home: function () {
            let prams = { lotteryType: this.lotterytype }
            home(prams).then((res) => {
                let data = res.result
                this.lotteryTime = data.lotteryTimeList
                this.listYear = data.listYear
                let listLenth = data.listPicture.length
                let leftArr = [];
                let rightArr = [];
                for (let i = 0; i < listLenth; i++) {
                    if (i % 2 == 0) {
                        leftArr.push(data.listPicture[i])
                    } else {
                        rightArr.push(data.listPicture[i])
                    }
                }
                this.leftArr = leftArr
                this.rightArr = rightArr
                this.lastLottery = data.lastLotteryRecord
            }).catch(err => {
                console.log(err)
            })
        },
        GetList: function () {
            let prams = { pageNum: this.page, lotteryType: this.lotterytype }
            list(prams).then((res) => {
                let data = res.result.records
                let listLenth = data.length
                let leftArr = [];
                let rightArr = [];
                for (let i = 0; i < listLenth; i++) {
                    if (i % 2 == 0) {
                        leftArr.push(data[i])
                    } else {
                        rightArr.push(data[i])
                    }
                }
                this.leftArr.push(...leftArr)
                this.rightArr.push(...rightArr)
                this.isLoadMore = false
            }).catch(err => {
                console.log(err)
            })
        },
        //信息
        xinxi: function () {
            uni.navigateTo({
                url: '/pages/user/announcement',
            })
        },
        //选择彩票
        selectLottery: function (item) {
            this.lotteryType = item.lotteryType
            this.page = 1;
            this.list = [];
            this.listLatest()
        },
        selectSort: function (index) {
            this.sort = index
            this.page = 1;
            this.list = [];
            this.listLatest()
        },
        //开奖信息
        lastLotteryRecord: function () {
            let prams = { lotteryType: this.lotterytype }
            lastLotteryRecord(prams).then(res => {
                this.lastLottery = res.result
            }).catch(err => {
                console.log(err)
            })
        },
        listLatest: function () {
            let prams = {
                lotteryType: this.lotteryType,
                type: 3,
                sort: this.sort,
                speak: 0,
                pageNum: this.page,
                pageSize: 10
            }
            listLatest(prams).then(res => {
                if (res.result.records.length > 0) {
                    this.list.push(...res.result.records)
                }
                this.isLoadMore = false
            }).catch(err => {
                console.log(err)
            })
        },
        detail: function (item) {
            const that = this
            item.read = 1
            uni.navigateTo({
                url: '/pages/forum/detail?id=' + item.articleId + '&type=' + item.type + "&createTime=" + item.createTime,
                success: function (res) {
                    res.eventChannel.emit('argParams', {
                        lotteryType: that.lotteryType
                    })
                }
            })
        },
        //用户主页
        homepage: function (item) {
            uni.navigateTo({
                url: "/pages/user/homepage/homepage?userId=" + item.userId
            })
        },
        lotteryName: function (lotteryId) {
            let lotteryName = ''
            this.lotteryTime.forEach((item, index) => {
                if (item.lotteryType == lotteryId) {
                    lotteryName = item.name
                    return
                }
            })
            return lotteryName
        },
        getNotice() {
            let prams = { position: 1 }
            notice(prams).then(res => {
                this.noticeList = res.result
            }).catch(err => {
                console.log(err)
            })
        },
        getAdvertList() {
            let prams = {
                projectType: 1,
                code: 3,
            }
            this.listPicture = [];
            advertList(prams).then(res => {
                this.listPicture = res.result
            }).catch(err => {

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
        //年跳转
        picture: function (item) {
            let url = "/pages/picture/index?year=" + item.year + "&color=" + item.color
            uni.navigateTo({
                url: url,
            })
        },
        //图库详情
        pictureDetail: function (item) {
            let url = "/pages/picture/detail?id=" + item.pictureId
            uni.navigateTo({
                url: url,
            })
        },
        //跳转方法
        tiaozhuan: function (item) {
            var lotterytype = this.lotterytype
            uni.navigateTo({
                url: item.url,
                success: function (res) {
                    res.eventChannel.emit('argParams', {
                        lotteryType: lotterytype,
                    })
                }
            })
        },
        //跳转方法
        tiaozhuan1: function (item) {
            var lotterytype = this.lotterytype
            uni.navigateTo({
                url: item,
                success: function (res) {
                    res.eventChannel.emit('argParams', {
                        lotteryType: lotterytype,
                    })
                }
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
        //切换彩种
        cutover: function (item, index) {
            this.page = 1;
            this.lotterytype = item.lotteryType
            this.lotteryType = item.lotteryType
            this.curr = index
            uni.setStorageSync('lotteryType', this.lotterytype);
            this.home()
            this.page = 1;
            this.list = [];
            this.listLatest()
            //this.lastLotteryRecord()
        },
        //加载更多
        lower: function (e) {
            if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
                this.isLoadMore = true
                this.page += 1
                //this.GetList()
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
        //轮播图事件
        changeSwiper(e) {
            this.current = e.detail.current;
            //动态设置swiper的高度，使用nextTick延时设置
            /*this.$nextTick(() => {
              this.setSwiperHeight();
            });*/
        },
        //动态设置swiper的高度
        setSwiperHeight() {
            let element = "#content-wrap" + this.current;
            let query = uni.createSelectorQuery().in(this);
            query.select(element).boundingClientRect();
            query.exec((res) => {
                if (res && res[0]) {
                    this.swiperHeight = res[0].height;
                }
            });
        },
    }
}
</script>

<style scoped>
.header {
    height: 46px;
}

.scroll-Y {
    background-color: #eee !important;
    height: calc(var(--vh));
}

.input-view {
    margin: auto;
    color: #323233;
    font-weight: 500;
    font-size: 16px;
}

.block-lottery {
    position: relative;
}

.block-lottery .platform-list {
    overflow: hidden;
    padding: 12rpx 20rpx 0;
    background: #eee;
    display: flex;
    justify-content: space-between;
}

.block-lottery .platform-list li {
    width: 25%;
}

.block-lottery .platform-list li .item-body.act {
    background: #07c160;
    color: #fff;
}

.notic {
    margin-bottom: 0px;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 24rpx;
}

.block-lottery .platform-list li .item-body {
    background: #fff;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-radius: 16rpx 16rpx 0 0;
    padding: 10rpx 0;
    margin-right: 4rpx;
}

.block-lottery .platform-list li .item-body .title {
    font-size: 26rpx;
    padding-bottom: 10rpx;
}

.block-lottery .platform-list li .item-body .time {
    font-size: 24rpx;
    transform: translateZ(0);
}

.block-lottery .platform-list li .item-body .time span {
    transform: scale(.9);
    white-space: nowrap;
    transform-origin: 180rpx 0;
    left: 0;
}

.block-lottery .border-bg {
    position: absolute;
    height: 100rpx;
    background-color: #eee;
    left: 0;
    right: 0;
}

.block-lottery .border-box {
    padding: 0 16rpx 20rpx;
    background: #ffffff !important;
}

.block-lottery .border-box .border-box-body {
    padding: 20rpx;
    background-image: none;
    border: 2rpx solid #07c160;
    background-color: #fff;
    box-shadow: 4rpx 4rpx 10rpx #eee;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.border-box .border-box-body {
    position: relative;
    background-size: 100% 100%;
    border-radius: 10Px;
    height: 220rpx;
}

.category-tr {
    display: inline-block;
    height: auto;
    background: #eee;
    width: 100%;
    padding: 0 0 0rpx 0;
}

.category-icon {
    text-align: center;
    padding: 20rpx 0 20rpx 0;
    background: #fff;
    width: 100%;
    display: inline-block;
}

.van-col--6 {
    width: 25%;
}

.van-col {
    float: left;
    box-sizing: border-box;
    min-height: 1px;
}

.icon-text {
    display: inline-block;
    text-align: center;
    position: relative;
}

.category-icon .icon-bg {
    border-radius: 100%;
    text-align: center;
    display: inline-block;
    line-height: 30rpx;
}

.icon-text .text {
    padding: 16rpx 0;
    font-size: 28rpx;
    color: #555;
}

.body-image {
    background: #fff;
}

.scroll-view_H {
    white-space: nowrap;
    width: 100%;
}

.scroll-view-item_year {
    display: inline-block;
    width: 190rpx;
    text-align: center;
}

.van-sticky {
    background: #fff;
    padding-top: 10px;
}

.van-sticky .text {
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #555;
}

.van-sticky--fixed {
    position: fixed;
    top: 46px;
    z-index: 2;
    max-width: 480px;
}

.van-sticky .gray {
    background: #d8d8d8 !important;
}

.van-sticky .icon-bg {
    width: 86rpx;
    height: 86rpx;
    background: #20d497;
    border-radius: 100%;
    text-align: center;
    display: inline-block;
    line-height: 112rpx;
    margin-bottom: 10rpx;
}

.van-list {
    width: 100%;
    display: inline-block;
}

.van-list .image-item {
    width: 100%;
    margin: 5px 5px 5px 10px;
    text-align: center;
    box-shadow: 1px 1px 5px 1px hsl(0deg 25% 70% / 50%);
    border-radius: 5px;
    position: relative;
    border-top: 1Px solid #bbb;
    height: auto;
    display: inline-block;
}

.van-list .image-item-title {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 28rpx;
}

.ft-icon-text {
    display: flex;
    position: fixed;
    bottom: 50px;
    width: 100%;
    max-width: 480px;
}

.ft-icon-text .ft-icon-text-item {
    width: 25%;
    display: flex;
    height: 35px;
    border: 1Px solid;
    border-radius: 5px;
    background: #fff;
    font-size: 13px;
    margin-left: 3px;
    margin-right: 3px;
    margin-bottom: 5px;
    justify-content: center;
    align-items: center;
}

.ft-icon-text .text-item-0 {
    border-color: #07c160;
    color: #07c160;
}

.ft-icon-text .text-act-item-0 {
    background-color: #07c160;
    color: #fff;
}

.ft-icon-text .text-item-1 {
    border-color: #c10707;
    color: #c10707;
}

.ft-icon-text .text-act-item-1 {
    background-color: #c10707;
    color: #fff;
}

.ft-icon-text .text-item-2 {
    border-color: #0755c1;
    color: #0755c1;
}

.ft-icon-text .text-act-item-2 {
    background-color: #0755c1;
    color: #fff;
}

.ft-icon-text .text-item-3 {
    border-color: #b907c1;
    color: #b907c1;
}

.ft-icon-text .text-act-item-3 {
    background-color: #b907c1;
    color: #fff;
}

.ft-icon-text .ft-icon-text-item .ft-text {
    margin-left: 5px;
}


.van-notice-bar {
    padding: 0;
    color: #444;
    font-size: 22rpx;
    height: 60rpx;
}

.van-notice-bar {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    height: 60rpx;
    color: #ed6a0c;
    font-size: 26rpx;
    line-height: 48rpx;
    background-color: #fffbe8;
}

.van-notice-bar__wrap {
    display: flex;
    align-items: center;
    height: 100%;
    animation: scroll 30s linear infinite;
    /*滚动动画*/
}

.van-notice-bar__content {
    font-size: 24rpx;
    white-space: nowrap;
    display: inline-block;
    height: 100%;
    line-height: 60rpx;
    margin-right: 594rpx;
}

@keyframes scroll {
    from {
        transform: translateX(300px);
        /*div多宽就写多宽*/
    }

    to {
        transform: translateX(-100%);
    }
}

.forum-body-bd {
    padding: 0 0rpx;
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

.forum-body-bd .ntool img {
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

.tab-div-top {
    position: fixed;
    z-index: 1;
    background: #f8f8f8;
    width: 100%;
    top: 46px;
    max-width: 480px;
}

.sort-box {
    background-color: #fff;
    padding: 20rpx 20rpx 10rpx 20rpx;
    font-size: 28rpx;
}

.sort-box span {
    display: inline-block;
    margin-right: 40rpx;
    color: #797979;
}

.sort-box .act {
    color: #07c160;
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
</style>
