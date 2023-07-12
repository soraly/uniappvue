<template>
    <view class="ptp-empty">
        <image class="img" mode="widthFix" src="/static/img/ptp-empty.png" alt=""></image>
        <view class="text">暂无数据</view>
    </view>
</template>

<style lang="scss" scoped>
.ptp-empty {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    margin: auto;
    text-align: center;

    .img {
        width: 100%;
    }

    .text {
        font-size: 20rpx;
        color: #55657E;
    }
}
</style>