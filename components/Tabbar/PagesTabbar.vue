<template>
    <div class="tabbar" :style="styles">
        <view class="bar" :class="{ selected: current === index }" v-for="(item, index) in barList" :key="index"
            @click="itemClick(item)">
            <image class="bar-img" :src="current === index ? item.selectedImg : item.img"></image>
            <text class="text">{{ item.name }}</text>
        </view>
        <view class="bg-bar"></view>
    </div>
</template>

<script>
export default {
    props: {
        current: {
            type: Number | String,
            default: () => {
                return 0
            }
        },
        barList: {
            type: Array,
            default: () => {
                return []
            }
        },
        activeColor: {
            type: String,
            default: () => {
                return '#01B558'
            }
        },
        bgColor: {
            type: String,
            default: () => {
                return '#9bf7c8'
            }
        }
    },
    computed: {
        styles() {
            return { '--activeColor': this.activeColor, '--bgColor': this.bgColor, '--bgLeft': this.current * 25 + '%' }
        }
    },
    mounted() {
        uni.hideTabBar()
    },
    methods: {
        itemClick(item) {
            if (item.login && !isLogin()) {
                uni.$emit('showPop', {
                    refName: 'AlertMsg',
                    data: {
                        title: '提示',
                        content: '您还没有登录账号，\n是否立即前往登录？'
                    },
                    confirm: () => {
                        uni.navigateTo({
                            url: "/pages/liuhe/login"
                        })
                    },
                })
                return false
            }
            if (item.path == '') {
                pop('敬请期待', 2000)
                return false
            }
            uni.switchTab({
                url: item.path
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.tabbar {
    flex-shrink: 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 100rpx;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
    max-width: 480px;

    .bar {
        display: grid;
        place-items: center;
        color: #646566;
        font-size: 20rpx;
        text-align: center;

        .bar-img {
            width: 48rpx;
            height: 48rpx;
        }
    }

    .bg-bar {
        content: '';
        position: absolute;
        width: 25%;
        height: 100%;
        border-radius: 20rpx;
        background: var(--bgColor);
        z-index: -1;
        left: var(--bgLeft);
        transition: all .3s;
    }

    .selected {
        color: var(--activeColor);
    }
}
</style>