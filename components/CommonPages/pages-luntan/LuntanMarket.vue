<template>
    <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
        <nav-bar :headerStyle="headerStyle" :is-back="false">
            <view class="input-view" style="font-weight: 600;font-size: 36rpx;" slot="title">{{ title }}</view>
            <view slot="right" class="right-set">
                <!--        <view class="rht rht1">
            <image src="@/static/img/market/cz.png"></image>
            <span class="descs">充值</span>
          </view>
          <view class="rht">
            <image src="@/static/img/market/pt.png"></image>
            <span class="descs">平台切换</span>
          </view>-->
            </view>
        </nav-bar>
        <!-- <view class="header-box" style="height: 44px">
        <view class="header">
          <view class="box-bg" style="height: 44px">
            <uni-nav-bar height="44px" :leftWidth="'170rpx'" :rightWidth="'170rpx'">
              <view class="input-view" style="font-weight: 600;font-size: 36rpx;">{{ title }}</view>
              <block slot="right" >
                <view class="rht rht1">
                  <image src="@/static/img/market/cz.png"></image>
                  <span class="descs">充值</span>
                </view>
                <view class="rht">
                  <image src="@/static/img/market/pt.png"></image>
                  <span class="descs">平台切换</span>
                </view>
              </block>
            </uni-nav-bar>
          </view>
        </view>
      </view> -->
        <view class="title-div">
            <view class="left">
                <uni-icons type="sound-filled" size="14"
                    style="margin-right: 5px; color: rgb(239, 81, 81); font-size: 28rpx;"></uni-icons>
            </view>
            <view class="right">
                <view class="notice">
                    <view class="notice-item" v-for="(item, index) in noticeInfo">
                        {{ item.noticeContent }}
                    </view>
                </view>
            </view>
        </view>
        <view class="main-box">
            <view class="tips-box">
                <view class="notices">淘料市场为第三方入驻平台，只提供资料参考信息，资料自由买卖，若发现六合专家强制要求购买资料，请联系在线客服举报，对于强制要求购买的六合专家，我们将严厉处理。</view>
            </view>
            <view class="items">
                <view class="items1" @click="qidai">
                    <view class="imgs img1"></view>
                    <view class="titles">六合王</view>
                    <view class="tips1">当前心水数量</view>
                    <view class="numbers">198</view>
                </view>
                <view class="items1" @click="qidai">
                    <view class="imgs img2"></view>
                    <view class="titles">连胜榜</view>
                    <view class="tips1">当前心水数量</view>
                    <view class="numbers">49</view>
                </view>
                <view class="items1" @click="qidai">
                    <view class="imgs img3"></view>
                    <view class="titles">历史冠军</view>
                    <view class="tips1">当前心水数量</view>
                    <view class="numbers">34</view>
                </view>
                <view class="items1" @click="qidai">
                    <view class="imgs img4"></view>
                    <view class="titles">专家统计</view>
                    <view class="tips1">当前心水数量</view>
                    <view class="numbers">161</view>
                </view>
            </view>
        </view>

        <view class="noexpert">
            <view class="item">
                <image src="@/static/img/market/zj.png"></image>
                <view @click="qidai">
                    <span>申请专家</span>
                    <view class="apply">申请专家</view>
                </view>
            </view>
            <view class="item">
                <image src="@/static/img/market/jx.png"></image>
                <view @click="qidai">
                    <span>竞选专家</span>
                    <view class="apply">点击进入</view>
                </view>
            </view>
        </view>

        <view class="spans"></view>

        <uni-list>
            <uni-list-item v-for="(item, index) in navArr" :show-extra-icon="true" showArrow :thumb="item.leftImg"
                thumb-size="base" :title="item.title" :to="item.url" />
        </uni-list>
        <!--底部-->
        <view class="footer">
            <component :is="componentTabBar" />
            <TabBar current="1" />
        </view>
        <AlertInjectLayer />
    </view>
</template>
  
<script>
import TabBarLuntan from '@/components/Tabbar/Luntan'
import TabBarAll from "@/components/common/tabbar/TabBar";
import NavBar from "@/components/common/navBar/navBar.vue"
import { noticeList } from '@/utils/common/index'
import { notice } from '@/utils/common/index'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
    name: "index",
    components: {
        AlertInjectLayer,
        TabBarLuntan,
        TabBarAll,
        NavBar
    },
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            headerStyle: {
                backgroundColor: '#fff',
            },
            title: '淘料市场',
            noticeInfo: [],
            navArr: [
                {
                    leftImg: '/static/img/market/care.png',
                    title: '我的关注',
                    url: '',
                },
                {
                    leftImg: '/static/img/market/fans.png',
                    title: '我的粉丝',
                    url: '',
                },
                {
                    leftImg: '/static/img/market/gm.png',
                    title: '购买记录',
                    url: '',
                }, {
                    leftImg: '/static/img/market/ml.png',
                    title: '卖料记录',
                    url: '',
                },
                {
                    leftImg: '/static/img/market/jb.png',
                    title: '我的举报',
                    url: '',
                },
                {
                    leftImg: '/static/img/market/bz.png',
                    title: '帮助说明',
                    url: '/pages/liuhe/help/index',
                }
            ],
        }
    },
    computed: {
        componentTabBar() {
            const nameMap = {
                ALL: 'TabBarAll',
                LUNTAN: 'TabBarLuntan'
            }
            return nameMap[this.$config.station]
        }
    },
    onShow() {
        uni.hideTabBar()
    },
    onLoad() {
        this.noticeList()
    },
    methods: {
        noticeList() {
            let prams = { position: 3 }
            notice(prams).then(res => {
                this.noticeInfo = res.result
            }).catch(err => {
                console.log(err)
            })
        },
    }
}
</script>
  
