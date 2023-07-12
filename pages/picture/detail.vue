<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" show-scrollbar="true"
      scroll-with-animation="true" @scrolltolower="lower" @scroll="scroll" @click="isShow = false">
      <!--顶部导航栏-->
      <view class="header-box">
        <div class="header" :style="{ marginTop: safeHeight }">
          <view class="box-bg" style="height: 46px">
            <uni-nav-bar backgroundColor="#fff" :height="46" color="#000" rightWidth="250rpx">
              <block slot="left">
                <uni-icons @click="back" type="back" color="#000" size="16" style="margin-left: 10px;text-align: right" />
              </block>
              <view class="input-view">{{ info.pictureName || title }}</view>
              <block slot="right">
                <view class="rht rht1" @click="lishi"><i class="icons"></i><span class="descs">开奖记录</span></view>
                <view class="rht rht2"><i class="icons"></i><span class="descs" @click="replyComment">发表评论</span></view>
              </block>
            </uni-nav-bar>
          </view>
        </div>
      </view>
      <view class="customfixed">
        <view class="sticky-body">
          <!--年月份-->
          <view class="m-tabs-years">
            <view class="m-tabs-years-bd">
              <span v-for="(item, index) in yearList" :key="index" @click="selectYears(item, index)"
                :class="index == curr ? 'act' : ''">
                {{ item.name }}
              </span>
            </view>
          </view>
          <!--期数-->
          <view class="m-tabs-period-home van-row">
            <view class="m-tabs-period">
              <view class="m-tabs-period-bd">
                <span v-for="(item, index) in periodList" :key="index" :class="pictureId == item.pictureId ? 'act' : ''"
                  @click="selectPeriod(item)">{{ item.name }}</span>
              </view>
            </view>
            <view class="van-dropdown-menu">
              <view class="van-dropdown-menu__bar">
                <view role="button" tabindex="0" class="van-dropdown-menu__item">
                  <span class="van-dropdown-menu__title" @click.stop="isShow = !isShow">
                    <view class="van-ellipsis">{{ selectText }}
                      <uni-icons v-if="isShow === false" type="bottom" size="12" color="#fff"></uni-icons>
                      <uni-icons v-else type="top" size="12" color="#fff"></uni-icons>
                    </view>
                  </span>
                </view>
              </view>
            </view>
            <view class="van-dropdown-box" v-show="isShow" :style="{ marginTop: safeHeight }">
              <view class="van-dropdown-box-in" @click.stop="">
                <view class="dropdown-body">
                  <view class="van-col van-col--6" v-for="(item, index) in periodList" :key="index"
                    @click.stop="selectPeriod(item)">
                    <span :class="pictureId == item.pictureId ? 'act' : ''">{{ item.name }}</span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--彩票区域-->
      <view class="border-box" v-if="lottery.id && lottery.isFit">
        <lottery :lotteryDetail="lottery">
          <template v-slot:header>
            <view class="body-hd-2">{{ lottery.year }}年 第{{ lottery.period }}期</view>
          </template>
          <template v-slot:lottery></template>
          <template v-slot:footer><span></span></template>
        </lottery>
      </view>
      <!-- 图片区域 -->
      <view class="imgPos"
        style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
        <view class="ms-bd-img">
          <img :src="info.largePictureUrl" @click="previewImg(info.largePictureUrl, info.largePictureUrl)">
        </view>
      </view>
      <!-- 投票区域 -->
      <view v-show="voteShow">
        <view class="vote-box"
          style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
          <view class="ms-bd-vote">
            <view class="van-row">
              <view class="van-col van-col--12" style="padding-right: 15rpx;" v-for="(item, index) in info.voteResult"
                :key="index">
                <view class="vote-num">{{ item.voteCount }}票</view>
                <view class="vote-item">
                  <span class="left">{{ item.animalName }}</span>
                  <view class="bd-rate">
                    <span class="bd-rate-color" :style="'width: ' + item.rate + '%;'"></span>
                  </view>
                  <span class="right">{{ item.rate }}%</span>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!--投票按钮-->
        <view class="ms-bd-btn">
          <view class="van-row">
            <view class="van-col van-col--12" style="padding-right: 15px;" @click="openVote">
              <button type="primary" class="vote-btn">投票</button>
            </view>
            <view class="van-col van-col--12" style="padding-right: 15px;" @click="voteDetail">
              <button type="primary" class="vote-his">投票记录</button>
            </view>
          </view>
        </view>
      </view>
      <!-- 显示隐藏 -->
      <view class="open-hide">
        <span class="" @click="zhankai">
          <uni-icons v-if="voteShow" custom-prefix="iconfont" type="shangjiantou" size="12" color="#fff"></uni-icons>
          <uni-icons v-else custom-prefix="iconfont" type="jiantouxia" size="12" color="#fff"></uni-icons>
          <label>{{ voteShow ? '收起投票' : '展开投票' }}</label>
        </span>
      </view>
      <!--轮播图-->
      <view class="bottom-bd">
        <view class="hd-interaction">
          <view class="interaction">
            <view class="van-row">
              <view class="van-col van-col--18">
                <span class="tool-item">
                  <uni-icons v-if="info.thumbUp == 0" type="hand-up" size="16" color="#888"
                    style="margin-right: 5px"></uni-icons>
                  <uni-icons v-else type="hand-up-filled" size="16" color="#07c160" style="margin-right: 5px"></uni-icons>
                  {{ info.thumbUpCount | moneyFormat }}点赞
                </span>
                <span class="tool-item">
                  <uni-icons v-if="info.comment == 0" custom-prefix="iconfont" type="pinglun" size="16" color="#888"
                    style="margin-right: 5px"></uni-icons>
                  <uni-icons v-else custom-prefix="iconfont" type="pinglun" size="16" color="#07c160"
                    style="margin-right: 5px"></uni-icons>
                  {{ info.commentCount | moneyFormat }}评论
                </span><!---->
                <span class="tool-item">
                  <uni-icons v-if="info.collect == 0" type="star" size="16" color="#888"
                    style="margin-right: 5px"></uni-icons>
                  <uni-icons v-else type="star-filled" size="15" color="#07c160" style="margin-right: 5px"></uni-icons>
                  {{ info.collectCount | moneyFormat }}收藏
                </span>
              </view>
              <view class="van-col van-col--6">
                <view class="right-text">{{ info.clickCount | moneyFormat }}次阅读</view>
              </view>
            </view>
          </view>
        </view>
        <!--推荐区域-->
        <div class="body-image-hds">
          <div class="mtitle">为您推荐类似图纸:</div>
          <div class="van-tabs van-tabs--line">
            <div class="van-tabs__wrap van-tabs__wrap--scrollable">
              <div role="tablist" class="van-tabs__nav van-tabs__nav--line van-tabs__nav--complete">
                <div role="tab" aria-selected="true" class="van-tab van-tab--active" style=""
                  v-for="(item, index) in recommendPictureList" :key="index" @click="tiaozhuan(item.pictureId)">
                  <span class="van-tab__text">
                    <div class="icon-text">
                      <div>
                        <div class="icon-bgs">
                          <img :src="item.pictureUrl" alt="">
                        </div>
                      </div>
                      <div class="text">{{ item.pictureName }}</div><!---->
                    </div>
                  </span>
                </div>

                <div role="tab" class="van-tab" style="padding-right: 0px; border: none;" @click="recommendPicture">
                  <span class="van-tab__text">
                    <div class="moore">{{ loadMoreText }}</div>
                  </span>
                </div>
                <div class="van-tabs__line"
                  style="width: 0px; transform: translateX(45px) translateX(-50%); transition-duration: 0.3s;"></div>
              </div>
            </div>
            <div class="van-tabs__content"><!----><!----><!----><!----><!----><!----><!----><!----><!----><!---->
              <div></div><!---->
            </div>
          </div>
        </div>
        <!--广告轮播图区域-->
        <view class="v-interaction">
          <ads :listPicture="listPicture"></ads>
        </view>
        <!--热门评论-->
        <comment ref="comment" :relatedId="pictureId" :type="1" :isShow="false" @setIsLoadMore="setIsLoadMore"
          @openPopup="openPopup"></comment>
      </view>
      <!--底部-->
      <view style="height: 96rpx">
        <view class="tjxzBotom">
          <view class="item tz selected" @click="replyComment">
            <span class="icons"></span>
            <span class="descs">评论</span>
          </view>
          <view class="item ckpl" @click="tujie">
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
      <view class="sky" @click="replyComment" v-show="isTop">
        <view class="input-btn van-row" style="">
          <view class="cont van-col van-col--21">
            <span class="left">
              <label for="commentInput">来发布您的评论吧</label>
            </span>
          </view>
          <view class="num van-col van-col--3">
            <uni-icons custom-prefix="iconfont" type="comment" size="25"></uni-icons>
            {{ info.commentCount | moneyFormat }}
          </view>
        </view>
      </view>
    </scroll-view>
    <!--投票弹窗-->
    <uni-popup ref="vote" type="dialog" background-color="#fff" mask-background-color="rgba(0,0,0,.7)">
      <vote @closeVote="closeVote" @openPopup="openPopup" :year="info.year" :period="info.period"
        :voteResult="info.voteResult" :type="1" :relatedId="pictureId"></vote>
    </uni-popup>
    <!--评论弹窗-->
    <uni-popup ref="comentPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <reply-comment ref="replyComment" @closeComent="closeComent" :commentId="0" :relatedId="pictureId"
          :commentType="1"></reply-comment>
      </view>
    </uni-popup>
    <!-- 分享 -->
    <uni-popup class="share" ref="share" type="share" safeArea backgroundColor="#fff">
      <share @closefx="closefx"></share>
    </uni-popup>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--悬浮菜单栏-->
    <fab></fab>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Lottery from '../../components/common/lottery/Lottery'
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import Login from "../../components/common/login/Login";
import Ads from '../../components/common/ad/Ad'
import Comment from "../../components/common/comment/Comment";
import ReplyComment from "../../components/common/comment/ReplyComment";
import Fab from "../../components/common/fab/Fab";
import Vote from "../../components/common/vote/Vote";
import Share from "../../components/common/share/Share";

