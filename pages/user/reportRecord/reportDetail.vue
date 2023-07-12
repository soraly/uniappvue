<template>
    <view class="report-detail" :style="{ marginTop: safeHeight }">
        <navBarVue :title="title"></navBarVue>
        <uni-popup ref="popup" type="center">
            <view>
                <image mode="aspectFit" :src="pic" />
            </view>
        </uni-popup>
        <view class="content">
            <view class="top">
                <view class="top-title">标题：</view>
                <view class="top-text">{{ detail.title }}</view>
            </view>
            <view class="bottom">
                <view class="bottom-title">举报理由：</view>
                <view class="bottom-text">{{ detail.reason }}</view>
            </view>
            <view class="pic-list">
                <view class="pic-list-item" v-for="(item, index) in detail.pictureList">
                    <image mode="widthFix" :src='item.smallPictureUrl' @click="openPic(item)"></image>
                </view>
            </view>
        </view>
        <view class="status">
            <text class="status-title">处理结果：</text>
            <view :class="setStasusClass(detail.status)">{{ setResult(detail.status) }}</view>
            <!-- <view class="status-content">{{detail.status === 0 ? "未处理" : "已处理"}}</view> -->
        </view>
        <AlertInjectLayer />
    </view>
</template>
<script>
import navBarVue from '../../../components/common/navBar/navBar.vue';
import { reportDetail } from '../../../utils/user';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
    name: "reportDetail",
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: "举报详情",
            id: "",
            detail: {},
            pic: ""
        }
    },
    components: {
        AlertInjectLayer,
        navBarVue
    },
    onLoad(option) {
        console.log(option)
        this.id = option.id;
        this.getFeedbackDetail()
    },
    methods: {
        setResult(status) {
            switch (status) {
                case 0:
                    return "审核中"
                case 1:
                    return "审核拒绝"
                case 2:
                    return "审核成功"
            }
        },
        setStasusClass(status) {
            switch (status) {
                case 0:
                    return "status-content doing"
                case 1:
                    return "status-content fail"
                case 2:
                    return "status-content done"
            }
        },
        openPic(item) {
            this.$refs.popup.open()
            this.pic = item.pictureUrl
        },
        getFeedbackDetail() {
            reportDetail({ id: this.id }).then(res => {
                if (res.code === 200) {
                    this.detail = res.result
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.report-detail {
    background-color: #fff;
    height: var(--vh);
}

.content {
    margin-top: 20rpx;
    padding: 0 20rpx;
    position: relative;

    &::before {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        content: " ";
        pointer-events: none;
        top: 0;
        border-top: 1px solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
    }

    .top {
        border-bottom: 1px solid rgb(238, 238, 238);
        line-height: 50rpx;

        .top-title {
            font-weight: bold;
            font-size: 28rpx;
        }

        .top-text {
            font-size: 24rpx;
            color: rgb(170, 170, 170);
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .bottom {
        margin-bottom: 50rpx;
        line-height: 50rpx;

        .bottom-title {
            font-weight: bold;
            font-size: 28rpx;
        }

        .bottom-text {
            font-size: 24rpx;
            color: rgb(170, 170, 170);
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .pic-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15rpx 0;

        .pic-list-item {
            image {
                max-width: 150rpx;
            }
        }
    }
}

.status {
    line-height: 50rpx;
    padding: 0 20rpx;

    .status-title {
        font-weight: bold;
        font-size: 28rpx;
    }

    .status-content {
        font-size: 28rpx;
        text-align: center;
        height: 50rpx;
        line-height: 50rpx;
    }

    .status-content.doing {
        color: rgb(0, 90, 160);
    }

    .status-content.done {
        color: rgb(7, 193, 96);
    }

    .status-content.fail {
        color: rgb(255, 51, 17);
    }
}
</style>
