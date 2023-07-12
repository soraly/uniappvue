<template>
    <view class="container">
        <uni-forms ref="valiForm" :rules="rules" :modelValue="formData" label-position="top">
            <uni-forms-item label="会员账号" required name="userName">
                <uni-easyinput v-model="formData.userName" placeholder="请输入4-16位字符，支持英文/数字" />
            </uni-forms-item>
            <uni-forms-item label="登陆密码" required name="pwd">
                <uni-easyinput type="password" v-model="formData.pwd" placeholder="请输入6-16位包含英文/数字/符号两种" />
            </uni-forms-item>
            <uni-forms-item label="确认密码" name="confirmPwd">
                <uni-easyinput type="password" v-model="formData.confirmPwd" placeholder="请再次输入登陆密码" />
            </uni-forms-item>
        </uni-forms>
        <button class="btn" type="primary" @click="submit">提交</button>
    </view>
</template>
<script>
import { underOpenAccount } from "@/utils/ptp";
export default {
    data() {
        return {
            formData: {
                userName: '',
                pwd: '',
                confirmPwd: '',
            },
            rules: {
                userName: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '会员账号不能为空'
                        },
                        { pattern: /^[a-zA-Z0-9]{4,16}$/, errorMessage: '会员账号格式不正确' }
                    ]
                },
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
    methods: {
        async submit() {
            const vali = await this.$refs.valiForm.validate().catch(err => {
                console.log('err', err);
            })
            if (vali) {
                uni.$emit('showPop', {
                    refName: 'Verify',
                    success: () => {
                        underOpenAccount(this.formData).then((res) => {
                            pop(res.message)
                            if (res.code !== 200) {
                                return
                            }
                            this.formData = {
                                userName: '',
                                pwd: '',
                                confirmPwd: '',
                            }
                        })
                    },
                    fail: (e) => {
                        console.log('fail', e);
                    }
                })
            }
        },
    }
}
</script>
<style lang="scss">
/deep/ .uni-easyinput__content-input {
    height: 70rpx;
}

.btn {
    background: #1794FF;
}
</style>

