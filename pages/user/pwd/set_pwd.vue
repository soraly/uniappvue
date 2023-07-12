<template>
  <view class="log-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" :isBack="false">
      <block slot="left">
        <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
      </block>
    </NavBar>
    <view class="prop-box">
      {{ step == 1 ? '请设置资金密码，建议不要与银行卡取款密码相同' : '再次填写以确认' }}
    </view>
    <view class="pwd-box">
      <one-input v-show="step == 1" v-model="pwd" :maxlength="6" :isPwd="true" @finish="finishedOne" ref="hi" type="box">
      </one-input>
      <one-input v-show="step == 2" v-model="repwd" :maxlength="6" :isPwd="true" @finish="finishedAct" ref="hi"
        type="box">
      </one-input>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import oneInput from '@/components/myp-one/myp-one'
import { setPinCode } from "../../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "update_pwd",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, oneInput
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "资金密码设置",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      step: 1,
      pwd: '',
      repwd: '',
    }
  },
  mounted() {

  },
  methods: {
    back() {
      if (this.step == 2) {
        this.step = 1
      } else {
        uni.navigateBack()
      }
    },
    finishedOne(val) {
      this.pwd = val
      this.step = 2
    },
    finishedAct(val) {
      this.repwd = val
      if (this.pwd == '') {
        pop("请输入密码", 2000)
        return false
      }
      if (this.pwd != this.repwd) {
        pop("两次密码不一致,请重新输入", 2000)
        this.step = 1
        this.pwd = ''
        this.repwd = ''
        return false
      }
      let prams = { pinCode: this.pwd };
      setPinCode(prams).then(res => {
        if (res.code == 200) {
          uni.$emit('emitParams', { msg: '设置成功' })
          backPage()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.log-box {
  font-family: 'PingFang SC';
  height: var(--vh);
  background: #fff;

  .prop-box {
    font-weight: 600;
    font-size: 28rpx;
    text-align: center;
    color: #CC3333;
    margin: 29rpx 0;
  }
}
</style>