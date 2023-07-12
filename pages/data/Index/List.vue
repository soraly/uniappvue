<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <view class="header-box">
      <view class="header" :style="{ marginTop: safeHeight }">
        <view class="box-bg">
          <uni-nav-bar :height="46" :rightWidth="'180rpx'">
            <block slot="left">
              <uni-icons @click="back" type="back" color="#666" size="18" style="font-weight: bold;margin-left: 10px" />
            </block>
            <view class="input-view">{{ title }}</view>
            <block slot="right">
              <view class="uni-list-cell-db">
                <picker @change="bindTimeChange" :value="index" :range="array">
                  <uni-icons custom-prefix="iconfont" type="rili" color="#07c160" size="18"
                    style="width:15px;height:15px;margin: auto 10px auto;text-align: center" />
                </picker>
                <view class="">
                  年份
                </view>
              </view>
              <view class="uni-list-cell-db" @click="search">
                <uni-icons type="search" color="#07c160" size="18"
                  style="width:15px;height:15px;margin: auto 10px auto;" />
                <view class="">
                  搜索
                </view>
              </view>
            </block>
          </uni-nav-bar>
        </view>
      </view>
    </view>
    <!--列表-->
    <z-paging class="paging" style="background: #fff;z-index: 1" ref="paging" v-model="list" @query="searchList"
      :refresher-enabled="true" :hide-empty-view="false" :empty-view-center="true" :empty-view-text="'暂无数据'"
      :hide-no-more-inside="true" :empty-view-img="'/static/img/wu.png'" :fixed="false" :auto-show-system-loading="true"
      :loading-full-fixed="true" :system-loading-mask="true" :empty-view-style="{ 'margin-bottom': '170px' }"
      :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
      :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
      <view class="swipers">
        <view class="colse" @click="swiperShow = false"><uni-icons type="clear" size="20" color="#ffffff"></uni-icons>
        </view>
        <view class="web-rol" v-show="listPicture.length > 0" @click.stop="openAd(listPicture[0])">
          <image :src="listPicture[0] ? listPicture[0].img : ''"></image>
        </view>
      </view>
      <uni-list class="list-row" v-if="list.length > 0">
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
      <empty v-else></empty>
    </z-paging>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Swipers from "../../../components/common/swiper/Swipers";
import Empty from "../../../components/common/empty/empty";
import { searchList, wheelAdvertList, advertList } from "../../../utils/data/index.js";
import { listYear } from '../../../utils/live/index'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "list",
  components: {
    AlertInjectLayer,
    Swipers, Empty
  },
  onLoad(option) {
    this.title = option.title
    this.prams.articleTypeId = option.id
    this.prams.type = option.type
    this.wheelAdvertList()
    this.listYear()
    uni.setNavigationBarTitle({
      title: this.title,
      success: () => {
        console.log('修改标题成功')
      },
      fail: () => {
        console.log('修改标题失败')
      },
      complete: () => {
        console.log('修改标题结束')
      },
    });
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '',
      lotteryType: 1,
      years: '',
      index: 0,
      array: [],
      prams: {
        type: 4,
        articleTypeId: 0,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      swiperShow: true,
      listPicture: [],//轮播图列表
    }
  },
  methods: {
    //返回
    back: function () {
      uni.navigateBack()
    },
    search: function () {
      uni.navigateTo({
        url: 'serachassistant?type=4',
      })
    },
    detail: function (item) {
      const that = this
      item.read = 1
      uni.navigateTo({
        url: '/pages/forum/detail?id=' + item.articleId + '&type=4&createTime=' + item.createTime,
        success: function (res) {
          res.eventChannel.emit('argParams', {
            lotteryType: that.lotteryType
          })
        }
      })
    },
    //时间选择
    bindTimeChange: function (e) {
      this.years = this.array[e.detail.value]
      this.$refs.paging.reload()
    },
    listYear() {
      let prams = { lotteryType: this.lotteryType }
      listYear(prams).then(res => {
        this.array = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //获取轮播图
    wheelAdvertList: function () {
      /*let prams = {
        type:7
      }
      wheelAdvertList(prams).then(res=>{
        if(res.result.advertList.length > 0){
          this.listPicture = res.result.advertList[0]
        }else{
          this.listPicture = {imgPath:'',url:''}
        }
      }).catch(err=>{
        console.log(err)
      })*/
      let prams = {
        projectType: 1,
        code: 4,
      }
      advertList(prams).then(res => {
        this.listPicture = res.result
      }).catch(err => {

      })
    },
    //下拉加载更多
    openAd(item) {
      openUrl(item)
    },
    //列表获取
    searchList: function (pageNo, pageSize = 10) {
      this.prams.pageNum = pageNo
      let prams = this.prams
      if (this.years) {
        prams.years = this.years
      }
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
.header-box,
.header,
.box-bg {
  height: 46px;
}

.uni-list-cell-db {
  display: inline-block;
  margin-left: 20rpx;
  text-align: center;
}

.input-view {
  font-size: 16px;
}

.swipers {
  position: relative;

  .colse {
    position: absolute;
    right: 6px;
    top: 5px;
    z-index: 2;
    border-radius: 50%;
    width: 30rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    color: rgb(255, 255, 255);
  }

  image {
    width: 100%;
    height: 160rpx;
  }
}

.paging {
  height: calc(var(--vh) - 46px - env(safe-area-inset-bottom) - var(--status-bar-height));
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