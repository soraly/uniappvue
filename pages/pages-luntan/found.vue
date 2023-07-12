<template>
    <view class="body" :style="{ paddingTop: statusBarH }">
        <view class="header-row">
            <view class="header-item" :style="{ paddingTop: statusBarH }">
                <uni-row>
                    <uni-col :class="curr == 0 ? 'nav-item active' : 'nav-item'" :span="12">
                        <text @click="selectNav(0)">全部</text>
                    </uni-col>
                    <uni-col :class="curr == 1 ? 'nav-item active' : 'nav-item'" :span="12">
                        <text @click="selectNav(1)">推荐</text>
                    </uni-col>
                </uni-row>
            </view>
        </view>
        <z-paging :style="'height: calc(var(--vh) - 96rpx - 55px);'" class="paging" v-show="curr == 0" ref="paging"
            v-model="dataList" @query="lists" :lower-threshold="500" :refresher-enabled="true" :hide-empty-view="false"
            :empty-view-center="true" :empty-view-text="'暂无数据'" :hide-no-more-inside="true"
            :empty-view-img="'/static/img/wu.png'" :fixed="false" :empty-view-style="{ 'margin-bottom': '170px' }"
            :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
            :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
            <view class="search-row">
                <uni-search-bar bgColor="#fff" radius="19" v-model="dataOne.searchValue" :placeholder="searchTitle"
                    :placeholder-style="'color:#969799'"
                    :cancelStyle="{ 'font-weight': 600, 'color': '#07c160', 'text-align': 'right', 'font-size': '32rpx' }"
                    cancelButton="always" cancelText="搜索" @confirm="search1" @cancel="search1">
                    <template v-slot:searchIcon>
                        <span></span>
                    </template>
                </uni-search-bar>
            </view>
            <view class="list-box">
                <ul class="list-row">
                    <li class="list-item" v-for="(item, index) in dataList">
                        <view class="image-item" @click="detail(item)">
                            <fast-lazy-load :radius="'8rpx'" :src="item.pictureList[0]" :width="'100%'" :height="'356rpx'"
                                mode="aspectFill">
                                <template v-slot:loading>
                                    <image class="lazy-image" :src="loadingImg"></image>
                                </template>
                                <template v-slot:error>
                                    <image class="lazy-image" :src="loadingImg"></image>
                                </template>
                            </fast-lazy-load>
                        </view>
                        <view class="text">
                            <uni-row class="text-row">
                                <uni-col :span="1">
                                    <image @click="homepage(item)" class="headPic" :src="item.headPic"></image>
                                </uni-col>
                                <uni-col class="title-item" :span="19">
                                    <text class="title" @click="detail(item)">{{ item.title }}</text>
                                </uni-col>
                                <uni-col :span="4">
                                    <uni-icons type="hand-up" size="14" @click="detail(item)"></uni-icons>
                                    <span class="num" @click="detail(item)">{{ item.thumbUpCount | moneyFormat }}</span>
                                </uni-col>
                            </uni-row>
                        </view>
                    </li>
                </ul>
            </view>
        </z-paging>

        <z-paging :style="'height: calc(var(--vh) - 96rpx - 55px);'" class="paging" v-show="curr == 1" ref="paging2"
            v-model="dataList2" @query="lists2" :refresher-enabled="true" :hide-empty-view="false" :empty-view-center="true"
            :empty-view-text="'暂无数据'" :hide-no-more-inside="true" :empty-view-img="'/static/img/wu.png'" :fixed="false"
            :empty-view-style="{ 'margin-bottom': '170px' }"
            :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
            :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
            <view class="search-row">
                <uni-search-bar bgColor="#fff" radius="19" v-model="dataTwo.searchValue" :placeholder="searchTitle"
                    :placeholder-style="'color:#969799'"
                    :cancelStyle="{ 'font-weight': 600, 'color': '#07c160', 'text-align': 'right', 'font-size': '32rpx' }"
                    cancelButton="always" cancelText="搜索" @confirm="search2" @cancel="search2">
                    <template v-slot:searchIcon>
                        <span></span>
                    </template>
                </uni-search-bar>
            </view>
            <view class="list-box">
                <ul class="list-row">
                    <li class="list-item" v-for="(item, index) in dataList2">
                        <view class="image-item" @click="detail(item)">
                            <fast-lazy-load :radius="'8rpx'" :src="item.pictureList[0]" :width="'100%'" :height="'356rpx'"
                                mode="aspectFill">
                                <template v-slot:loading>
                                    <image class="lazy-image" :src="loadingImg"></image>
                                </template>
                                <template v-slot:error>
                                    <image class="lazy-image" :src="loadingImg"></image>
                                </template>
                            </fast-lazy-load>
                        </view>
                        <view class="text">
                            <uni-row class="text-row">
                                <uni-col :span="1">
                                    <image @click="homepage(item)" class="headPic" :src="item.headPic"></image>
                                </uni-col>
                                <uni-col class="title-item" :span="19">
                                    <text class="title" @click="detail(item)">{{ item.title }}</text>
                                </uni-col>
                                <uni-col :span="4">
                                    <uni-icons type="hand-up" size="14"></uni-icons>
                                    <span class="num" @click="detail(item)">{{ item.thumbUpCount | moneyFormat }}</span>
                                </uni-col>
                            </uni-row>
                        </view>
                    </li>
                </ul>
            </view>
        </z-paging>

        <!--底部-->
        <TabBar current="2" />
        <!--悬浮菜单栏-->
        <fab></fab>
        <!--发布悬浮按钮-->
        <view class="fabu" @click="add">
            <image src="@/static/img/find/fanbu.png" mode="widthFix"></image>
        </view>
        <!--注册界面-->
        <AlertInjectLayer />
    </view>
