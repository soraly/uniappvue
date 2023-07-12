<template>
    <scroll-view scroll-y="true" show-scrollbar="true" scroll-with-animation="true" lower-threshold="700" class="vip-box"
        :style="{ marginTop: safeHeight }">
        <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
            :font-color="fontColor" :title-style="titleStyle">
            <block slot="left">
                <uni-icons @click="back" type="back" :color="fontColor" size="18"
                    style="font-weight: bold;margin-left: 10px" />
            </block>
        </NavBar>
        <view class="content">
            <view class="item">
                <view class="text">等级</view>
                <view class="text">打码量</view>
            </view>
            <view class="item" v-for="(item, index) in vipList" :key="index">
                <view class="text">{{ item.levelName }}</view>
                <view class="num">{{ item.codingAmount }}</view>
            </view>
            <div class="tips-box">
                <view class="tips-title">vip等级介绍</view>
                <view class="tips">{{ desc }}</view>
            </div>
        </view>
        <AlertInjectLayer />
    </scroll-view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { vipInfo } from "../../../utils/user/vip";
import defaultTemplate from "../../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
    name: "vip",
    components: {
        AlertInjectLayer,
        NavBar,
    },
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: "VIP等级",
            headerStyle: {
                backgroundColor: "#1794FF"
            },
            fontColor: "#FFFFFF",
            titleStyle: {
                color: "#FFFFFF"
            },
            vipList: [],
            desc: ''
        }
    },
    onLoad() {
        this.getUserVipInfo()
    },
    methods: {
        back() {
            history.back();
        },
        async getUserVipInfo() {
            const { result } = await vipInfo()
            const { vips, desc } = defaultTemplate({
                vips: [
                    {
                        "id": 1,
                        "level": 1,
                        "levelName": "VIP1",
                        "levelDesc": "VIP1",
                        "codingAmount": 0,
                        "status": '1',
                        "createTime": "0",
                        "createBy": "0",
                        "updateTime": "0",
                        "updateBy": "0"
                    },
                ],
                desc: ""
            }, result)
            this.vipList = vips.filter(item => item.status === '1')
            this.desc = desc
        }
    }
}
</script>
<style lang="scss" scoped>
.vip-box {
    height: var(--vh);
    background: #f6f6f6;
    font-family: 'PingFang SC';
    font-style: normal;

    .content {
        padding: 20rpx;

        .item {
            display: flex;
            font-size: 28rpx;
            color: #03536E;

            .num,
            .text {
                flex: 1;
                height: 80rpx;
                display: grid;
                place-content: center;
            }

            .num {
                color: #FE9D2A;
            }

            &:nth-child(odd) {
                background: #fff;
                border-radius: 10rpx;
            }
        }

        .tips-box {
            margin-top: 40rpx;
            border-radius: 10rpx;
            background: #FFF;
            padding: 20rpx;
            display: flex;
            flex-direction: column;
            gap: 10rpx;

            .tips-title {
                color: #03536E;
                font-size: 36rpx;
                font-weight: 400;
            }

            .tips {
                font-size: 28rpx;
                color: #444444;
            }
        }
    }
}
</style>