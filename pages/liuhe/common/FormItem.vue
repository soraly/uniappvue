<template>
  <view class="form-col">
    <view class="form-item" :class="{ err: err }">
      <view class="label" v-show="showLabel">{{ labelName }}</view>
      <view class="input-view">
        <input class="uni-input" :style="inputStyle" :focus="focused" :value="val" @focus="_Focus" @blur="_Blur"
          @input="onInput" :placeholder='placeholder' :password="showPassword" :disabled="disabled" />
      </view>
      <view class="show">
        <image v-show="val != '' && showClear" src="/static/img/liuhe/login/close.png" @click="clearVal()"></image>
        <image @click="changePassword" v-show="isPassword && showPassword" src="/static/img/liuhe/login/baneye.png">
        </image>
        <image @click="changePassword" v-show="isPassword && !showPassword" src="/static/img/liuhe/login/eye.png"></image>
        <image v-show="showTipsIcon && succ" src="/static/img/liuhe/login/succ.png"></image>
        <image v-show="showTipsIcon && err" src="/static/img/liuhe/login/err.png"></image>
        <view class="text" v-show="requied">必填</view>
        <view class="text" v-show="optional">选填</view>
      </view>
    </view>
    <view class="msg-box">
      <view class="err-text" v-show="err || showMsg">
        {{ errMsg || tipsMsg }}
      </view>
      <view :class="{ 'pwd-type-box': showType && val != '' }">
        <view class="pwd-type" v-show="showType && val != ''" :class="type == 1 ? 'ruo' : type == 2 ? 'zhong' : 'qiang'">
          {{ type == 1 ? "弱" : type == 2 ? "中" : "强" }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "FormItem",
  props: {
    value: [Number, String],
    disabled: Boolean,
    labelName: [String],
    placeholder: [String],
    showLabel: {
      type: Boolean,
      default: true
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showType: {
      type: Boolean,
      default: false
    },
    isPassword: {
      type: Boolean,
      default: false,
    },
    inputStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showSucc: {
      type: Boolean,
      default: false,
    },
    showErr: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => {
        return []
      }
    },
    eachValue: {
      type: String,
      default: '',
    },
    requied: {
      type: Boolean,
      default: false
    },
    optional: {
      type: Boolean,
      default: false
    },
    tipsMsg: {
      type: String,
      default: "",
    },
    showTipsIcon: {
      type: Boolean,
      default: true
    },
    showClear: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      focused: false,
      type: 1,
      val: '',
      errMsg: "",
      succ: false,
      err: false,
      showMsg: false,
    };
  },
  mounted() {
    this.val = this.value
  },
  watch: {
    val(newVal) {
      this.val = newVal
      this.setRules()
      this.setType()
    }
  },
  methods: {
    setRules() {
      let rules = this.rules
      let status = true
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].type == "RegExp") {
          let reg = rules[i].rule
          status = reg.test(this.val)
        } else if (rules[i].type == "required") {
          status = !(this.val == '')
        } else if (rules[i].type == "MinLength") {
          status = this.val.length >= rules[i].minLength
        } else if (rules[i].type == "Each") {
          status = this.val == this.eachValue
        }
        if (status) {
          this.succ = true
          this.err = false
        } else {
          this.succ = false
          this.err = true
          this.errMsg = rules[i].msg
          break;
        }
      }
    },
    clearVal() {
      this.val = ""
      this.succ = false
      this.err = false
      this.errMsg = ""
      this.type = 1
    },
    setType() {
      if (!this.showType) return false
      let numReg = /^[0-9]*$/
      if (numReg.test(this.val)) {
        this.type = 1
      }
      let zmNum = /[a-z].*[0-9]|[0-9].*[a-z]/;
      if (zmNum.test(this.val)) {
        console.log(222)
        this.type = 2
      }
      let dzmNum = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
      if (dzmNum.test(this.val)) {
        console.log(333)
        this.type = 3
      }
    },
    changePassword() {
      this.showPassword = !this.showPassword
    },
    /**
     * 输入时触发
     * @param {Object} event
     */
    onInput(event) {
      let value = event.detail.value;
      // 判断是否去除空格
      if (this.trim) {
        if (typeof (this.trim) === 'boolean' && this.trim) {
          value = this.trimStr(value)
        }
        if (typeof (this.trim) === 'string') {
          value = this.trimStr(value, this.trim)
        }
      };
      if (this.errMsg) this.errMsg = ''
      this.val = value
      // TODO 兼容 vue2
      this.$emit('input', value);
      // TODO　兼容　vue3
      this.$emit('update:modelValue', value)
    },
    /**
     * 外部调用方法
     * 获取焦点时触发
     * @param {Object} event
     */
    onFocus() {
      this.$nextTick(() => {
        this.focused = true
      })
      this.$emit('focus', null);
    },

    _Focus(event) {
      this.focusShow = true
      if (this.tipsMsg !== '') {
        this.showMsg = true
      }
      this.$emit('focus', event);
    },
    /**
     * 外部调用方法
     * 失去焦点时触发
     * @param {Object} event
     */
    onBlur() {
      this.setRules()
      this.focused = false
      this.$emit('focus', null);
    },
    _Blur(event) {
      let value = event.detail.value;
      this.focusShow = false
      this.$emit('blur', event);
      // 根据类型返回值，在event中获取的值理论上讲都是string
      if (this.isEnter === false) {
        this.$emit('change', this.val)
      }
      this.setRules()
      if (this.tipsMsg != '') {
        this.showMsg = false
      }
      // 失去焦点时参与表单校验
      if (this.form && this.formItem) {
        const {
          validateTrigger
        } = this.form
        if (validateTrigger === 'blur') {
          this.formItem.onFieldChange()
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.form-col {
  margin-bottom: 30rpx;
}

.form-item {
  width: 630rpx;
  height: 100rpx;
  background: #F5F5F5;
  border: 1px solid #E2E2E3;
  border-radius: 50rpx;
  display: flex;
  align-items: center;

  .label {
    font-weight: 400;
    font-size: 30rpx;
    color: #A1A1A1;
    width: 148rpx;
    margin-left: 52rpx;
  }

  .input-view {
    width: 380rpx;
    margin: 0;

    .uni-input {
      width: 100%;
      border: none;
      background: none;
      text-align: left;
      font-size: 26rpx;
      color: #333333;
    }
  }

  .show {
    max-width: 140rpx;
    margin-right: 26rpx;
    font-weight: 400;
    font-size: 26rpx;
    text-align: center;
    color: #A1C8E0;
    display: flex;
    position: absolute;
    right: 60rpx;

    image {
      height: 48rpx;
      width: 48rpx;
    }

    .text {
      color: #8cb2c9;
      font-size: 30rpx;
    }
  }
}

.err {
  background: #FFE9E9;
  border: 1px solid #E6ABAB;
}

.msg-box {
  display: flex;
  margin-top: 10rpx;
  justify-content: flex-start;

  .err-text {
    font-weight: 400;
    font-size: 23rpx;
    text-align: center;
    color: #CC3333;
    margin-left: 20rpx;
  }

  .pwd-type-box {
    height: 30rpx;
  }

  .pwd-type {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90rpx;
    height: 30rpx;
    border-radius: 50rpx;
    font-weight: 500;
    font-size: 22rpx;
    color: #FFFFFF;
    margin-right: 20rpx;
    right: 60rpx;
  }

  .ruo {
    background: #FF2D44;
  }

  .zhong {
    background: #FF9933;
  }

  .qiang {
    background: #00C957;
  }

}
</style>