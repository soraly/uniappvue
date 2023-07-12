<template>
    <view class="input">
        <view class="title">请按要求完成</view>
        <view class="display-text" id="displayText">
            <image class="img" src="/static/img/verify/select/img.png"></image>
            <view class="text" v-for="item in chooseTexts" :style="{
                transform: `rotate(${item.rotate}deg)`,
                left: item.posi.left,
                top: item.posi.top
            }">
                {{ item.text }}
            </view>
        </view>
        <view class="btn">请依次点击‘帝’‘著’‘头’</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            chooseTexts: [],
            verifyTexts: [],
            checkedTexts: [],
        }
    },
    computed: {
    },
    mounted() {
        this.loadData()
    },
    methods: {
        loadData() {
            const texts = ['帝', '著', '头', '张', '三']
            this.verifyTexts = ['帝', '著', '头']
            const query = uni.createSelectorQuery().in(this);
            query.select('#displayText').boundingClientRect(data => {
                const { width, height } = data
                this.chooseTexts = texts.map(text => {
                    return {
                        text,
                        rotate: Math.floor(Math.random() * 360),
                        posi: { left: Math.floor(Math.random() * (width - 20)) + 'px', top: Math.floor(Math.random() * (height - 20)) + 'px' }
                    }
                })
            }).exec();
        },
        confirm() {
            // 验证失败
            if (this.checkedTexts !== this.verifyTexts) {
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

    .title {
        color: #444;
        text-align: center;
        font-size: 24rpx;
    }

    .display-text {
        width: 350rpx;
        position: relative;

        .img {
            width: 100%;
            height: 175rpx;
        }

        .text {
            position: absolute;
        }
    }

    .btn {
        display: grid;
        place-items: center;
        width: 100%;
        height: 70rpx;
        border-radius: 10rpx;
        border: 1px solid #DDD;
        background: #16A7FB;
        color: #fff;
        font-size: 20rpx;
    }
}
</style>