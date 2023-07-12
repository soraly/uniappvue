<template>
    <view class="ptp-teamData">
        <view class="selects">
            <uni-data-select :clear="false" v-model="value1" :localdata="range1" @change="change"></uni-data-select>
            <uni-search-bar placeholder="账号" bgColor="#fff" clearButton="none" cancelButton="none" @confirm="search" />
            <view class="yeji" @click="sort = sort === 'desc' ? 'asc' : 'desc'">
                业绩
                <view class="icon">
                    <u-icon class="yeji-icon top" name="play-right-fill" :color="sort === 'desc' ? '#0DB9EE' : '#222'"
                        size="10"></u-icon>
                    <u-icon class="yeji-icon bottom" name="play-left-fill" :color="sort === 'asc' ? '#0DB9EE' : '#222'"
                        size="10"></u-icon>
                </view>
            </view>
        </view>
        <Empty v-if="!list.length"></Empty>
        <view class="list" v-else>
            <view class="item" v-for="(item, index) in list" :key="index">
                <view class="text name">{{ item.name }}</view>
                <view class="text name">{{ item.num }}人</view>
                <view class="right">
                    <view class="text">{{ item.text1 }}</view>
                    <view class="text">贡献佣金：{{ item.text2 }}</view>
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
            sort: '',
            value1: 0,
            range1: [
                { value: 0, text: "全部" },
                { value: 2, text: "昨日" },
                { value: 2, text: "本周" },
                { value: 2, text: "上周" },
                { value: 2, text: "本月" },
            ],
            list: [
                {
                    name: 'new1',
                    num: '0',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new2',
                    num: '0',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: 'new3',
                    num: '0',
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

        .yeji {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 20rpx;
            justify-content: flex-end;

            .icon {
                display: flex;
                flex-direction: column;

                .yeji-icon {
                    transform: rotate(-90deg);
                }
            }
        }

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

            .name {
                flex: 1;
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