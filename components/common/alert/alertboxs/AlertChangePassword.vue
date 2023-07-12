<template>
    <u-popup v-model="show" mode="center" border-radius="10" :z-index="zIndex" :mask-close-able="false" @open="handleOpen"
        @close="handleClose">
        <view class="change-password">
            <view class="title">修改登录密码</view>
            <uni-forms ref="valiForm" :rules="rules" :modelValue="formData">
                <uni-forms-item name="pwd">
                    <uni-easyinput type="password" v-model="formData.pwd" placeholder="请输入6-16位包含英文/数字/符号两种" />
                </uni-forms-item>
                <uni-forms-item name="confirmPwd">
                    <uni-easyinput type="password" v-model="formData.confirmPwd" placeholder="请确认密码" />
                </uni-forms-item>
            </uni-forms>
            <view class="tip">您是首次登录或被重置密码，为了账户安全，请修改密码。</view>
            <button class="btn" type="primary" @click="submit">提交</button>
        </view>
    </u-popup>
</template>

<script>
import { underOpenAccountUpdatePwd } from '@/utils/ptp'
export default {
    name: "Account",
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
            callback: null,
            formData: {
                pwd: '',
                confirmPwd: '',
            },
            rules: {
                pwd: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '登陆密码不能为空'
                        },
                        { pattern: /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{6,16}$/, errorMessage: '登陆密码格式不正确' }
                    ]
                },
                confirmPwd: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '确认密码不能为空'
                        },
                        { pattern: /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{6,16}$/, errorMessage: '确认密码格式不正确' },
                        {
                            validateFunction: (rule, value, data, callback) => {
                                if (value !== this.formData.pwd) {
                                    callback('两次密码输入不一致')
                                }
                                return true
                            }
                        }
                    ]
                }
            },
        }
    },
    watch: {
        '$store.state.appInfoStore.userInfo.createType': {
            handler(val) {
                console.log('createType', val);
                if (val === '1') {
                    this.show = true
                }
            },
            immediate: true
        }
    },
    methods: {
        open(_, { callback }) {
            this.show = true
            this.callback = callback
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
        async submit() {
            const vali = await this.$refs.valiForm.validate().catch(err => {
                console.log('err', err);
            })
            if (vali) {
                const res = await underOpenAccountUpdatePwd(this.formData)
                pop(res.message, 1000)
                if (res.code === 200) {
                    const userInfo = uni.getStorageSync('userInfo');
                    userInfo.createType = '2'
                    uni.setStorageSync('userInfo', userInfo);
                    this.$store.dispatch("updateUserInfoProperties", { createType: '2', })
                    this.close()
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.change-password {
    padding: 30rpx;
    width: 560rpx;

    .title {
        color: #444;
        text-align: center;
        font-size: 32rpx;
        margin-bottom: 40rpx;
    }

    /deep/ .uni-easyinput__content-input {
        height: 70rpx;
        font-size: 20rpx;
    }


    .tip {
        color: #666;
        font-size: 24rpx;
    }

    .btn {
        background: #16A7FB;
        margin-top: 50rpx;
    }
}
</style>