import { detail, recommendPicture, latest } from '../../utils/picture/index.js'
import { period } from '../../utils/lottery/index.js'
import { advertList, listSpreadByType } from "../../utils/common/index.js"
import { collect, thumbUp } from "../../utils/user/index.js"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "detail",
  components: {
    Vote,
    Lottery,
    cusPreviewImg,
    Login,
    Ads,
    Comment,
    ReplyComment,
    Fab,
    Share,
    AlertInjectLayer,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '详情',
      curr: 0,
      selectText: '请选择',
      scrollTop: 0,
      isTop: 0,           //吸附判断
      isShow: false,
      voteShow: false,
      old: {
        scrollTop: 0,
        myScroll: 0,
      },
      yearList: [],
      periodList: [],
      pictureId: 0,
      info: {},
      lottery: {},
      listPicture: [],
      ImgList: [],
      animalId: 0,
      recommendPictureList: [],
      pageNum: 0,
      loadMoreText: '加载更多',
      isLoadMorePic: false,
    }
  },
  onLoad(option) {
    //方式一：接收参数
    console.log(option);
    this.pictureId = parseInt(option.id)
    this.detail()
    this.listSpreadByType()
    this.navY()
    uni.setNavigationBarTitle({
      title: this.title
    });
  },
  methods: {
    back: function () {
      uni.navigateBack()
    },
    tiaozhuan: function (id) {
      uni.navigateTo({
        url: "detail?id=" + id // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    tujie: function () {
      uni.navigateTo({
        url: "tujie?id=" + this.pictureId // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    lishi: function () {
      uni.navigateTo({
        url: '/pages/lottery/lottery?lotteryType=' + uni.getStorageSync('lotteryType')
        // page.json定义的路径 传url 到webview界面去接收 实现跳转
      })
    },
    navY: function () {
      this.$nextTick(function () {
        /*下次 DOM 更新时，找到某个控件，再进行复杂计算并确定其高度后*/
        const query = uni.createSelectorQuery();
        query.select('.comment-list').boundingClientRect(data => {
          this.old.myScroll = data.height;
        }).exec();
      });
      console.log(this.old.myScroll)
    },
    //展开
    zhankai: function () {
      this.voteShow = !this.voteShow
      this.navY()
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
    //加载更多
    lower: function (e) {
      if (!this.isLoadMore) {  //此处判断，上锁，防止重复请求
        this.isLoadMore = true
        this.$refs.comment.listLatest()
      }
    },
    setIsLoadMore: function () {
      this.isLoadMore = false
    },
    previewImg: function (imgList, url) { // 点击预览图片
      this.ImgList = []
      this.ImgList.push(imgList)
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    //滚动条监听
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop
      console.log(this.old.myScroll)
      if ((this.old.scrollTop) >= this.old.myScroll) {
        this.isTop = 1
      } else {
        this.isTop = 0
      }
    },
    //选择年
    selectYears(item, index) {
      this.curr = index
      let prams = {
        pictureTypeId: this.info.pictureTypeId,
        year: item.year
      }
      latest(prams).then(res => {
        this.yearList = res.result.yearList
        this.periodList = res.result.periodList
        this.info = res.result
        this.period()
        this.recommendPicture()
      }).catch(err => {
        console.log(err)
      })
    },
    //选择期
    async selectPeriod(item) {
      this.pictureId = item.pictureId
      await this.detail()
      this.selectText = "第" + this.info.period + "期"
      this.isShow = false
      this.$refs.comment.restComment()
    },
    //详情
    async detail() {
      let prams = { pictureId: this.pictureId }
      await detail(prams).then(res => {
        this.yearList = res.result.yearList
        this.periodList = res.result.periodList
        this.info = res.result
        this.period()
        this.recommendPicture()
      }).catch(err => {
        console.log(err)
      })
    },
    //根据期数获取彩票信息
    period: function () {
      let prams = {
        lotteryType: uni.getStorageSync('lotteryType'),
        number: this.info.period,
        year: this.info.year,
      }
      period(prams).then(res => {
        this.lottery = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //打开登录界面
    openPopup: function () {
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
    //打开评论
    replyComment: function () {
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
      this.$refs.comentPopup.open('right')
    },
    //关闭评论
    closeComent: function () {
      this.$refs.comentPopup.close()
      this.$refs.comment.restComment()
      this.detail()
    },
    //轮播图获取
    listSpreadByType: function () {
      let prams = {
        projectType: 1,
        code: 3,
      }
      advertList(prams).then(res => {
        this.listPicture = res.result
      }).catch(err => {

      })
    },
    //收藏
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
      let prams = { relatedId: this.pictureId, type: 1, createTime: this.info.createTime }
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
    //投票
    openVote: function () {
      this.$refs.vote.open()
    },
    //关闭投票
    closeVote: function () {
      console.log(1111)
      this.$refs.vote.close()
      this.detail()
    },
    //投票记录
    voteDetail: function () {
      uni.navigateTo({
        url: "voteDetails?pictureId=" + this.pictureId // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    //推荐
    recommendPicture: function () {
      if (this.isLoadMorePic) {
        return false
      }
      this.pageNum++
      let prams = {
        pageNum: this.pageNum,
        pictureId: this.pictureId,
        year: this.info.year
      }
      recommendPicture(prams).then(res => {
        this.recommendPictureList.push(...res.result.records)
        if (res.result.pages <= this.pageNum) {
          this.loadMoreText = '已加载全部'
          this.isLoadMorePic = true
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.mint-tab-container-item {
  font-family: PingFang SC;
}

.scroll-Y {
  height: var(--vh);
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

.rht1 {
  margin-right: 32rpx;
}

.rht {
  color: #07c160;
  font-family: PingFang SC;
  font-size: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rht span {
  height: 34rpx;
  line-height: 34rpx;
}

.rht * {
  display: inline-block;
}

.rht1 .icons {
  background-image: url('../../static/img/picture/lis.png');
  background-size: 100% 100%;
  height: 36rpx;
  width: 36rpx;
}

.rht2 .icons {
  background-image: url('../../static/img/picture/pl.png');
  background-size: 100% 100%;
  height: 36rpx;
  width: 36rpx;
}

.customfixed {
  height: 140rpx;
}

.sticky-body {
  max-width: 480px;
  width: 100vw;
  margin: 0px auto;
  background-color: #fff;
  position: fixed;
  z-index: 4;
}

.m-tabs-years {
  overflow-x: auto;
  background-color: #fff;
}

.m-tabs-years .m-tabs-years-bd {
  height: 76rpx;
  white-space: nowrap;
  min-width: 100%;
  overflow: hidden;
  padding-left: 28rpx;
}

.m-tabs-years .m-tabs-years-bd span {
  border: 1Px solid #a9a9a9;
  border-radius: 40rpx;
  width: 110rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  font-size: 24rpx;
  margin: 20rpx 28rpx 0 0;
  display: inline-block;
}

.m-tabs-years .m-tabs-years-bd span.act {
  border: 1px solid #07c160;
  background: #07c160;
  color: #fff;
}

.m-tabs-period-home {
  border-top: 1Px solid #f8f8f8;
  background-color: #fff;
  position: relative;
  display: flex;
  justify-content: space-between;
}

.m-tabs-period {
  overflow-x: auto;
  width: 70%;
}

.m-tabs-period .m-tabs-period-bd {
  height: 60rpx;
  white-space: nowrap;
  min-width: 100%;
}

.m-tabs-period .m-tabs-period-bd span {
  width: 150rpx;
  text-align: center;
  font-size: 24rpx;
  margin-top: 18rpx;
  display: inline-block;
}

.m-tabs-period .m-tabs-period-bd span.act {
  color: #07c160;
}

.m-tabs-period-home .van-dropdown-menu {
  height: 60rPx;
  width: 28%;
  text-align: center;
  display: flex;
  margin-right: 10rpx;
  justify-content: center;
}

.van-dropdown-menu__bar {
  width: 116rpx;
  height: 44rpx;
  line-height: 44rpx;
  margin-top: 10rpx;
  background: #07c160;
  border-radius: 30rpx;
}

.van-dropdown-menu__title {
  font-size: 24rpx;
  color: #fff;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.van-dropdown-box {
  position: fixed;
  top: calc(136rpx + 45px);
  width: 100%;
  max-width: 480px;
  height: calc(var(--vh) - 150rpx);
  background-color: rgba(0, 0, 0, .7);
  z-index: 1;
}

.van-dropdown-box-in {
  width: 100%;
  max-height: 1100rpx;
  background-color: #fff;
  overflow-y: auto;
}

.dropdown-body {
  background: #fff;
  overflow: hidden;
  padding: 20rpx 0;
}

.dropdown-body .van-col {
  display: inline-block;
  width: 25%;
  text-align: center;
}

.dropdown-body .van-col span {
  display: inline-block;
  width: 160rpx;
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 6rpx;
  border: 1px solid #a9a9a9;
  text-align: center;
  margin-bottom: 20rpx;
  font-size: 26rpx;
}

.dropdown-body .van-col span.act {
  border: 1px solid #07c160;
  color: #07c160;
}

.body-hd-2 {
  text-align: center;
  color: #07c160;
  margin-top: -10rpx;
  padding-bottom: 16rpx;
}

.vote-box {
  display: inline-block;
  background: #fff;
}

.imgPos {
  background: #fff;
}

.ms-bd-img {
  text-align: center;
  background: #f9f9f9;
}

.ms-bd-img img {
  width: auto;
  width: 100%;
}

.ms-bd-vote {
  padding: 40rpx 20rpx;
  font-size: 24rpx;
  display: inline-block;
}

.ms-bd-vote .vote-num {
  text-align: center;
  margin-bottom: 16rpx;
}

.ms-bd-vote .vote-item {
  margin-bottom: 40rpX;
  position: relative;
}

.ms-bd-vote .vote-item .left,
.ms-bd-vote .vote-item .right {
  position: absolute;
  font-size: 24rpx;
  top: -4rpx;
}

.ms-bd-vote .bd-rate {
  background: #ebeae8;
  height: 20rpx;
  position: relative;
  margin-left: 30rpx;
  margin-right: 96rpx;
}

.ms-bd-vote .bd-rate .bd-rate-color {
  background: #07c160;
  height: 20rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.ms-bd-vote .vote-item .right {
  right: 0;
}

.ms-bd-btn {
  padding: 0 40rpx 20rpx;
  background: #fff;
}

.ms-bd-btn .van-row {
  display: inline-block;
  width: 100%;
}

.vote-btn,
.vote-his {
  border-radius: 999px;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border: 2rpx solid #07c160;
}

.vote-btn {
  background-color: #07c160;
  color: #fff;
}

.vote-his {
  background-color: #fff;
  color: #07c160;
}

.open-hide {
  height: 70rpx;
  background: #fff;
  margin-top: 20rpx;
  text-align: center;
}

.open-hide span {
  width: 206rpx;
  height: 46rpx;
  background-image: url("../../static/img/shuqi.png");
  background-size: 100% 100%;
  display: inline-block;
  line-height: 46rpx;
  font-size: 24rpx;
  color: #fff;
  position: relative;
}

.bottom-bd {
  padding: 0 20rpx;
}

.hd-interaction {
  padding: 20rpx 0 72rpx 0;
}

.interaction {
  position: relative;
}

.interaction .tool-item {
  margin-right: 30rpx;
  color: #888;
  font-size: 26rpx;
}

.interaction .right-text {
  text-align: right;
  font-size: 24rpx;
  color: #666;
  padding-top: 6rpx;
}

.bottom-bd .body-image-hds {
  background: #fff;
  max-width: 960rpx;
  margin: 0 auto;
}

.bottom-bd .mtitle {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.bottom-bd .body-image-hds .van-tabs--line .van-tabs__wrap {
  height: inherit;
}

.van-tabs__wrap {
  overflow: hidden;
}

.bottom-bd .body-image-hds .van-tabs__nav--line {
  padding-bottom: 10rpx;
  padding-left: 0 !important;
}

.bottom-bd .body-image-hds .van-tab {
  line-height: inherit;
  font-size: inherit;
  padding: 0;
  padding-right: 0.36rem;
}

.van-tabs__nav--line.van-tabs__nav--complete {
  padding-right: 8px;
  padding-left: 8px;
}

.van-tabs__wrap--scrollable .van-tabs__nav {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.van-tabs__nav--line {
  box-sizing: content-box;
  height: 100%;
  padding-bottom: 15px;
}

.van-tabs__nav {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  background-color: #fff;
  -webkit-user-select: none;
  user-select: none;
}

.bottom-bd .body-image-hds .van-tab {
  line-height: inherit;
  font-size: inherit;
  padding: 0;
  padding-right: 36rpx;
}

.van-tabs__wrap--scrollable .van-tab {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 auto;
  flex: 1 0 auto;
  padding: 0 12px;
}

.van-tab {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 4px;
  color: #646566;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.bottom-bd .body-image-hds .van-tab {
  line-height: inherit;
  font-size: inherit;
  padding: 0;
  padding-right: 36rpx;
}

.bottom-bd .body-image-hds .icon-bgs {
  width: 140rpx;
  height: 200rpx;
  border-radius: 20rpx;
  text-align: center;
  display: inline-block;
  line-height: 200rpx;
}

.bottom-bd .body-image-hds .icon-bgs img {
  width: 140rpx;
  height: 200rpx;
}

.bottom-bd .body-image-hds .text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 138rpx;
  height: 20rpx;
  line-height: 20rpx;
  text-align: center;
}

.icon-text .text {
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #555;
}

.bottom-bd .body-image-hds .moore {
  height: 276rpx;
  width: 56rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 30rpx;
  color: #20d497;
  font-weight: 600;
  border: none;
}

.bottom-bd .body-image-hds .van-tab__text {
  border: 2rpx solid #eee;
  border-radius: 20rpx;
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
  max-width: 480px;
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
  background-image: url('../../static/img/picture/pinglun.png');
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
  background-image: url('../../static/img/picture/tujie.png');
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

.sky {
  width: 100%;
  max-width: 480px;
  height: 140rpx;
}

.sky .input-btn {
  position: fixed;
  background: #fff;
  width: calc(100vw - 40rpx);
  height: calc(100rpx - 40rpx);
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 96rpx;
  max-width: calc(480px - 40rpx);
  padding: 20rpx;
}

.sky .input-btn .cont {
  background: #eee;
  color: #ccc;
  padding: 16rpx;
  border-radius: 30rpx;
  height: 64rpx;
  margin-left: 20rpx;
  line-height: 32rpx;
  font-size: 28rpx;
}

.sky .input-btn .num {
  display: flex;
  flex-direction: column;
  text-align: right;
  align-items: center;
}
</style>