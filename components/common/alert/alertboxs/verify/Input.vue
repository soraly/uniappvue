<template>
    <view class="input">
        <view class="title">输入验证码</view>
        <image class="img" src="/static/img/verify/input/img.png"></image>
        <input class="code" v-model="code" placeholder='请输验证码' />
        <u-button class="btn" @click="confirm">确定</u-button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            verifyCode: 'BZa4',
            code: '',
        }
    },
    methods: {
        loadData() {
            console.log('loadData');
        },
        confirm() {
            // 验证失败
            if (this.code.toLowerCase() !== this.verifyCode.toLowerCase()) {
                this.$emit('fail', { code: 0, message: '输入不正确', success: false })
                return
            }
            uni.showLoading({
                title: '验证中'
            });
            setTimeout(() => {
                uni.hideLoading();
                this.$emit('success', { code: 0, message: '成功', success: false })
            }, 1000);
        }
    }
} 
</script>
<style lang="scss" scoped>
.input {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    padding: 0 50rpx;
    align-items: center;

    .title {
        color: #444;
        text-align: center;
        font-size: 24rpx;
    }

    .img {
        width: 100%;
        height: 103rpx;
    }

    .code {
        width: 100%;
        height: 70rpx;
        display: flex;
        border-radius: 10rpx;
        border: 1rpx solid #DDD;
        text-align: center;
    }

    .btn {
        width: 100%;
        background: #16A7FB;
        color: #fff;
    }
}
</style>