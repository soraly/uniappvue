<template>
  <view class="care-box" :style="{ marginTop: safeHeight }">
    <nav-bar :show="true" :title="title" is-back></nav-bar>
    <view class="search">
      <uni-search-bar bgColor="#f7f8fa" v-model="searchValue" :placeholder="searchTitle"
        :placeholderStyle="'color:#969799'" cancelButton="always" cancelText="搜索" @confirm="search" @cancel="search"
        @clear="clear">
        <template v-slot:searchIcon>
          <uni-icons color="#323233" size="16" type="search" />
        </template>
      </uni-search-bar>
    </view>
    <z-paging style="background: #fff;margin-top: 14rpx;" :height="'85vh'" ref="paging" v-model="dataList" @query="myFans"
      :refresher-enabled="false" :hide-empty-view="false" :empty-view-center="true" :empty-view-text="'暂无数据'"
      :hide-no-more-inside="true" :empty-view-img="'/static/img/wu.png'" :fixed="false"
      :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
      :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
      <view class="list-box">
        <ul>
          <li class="list-item" v-for="(item, index) in dataList" :key="index">
            <fans :item="item"></fans>
          </li>
        </ul>
      </view>
    </z-paging>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from '../../../components/common/navBar/navBar.vue';
import Fans from '../../../components/common/fans/Fans.vue';
import { myFans } from "../../../utils/user/index"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, NavBar, Fans
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '我的粉丝',
      userId: '',
      searchValue: "",
      searchTitle: "点击搜索用户",
      dataList: [],
      pageNum: 1,
      pageSize: 10,
    }
  },
  onLoad(option) {
    if (option.userId) {
      this.title = "ta的粉丝"
      this.userId = option.userId
    }
  },
  methods: {
    //搜索
    search: function () {
      this.pageNum = 1
      this.myFans(this.pageNum)
    },
    //我的关注
    myFans: function (pageNo, pageSize = 10) {
      this.pageNum = pageNo
      let prams = {
        concernUserId: this.userId,
        name: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      myFans(prams).then(res => {
        this.$refs.paging.complete(res.result.records);
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.care-box {
  width: 100%;
  height: var(--vh);
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;

  .search {
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #ebedf0;
  }

  .list-box {
    .list-item {
      width: 100%;
      overflow: hidden;
      color: #323233;
      font-size: 14px;
      line-height: 24px;
      background-color: #fff;
    }
  }
}
</style>