<style lang="scss" scoped>
.mint-tab-container-item {
    font-family: PingFang SC;
    background: #fff;
}

.header {
    box-shadow: inset 0 -0.02rem 0 #ededed;
    border-bottom: 1px solid #ededed;

    .rht1 {
        // margin-right: 20rpx;
    }

    .right-set {
        display: flex;
        // flex-direction: column;
        // justify-content: center;
        align-items: center;

        .rht {
            width: 96rpx;
            color: #07c160;
            font-family: PingFang SC;
            font-size: 24rpx;
            text-align: center;
            flex: 1;

            * {
                display: inline-block;
            }

            image {
                margin: 0 auto;
                display: block;
                width: 36rpx;
                height: 36rpx;
            }
        }
    }

}

.van-notice-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 16px;
    color: rgb(239, 81, 81);
    font-size: 14px;
    line-height: 24px;
    background-color: #fffbe8;

    .van-notice-bar__wrap {
        width: 100%;
        display: block;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        animation: scroll 20s linear infinite;
        /*滚动动画*/
    }

    .van-notice-bar__content {
        white-space: nowrap;
        width: 100%;
        height: 100%;
        line-height: 80rpx;
        display: inline-block;
    }
}

.title-div {
    display: flex;
    height: 80rpx;
    align-items: center;
    justify-content: center;

    .left {

        /*width: 15%;
      margin-left: 32rpx;*/
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
            animation: scroll 30s linear infinite;
            height: 100%;
            align-items: center;
            display: inline-block;

            .notice-item {
                display: inline-block;
                line-height: 40rpx;
                color: rgb(239, 81, 81);
                font-size: 14px;
                margin-right: 594rpx;
            }
        }
    }
}

@keyframes scroll {
    from {
        transform: translateX(630rpx);
        /*div多宽就写多宽*/
    }

    to {
        transform: translateX(-100%);
    }
}

.main-box {
    padding: 20rpx 20rpx;
    border-top: 2rpx solid #ededed;

    .tips-box {
        padding: 0 10rpx 20rpx 10rpx;

        .notices {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            padding: 20rpx;
            position: static;
            left: 20rpx;
            top: 20rpx;
            background: rgba(7, 193, 96, .1);
            border: 2rpx dashed #07c160;
            box-sizing: border-box;
            border-radius: 16rpx;
        }
    }

    .items {
        display: flex;

        .items1 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 187.5rpx;
            height: 302rpx;

            .img1 {
                background-image: url('@/static/img/market/lhw.png');
            }

            .img2 {
                background-image: url('@/static/img/market/lsb.png');
            }

            .img3 {
                background-image: url('@/static/img/market/lsgj.png');
            }

            .img4 {
                background-image: url('@/static/img/market/zjtj.png');
            }

            .imgs {
                background-size: 100% 100%;
                text-align: center;
                height: 96rpx;
                width: 96rpx;
                margin: 8rpx 0;
            }

            .titles {
                font-size: 28rpx;
                line-height: 32rpx;
                margin: 8rpx 0;
            }

            .tips1 {
                font-size: 24rpx;
                line-height: 28rpx;
                color: #999;
                margin: 8rpx 0;
            }

            .numbers {
                font-size: 32rpx;
                line-height: 38rpx;
                color: #e71607;
                margin: 8rpx 0;
            }
        }
    }
}

.noexpert {
    background: #fff;
    display: flex;
    flex-direction: row;
    height: 160rpx;
    color: #fff;
    width: 95%;
    margin: auto;
    margin-bottom: 20rpx;
    justify-content: space-around;

    .item {
        display: flex;
        justify-content: space-around;
        background: #07c160;
        align-items: center;
        width: 47%;
        border-radius: 16rpx;

        image {
            height: 80rpx;
            width: 80rpx;
        }

        uni-view {
            display: flex;
            flex-direction: column;

            span {
                font-size: 36rpx;
                font-weight: 700;
                color: #fff;
                margin-bottom: 4rpx;
            }

            .apply {
                position: static;
                width: 160rpx;
                height: 50rpx;
                left: 514rpx;
                font-size: 28rpx;
                line-height: 50rpx;
                text-align: center;
                border: 2rpx solid #fff;
                box-sizing: border-box;
                border-radius: 60rpx;
            }
        }
    }
}

.spans {
    height: 12rpx;
    background: #f2f2f2;
}

.footer {
    height: 50px;
}
</style>
  