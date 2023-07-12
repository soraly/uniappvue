<template>
  <scroll-view :scroll-top="scrollTop" scroll-y="true" show-scrollbar="true" scroll-with-animation="true"
    @scrolltolower="lower" class="lottery-page" :style="{ marginTop: safeHeight }">
    <nav-bar :fontColor="'#FFFFFF'" :isBack="true" :titleStyle="titleStyle" :title="title" :headerStyle="headerStyle">
    </nav-bar>
    <view class="search">
      <view class="search-item">
        <uni-search-bar
          style="padding: 0;box-shadow: 0px -4rpx 4rpx rgba(66, 175, 153, 0.25);height: 60rpx;border-radius: 10rpx;"
          v-model="name" @confirm="search" @blur="search" @clear="search" :searchHeigth="'60rpx'" :radius="10"
          :iconStyle="{ padding: '0 0 0 16rpx' }"
          :placeholderStyle="'font-size: 24rpx;color: rgba(37, 98, 86, 0.75);margin-left:0;font-weight: 400;'"
          :show="false" placeholder="搜索" cancelButton="none" bgColor="#FFFFFF">
          <uni-icons slot="searchIcon" color="rgba(37, 98, 86, 0.75)" style="font-size: 34rpx;font-weight: 400;" size="18"
            type="search" />
        </uni-search-bar>
      </view>
    </view>
    <uni-row class="list-row">
      <uni-col class="list-col" :span="6" v-for="(item, index) in data">
        <view class="list-item">
          <image :src="item.logo" @click="detail(item)"></image>
          <image v-if="item.collectStatus == 0" @click="collect(item)" class="collect"
            src="/static/img/liuhe/list/nsc.png"></image>
          <image v-if="item.collectStatus == 1" @click="collect(item)" class="collect"
            src="/static/img/liuhe/list/ysc.png"></image>
        </view>
      </uni-col>
    </uni-row>
    <Maintain ref="maintain" />
    <AlertInjectLayer />
  </scroll-view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import TabBar from "../../components/common/tabbar/TabBar";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import LotteryList from "./common/LotteryList";
import Category from "./common/Category";
import { gameCollect, gameCollectList } from "../../utils/lottery/list"
import { enter, gamePlatformUpholdInfo } from "../../utils/lottery/mine";
import Maintain from "./common/Maintain";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar,
    TabBar,
    LotteryList,
    Category,
    Maintain,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '收藏',
      headerStyle: {
        backgroundColor: '#025F8D',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      scrollTop: 0,
      data: [],
      name: ''
    }
  },
  onLoad(option) {
    this.GetGameCollectList()
  },
  methods: {
    search() {
      this.GetGameCollectList()
    },
    GetGameCollectList() {
      let prams = {
        name: this.name
      }
      gameCollectList(prams).then(res => {
        this.data = res.result
      }).catch(err => {

      })
    },
    collect(item) {
      let prams = {
        gameId: item.id
      }
      gameCollect(prams).then(res => {
        item.collectStatus = res.result ? 1 : 0
      }).catch(err => {
        console.log(err)
      })
    },
    detail(item) {
      if (!isLogin()) {
        this.$refs.loginConfirm.open()
        return false
      }
      let userInfo = uni.getStorageSync('userInfo');
      if (userInfo.userType == "demo") {
        uni.$emit('showPop', { refName: 'AlertTestMsg', })
        return false
      }
      let prams = {
        platformId: item.platformId
      };
      gamePlatformUpholdInfo(prams).then(res => {
        if (res.result.upholdStatus == 1) {
          this.$refs.maintain.openMaintain(res.result)
          return false
        }
        this.enterGame(item.code, item.platformId, item.platformCateId)
      }).catch(err => {
        console.log(err)
      })
      const that = this
    },
    enterGame(gameCode, platformId, platformCateId) {
      let prams = {
        gameCode: gameCode,
        platformId: platformId,
        platformCateId: platformCateId
      }
      console.log(prams)
      enter(prams).then(res => {
        if (res.code == 200) {
          uni.navigateTo({
            url: '/pages/webview/game?platformId=' + platformId + '&url=' + res.result + '&backPath=' + this.$route.path,
            success: function (res) {
              res.eventChannel.emit('argParams', {})
            }
          })
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //加载更多
    lower: function (e) {
    },
  }
}
</script>

<style lang="scss" scoped>
.lottery-page {
  font-family: 'PingFang SC';
  background: #EFF6FE;
  height: var(--vh);

  .search {
    .search-item {
      padding: 30rpx 40rpx 0;
    }
  }

  .list-row {
    padding: 30rpx 20rpx;

    .list-col {
      .list-item {
        position: relative;

        image {
          width: 170rpx;
          height: 170rpx;
        }

        .collect {
          height: 40rpx;
          width: 40rpx;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
}
</style>
