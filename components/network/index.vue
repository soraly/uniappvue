<template>
    <view>
        <u-popup v-model="show" mode="center" border-radius="10">
            <view class="content">
                <view class="title">选择线路</view>
                <u-radio-group v-model="value">
                    <view class="list">
                        <u-radio class="radio" :class="{ checked: value === item.id }" active-color="#FF9900"
                            v-for="(item, index) in list" :key="index" :name="item.id">
                            <view class="item">
                                <image class="network" src="/static/img/network.png" />
                                <view class="name">{{ item.name }}</view>
                                <view class="ms" :class="item.ping < 150 ? 'green-text' :
                                    item.ping > 150 && item.ping < 300 ? 'orange-text' :
                                        'red-text'">{{ item.ping }}MS</view>
                            </view>
                        </u-radio>
                    </view>
                </u-radio-group>
                <view class="btns">
                    <u-button class="btn close" shape="circle" :hair-line="false" @click="close">取消</u-button>
                    <u-button class="btn confirm" shape="circle" :hair-line="false" @click="confrim">确定</u-button>
                </view>
            </view>
        </u-popup>
        <slot v-if="list.length" v-bind:lineName="lineName" />
    </view>
</template>
<script>
import { lineList } from "@/utils/line";
import defaultTemplate from "@/utils/defaultTemplate";
import { mapGetters } from "vuex";
import { config } from '@/config/config.js'
export default {
    data() {
        return {
            show: false,
            checkedValue: 1,
            value: 1,
            list: [],
        }
    },
    computed: {
        ...mapGetters(["debugWebsocketTimeInterval"]),
        lineName() {
            return this.list.find(item => item.id === this.value)?.name
        }
    },
    mounted() {
        this.getLineList()
    },
    methods: {
        async getLineList() {
            const res = await lineList()
            const result = defaultTemplate([{
                id: '',
                name: "",
                url: ''
            }], res.result)
            for (const item of result) {
                const start = Date.now();
                const img = new Image();
                const getLatencyTime = () => {
                    item.ping = Date.now() - start;
                };
                img.onload = getLatencyTime
                img.onerror = getLatencyTime
                img.src = item.url;
            }
            const lineData = uni.getStorageSync('apiDomain') || result[0]
            this.value = lineData.id
            this.checkedValue = lineData.id
            this.list = result
            this.list.unshift({
                id: '0',
                name: '默认线路',
                url: '/',
                ping: this.debugWebsocketTimeInterval
            })
        },
        open() {
            this.show = true
        },
        close() {
            this.show = false
            this.value = this.checkedValue
        },
        confrim() {
            config.updateDomain(this.list.find(item => item.id === this.value))
            this.show = false
        },
    }
}
</script>

<style lang="scss" scoped>
/deep/ .u-drawer {
    position: fixed !important;
}

.content {
    padding: 20rpx 30rpx;
    max-width: 350px;

    .title {
        font-size: 32rpx;
        line-height: 40rpx;
        text-align: center;
        color: #444444;
        margin-bottom: 20rpx;
    }

    /deep/ .u-radio-group {
        max-width: 100%;
    }

    .list {
        display: flex;
        flex-direction: column;
        width: 60vw;

        .radio {
            padding: 20rpx;
            box-sizing: border-box;
            flex-direction: row-reverse;

            /deep/ .u-radio__label {
                width: 100%;
            }

            .item {
                display: flex;
                align-items: center;
                font-size: 24rpx;
                line-height: 34rpx;
                gap: 10rpx;

                .network {
                    width: 40rpx;
                    height: 40rpx;
                }

                .name {
                    flex: 1;
                    color: #3881A8;
                }

                .ms {
                    color: #39DD3D;

                }

                .green-text {
                    color: #5ac54c;
                }

                .orange-text {
                    color: #ff7010;
                }

                .red-text {
                    color: #ff0000;
                }
            }
        }

        .checked {
            background: #ECF8FF;
        }
    }

    .btns {
        display: flex;
        gap: 40rpx;
        margin-top: 30rpx;

        .btn {
            width: 200rpx;
            color: #fff;
            height: 60rpx;
            border: none;
        }

        .close {
            background: #8CB2C9;
        }

        .confirm {
            background: #FF9900;
        }
    }
}
</style>