<template>
  <view class="bank-div">
    <view class="bank" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <view class="title">确认绑定信息</view>
      <view class="from">
        <view class="from-row">
          <view class="from-rol">
            <view class="left">USDT地址</view>
            <view class="right">{{ formData.bankNumber }}</view>
          </view>
          <view class="from-rol">
            <view class="left">钱包名称</view>
            <view class="right">{{ data.name }}</view>
          </view>
        </view>
      </view>
      <view class="next-box">
        <view class="next-btn" @click="actionFrom">确定绑定</view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/common/navBar/navBar";
import { addUSDT } from "../../../../utils/lottery/mine";
export default {
  name: "ConfirmWallet",
  components: { NavBar },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "确认信息",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      isAction: false
    }
  },
  methods: {
    back() {
      this.$emit('closeNext');
    },
    backIndex() {
      this.$emit("backIndex");
    },
    actionFrom() {
      if (this.isAction == true) {
        pop("请不要重复提交", 2000)
        return false
      }
      this.isAction = true
      let prams = this.formData
      addUSDT(prams).then(res => {
        if (res.code == 200) {
          this.isAction = true
          /*pop("添加成功",2000)*/
          this.$emit("backIndex");
          /*uni.navigateTo({
            url:"/pages/user/bank/index"
          })*/
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
.bank-div {
  width: 100vw;
  background: rgba(0, 0, 0, 0.1);
}

.bank {
  font-family: 'PingFang SC';
  width: 100vw;
  max-width: 480px;
  margin: auto;
  height: var(--vh);
  background: #ffffff;

  .title {
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
          width: 20%;
          font-weight: 400;
          font-size: 30rpx;
          line-height: 42rpx;
          color: #222222;
        }

        .right {
          width: 80%;
          display: flex;
          flex-direction: row-reverse;
          color: #777777;
          font-size: 30rpx;
        }
      }
    }
  }

  .next-box {
    margin-top: 29rpx;
    display: flex;
    justify-content: center;

    .next-btn {
      width: 705rpx;
      height: 90rpx;
      background: #16A7FB;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 45rpx;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .ok {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100rpx;

    .img {
      image {
        height: 250rpx;
        width: 250rpx;
        border-radius: 0px;
      }
    }

    .msg {
      font-weight: 400;
      font-size: 32rpx;
      line-height: 45rpx;
      color: #666666;
    }
  }
}
</style>