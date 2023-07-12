<template>
  <view class="help" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <Empty v-if="!list.length && !loading" />
    <view class="box-div">
      <view class="list-row">
        <view class="list-item" v-for="(item, index) in list" @click="detail(item)">
          <view class="slot-text">{{ item.title }}</view>
          <view class="icon-box">
            <uni-icons type="right" color="#C7C7CC" style="font-size: 40rpx"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <view class="footer-box">
      <view class="footer">
        <view class="ts" @click="toUrl('/pages/user/feedback/index')">
          <image src="/static/img/liuhe/help/ts.png"></image>
          <text class="text">有奖反馈</text>
        </view>
        <view class="kf" @click="toUrl('/pages/user/service/index')">
          <image src="/static/img/liuhe/help/kf.png"></image>
          <text class="text">联系客服</text>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { helps } from "../../../utils/lottery/help";
import Empty from '../../../components/common/empty/empty'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, Empty, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      id: '',
      title: "帮助中心",
      headerStyle: {
        backgroundColor: "#1794FF",
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      list: [],
      loading: false
    }
  },
  onLoad(option) {
    this.id = option.id
    this.title = option.title
    this.getList()
  },
  methods: {
    toUrl(url) {
      this.isLogin = global.isLogin()
      if (!this.isLogin) {
        uni.navigateTo({
          url: "/pages/liuhe/login"
        })
      } else {
        uni.navigateTo({
          url: url
        })
      }
    },
    getList() {
      this.loading = true
      helps(this.id).then(res => {
        if (res.code == 200) {
          this.list = res.result
        } else {
          pop(res.message, 2000)
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    detail(item) {
      let url = './detail?id=' + item.id
      uni.navigateTo({ url: url })
    },
  }
}
</script>

<style lang="scss" scoped>
.help {
  background: #F3F3F3;
  height: var(--vh);
  font-family: 'PingFang SC';

  /deep/ .input-view {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .box-div {
    .title {
      padding: 14rpx 20rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #444444;
    }

    .list-row {
      .list-item {
        height: 110rpx;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 35rpx 0 40rpx;
        border-bottom: 1px solid #DDDDDD;

        .slot-text {
          font-weight: 300;
          font-size: 32rpx;
          color: #222222;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .footer-box {
    height: 110rpx;

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 480px;
      height: 110rpx;
      background: #FFFFFF;

      .ts,
      .kf {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: center;

        image {
          height: 40rpx;
          width: 40rpx;
          margin-left: 10rpx;
        }

        .text {
          font-weight: 400;
          font-size: 32rpx;
          color: #222222;
          margin-left: 10rpx;
        }
      }

      .ts {
        border-right: 1px solid #EFEFEF;
      }
    }
  }
}
</style>