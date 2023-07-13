<template>
    <view class="activity" :style="{ marginTop: safeHeight }" :class="{ 'show-tabbar': showTabBar }">
        <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
            :title-style="titleStyle" :isBack="!showTabBar">
        </NavBar>
        <!--    <view class="menu-box">
        <view class="menu-item" :class="{active:type==item.type}" v-for="(item,index) in menu" @click="selectType(item)">
          {{item.name}}
        </view>
      </view>-->
        <view class="list-row">
            <view class="menu-box">
                <view class="menu-item" v-for="(item, index) in cat" @click="selectType(item, index)"
                    :class="{ active: curr == index }">
                    <image
                        :src="curr == index ? '/static/img/liuhe/activity/' + item.id + '.png' : '/static/img/liuhe/activity/ac' + item.id + '.png'">
                    </image>
                    <text class="title">
                        {{ item.name }}
                    </text>
                </view>
                <view class="lq-btn" @click="getReceiveAll">
                    一键领取
                </view>
                <view class="jl-btn" @click="ToLog">
                    领取记录
                </view>
            </view>
            <z-paging :style="{ height: `calc(var(--vh) - 96rpx - ${showTabBar ? '160' : '60'}rpx)` }" class="paging"
                ref="paging" v-model="lists" @query="getList" :lower-threshold="10" :refresher-enabled="true"
                :refresherAnimated="false" :show-refresher-update-time="true" :refresher-default-text="'松开刷新...'"
                :refresher-pulling-text="'松开刷新...'" :refresher-default-img="'/static/img/liuhe/load.gif'"
                :refresher-pulling-img="'/static/img/liuhe/load.gif'"
                :refresher-refreshing-img="'/static/img/liuhe/load.gif'" :refresher-default-style="'#EFF6FE'"
                :refresher-background="'#EFF6FE'" :refresher-fixed-background="'#EFF6FE'"
                :refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
                :refresher-refreshing-text="'正在加载更多数据...'"
                :loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
                :loading-more-loading-icon-custom-image="'/static/img/liuhe/load.gif'"
                :loading-more-custom-style="{ 'padding-top': '20rpx', 'background': '#EFF6FE' }"
                :loading-more-loading-animated="false" :loading-more-default-as-loading="true"
                :show-loading-more-no-more-view="false" :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false"
                :empty-view-center="true" :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/empty.png'" :fixed="false"
                :empty-view-style="{ 'margin-bottom': '170px' }"
                :empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
                :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
                <view class="list-box">
                    <view class="list-item" v-for="(item, index) in lists" @click="detail(item)">
                        <view class="img">
                            <image :src="item.img"></image>
                            <view class="status" :class="item.sector == 0 ? 'jx' : item.sector == 1 ? 'wks' : 'over'"
                                :style="{ color: item.timeStatus[1] }">
                                {{ item.timeStatus[0] }}
                            </view>
                        </view>
                        <view class="desc">
                            <view class="title">{{ item.name }}</view>
                            <view class="time">{{ item.dateRange }}</view>
                        </view>
                    </view>
                </view>
            </z-paging>
        </view>
        <TabBar :current="2" v-if="showTabBar" />
        <AlertInjectLayer />
    </view>
</template>
  
