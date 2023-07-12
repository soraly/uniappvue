<template>
  <scroll-view scroll-y="true" show-scrollbar="true" scroll-with-animation="true" class="data-page"
    :style="{ marginTop: safeHeight }">
    <nav-bar :fontColor="'#FFFFFF'" :isBack="isBack" :titleStyle="titleStyle" :title="title" :headerStyle="headerStyle">
      <block slot="right">
        <view class="next-box">
          <view class="next" @click="jump">跳过</view>
        </view>
      </block>
    </nav-bar>
    <view class="step-box">
      <view class="step-item">
        <image src="/static/img/user/accountlog/lv.png" v-if="step >= 1"></image>
        <image src="/static/img/user/accountlog/hui.png" v-else></image>
        <view class="title" :class="{ 'hui-title': step >= 1 }">设置资金密码</view>
        <view class="left-line" :class="{ 'hui-line': step < 1 }"></view>
      </view>
      <view class="step-item">
        <view class="right-line" :class="{ 'hui-line': step == 1 }"></view>
        <image src="/static/img/user/accountlog/lv.png" v-if="step >= 2"></image>
        <image src="/static/img/user/accountlog/hui.png" v-else></image>
        <view class="title" :class="{ 'hui-title': step >= 2 }">绑定银行卡</view>
      </view>
    </view>
    <view v-if="step == 1">
      <view class="prop-box">
        {{ pwd_step == 1 ? '请设置资金密码，建议不要与银行卡取款密码相同' : '再次填写以确认' }}
      </view>
      <view class="pwd-box">
        <one-input v-show="pwd_step == 1" v-model="pwd" :maxlength="6" :isPwd="true" @finish="finishedOne" ref="hi"
          type="box">
        </one-input>
        <one-input v-show="pwd_step == 2" v-model="repwd" :maxlength="6" :isPwd="true" @finish="finishedAct" ref="hi"
          type="box">
        </one-input>
      </view>
      <view class="btn-box pwd-btn" @click="nexPwd">下一步</view>
    </view>
    <view v-else-if="step == 2">
      <view class="titles">请绑定持卡人本人银行卡</view>
      <view class="from">
        <view class="from-row">
          <view class="from-rol">
            <view class="left">姓名：</view>
            <view class="right">
              <uni-easyinput class="input-item" v-model="formData.realName" :inputBorder="false" :styles="styles"
                :disabled="true" :placeholderStyle="placeholderStyle2" placeholder="请输入姓名"></uni-easyinput>
            </view>
          </view>
          <view class="from-rol">
            <view class="left">卡号：</view>
            <view class="right">
              <uni-easyinput class="input-item" v-model="formData.bankNumber" :inputBorder="false" :styles="styles"
                :placeholderStyle="placeholderStyle2" placeholder="请输入银行卡号"></uni-easyinput>
            </view>
          </view>
          <view class="from-rol">
            <view class="left">银行：</view>
            <view class="right" @click="selectBank()">
              <view class="text-box">
                <view class="text" v-if="!BankInfo">请选择银行</view>
                <view class="bank" v-else>
                  <image :src="BankInfo.logoMobile"></image>
                  {{ BankInfo.name }}
                </view>
              </view>
              <view class="arrow">
                <uni-icons type="forward" style="color: #999999;" size="20"></uni-icons>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="btn-box bank-btn" @click="nextBank()">
        下一步
      </view>
      <uni-drawer ref="bank" :mode="'right'" :width="100">
        <bank-list @closePay="closePay" :data="bank" @searchBank="searchBank" @setBank="setBank">
        </bank-list>
      </uni-drawer>
      <uni-drawer ref="bankConfirm" :mode="'right'" :width="100">
        <Confirm @closeNext="closeNext" @backIndex="backIndex" :data="BankInfo" :form-data="formData" />
      </uni-drawer>
      <uni-drawer ref="succ" :mode="'right'" :width="100">
        <Success />
      </uni-drawer>
    </view>
    <view v-else-if="step == 3">
      <view class="titles">确认银行卡信息</view>
      <uni-list class="list-box">
        <uni-list-item class="list-item" thumb-size="base" showArrow>
          <template v-slot:header>
            <view class="slot-box">
              <image class="slot-image" :src="BankInfo.logoMobile" mode="widthFix">
              </image>
            </view>
          </template>
          <template v-slot:body>
            <text class="slot-text">{{ BankInfo.name }}
              <view class="slot-desc">{{ formData.bankNumber }}</view>
            </text>
          </template>
        </uni-list-item>
      </uni-list>
      <view class="btn-box bank-btn" @click="confirmBtn">确定绑定</view>
    </view>
    <view v-else>
      <view class="img-box">
        <image src="/static/img/user/bank/ok.png"></image>
        <view class="msg">绑定成功</view>
      </view>
      <view class="btn-box bank-btn" @click="jump">完成</view>
    </view>
    <AlertInjectLayer />
  </scroll-view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import oneInput from '@/components/myp-one/myp-one'
