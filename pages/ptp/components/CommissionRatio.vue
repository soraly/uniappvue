<template>
    <view class="ptp-teamData">
        <u-tabs class="tabs" bg-color="transparent" active-color="#1794FF" :bold="false" :list="tabList" :is-scroll="false"
            :current="current" @change="change"></u-tabs>
        <view class="items">
            <view class="item header">
                <view>级别</view>
                <view>有效投注</view>
                <view>返佣金额</view>
            </view>
            <Empty v-if="!list.length && !loading" />
            <view v-if="loading" class="loading">
                <image src="/static/img/load.gif"></image>
                <view>加载中...</view>
            </view>
            <view v-else class="item" v-for="(item, index) in list" :key="index">
                <view>{{ item.level }}</view>
                <view>{{ item.bettingLevel }}万</view>
                <view>
                    <text class="yellow">{{ item.rebateAmount }}</text>/万
                </view>
            </view>
        </view>
        <view class="tips">
            只有在结算期间存款
            <text class="yellow">≥{{ data.effectiveBetting.itemValue }}</text>
            且有效投注
            <text class="yellow">≥{{ data.deposit.itemValue }}</text>
            的情况下才能领取佣金。
        </view>
    </view>
</template>
<script>
import { getRateType, getRateByType, getRateRemindConfig } from '@/utils/ptp'
import defaultTemplate from '../../../utils/defaultTemplate'
import Empty from "./Empty";
export default {
    components: {
        Empty
    },
    data() {
        return {
            tabList: [],
            list: [],
            current: 0,
            loading: false,
            data: {
                effectiveBetting: {
                    itemValue: '0.00'
                },
                deposit: {
                    itemValue: '0.00'
                }
            },
        }
    },
    mounted() {
        this.getRateTypeList()
        this.getRateRemindConfigData()
    },
    methods: {
        async getRateRemindConfigData() {
            const res = await getRateRemindConfig()
            this.data = defaultTemplate({
                effectiveBetting: {
                    id: "",
                    itemValue: '',
                    itemName: "",
                    itemGroup: "",
                },
                deposit: {
                    id: "",
                    itemValue: '',
                    itemName: "",
                    itemGroup: "",
                }
            }, res.result)
        },
        async getRateTypeList() {
            const res = await getRateType()
            const result = defaultTemplate(
                [
                    {
                        id: '',
                        name: "",
                    }
                ],
                res.result
            )
            this.tabList = result
            if (!result.length) {
                return
            }
            this.getRateByTypeList()
        },
        async getRateByTypeList() {
            this.loading = true
            const res = await getRateByType({ type: this.tabList[this.current]?.id })
            const list = defaultTemplate(
                [
                    {
                        level: '',
                        bettingLevel: '',
                        rebateAmount: '',
                        status: ''
                    }
                ],
                res.result
            )
            this.list = list.filter(item => item.status === '1')
            this.loading = false
        },
        change(index) {
            this.current = index;
            this.getRateByTypeList()
        }
    }
}
</script>

<style lang="scss" scoped>
.ptp-teamData {
    position: relative;

    .tabs {
        border-bottom: 4rpx solid #D9D9D9 !important;

        /deep/ .u-tab-bar {
            bottom: -5rpx;
            width: 44rpx !important;
            height: 4rpx !important;
            flex-shrink: 0;
            border-radius: 0 !important;
        }
    }

    .items {
        margin-top: 30rpx;
        height: calc(var(--vh) - 460rpx);
        overflow: auto;

        .item {
            padding: 25rpx 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            text-align: center;
            border-radius: 10px;
            font-size: 20rpx;
            color: #666666;

            &:nth-child(odd) {
                background: #fff;
            }
        }

        .header {
            border: 1px solid #DDDDDD;
            font-size: 22rpx;
            position: sticky;
            top: -1px;
        }

        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            image {
                width: 100rpx;
                height: 100rpx;
            }
        }
    }

    .tips {
        font-size: 24rpx;
        color: #222222;
        margin-top: 10rpx;
        word-break: break-all;
    }

    .yellow {
        color: #FDA200;
    }
}
</style>