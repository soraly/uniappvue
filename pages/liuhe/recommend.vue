<template>
  <view class="recommend">
    <nav-bar :fontColor="'#FFFFFF'" :isBack="true" :titleStyle="titleStyle" :title="title" :headerStyle="headerStyle">
    </nav-bar>
    <view id="nav-div" class="nav-div">
      <view id="nav-row" class="nav-row" :class="{ isTop: isTop }">
        <view v-for="(item, index) in nav" :class="select == index ? 'nav-item active' : 'nav-item'"
          @click="selectNav(index, item)">
          <view :class="{ 'nav-text': select - 1 != index }">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <view class="list">
      <List v-for="(item, index) in CategoryData" :key="index" :data="item" />
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import List from "./common/List";
import { reCategories, platformsByCategory } from "../../utils/lottery/list"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "recommend",
  components: {
    AlertInjectLayer,
    NavBar,
    List
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '本站推荐',
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      isTop: false,
      select: 0,
      nav: [],
      name: '',
      category: {},
      data: [],
      CategoryData: [],
    }
  },
  onLoad() {
    this.getCategories()
  },
  methods: {
    openLoginPop() {
      uni.$emit('showPop', {
        refName: 'AlertMsg',
        data: {
          title: '提示',
          content: '您还没有登录账号，\n是否立即前往登录？'
        },
        confirm: () => {
          uni.navigateTo({
            url: "/pages/liuhe/login"
          })
        },
      })
    },
    selectNav(index, item) {
      this.select = index
      this.category = item
      this.CategoryData = []
      this.getCategoryData()
    },
    getCategories() {
      reCategories().then(res => {
        this.nav = res.result
        this.category = this.nav[0]
        this.getCategoryData()
      }).catch(err => {
        console.log(err)
      })
    },
    getCategoryData() {
      let prams = {
        id: this.category.id
      };
      platformsByCategory(prams).then(res => {
        this.CategoryData = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  background: #EFF6FE;

  .nav-div {
    background: #FFFFFF;
    height: 60rpx;
    border-radius: 10rpx 10rpx 0 0;
    margin: 20rpx;

    .nav-row {
      display: flex;
      height: 60rpx;
      border-radius: 10rpx 10rpx 0 0;
      border-bottom: 2px solid #0099CC;

      .nav-item {
        width: 100%;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 28rpx;
        color: #0DA5E3;

        .nav-text {
          width: 100%;
          text-align: center;
          border-right: 1px solid #0DA5E3;
        }

        &:last-child {
          border-top-right-radius: 10rpx;

          .nav-text {
            border-right: 0px solid #0DA5E3;
          }
        }

        &:first-child {
          border-top-left-radius: 10rpx;
        }
      }

      .active {
        background: linear-gradient(180deg, #20B5FA 0%, #059ED9 100%);
        color: #FFFFFF;
      }
    }

    .isTop {
      position: fixed;
      top: 46px;
      width: calc(100vw - 40rpx);
      max-width: calc(480px - 40rpx);
      background: #ffffff;
      z-index: 999;
    }
  }
}
</style>