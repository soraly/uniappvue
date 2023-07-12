<template>
  <view class="detail">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
      <block slot="right">
        <view class="lin-btn" @click="toLog">
          领取记录
        </view>
      </block>
    </NavBar>
    <view class="table-box" v-if="info.type == 2">
      <view class="td-box">
        <view class="text">{{ info.taskTypeVo2.name }}</view>
        <view class="text">额外奖励</view>
      </view>
      <view class="td-box" v-for="(item, index) in info.taskTypeVo2.rules">
        <view class="text">{{ item.dec }}</view>
        <view class="coin">{{ item.rewardMoney }}</view>
      </view>
    </view>
    <view class="task-box" v-if="info.type == 1">
      <view class="task-item" v-for="(item, index) in info.taskTypeVo1">
        <image class="label" v-if="item.type == 'day'" src="/static/img/liuhe/activity/mr.png"></image>
        <image class="label" v-else-if="item.type == 'sign'" src="/static/img/liuhe/activity/qd.png"></image>
        <image class="label" v-else-if="item.type == 'single'" src="/static/img/liuhe/activity/dc.png"></image>
        <image class="label" v-else src="/static/img/liuhe/activity/mz.png"></image>
        <view class="left">
          <view class="title">
            {{ item.des }}
          </view>
          <view class="progress-box">
            <liu-progressbar :progress="item.taskSpeed > item.taskVolume ? 100 : (item.taskSpeed / item.taskVolume) * 100"
              bgColor="#00C200" dsColor="#DDDDDD" color="#FFFFFF" fontSize="24rpx" :height="'26rpx'"
              :borderRadius="'40rpx'" />
          </view>
        </view>
        <view class="right">
          <view class="btn">
            <image v-if="item.status == 1" @click="getReceive(item)" src="/static/img/liuhe/activity/lqbtn.png"></image>
            <image v-else-if="item.status == 2" src="/static/img/liuhe/activity/ylq.png"></image>
            <image v-else @click="goUrl(item)" src="/static/img/liuhe/activity/go-btn.png"></image>
          </view>
          <view class="coin">
            <image src="/static/img/liuhe/activity/coin.png"></image>
            <text class="coin-text">{{ item.rewardMoney }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="detail-box">
      <mp-html :content="info.content" />
    </view>
    <view class="footer-btn">
      <view class="btn-box" v-if="info.type == 2">
        <view class="back" @click="backPre">
          返回
        </view>
        <view class="sq-btn" v-if="info.taskTypeVo2.status == 0" @click="getApply">
          申请
        </view>
        <view class="sq-btn dis-btn" v-else>
          申请
        </view>
      </view>
      <view class="btn-box" v-if="info.type == 1">
        <view class="back" @click="backPre">
          返回
        </view>
        <view class="sq-btn" v-if="isLq" @click="getReceive(null)">
          一键领取
        </view>
        <view class="sq-btn dis-btn" v-else>
          一键领取
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { details, receive, apply } from "../../../utils/activity/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "detail",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: this.$t("liuhe.activity.detail.title"),
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      id: 0,
      info: {},
      reloadState: false
    }
  },
  onLoad(option) {
    this.id = option.id
    this.getInfo()
  },
  onShow() {
    if (this.reloadState) {
      this.getInfo()
    }
  },
  computed: {
    isLq() {
      let status = false
      this.info.taskTypeVo1.some(item => {
        if (item.status == 1) {
          status = true
        }
      })
      console.log(status)
      return status
    }
  },
  methods: {
    toLog() {
      uni.navigateTo({ url: "./log" })
    },
    getInfo() {
      let prams = {
        id: this.id
      }
      details(prams).then(res => {
        if (res.code == 200) {
          this.info = res.result
          this.title = this.info.name
          this.reloadState = false
        } else {
          this.reloadState = true
          // pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    backPre() {
      console.log(111)
      backPage()
    },
    goUrl(item) {
      let url = '';
      if (this.info.jumpType == 1) {
        url = "/pages/pay/index"
      } else if (this.info.jumpType == 2) {
        url = ""
      } else {
        url = "/pages/liuhe/list"
      }
      uni.navigateTo({ url: url })
    },
    getApply() {
      let prams = {
        taskId: this.info.taskId
      }
      apply(prams).then(res => {
        if (res.code == 200) {
          pop("申请成功", 2000)
          this.getInfo()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getReceive(item = null) {
      let prams = {
        ruleId: 0,
        taskId: this.info.taskId
      }
      if (item !== null) {
        prams.ruleId = item.ruleId
      }
      receive(prams).then(res => {
        if (res.code == 200) {
          pop("领取成功", 2000)
          this.getInfo()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.detail {
  font-family: 'PingFang SC';
  background: #F6F6F6;

  .lin-btn {
    font-weight: 400;
    font-size: 28rpx;
    color: #FFFFFF;
  }

  .table-box {
    margin: 20rpx;
    background: #FFFFFF;
    border-radius: 10rpx;

    .td-box {
      height: 79rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 400;
      font-size: 28rpx;
      color: #03536E;

      .text {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .coin {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FE9D2A;
      }

      &:nth-child(2n) {
        background: #F6F6F6;
      }
    }
  }

  .task-box {
    margin: 20rpx;

    .task-item {
      padding: 20rpx;
      margin-top: 20rpx;
      background: #FFFFFF;
      border: 1px solid #DDDDDD;
      border-radius: 10px;
      display: flex;
      align-items: center;
      position: relative;

      .label {
        position: absolute;
        top: 0;
        left: 0;
        height: 20rpx;
        width: 44rpx;
      }

      .left {
        width: 100%;

        .title {
          font-weight: 300;
          font-size: 24rpx;
          color: #000000;
        }

        .progress-box {
          width: 350rpx;
          margin-top: 7rpx;
        }
      }

      .right {
        .btn {
          display: flex;
          justify-content: center;

          image {
            height: 39rpx;
            width: 109rpx;
          }
        }

        .coin {
          margin-top: 6rpx;
          display: flex;
          justify-content: center;
          align-items: center;

          image {
            height: 24rpx;
            width: 24rpx;
          }

          .coin-text {
            margin-left: 10rpx;
            font-weight: 400;
            font-size: 20rpx;
            color: #FE9D2A;
          }
        }
      }
    }
  }

  .detail-box {
    margin: 20rpx;
    padding: 20rpx;
    background: #FFFFFF;
    border-radius: 10rpx;

    .title {
      font-weight: 500;
      font-size: 28rpx;
      color: #03536E;
      opacity: 0.9;
    }

    .desc-body-box {
      margin-top: 10rpx;
      font-weight: 400;
      font-size: 28rpx;
      line-height: 39rpx;
      color: #444444;
    }
  }

  .footer-btn {
    height: 100rpx;

    .btn-box {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      width: 100%;
      max-width: 480px;
      height: 100rpx;
      background: #ffffff;
      z-index: 1;

      .back,
      .sq-btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 300rpx;
        height: 70rpx;
        border-radius: 10rpx;
        color: #FFFFFF;
      }

      .back {
        background: #FF9900;
      }

      .sq-btn {
        background: #8CB2C9;
      }

      .dis-btn {
        background: #CFCFCF;
      }
    }
  }
}
</style>