</template>
  
<script>
import { findList } from "@/utils/forum/index.js"
import TabBar from '@/components/Tabbar/Luntan'
import Fab from "@/components/common/fab/Fab";
import UniRow from "@/uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "@/uni_modules/uni-row/components/uni-col/uni-col";
import { listLatest } from '@/utils/forum/index.js'
import Login from "@/components/common/login/Login";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
    name: "index",
    components: {
        AlertInjectLayer, UniCol, UniRow, TabBar, Fab, Login,
    },
    data() {
        return {
            curr: 0,
            searchTitle: '点击搜索作者或标题…',
            loadingImg: '/static/img/zw.png',
            dataList: [],
            dataOne: {
                searchValue: '',
                pageNum: 1,
                pageSize: 10,
            },
            dataList2: [],
            statusBarH: uni.getStorageSync("systemInfo").safeArea.top + "px",
            dataTwo: {
                searchValue: '',
                pageNum: 1,
                pageSize: 10,
            },
            msg: '',
        }
    },
    onLoad(option) {
        uni.$on('emitParams', data => {
            this.msg = data.msg
        })
        let configData = uni.getStorageSync('config')
        try {
            configData.forEach((item, index) => {
                if (item.type == 23) {
                    this.loadingImg = item.url
                    throw Error();
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
    onShow() {
        uni.hideTabBar()
        if (this.msg) {
            pop(this.msg, 2000)
            this.msg = ''
        }
    },
    methods: {
        //切换选项卡
        selectNav(index) {
            console.log(index)
            this.curr = index
            if (this.curr == 0) {
                this.$refs.paging.scrollToTop(false)
            } else {
                this.$refs.paging2.scrollToTop(false)
            }
        },
        //用户主页
        homepage: function (item) {
            uni.navigateTo({
                url: "/pages/user/homepage/homepage?userId=" + item.userId
            })
        },
        detail: function (item) {
            const that = this
            item.read = 1
            uni.navigateTo({
                url: '/pages/forum/detail?id=' + item.articleId + '&type=2',
                success: function (res) {
                    res.eventChannel.emit('argParams', {
                        lotteryType: uni.getStorageSync('lotteryType') || 1
                    })
                }
            })
        },
        search1: function () {
            this.$refs.paging.reload()
        },
        search2: function () {
            this.$refs.paging2.reload()
        },
        add: function () {
            console.log('isLogin()', isLogin());
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
            uni.navigateTo({
                url: '/pages/find/find-add'
            })
        },
        //请求列表
        lists: function (pageNo, pageSize = 10) {
            this.dataOne.pageNum = pageNo
            let prams = {
                lotteryType: uni.getStorageSync('lotteryType'),
                type: 2,
                sort: 0,
                pageNum: this.dataTwo.pageNum,
                pageSize: this.dataTwo.pageSize,
                title: this.dataOne.searchValue,
            }
            listLatest(prams).then(res => {
                this.$refs.paging.complete(res.result.records);
            }).catch(err => {
                console.log(err)
            })

        },
        //请求2
        lists2: function (pageNo, pageSize = 10) {
            this.dataTwo.pageNum = pageNo
            let prams = {
                lotteryType: uni.getStorageSync('lotteryType'),
                type: 2,
                sort: 1,
                pageNum: this.dataTwo.pageNum,
                pageSize: this.dataTwo.pageSize,
                title: this.dataOne.searchValue,
            }
            listLatest(prams).then(res => {
                this.$refs.paging2.complete(res.result.records);
            }).catch(err => {
                console.log(err)
            })

        },
    }

}
</script>
  
<style lang="scss" scoped>
.body {
    max-width: 480px;
    margin: auto;

    .header-row {
        height: 96rpx;
        width: 100vw;
        max-width: 480px;
        margin: 0 auto;
        background-color: #fff;

        .header-item {
            position: fixed;
            top: 0;
            z-index: 11;
            width: 100%;
            max-width: 480px;
            background-color: #fff;
        }

        .nav-item {
            height: 96rpx;
            line-height: 96rpx;
            text-align: center;
            padding: 0 4px;
            font-weight: 600;
            font-size: 14px;

            text {
                width: 100%;
                display: block;
            }
        }

        .active {
            color: rgb(7, 193, 96);
        }
    }

    .paging {
        background: #fff;
        z-index: 1
    }

    .search-row {
        background: #f6f6f6;
        padding: 0rpx 10rpx;
    }

    .list1 {
        transition-duration: 0.3s;
        transform: translate3d(0%, 0px, 0px);
    }

    .list2 {
        transition-duration: 0.3s;
        transform: translate3d(-100%, 0px, 0px);
    }

    .list-row {
        padding: 20rpx;
        display: flex;
        flex: 1;
        flex-wrap: wrap;

        .list-item:nth-child(2n) {
            margin-left: 5px;
        }

        .list-item:nth-child(2n+1) {
            margin-right: 5px;
        }

        .list-item {
            width: calc(50% - 5px);
            margin-bottom: 20rpx;
            border-radius: 4px;
            border-top: 1px solid #bbb;
            position: relative;

            .image-item {
                height: 356rpx;
                display: flex;

                .lazy-image {
                    max-width: 80rpx;
                    max-height: 80rpx;
                    width: 50%;
                    height: 50%;
                    margin: auto;
                    background: #f7f8fa;
                }
            }

            .text {
                height: 80rpx;
                line-height: 80rpx;
                font-size: 24rpx;
                bottom: 0;
                color: #000 !important;
                background: #fff !important;
                width: 100%;
                left: 0;

                .text-row {
                    .headPic {
                        width: 52rpx;
                        height: 52rpx;
                        border-radius: 50%;
                        position: absolute;
                        top: 5px;
                        left: 5px;
                    }

                    .title-item {
                        text-align: center;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        padding-left: 70rpx !important;
                        padding-right: 20rpx !important;
                    }
                }
            }
        }
    }

    .fabu {
        width: 120rpx;
        position: fixed;
        right: 20rpx;
        bottom: 520rpx;
        z-index: 12;

        image {
            width: 120rpx;
        }
    }
}
</style>
<style>
.list-item {
    box-shadow: 0 2rpx 8rpx 0 hsl(0deg 0% 63% / 50%);
}
</style>
  