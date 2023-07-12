<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true">
      <!--          <block slot="left">-->
      <!--            <uni-icons type="back" color="#666" size="18" style="font-weight: bold;margin-left: 10px"/>-->
      <!--          </block>-->
      <view class="input-view" slot="title">{{ title }}</view>
      <block slot="right">
        <view class="uni-list-cell-db">
          <picker @change="bindTimeChange" :value="index" :range="array">
            <span size="16" class="curyear">{{ years }}</span>
            <uni-icons custom-prefix="iconfont" type="rili" color="#07c160" size="18"
              style="width:15px;height:15px;margin-right:10px;" />
          </picker>
        </view>
      </block>
    </nav-bar>
    <!-- <view class="header-box">
      <view class="header">
      <view class="box-bg">
        <uni-nav-bar :height="46">
          <block slot="left">
            <uni-icons @click="back" type="back" color="#666" size="18" style="font-weight: bold;margin-left: 10px"/>
          </block>
          <view class="input-view">{{ title }}</view>
          <block slot="right">
            <view class="uni-list-cell-db">
              <picker @change="bindTimeChange" :value="index" :range="array">
                <span size="16" class="curyear">{{ years }}</span>
                <uni-icons custom-prefix="iconfont" type="rili" color="#07c160" size="18"
                           style="width:15px;height:15px;margin-right:10px;"/>
              </picker>
            </view>
          </block>
        </uni-nav-bar>
      </view>
    </view>
    </view> -->
    <!--搜索-->
    <view class="search-div">
      <view style="width: 90%;">
        <uni-search-bar bgColor="#fff" radius="100" :placeholderStyle="'color:#969799;font-size: 30rpx;'"
          placeholder="搜索相关标题文章" cancelButton="none" v-model="searchValue" @confirm="search" />

      </view>
      <view role="button" @click="search" tabindex="0" class="van-search__action">
        <view style="font-size: 15px; color: rgb(11, 189, 99);">
          搜索
        </view>
      </view>
    </view>
    <!--列表-->
    <view class="search-list clearfix" v-if="list.length > 0">
      <view class="search-item" v-for="(item, index) in list" :key="index">
        <view class="search-rol" @click="lists(item)">{{ item.articleTypeName }}</view>
      </view>
    </view>
    <view class="search-list empty" v-else>
      <empty></empty>
    </view>

    <AlertInjectLayer />
  </view>
</template>

<script>
import { listArticleType } from "../../../utils/data/index.js";
import { listYear } from '../../../utils/live/index'
import Empty from '../../../components/common/empty/empty'
import NavBar from '../../../components/common/navBar/navBar.vue'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, Empty, NavBar
  },
  data() {
    const date = new Date();
    return {
      title: '资料大全',
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      lotteryType: uni.getStorageSync('lotteryType'),
      years: '',
      array: [],
      index: 0,
      searchValue: '',
      list: [],
      allList: [],
    }
  },
  onLoad(option) {
    this.lotteryType = uni.getStorageSync('lotteryType') || 1
    if (this.lotteryType == 1) {
      this.title = '香港' + this.title
    } else if (this.lotteryType == 2) {
      this.title = '澳门' + this.title
    } else if (this.lotteryType == 3) {
      this.title = '台湾' + this.title
    } else {
      this.title = '新加坡' + this.title
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.listYear()
  },
  methods: {
    //返回
    back: function () {
      backPage()
    },
    lists: function (item) {
      let url = "/pages/data/Index/List"
      uni.navigateTo({
        url: url + "?title=" + item.articleTypeName + "&id=" + item.articleTypeId + "&type=4",
      })
    },
    //时间选择
    bindTimeChange: function (e) {
      this.years = this.array[e.detail.value]
      this.listArticleType()
    },
    listYear() {
      let prams = { lotteryType: this.lotteryType }
      listYear(prams).then(res => {
        this.array = res.result
        this.listArticleType()
      }).catch(err => {
        console.log(err)
      })
    },
    listArticleType: function () {
      let prams = {
        type: 4,
        lotteryType: this.lotteryType,
        year: this.years
      }
      listArticleType(prams).then(res => {
        this.list = res.result.list
        this.allList = this.list
      }).catch(err => {
        console.log(err)
      })
    },
    //搜索功能
    search: function () {
      let val = this.searchValue
      console.log(val)
      if (val == '') {
        this.list = this.allList
        return false
      }
      let list = []
      this.list.forEach((item, index) => {
        // 声明一个变量接收
        let res = item.articleTypeName.indexOf(val);
        if (res != -1) {
          list.push(item)
        }
      })
      this.list = list
      console.log(this.list)
    }
  }
}
</script>

<style scoped>
.header-box,
.header,
.box-bg {
  height: 46px;
}

.input-view {
  font-size: 16px;
}

.curyear {
  width: 50px;
  height: 35px;
  line-height: 35px;
  color: #03bf03;
  margin-right: 5px;
}

.search-div {
  padding: 0px 10px;
  background: #f8f8f8;
  display: flex;
  height: auto;
}

.van-search__action {
  width: 15%;
  text-align: center;
  line-height: 50px;
}

.search-list {
  padding: 20rpx 20rpx 0;
  background: #fff;
  min-height: var(--vh);
  display: block;
}

.empty {
  width: 100%;
}

.search-list .search-item {
  float: left;
  width: 33.333%;
  color: #979797;
}

.search-list .search-item .search-rol {
  width: 192rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 6rpx;
  border: 2rpx solid #979797;
  text-align: center;
  margin: 0 auto 28rpx auto;
  font-size: 28rpx;
}
</style>
