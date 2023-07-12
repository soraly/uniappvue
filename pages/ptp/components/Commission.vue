<template>
    <view class="ptp-teamData">
        <view class="selects">
            <uni-data-select :clear="false" v-model="value1" :localdata="range1" @change="change"></uni-data-select>
            <uni-data-select :clear="false" v-model="value2" :localdata="range2" @change="change"></uni-data-select>
        </view>
        <Empty v-if="!list.length"></Empty>
        <view class="list" v-else>
            <view class="item" v-for="(item, index) in list" :key="index">
                <view class="text name">{{ item.name }}</view>
                <view class="right">
                    <view class="text">有效投注：{{ item.text1 }}</view>
                    <view class="text">佣金：{{ item.text2 }}</view>
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
    }, data() {
        return {
            value1: 0,
            range1: [
                { value: 0, text: "全部" },
                { value: 2, text: "昨日" },
                { value: 2, text: "本周" },
                { value: 2, text: "上周" },
                { value: 2, text: "本月" },
            ],
            value2: 0,
            range2: [
                { value: 0, text: "全部类型" },
                { value: 1, text: "棋牌" },
                { value: 1, text: "电子" },
                { value: 2, text: "捕鱼" },
                { value: 2, text: "真人" },
                { value: 2, text: "体育" },
                { value: 2, text: "彩票" },
            ],
            list: [
                {
                    name: '棋牌',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: '电子',
                    text1: '1987000.00',
                    text2: '89.42'
                },
                {
                    name: '彩票',
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
            }
        }
    }
}
</style>