<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="search-row">
      <uni-search-bar bgColor="#fff" radius="19" v-model="prams.title" :searchHeigth="'60rpx'" :placeholder="searchTitle"
        :placeholder-style="'color:#cbc9d6'"
        :cancelStyle="{ 'line-height': '60rpx', 'padding': '0 10px', 'color': '#323233', 'font-size': '14px' }"
        cancelButton="always" cancelText="搜索" @confirm="search" @cancel="search" @clear="clear">
        <template v-slot:searchIcon>
          <uni-icons color="#323233" size="16" type="search" />
        </template>
      </uni-search-bar>
    </view>
    <z-paging :style="'height:calc(var(--vh) - 46px - 50px - ' + safeHeight + ')'" class="paging"
      style="background: #fff;z-index: 1" ref="paging" v-model="list" @query="searchList" :refresher-enabled="true"
      :hide-empty-view="false" :empty-view-center="true" :empty-view-text="'没有找到您想要的'" :hide-no-more-inside="true"
      :empty-view-img="'/static/img/wu.png'" :fixed="false" :empty-view-style="{ 'margin-bottom': '170px' }"
      :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
      :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
      <uni-list class="list-row">
        <uni-list-item class="list-item" direction="column" v-for="(item, index) in list">
          <!-- 自定义 header -->
          <template v-slot:header>
            <view class="list-header" @click="detail(item)">
              <image class="slot-image" :src="item.headPic" mode="widthFix"></image>
              <view class="cell-top-text">
                <p>{{ item.username }}</p>
                <view class="time">{{ item.createTime }}</view>
              </view>
            </view>
          </template>
          <!-- 自定义 body -->
          <template v-slot:body>
            <view class="content-box has-read" @click="detail(item)">
              <p>{{ item.title }}</p>
            </view>
          </template>
          <!-- 自定义 footer-->
          <template v-slot:footer>
            <view class="operation-box clearfix" @click="detail(item)">
              <view class="good">
                <uni-icons class="icon" type="hand-up-filled" size="17"></uni-icons>
                {{ item.thumbUpCount }}
              </view>
              <view class="comment">
                <uni-icons class="icon" custom-prefix="iconfont" type="pinglun" size="17"></uni-icons>
                {{ item.commentCount }}
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </z-paging>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { searchList } from "../../../utils/data/index.js";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "serachassistant",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '查询助手',
      searchTitle: '请输入搜索的标题或作者',
      prams: {
        type: 4,
        pageNum: 1,
        pageSize: 10,
        title: '',
      },
      list: [],
    }
  },
  onLoad(option) {
    this.prams.type = option.type
  },
  methods: {
    search() {
      this.$refs.paging.reload()
    },
    detail: function (item) {
      const that = this
      item.read = 1
      uni.navigateTo({
        url: '/pages/forum/detail?id=' + item.articleId + '&type=4',
        success: function (res) {
          res.eventChannel.emit('argParams', {
            lotteryType: that.lotteryType
          })
        }
      })
    },
    //列表获取
    searchList: function (pageNo, pageSize = 10) {
      if (!this.prams.title) {
        this.$refs.paging.complete([]);
        return false
      }
      this.prams.pageNum = pageNo
      let prams = this.prams
      searchList(prams).then(res => {
        this.$refs.paging.complete(res.result.list);
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.paging {
  height: calc(var(--vh) - 46px - 50px);
}

.list-row {
  .list-item {
    .list-header {
      display: flex;

      .slot-image {
        height: 84rpx;
        width: 84rpx;
        margin-right: 20rpx;
      }

      .cell-top-text {
        display: inline-block;

        p {
          font-size: 28rpx;
          line-height: 40rpx;
          color: #333;
          margin-bottom: 6rpx;
        }

        .time {
          font-size: 24rpx;
          line-height: 34rpx;
          color: #888;
        }
      }
    }

    .content-box {
      margin: 18rpx 0;
      color: #333;
      line-height: 44rpx;
      font-size: 32rpx;
    }

    .operation-box {
      color: #888;
      font-size: 24rpx;
      line-height: 40rpx;

      .good,
      .comment {
        margin-right: 40rpx;
        float: left;

        .icon {
          color: #888 !important;
          margin-right: 10rpx;
        }
      }
    }
  }
}
</style>