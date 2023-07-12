<template>
    <view class="notice-box">
        <image class="ico" src="@/static/img/liuhe/ico_noticce.png"></image>
        <view class="content"></view>
        <view class="kefu">
            <image src="@/static/img/liuhe/ico_kefu.png"></image>
            <view class="text">客服</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "NoticeBox",
        desc: ""
    }
</script>

<style lang="scss" scoped>
    .notice-box{
        width: 720rpx;
        height: 58rpx;
        background: white;
        border-radius: 29rpx;

        .ico{
            width: 38rpx;
            height: 38rpx;
            margin: 10rpx 19rpx;
            display: inline-block;
        }

        .content{
            display: inline-block;
            width: 500rpx;
            height: 58rpx;
            overflow: hidden;
            /*background: red;*/
        }

        .kefu{
            display: inline-block;
            width: 125rpx;
            height: 58rpx;
            image{
                width: 52rpx;
                height: 52rpx;
            }
            .text{
                width: 70rpx;
                overflow: hidden;
                float: right;
                line-height: 58rpx;
                font-weight: 500;
                color: #030303;
                font-size: 30rpx;
            }
        }

    }
</style>