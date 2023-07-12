<template>
    <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" :mask-close-able="false" @open="handleOpen"
        @close="handleClose">
        <view class="verify">
            <component ref="verify" :is="componentId" @success="handleSuccess" @fail="fail"></component>
            <view class="btn-icons">
                <uni-icons type="close" size="34" @click="close"></uni-icons>
                <uni-icons type="loop" size="31" @click="$refs.verify.loadData()"></uni-icons>
            </view>
        </view>
    </u-popup>
</template>

<script>
import Select from './Select'
import Input from './Input'
import Slide from './Slide'

export default {
    name: "Verify",
    components: {
        Select,
        Input,
        Slide
    },
    props: {
        zIndex: {
            type: [Number, String],
            default: () => {
                return 10075
            }
        }
    },
    data() {
        return {
            show: false,
            success: null,
            fail: null,
            /**
             * 验证码类型: Select 点选 Input 输入 Slide 滑动 
             */
            verifyTypeList: ['Input', 'Slide'],
            componentId: 'Select',
        }
    },
    methods: {
        open(data = {}, { success, fail }) {
            this.show = true

            const { verifyType } = data
            // 如果没指定验证码类型 随意使用一个
            this.componentId = verifyType || this.verifyTypeList[Math.floor(Math.random() * this.verifyTypeList.length)]

            this.success = success
            this.fail = fail
        },
        close() {
            this.show = false
        },
        handleOpen() {
            this.$emit('open')
            this.callback && this.callback({
                type: 'open'
            })
        },
        handleClose() {
            this.$emit('close')
            this.callback && this.callback({
                type: 'close'
            })
        },
        handleSuccess(res) {
            this.close()
            this.success(res)
        }
    }
}
</script>

<style lang="scss" scoped>
.verify {
    min-width: 200rpx;
    border-radius: 10rpx;
    border-top: 8rpx solid #5381FD;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30rpx;

    .btn-icons {
        display: flex;
        align-items: center;
        gap: 10rpx;
    }
}
</style>