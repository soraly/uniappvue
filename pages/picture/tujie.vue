<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" show-scrollbar="true" lower-threshold="100"
      scroll-with-animation="true" @scrolltolower="lower">
      <!--顶部导航栏-->
      <view class="header-box" style="height: 46px">
        <div class="header" style="height: 46px" :style="{ marginTop: safeHeight }">
          <view class="box-bg" style="height: 46px">
            <uni-nav-bar backgroundColor="#fff" :rightWidth="'180rpx'" :height="46" color="#000">
              <block slot="left" height="46">
                <uni-icons @click="backPage()" type="back" color="#000" size="16"
                  style="font-weight: bold;margin-left: 10px" />
              </block>
              <view class="input-view" height="46">{{ info.pictureName || title }}</view>
              <block slot="right" height="46">
                <!--                <view class="rht rht1" @click="pictureFabu"><i class="icons"></i><span class="descs">参与竞猜</span></view>-->
                <view class="rht rht2" @click="add"><i class="icons"></i><span class="descs"
                    style="display: block">发布图解</span></view>
              </block>
            </uni-nav-bar>
          </view>
        </div>
      </view>
      <!--tab选项卡-->
      <view class="tabs-bd">
        <view class="m-tabs">
          <view :class="isActive == 0 ? 'm-tabs-item act' : 'm-tabs-item'" @click="tab(0)">图解小组</view>
          <!--          <view :class="isActive == 1 ? 'm-tabs-item act' : 'm-tabs-item'" @click="tab(1)">竞猜小组</view>-->
        </view>
      </view>
      <!--图解区域-->
      <view class="list-bd" v-if="list.length > 0">
        <view role="feed" class="van-list">
          <ul v-if="isActive == 0" class="forum-list type12">
            <li v-for="(item, index) in list">
              <view class="van-row">
                <view class="van-col van-col--17">
                  <view class="content">
                    <view><span class="csize">{{ item.title }}</span></view>
                    <view class="bsize">
                      <view class="text van-multi-ellipsis--l3" @click="details(item)">{{ item.description }}</view>
                    </view>
                    <view class="footer">
                      <image :src="item.headPic"></image>
                      <span class="span">{{ item.username }}</span>
                      <span>{{ item.updateTime }}</span>
                    </view>
                  </view>
                </view>
                <view class="van-col van-col--5"></view>
              </view>
            </li>
          </ul><!---->
          <ul v-else class="forum-list type12">
            <view v-show="isActive == 1" class="jc-title-history">点击查看我的竞猜记录</view>
            <li>
              <view class="heads van-row">
                <view class="van-col van-col--20">
                  <view class="content">
                    <view class="content-jc">
                      <span class="content-jc-name">竞猜</span>
                      <span class="csize">第2022320期澳门跑狗图竞猜</span>
                    </view>
                    <view class="bsize">
                      <view class="text van-multi-ellipsis--l3">特肖-一肖:狗</view><!---->
                    </view>
                    <view class="footer">
                      <image mode="widthFix"
                        src="https://img.sycccf.com:4949/unite49files/user-small/2022/07/13/2035504/1657685476343-1657685415351122.jpeg">
                      </image>
                      <span class="span">海里掏金</span>
                      <span>2022-11-16 12:32</span>
                    </view>
                  </view>
                </view>
                <view class="van-col van-col--3">
                  <view class="right">
                    <image mode="widthFix" src="../../static/img/picture/yzj.png"></image>
                  </view>
                </view>
              </view>
            </li>
          </ul>
          <view class="van-list__placeholder"></view>
        </view><!---->
        <!--<view class="jc-footer" v-show="isActive == 1">
          <button class="van-button van-button&#45;&#45;primary van-button&#45;&#45;normal">
            <view class="van-button__content">
              <span class="van-button__text">竞猜统计</span>
            </view>
          </button>
        </view>-->
      </view>
      <view class="list-bd" v-else>
        <empty></empty>
      </view>
      <!--底部-->
      <view style="height: 96rpx">
        <view class="tjxzBotom">
          <view class="item tz selected" @click="backPage">
            <span class="icons"></span>
            <span class="descs">评论</span>
          </view>
          <view class="item ckpl">
            <span class="icons"></span>
            <span class="descs">查看图解</span>
          </view>
          <view class="item sc" @click="collect">
            <uni-icons v-if="info.collect == 0" type="star" size="25" color="#888"></uni-icons>
            <uni-icons v-else type="star-filled" size="25" color="#07c160"></uni-icons>
            <span class="descs">收藏</span>
          </view>
          <view class="item dz" @click="thumbUp">
            <uni-icons v-if="info.thumbUp == 0" type="hand-up" size="25" color="#888"></uni-icons>
            <uni-icons v-else type="hand-up-filled" size="25" color="#07c160"></uni-icons>
            <span class="descs">点赞</span>
          </view>
          <view class="item zf" @click="fenxiang">
            <span class="icons"></span>
            <span class="descs">转发</span>
          </view>
          <view class="share"><!----></view>
        </view>
      </view>
    </scroll-view>
    <!-- 分享 -->
    <uni-popup class="share" ref="share" type="share" safeArea backgroundColor="#fff">
      <share @closefx="closefx"></share>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Login from "../../components/common/login/Login";
