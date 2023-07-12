<template>
    <view class="ptp-teamData">
        <view class="selects">
            <uni-data-select :clear="false" v-model="value1" :localdata="range1" @change="change"></uni-data-select>
            <uni-search-bar placeholder="账号" bgColor="#fff" clearButton="none" cancelButton="none" @confirm="search" />
        </view>
        <Empty v-if="!list.length"></Empty>
        <view class="list" v-else>
            <view class="item" v-for="(item, index) in list" :key="index">
                <view class="left">
                    <view class="text">{{ item.name }}</view>
                    <view class="time">{{ item.time }}</view>
                </view>
                <view class="right">
                    <view class="text">有效投注：{{ item.text1 }}</view>
                    <view class="text">充值：{{ item.text2 }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import Empty from './Empty.vue'
export default {
    components: {
        Empty
    },
    data() {
        return {
            value1: 0,
            range1: [
                { value: 0, text: "全部" },
                { value: 1, text: "今日" },
                { value: 2, text: "昨日" },
                { value: 2, text: "本周" },
                { value: 2, text: "上周" },
                { value: 2, text: "本月" },
            ],
            list: [
                {
                    name: 'new1',
                    time: '2023.05.23 09:54:42',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new1下级',
                    time: '2023.05.23 09:54:42',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new2',
                    time: '2023.05.23 09:54:42',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new2下级',
                    time: '2023.05.23 09:54:42',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new3',
                    time: '2023.05.23 09:54:42',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new3下级',
                    time: '2023.05.23 09:54:42',
                    text1: '1987000.00',
                    text2: '89.42'
                }
            ]
        };
    },
    computed: {

    },
    methods: {
        change(e) {
            console.log("e:", e);
        },
        search(res) {
            uni.showToast({
                title: '搜索：' + res.value,
                icon: 'none'
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.ptp-teamData {
    position: relative;
    height: 100%;

    .selects {
        display: flex;
        align-items: center;
        gap: 38rpx;
        position: sticky;
        top: -1px;
        background: #eff6fe;
        padding-bottom: 20rpx;

        /deep/ .uni-searchbar {
            width: 160rpx;
            padding: 0;

            .uni-searchbar__box {
                border-radius: 50rpx !important;
                flex-direction: row-reverse;
                padding-left: 16rpx;

                .uni-searchbar__box-icon-search {
                    padding: 0;

                    .uni-icons {
                        color: #0DB9EE !important;
                    }
                }
            }
        }

        /deep/ .uni-stat__select {
            width: auto;
            flex: none;

            .uni-stat__actived {
                width: auto;
                flex: none;
            }

            .uni-select {
                border: unset;
                background: #FFFFFF;
                border-radius: 50rpx;
                justify-content: center;
                width: 160rpx;

                .uni-select__input-box {
                    flex: none;
                    gap: 10rpx;

                    .uni-icons {
                        color: #0DB9EE !important;
                    }
                }

                .uni-select__selector {
                    top: 100%;

                    .uni-popper__arrow {
                        display: none !important;
                    }

                    .uni-select__selector-item {
                        justify-content: center;
                    }
                }
            }
        }
    }

    .list {

        .item {
            display: flex;
            align-items: center;
            padding: 20rpx 22rpx;
            border-radius: 20rpx;

            &:nth-child(odd) {
                background: #fff;
            }

            .left {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 10rpx;

                .time {
                    font-size: 20rpx;
                    color: #999999;
                }
            }

            .text {
                font-size: 20rpx;
                color: #444444;
            }

            .right {
                display: flex;
                flex-direction: column;
                gap: 10rpx;
                text-align: right;
            }
        }
    }
}
</style>