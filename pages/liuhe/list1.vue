<template>
  <scroll-view :scroll-top="scrollTop" :scroll-y="isScrollY" show-scrollbar="true" scroll-with-animation="true"
    @scroll="scroll" class="lottery-page" :style="{ marginTop: safeHeight }">
    <nav-bar :fontColor="'#FFFFFF'" :isBack="true" :titleStyle="titleStyle" :title="title" :headerStyle="headerStyle">
      <block slot="right">
        <view class="gift" @click="collect">
          <view class="collect">收藏</view>
        </view>
      </block>
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

    <view id="nav-div" class="nav-div">
      <view id="nav-row" class="nav-row" :class="{ isTop: isTop }" :style="{ marginTop: safeHeight }">
        <view v-for="(item, index) in nav" :class="select == index ? 'nav-item active' : 'nav-item'"
          @click="selectNav(index, item)">
          <view :class="{ 'nav-text': select - 1 != index }">{{ item.name }}</view>
        </view>
      </view>
    </view>

    <view class="lottery" :class="{ categorys: category.styleType == 2, lotterys: category.styleType != 2 }">
      <Category ref="cate" @openLoginPop="openLoginPop" @scrolltoupper="scrolltoupper" :isTop="isTop"
        :data-height="'calc(var(--vh) - 92rpx - 60rpx)'" :gameCategoryId="category.dataCategoryId" :is-show="true"
        :name="name" v-if="category.styleType == 2" :data="data" />
      <lottery-list v-else-if="item.typeName" v-for="(item, index) in data" :data="item.lotteries" :isShow="true"
        :title="item.typeName + '系列'"></lottery-list>
    </view>
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
import { categories, categoryData } from "../../utils/lottery/list"
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
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '游戏大厅',
      headerStyle: {
        backgroundColor: '#025F8D',
      },
      objHeight: {
        header: 0,
        nav: 0,
        history: 0,
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      scrollTop: 0,
      oldScrollTop: 0,
      isScrollY: true,
      current: 0,
      select: 0,
      nav: [],
      name: '',
      category: {},
      isTop: 0,
      data: [],
    }
  },
  onLoad(option) {
    this.GetCategories()
    this.$nextTick(function () {
      this.getHight()
    })
  },
  methods: {
    getHight() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.header-box').boundingClientRect(data => {
        this.objHeight.header = data.height;
      }).exec();
    },
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
    collect() {
      if (!isLogin()) {
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
        return false
      }
      uni.navigateTo({
        url: './collect',
        success: function (res) {
          res.eventChannel.emit('argParams', {})
        }
      })
    },
    search() {
      if (this.category.styleType == 2) {
        this.$refs.cate.reload()
      } else {
        this.getCategoryData()
      }
    },
    GetCategories() {
      categories().then(res => {
        this.nav = res.result
        this.category = this.nav[0]
        this.getCategoryData()
      }).catch(err => {
        console.log(err)
      })
    },
    selectNav(index, item) {
      this.select = index
      this.category = item
      this.getCategoryData()
    },
    getCategoryData() {
      let prams = {
        'categoryId': this.category.id,
        'name': this.name,
      };
      categoryData(prams).then(res => {
        this.data = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //滚动条监听
    scroll: function (e) {
      let headerH = this.objHeight.header
      this.oldScrollTop = e.detail.scrollTop;
      const query = uni.createSelectorQuery().in(this).select('#nav-div');
      query.boundingClientRect(data => {
        if (data.top <= uni.getStorageSync('systemInfo').safeArea.top + headerH) {
          this.isTop = 1
          if (this.category.styleType == 2) {
            this.isScrollY = false
          }
        } else {
          this.isTop = 0
        }
      }).exec();
    },
    top() {
      this.scrollTop = this.oldScrollTop;
      //当视图渲染结束 重新设置为0
      this.$nextTick(() => {
        this.isScrollY = true
        this.isTopNav = 0
        this.isTop = 0
        this.scrollTop = 0
      });
    },
    scrolltoupper() {
      this.isTop = 0
      this.isScrollY = true
      this.top();
    },
  }
}
</script>

<style lang="scss" scoped>
.lottery-page {
  font-family: 'PingFang SC';
  background: #EFF6FE;
  height: var(--vh);

  .gift {
    .collect {
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }

  .search {
    .search-item {
      padding: 30rpx 40rpx 0;
    }
  }

  .nav-div {
    background: #FFFFFF;
    height: 60rpx;
    border-radius: 10rpx 10rpx 0 0;
    margin: 20rpx 20rpx;

    .nav-row {
      display: flex;
      height: 60rpx;
      border-radius: 10rpx 10rpx 0 0;
      border-bottom: 1px solid #0099CC;

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
      top: 92rpx;
      width: calc(100vw - 40rpx);
      max-width: calc(480px - 40rpx);
      background: #ffffff;
      z-index: 12;
    }
  }

  .lottery {
    margin: 0px 20rpx;
    height: calc(var(--vh) - 92rpx);
  }

  .categorys {
    margin: 0;
  }

  .lotterys {
    background: #ffffff;
    margin: 20rpx;
    border-radius: 10rpx;
  }
}
</style>