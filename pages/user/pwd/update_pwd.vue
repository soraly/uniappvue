<template>
  <view class="log-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" :isBack="false">
      <block slot="left">
        <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
      </block>
    </NavBar>
    <view class="prop-box">
      {{ step == 1 ? '请输入旧密码，以确认身份' : step == 2 ? '请设置资金密码，建议不要与银行卡取款密码相同' : '再次填写以确认' }}
    </view>
    <view class="pwd-box">
      <one-input v-show="step == 1" v-model="oldPwd" :maxlength="6" :isPwd="true" @finish="oldPwdVerify" ref="hi"
        type="box">
      </one-input>
      <one-input v-show="step == 2" v-model="pinCode" :maxlength="6" :isPwd="true" @finish="newPwdAct" ref="hi"
        type="box">
      </one-input>
      <one-input v-show="step == 3" v-model="repinCode" :maxlength="6" :isPwd="true" @finish="finishedAct" ref="hi"
        type="box">
      </one-input>
    </view>
    <uni-popup ref="err" type="center" :mask-click="false">
      <PopItem @retry="retry" :msg="msg"></PopItem>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import oneInput from '@/components/myp-one/myp-one';
import PopItem from "../../../components/common/PopItem/PopItem";
import { revisePinCode } from "../../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {

  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, oneInput, PopItem
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
      oldPwd: '',
      pinCode: '',
      repinCode: '',
      msg: '',
    }
  },
  mounted() {

  },
  methods: {
    back() {
      if (this.step > 1) {
        this.step -= 1
      } else {
        backPage()
      }
    },
    finishedOne(val) {
      this.oldPwd = val
      this.step = 2
    },
    errPwd() {
      this.$refs.err.open()
    },
    retry() {
      this.$refs.err.close()
    },
    oldPwdVerify() {
      if (this.oldPwd == '') {
        pop("请输入旧密码", 2000)
        return false
      }
      let prams = {
        'oldPinCode': this.oldPwd
      };
      revisePinCode(prams).then(res => {
        if (res.code == 200) {
          this.step = 2
        } else if (res.code == 600) {
          this.msg = res.message
          this.oldPwd = "";
          this.errPwd()
        } else {
          this.oldPwd = "";
          pop(res.message, 1000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    newPwdAct() {
      if (this.pinCode == '') {
        pop("请输入新密码", 1000)
        return false
      }
      this.step = 3
    },
    finishedAct(val) {
      this.repinCode = val
      if (this.pinCode == '') {
        pop("请输入密码", 1000)
        return false
      }
      if (this.pinCode != this.repinCode) {
        pop("两次密码不一致,请重新输入", 1000)
        this.step = 2
        this.pinCode = ''
        this.repinCode = ''
        return false
      }
      let prams = {
        oldPinCode: this.oldPwd,
        pinCode: this.pinCode
      };
      revisePinCode(prams).then(res => {
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