<script>
import NavBar from "@/components/common/navBar/navBar";
import { list, types, receiveAll } from "@/utils/activity/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import TabBar from '@/components/Tabbar/Liuhe'
export default {
    name: "index",
    components: {
        TabBar,
        AlertInjectLayer,
        NavBar
    },
    props: {
        showTabBar: Boolean
    },
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: this.$t("liuhe.activity.title"),
            headerStyle: {
                backgroundColor: "#1794FF"
            },
            fontColor: "#FFFFFF",
            titleStyle: {
                color: "#FFFFFF"
            },
            curr: 0,
            type: 1,
            cat: [],
            menu: [
                { "name": "全部", type: 0 },
                { "name": "最新活动", type: 1 },
                { "name": "彩票任务", type: 2 },
                { "name": "游戏任务", type: 3 }
            ],
            projectType: 1,
            lists: [],
        }
    },
    methods: {
        _onLoad(option) {
            this.getType()
        },
        selectType(item, index) {
            this.curr = index
            this.type = item.id
            this.$refs.paging.reload()
        },
        detail(item) {
            if (!isLogin()) {
                uni.navigateTo({
                    url: "/pages/liuhe/login"
                })
                return false
            }
            uni.navigateTo({ url: "/pages/liuhe/activity/detail?id=" + item.id })
        },
        getType() {
            types().then(res => {
                if (res.code == 200) {
                    this.cat = res.result
                } else {
                    pop(res.message, 2000);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getList(pageNum, pageSize = 10) {
            let prams = {
                type: this.type,
                pageNum: pageNum,
                pageSize: pageSize
            }
            list(prams).then(res => {
                if (res.code == 200) {
                    this.$refs.paging.complete(res.result.records)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getReceiveAll() {
            let prams = {
                type: this.type
            }
            receiveAll(prams).then(res => {
                if (res.code == 200) {
                    pop("领取成功", 2000)
                } else {
                    pop(res.message, 2000)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        ToLog() {
            uni.navigateTo({ url: "/pages/liuhe/activity/log" })
        }
    }
}
</script>
  
<style lang="scss" scoped>
.activity {
    font-family: 'PingFang SC';
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
    height: var(--vh);
    position: relative;

    /*.menu-box{
      display: flex;
      height: 60rpx;
      justify-content: space-around;
      align-items: center;
      font-weight: 400;
      font-size: 24rpx;
      color: #222222;
      border-bottom: 1px solid #088972;
      .menu-item{
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .active{
        color: #088972;
        &:after{
          position: absolute;
          content: " ";
          height: 6rpx;
          width: 20rpx;
          background: #088972;
          bottom: 0;
        }
      }
    }*/
    .list-row {
        position: relative;
        display: flex;
        padding: 30rpx;
        background: #EFF6FE;

        .menu-box {
            width: 150rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: calc(var(--vh) - 96rpx - 160rpx);
            overflow: auto;
            flex-shrink: 0;

            .menu-item {
                width: 150rpx;
                height: 105rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: #FFFFFF;
                box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
                    0rpx 1rpx 2rpx 0rpx rgba(0, 0, 0, 0.10),
                    0rpx 3rpx 3rpx 0rpx rgba(0, 0, 0, 0.09),
                    0rpx 7rpx 4rpx 0rpx rgba(0, 0, 0, 0.05),
                    0rpx 13rpx 5rpx 0rpx rgba(0, 0, 0, 0.01),
                    0rpx 20rpx 6rpx 0rpx rgba(0, 0, 0, 0.00);
                border-radius: 10rpx;
                margin-bottom: 20rpx;
                flex-shrink: 0;

                image {
                    height: 43rpx;
                    width: 42rpx;
                }

                .title {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #0DB9EE;
                    margin-top: 8rpx;
                }
            }

            .menu-item.active {
                background: linear-gradient(180deg, #4FACFD 0%, #4FACFD 0%, #20B5FA 0.01%, #0089FF 100%);

                .title {
                    color: #FFFFFF;
                }
            }

            .lq-btn,
            .jl-btn {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 120rpx;
                height: 50rpx;
                border-radius: 10rpx;
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 20rpx;
                color: #FFFFFF;
            }

            .lq-btn {
                background: #04BE02;
            }

            .jl-btn {
                margin-top: 20rpx;
                background: #0089FF;
            }
        }
    }

    .list-box {
        .list-item {
            margin: 20rpx 24rpx 0;
            height: 276rpx;
            width: 520rpx;
            background: #fff;
            border-radius: 10rpx;

            .img {
                position: relative;
                height: 216rpx;
                width: 520rpx;

                image {
                    height: 216rpx;
                    width: 520rpx;
                    border-radius: 10rpx 10rpx 0 0;
                }

                .status {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 77rpx;
                    height: 37rpx;
                    font-weight: 500;
                    font-size: 20rpx;
                    display: grid;
                    place-content: center;
                    color: #FFFFFF;
                    border-radius: 10rpx 0 0 0;
                }

                .jx {
                    background: rgba(3, 110, 51, 0.7);
                }

                .wks {
                    background: rgba(0, 0, 0, 0.5);
                    color: #5CFFB1;
                }

                .over {
                    background: rgba(0, 0, 14, 0.7);
                }
            }

            .desc {
                height: 60rpx;
                width: 520rpx;
                display: flex;
                align-items: center;
                background: #fff;
                border-radius: 0 0 10rpx 10rpx;

                .title {
                    width: 50%;
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #222222;
                    margin-left: 20rpx;
                    white-space: nowrap;
                }

                .time {
                    width: 50%;
                    display: flex;
                    justify-content: flex-end;
                    font-weight: 400;
                    font-size: 20rpx;
                    color: #999999;
                    margin-right: 12rpx;
                    white-space: nowrap;
                }
            }
        }
    }
}

.show-tabbar {
    height: calc(var(--vh) - 100rpx);
}
</style>