import { addBankCard, bankList, getRealName, setPinCode } from "../../utils/lottery/mine";
import Confirm from "../user/bank/common/Confirm";
import Success from "../user/bank/common/Success";
import BankList from "../user/bank/common/BankList";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import { config } from '@/config/config.js'

export default {
  name: "set_data",
  components: {
    AlertInjectLayer, NavBar, oneInput, Confirm, Success, BankList
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: this.$t("liuhe.setdata.title"),
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      styles: {
        'width': '100%',
        'height': '100%',
        'border': 'none',
        'background': '#FFFFFF',
        'text-align': 'left',
      },
      placeholderStyle2: "font-weight: 400;font-size: 30rpx;",
      isBack: true,
      step: 1,
      pwd_step: 1,
      pwd: '',
      repwd: '',
      bank: [],
      BankInfo: null,
      isAction: false,
      formData: {
        bankId: '',
        realName: '',
        bankNumber: '',
      }
    }
  },
  onLoad() {
    this.realName()
    this.getBankList()
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    jump() {
      const urlMap = {
        'ALL': '/pages/liuhe/index',
        'LIUHE': '/pages/pages-liuhe/index',
        'LUNTAN': '/pages/pages-luntan/index'
      }
      uni.switchTab({
        url: urlMap[config.station]
      })
    },
    realName() {
      getRealName().then(res => {
        if (res.result) {
          this.isDisabled = true
          this.formData.realName = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getBankList() {
      let prams = {
        bankName: this.keyword,
      };
      bankList(prams).then(res => {
        this.bank = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    selectBank() {
      this.$refs.bank.open()
    },
    searchBank(keyword) {
      this.keyword = keyword
      this.getBankList()
    },
    setBank(item) {
      this.BankInfo = item
      this.formData.bankId = item.id
      this.closePay()
    },
    closePay() {
      this.$refs.bank.close()
    },
    finishedOne(val) {
      this.pwd = val
      this.pwd_step = 2
    },
    finishedAct(val) {
      this.repwd = val
    },
    nexPwd() {
      if (this.pwd == '') {
        pop("请输入密码", 2000)
        return false
      }
      if (this.pwd != this.repwd) {
        pop("两次密码不一致", 2000)
        this.pwd_step = 1
        this.pwd = ''
        this.repwd = ''
        return false
      }
      let prams = { pinCode: this.pwd };
      setPinCode(prams).then(res => {
        if (res.code == 200) {
          pop("设置成功", 2000)
          this.step = 2
          this.isBack = false
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    nextBank() {
      if (this.formData.realName != '' && this.formData.bankNumber != '' && this.formData.bankId != '') {
        this.step = 3
      } else {
        pop("请输入完整的信息", 2000)
      }
    },
    confirmBtn() {
      if (this.isAction == true) {
        pop("请不要重复提交", 2000)
        return false
      }
      this.isAction = true
      let prams = {
        bankId: this.formData.bankId,
        bankNumber: this.formData.bankNumber,
        realName: this.formData.realName
      }
      addBankCard(prams).then(res => {
        if (res.code == 200) {
          this.isAction = true
          this.step = 4
        } else {
          pop(res.message, 2000)
          return false
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-page {
  background: #fff;
  height: var(--vh);

  .next-box {
    .next {
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }

  .step-box {
    height: 230rpx;
    left: 0px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;

    .step-item {
      width: 330rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      image {
        height: 50rpx;
        width: 50rpx;
      }

      .title {
        font-weight: 400;
        font-size: 30rpx;
        text-align: center;
        margin-top: 20rpx;
        color: #999999;
      }

      .hui-title {
        color: #137620;
      }

      .hong-title {
        color: #CC3333;
      }

      .time {
        font-weight: 400;
        font-size: 22rpx;
        text-align: center;
        color: #999999;
        margin-top: 20rpx;
        height: 32rpx;
      }

      .left-line {
        position: absolute;
        height: 4rpx;
        width: 160rpx;
        background: linear-gradient(180deg, #6BD776 0%, #24A335 100%);
        border-radius: 20rpx;
        top: 20rpx;
        left: 190rpx;
      }

      .right-line {
        position: absolute;
        height: 4rpx;
        width: 160rpx;
        background: linear-gradient(180deg, #6BD776 0%, #24A335 100%);
        border-radius: 20rpx;
        top: 20rpx;
        right: 160rpx;
      }

      .hui-line {
        background: #CCCCCC;
      }
    }
  }

  .prop-box {
    font-weight: 600;
    font-size: 28rpx;
    text-align: center;
    color: #CC3333;
    margin: 29rpx 0;
  }

  .btn-box {
    width: 705rpx;
    height: 90rpx;
    background: #16A7FB;
    border-radius: 50rpx;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 32rpx;
    text-align: center;
    color: #FFFFFF;
  }

  .pwd-btn {
    margin-top: 200rpx;
  }

  .bank-btn {
    margin-top: 80rpx;
  }

  .titles {
    height: 80rpx;
    border-radius: 0px;
    padding: 0rpx 10rpx 0rpx 20rpx;
    background: #F6F6F6;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 30rpx;
    line-height: 80rpx;
    color: #999999;
  }

  .from {
    .from-row {
      .from-rol {
        display: flex;
        height: 90rpx;
        padding: 0rpx 20rpx 0rpx 20rpx;
        background: #FFFFFF;
        border-bottom: 1px solid #DDDDDD;
        align-items: center;

        .left {
          width: 15%;
          font-weight: 400;
          font-size: 30rpx;
          line-height: 42rpx;
          color: #222222;
        }

        .right {
          width: 85%;
          display: flex;

          .text-box {
            width: 90%;
            margin-left: 20rpx;
            color: #999999;
          }

          .bank {
            width: 90%;
            color: #222222;
            display: flex;
            align-items: center;

            image {
              margin-right: 4rpx;
              height: 40rpx;
              width: 40rpx;
            }
          }

          .arrow {
            width: 10%;
            text-align: right;
          }
        }
      }
    }
  }

  .list-box {
    .list-item {
      padding: 0rpx 0;
      height: 120rpx;

      .slot-box {
        display: flex;
        align-items: center;

        .slot-image {
          height: 48rpx;
          width: 48rpx;
        }
      }

      .slot-text {
        margin-left: 20rpx;
        font-weight: 400;
        font-size: 32rpx;
        color: #222222;
        display: flex;
        align-items: center;

        .slot-desc {
          margin-top: 12rpx;
          font-weight: 400;
          font-size: 21rpx;
          line-height: 21rpx;
          color: #999999;
        }
      }
    }
  }

  .img-box {
    margin-top: 139rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    image {
      height: 250rpx;
      width: 250rpx;
    }

    .msg {
      font-weight: 400;
      font-size: 32rpx;
      color: #666666;
    }
  }
}
</style>