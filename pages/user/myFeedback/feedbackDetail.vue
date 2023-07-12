<template>
    <view class="feedback-detail" :style="{ marginTop: safeHeight }">
        <navBarVue :title="title"></navBarVue>
        <view class="content">
            <view class="top">
                <view class="top-title">标题：</view>
                <view class="top-text">{{ detail.title }}</view>
            </view>
            <view class="bottom">
                <view class="bottom-title">内容：</view>
                <view class="bottom-text">{{ detail.description }}</view>
            </view>
        </view>
        <view class="status">
            <text class="status-title">客服回复：</text>
            <text :class="detail.status == 0 ? 'status-content red' : 'status-content green'">{{ detail.status == 0 ? "未处理"
                :
                "已处理" }}</text>
        </view>
        <AlertInjectLayer />
    </view>
</template>
<script>
import navBarVue from '../../../components/common/navBar/navBar.vue';
import { feedbackDetail } from '../../../utils/user';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
    name: "feedbackDetail",
    data() {
        return {
            safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
            title: "反馈详情",
            id: "",
            detail: {}
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
        getFeedbackDetail() {
            feedbackDetail({ id: this.id }).then(res => {
                if (res.code === 200) {
                    this.detail = res.result
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.feedback-detail {
    background-color: #fff;
    height: var(--vh);
}

.content {
    margin-top: 20rpx;
    padding: 0 20rpx;
    background-color: #fff;
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
    }

    .status-content.red {
        color: red;
    }

    .status-content.green {
        color: rgb(7, 193, 96);
    }
}
</style>