import Share from "../../components/common/share/Share";
import { detail } from '../../utils/picture/index.js'
import { listLatest } from '../../utils/forum/index.js'
import { collect, thumbUp } from "../../utils/user/index.js"
import Empty from '../../components/common/empty/empty'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "tujie",
  components: {
    AlertInjectLayer, Login, Share, Empty,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      scrollTop: 0,
      isActive: 0,
      pictureId: 0,
      pageNum: 1,
      pageSize: 10,
      title: '',
      info: {},
      isLoadMore: false,
      list: [],
      msg: '',
    }
  },
  onLoad(option) {
    this.pictureId = option.id
    this.detail()
    uni.setNavigationBarTitle({
      title: this.title
    });
    uni.$on('emitParams', data => {
      this.msg = data.msg
    })
  },
  onShow() {
    uni.hideTabBar()
    if (this.msg) {
      pop(this.msg, 2000)
      this.msg = ''
    }
  },
  methods: {
    backPage: function () {
      uni.navigateBack()
    },
    add: function () {
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
        url: "add?id=" + this.pictureId // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    pictureFabu: function () {
      uni.navigateTo({
        url: "pictureFabu?pictureId=" + this.pictureId // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    //tab切换
    tab: function (index) {
      this.isActive = index
      this.pageNum = 1
      this.list = []
      if (index == 0) {
        this.listLatest()
      } else {

      }
    },
    details: function (item) {
      const that = this
      uni.navigateTo({
        url: '/pages/forum/detail?id=' + item.articleId + '&type=' + item.type,
        success: function (res) {
          res.eventChannel.emit('argParams', {
            lotteryType: that.info.lotteryType
          })
        }
      })
    },
    //加载更多
    lower: function (e) {
      if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.pageNum += 1
        this.listLatest()
      }
    },
    //分享弹窗
    fenxiang: function () {
      console.log(111)
      this.$refs.share.open()
    },
    //关闭分享
    closefx: function () {
      this.$refs.share.close()
    },
    //详情
    async detail() {
      let prams = { pictureId: this.pictureId }
      await detail(prams).then(res => {
        this.info = res.result
        this.listLatest()
      }).catch(err => {
        console.log(err)
      })
    },
    //图解列表
    listLatest: function () {
      let prams = {
        pictureId: this.pictureId,
        lotteryType: this.info.lotteryType,
        type: 12,
        sort: 0,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      listLatest(prams).then(res => {
        this.list.push(...res.result.records)
        this.isLoadMore = false
        console.log(this.list)
      }).catch(err => {
        console.log(err)
      })
    },
    collect: function () {
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
      let prams = { relatedId: this.info.pictureTypeId, type: 1 }
      collect(prams).then(res => {
        if (res.code == 200) {
          this.info.collect = res.result
          if (res.result == 1) {
            this.info.collectCount++
          } else {
            this.info.collectCount--
          }
        }
        pop(res.message, 2000)
      }).catch(err => {
        console.log(err)
      })
    },
    //点赞接口
    thumbUp: function () {
      console.log(isLogin())
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
      let prams = { relatedId: this.pictureId, type: 1 }
      thumbUp(prams).then(res => {
        pop(res.message, 2000)
        if (res.code == 200) {
          this.info.thumbUp = 1
          this.info.thumbUpCount++
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style scoped>
.scroll-Y {
  height: calc(var(--vh) - 48px);
  background: #fff;
}

.header-box {
  height: 46px;
}

.header-box .header {
  position: fixed;
  top: 0;
  height: 46px;
  z-index: 1;
  border-bottom: 1px solid #ebedf0;
  width: 100%;
  max-width: 480px;
}

.rht span {
  height: 30rpx;
  line-height: 28rpx;
  font-size: 24rpx;
  color: #07c160;
}

.rht {
  text-align: center;
  margin-right: 20rpx;
}

.rht * {
  display: inline-block;

}

.rht1 .icons {
  background-image: url('../../static/img/picture/jc.png');
  background-size: 100% 100%;
  height: 32rpx;
  width: 32rpx;
}

.rht2 .icons {
  background-image: url('../../static/img/picture/pl.png');
  background-size: 100% 100%;
  height: 36rpx;
  width: 36rpx;
}

.tabs-bd {
  height: 104rpx;
  margin-bottom: 20rpx;
}

.tabs-bd .m-tabs {
  height: 104rpx;
  color: #999;
  font-weight: 800;
  overflow: hidden;
}

.tabs-bd .m-tabs .m-tabs-item.act {
  border-radius: 40rpx;
  color: #07c160;
}

.tabs-bd .m-tabs .m-tabs-item {
  float: left;
  line-height: 104rpx;
  /*width: 44.33%;*/
  width: 100%;
  text-align: center;
  font-size: 32rpx;
  position: relative;
}

.tabs-bd .m-tabs .m-tabs-item.act:after {
  content: "";
  position: absolute;
  width: 92rpx;
  height: 8rpx;
  background: #07c160;
  bottom: 0;
  left: 50%;
  margin-left: -46rpx;
}

.list-bd {
  padding: 0 26rpx;
}

.forum-list li {
  padding: 20rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;
  border: 2rpx solid #eee;
  display: flow-root;
}

.list-bd .type12 .csize {
  color: red;
  font-size: 32rpx;
}

.list-bd .type12 .bsize {
  font-size: 36rpx;
  padding: 20rpx 0;
  display: block;
  font-size: 36rpx;
  color: #999;
}

.forum-list li .text {
  font-size: 26rpx;
  line-height: 40rpx;
  padding: 0 20rpx;
  margin-bottom: 10rpx;
}

.van-multi-ellipsis--l3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.list-bd .type12 .jc-title-history {
  color: #07c160;
  text-align: center;
  margin: 30rpx;
  font-weight: 700;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica;
}

.list-bd .type12 .footer {
  display: flex;
  font-size: 26rpx;
  align-items: center;
  color: #ccc;
}

.list-bd .type12 .footer image {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
}

.list-bd .type12 .footer .span {
  border-right: 2rpx solid;
  margin: 8rpx;
  padding-right: 8rpx;
}

.forum-list li .heads {
  display: flex;
  justify-content: space-around;
  position: relative;
}

.list-bd .type12 .content-jc {
  display: flex;
  align-items: center;
}

.list-bd .type12 .content-jc .content-jc-name {
  background: #07c160;
  font-size: 24rpx;
  color: #fff;
  border-radius: 10rpx;
  padding: 6rpx 10rpx;
  margin-right: 4rpx;
}

.list-bd .type12 .right image {
  width: 90rpx;
}

.tjxzBotom,
.tjxzBotom .item {
  display: flex;
  align-items: center;
  height: 96rpx;
}

.tjxzBotom {
  position: fixed;
  width: 750rpx;
  max-width: 960rpx;
  bottom: 0;
  background: #f8f8f8;
  box-shadow: inset 0 2rpx 0 #ddd;
  font-family: PingFang SC;
}

.tjxzBotom .item {
  width: 20%;
  flex-direction: column;
  justify-content: center;
}

.tjxzBotom,
.tjxzBotom .item {
  display: flex;
  align-items: center;
  height: 96rpx;
}

.tjxzBotom .tz.selected .icons {
  background-image: url('../../static/img/picture/pinl.png');
}

.tjxzBotom .item .icons {
  background-size: 100% 100%;
  height: 50rpx;
  width: 50rpx;
}

.tjxzBotom .item span {
  display: inline-block;
  font-size: 24rpx;
  line-height: 28rpx;
}

.tjxzBotom .item span {
  display: inline-block;
  font-size: 24rpx;
  line-height: 28rpx;
}

.tjxzBotom .ckpl .icons {
  background-image: url('../../static/img/picture/tj.png');
}

.tjxzBotom .sc .icons {
  background-image: url('../../static/img/picture/sc.png');
}

.tjxzBotom .dz .icons {
  background-image: url('../../static/img/picture/dianzan.png');
}

.tjxzBotom .zf .icons {
  background-image: url('../../static/img/picture/zhuanfa.png');
}
</style>