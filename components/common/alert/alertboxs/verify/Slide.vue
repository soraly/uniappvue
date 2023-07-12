<template>
    <view class="slide" id="slide">
        <view class="title">请拖动滑块完成拼图</view>
        <view class="imgs">
            <image class="bg" :src="imgs.img"></image>
            <image class="bar" :src="imgs.bar" :style="{ left: movable.x + 'px' }"></image>
        </view>
        <movable-area>
            <movable-view :x="movable.x" direction="horizontal" @change="onChange" @touchend="onMovableEnd"
                @mouseup="onMovableEnd">
                <image class="btn" src="/static/img/verify/slide/btn.png"></image>
            </movable-view>
            <view class="movable-bg"></view>
        </movable-area>
    </view>
</template>

<script>
export default {
    data() {
        return {
            imgs: {},
            imgsList: [
                {
                    img: '/static/img/verify/slide/1.png',
                    bar: '/static/img/verify/slide/1-1.png',
                    ratio: 68,
                    gap: 0.8
                },
                {
                    img: '/static/img/verify/slide/1.png',
                    bar: '/static/img/verify/slide/2-2.png',
                    ratio: 68,
                    gap: 0.8
                },
                {
                    img: '/static/img/verify/slide/3.png',
                    bar: '/static/img/verify/slide/3-3.png',
                    ratio: 68,
                    gap: 0.8
                }
            ],
            movable: {
                x: 0,
            }
        }
    },
    mounted() {
        this.loadData()
    },
    methods: {
        loadData() {
            /**
             * TODO 此处应该请求接口获取验证码内容
             * img 验证码背景图片地址         
             * bar 验证码滑动图片块地址          
             * ratio 滑动距离左边距离(百分比) 50              
             * gap 正负差距(允许多少误差 百分比)     
             */
            // 随机内容
            const imgs = this.imgsList[Math.floor(Math.random() * this.imgsList.length)]

            // 重新加载的如果和已有的一样 再重新加载一个
            if (imgs.img === this.imgs.img) {
                this.loadData()
                return
            }
            this.imgs = imgs
        },
        onChange: function (e) {
            this.movable.x = e.detail.x
        },
        onMovableEnd() {
            /**
             * TODO 应当请求接口判断是否验证成功
             * 以下内容仅供参考
             */
            const query = uni.createSelectorQuery().in(this);
            query.select('#slide').boundingClientRect(data => {
                const ratioBar = this.movable.x / data.width * 100
                const { ratio, gap } = this.imgs
                // 验证失败
                if (ratioBar < ratio - gap || ratioBar > ratio + gap) {
                    this.$nextTick(() => {
                        this.movable.x = 0
                    })
                    this.$emit('fail', { code: 0, message: '未滑动到指定范围内', success: false })
                    return
                }
                uni.showLoading({
                    title: '验证中'
                });
                setTimeout(() => {
                    uni.hideLoading();
                    this.$emit('success', { code: 0, message: '成功', success: false })
                }, 1000);
            }).exec();
        }
    }
}
</script>

<style lang="scss" scoped>
.slide {
    .title {
        color: #444;
        text-align: center;
        font-size: 24rpx;
        margin-bottom: 20rpx;
    }

    .imgs {
        position: relative;

        .bg {
            width: 375rpx;
            height: 254rpx;
        }

        .bar {
            width: 73rpx;
            height: 62rpx;
            position: absolute;
            left: 0;
            top: 89rpx;
        }
    }

    movable-area {
        height: 60rpx;
        width: 100%;

        .movable-bg {
            width: 100%;
            height: 24rpx;
            border-radius: 30rpx;
            background: #D9D9D9;
            position: absolute;
            z-index: -1;
            top: 50%;
            transform: translateY(-50%);
        }

        movable-view {
            display: grid;
            place-items: center;
            width: 100rpx;
            height: 100%;

            .btn {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>