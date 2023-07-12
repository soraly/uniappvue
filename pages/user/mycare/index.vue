<template>
  <view class="care-box" :style="{ marginTop: safeHeight }">
    <nav-bar :title="title" is-back></nav-bar>
    <view class="search" v-if="userId == ''">
      <uni-search-bar bgColor="#f7f8fa" v-model="searchValue" :placeholder="searchTitle"
        :placeholder-style="'color:#969799'" cancelButton="always" cancelText="搜索" @confirm="search" @cancel="search"
        @clear="clear">
        <template v-slot:searchIcon>
          <uni-icons color="#323233" size="16" type="search" />
        </template>
      </uni-search-bar>
    </view>
    <z-paging style="background: #fff;margin-top: 14rpx;" :height="'85vh'" ref="paging" v-model="dataList"
      @query="myConcern" :refresher-enabled="false" :hide-empty-view="false" :empty-view-center="true"
      :empty-view-text="'暂无数据'" :hide-no-more-inside="true" :empty-view-img="'/static/img/wu.png'" :fixed="false"
      :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
      :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
      <view class="list-box">
        <ul>
          <li class="list-item" v-for="(item, index) in dataList" :key="index">
            <uni-row class="list-row">
              <uni-col :span="4" class="img-box">
                <image :src="item.headPic" @click="homepage(item)"></image>
              </uni-col>
              <uni-col :span="15" class="text-box">
                <view class="text" @click="homepage(item)">{{ item.username }}</view>
              </uni-col>
              <uni-col :span="5" class="btn-box" v-if="userId == ''">
                <span class="cancel-care" @click="cancel(item, index)">取消关注</span>
              </uni-col>
            </uni-row>
          </li>
        </ul>
      </view>
    </z-paging>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from '@/components/common/navBar/navBar.vue';
import { myConcern, concern } from "../../../utils/user/index"
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '我的关注',
      searchValue: "",
      userId: '',
      searchTitle: "查找我关注的作者名",
      dataList: [],
      pageNum: 1,
      pageSize: 10,
    }
  },
  onLoad(option) {
    if (option.userId) {
      this.title = "ta的关注"
      this.userId = option.userId
    }
  },
  methods: {
    //搜索
    search: function () {
      this.pageNum = 1
      this.myConcern(this.pageNum)
    },
    homepage: function (item) {
      uni.navigateTo({
        url: "/pages/user/homepage/homepage?userId=" + item.userId
      })
    },
    //我的关注
    myConcern: function (pageNo, pageSize = 10) {
      this.pageNum = pageNo
      let prams = {
        userId: this.userId,
        name: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      myConcern(prams).then(res => {
        this.$refs.paging.complete(res.result.records);
      }).catch(err => {
        console.log(err)
      })
    },
    //取消关注
    cancel: function (item, index) {
      let prams = { userId: item.userId }
      concern(prams).then(res => {
        pop(res.message, 200)
        if (res.code == 200) {
          this.$delete(this.dataList, index)
        }
      }).catch(err => {
        console.log(err)
      })
    }
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
    position: relative;

    &::before {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      content: " ";
      pointer-events: none;
      top: 0;
      border-top: 1px solid #ebedf0;
      transform: scaleY(.5);
    }
  }

  .list-box {
    .list-item {
      width: 100%;
      overflow: hidden;
      color: #323233;
      font-size: 14px;
      line-height: 24px;
      background-color: #fff;

      .list-row {
        padding: 13px 16px;

        .img-box {
          width: 84rpx;
          height: 84rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .text-box {
          margin-left: 20rpx;

          .text {
            height: 84rpx;
            line-height: 84rpx;
            font-size: 32rpx;
            color: #333;
          }
        }

        .btn-box {
          height: 84rpx;
          line-height: 84rpx;

          .cancel-care {
            display: inline-block;
            height: 48rpx;
            text-align: center;
            line-height: 48rpx;
            border-radius: 22rpx;
            background: #07c160;
            font-size: 24rpx;
            color: #fff;
            padding: 0 18rpx;
          }
        }

        :after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 16px;
          bottom: 0;
          left: 16px;
          border-bottom: 1px solid #ebedf0;
          transform: scaleY(.5);
        }
      }

    }


  }
}
</style>