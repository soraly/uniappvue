<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" show-scrollbar="true"
      scroll-with-animation="true" @scrolltolower="lower" @scroll="scroll">
      <!--顶部导航栏-->
      <nav-bar>
        <!-- <block slot="left">
          <uni-icons @click="back" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
        </block> -->
        <view class="input-view"
          style="color:#000;font-weight: 700;font-size: 32rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
          v-if="type != 12" slot="title">
          {{ title }}
        </view>
        <view class="input-view" style="color:#323233;font-weight: 700;" v-else slot="title">{{ title }}</view>
        <block slot="right">
          <uni-icons @click="openJin" type="more-filled" size="16" color="rgb(7, 193, 96)"></uni-icons>
        </block>
      </nav-bar>
      <!-- <view class="header-box">
        <div class="header">
          <view class="box-bg">
            <uni-nav-bar backgroundColor="#fff" :height="46" color="#000" rightWidth="65px">
              <block slot="left">
                <uni-icons @click="back" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
              </block>
              <view class="input-view" style="color:#000;font-weight: 700;font-size: 32rpx" v-if="type!=12">{{ title }}</view>
              <view class="input-view"  style="color:#323233;font-weight: 700;" v-else>{{ title }}</view>
              <block slot="right">
                <uni-icons @click="openJin" type="more-filled" size="16" color="rgb(7, 193, 96)"></uni-icons>
              </block>
            </uni-nav-bar>
          </view>
        </div>
      </view> -->
      <!--开奖区域-->
      <view class="lottery" v-if="lastLottery">
        <lottery :lotteryDetail="lastLottery">
          <template v-slot:header></template>
          <template v-slot:lottery></template>
          <template v-slot:footer>
            <span v-if="lastLottery.isNewest == false"></span>
          </template>
        </lottery>
      </view>
      <view class="images-box" v-if="info.type == 2 && info.pictureList.length > 0">
        <view class="images" style="position: relative">
          <swiper :style="{ height: swiperHeight + 'px' }" @change="changeSwiper" class="swiper" :indicator-dots="false"
            :autoplay="false" :current="current">
            <swiper-item v-for="(item, index) in info.pictureList">
              <fast-lazy-load :id="'content-wrap' + index" @click="previewImg(info.pictureList, item)" :src="item"
                :width="'100%'" mode="widthFix">
                <template v-slot:loading>
                  <image class="lazy-image" :src="loadingImg"></image>
                </template>
                <template v-slot:error>
                  <image class="lazy-image" :src="loadingImg"></image>
                </template>
              </fast-lazy-load>
            </swiper-item>
          </swiper>
          <view class="current-text">
            {{ current + 1 }}/{{ info.pictureList.length }}
          </view>
        </view>
      </view>
      <!--帖子作者简介-->
      <view class="detail-body">
        <!--帖子点赞作者相关信息-->
        <view :style="{ height: detailHeight + 'px' }">
          <view id="detail" :class="isTop ? 'top' : ''" :style="isTop == 1 ? 'marginTop:' + safeHeight : ''">
            <view class="detail-body-box">
              <view class="cell-top clearfix">
                <view class="user-img">
                  <view class="left-image">
                    <view class="van-image van-image--round">
                      <image :src="info.headPic || ''" class="van-image__img" @click="homepage(info)"></image>
                    </view><!---->
                    <view class="m-follow" v-show="info.concern == 0" @click="concern()">
                      <span class="add-follow">关注</span>
                    </view>
                  </view>
                  <view class="user-info">
                    <view class="name" @click="homepage(info)">
                      {{ info.username }}
                      <span class="reportInfo"></span>
                    </view>
                    <view class="time" @click="homepage(info)">{{ info.updateTime || '' }}</view>
                  </view><!---->
                </view>
                <view class="right-tool">
                  <image src="../../static/img/forum/shang.png"></image>
                  <span class="editor-btn" v-if="info.editable == 0" @click="history">历史帖子</span>
                  <span class="editor-btn" v-else @click="editForum">编辑</span>
                </view>
              </view>
              <view class="interaction-info van-row">
                <view class="van-col van-col--4">
                  <view class="num">{{ info.thumbUpCount | moneyFormat }}</view>
                  <view class="label">获赞</view>
                </view>
                <view class="van-col van-col--5">
                  <view class="num">{{ info.fansCount | moneyFormat }}</view>
                  <view class="label">粉丝</view>
                </view>
                <view class="van-col van-col--5">
                  <div class="num">{{ info.concernCount | moneyFormat }}</div>
                  <div class="label">关注</div>
                </view>
                <view class="van-col van-col--5">
                  <div class="num">{{ info.score | moneyFormat }}</div>
                  <div class="label">成长值</div>
                </view>
                <view class="van-col van-col--5">
                  <view class="num">{{ info.clickCount | moneyFormat }}</view>
                  <view class="label">阅读数</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!--标题-->
        <view class="content-box has-read" v-if="info.type != 2">{{ info.title }}</view>
        <!--图解-->
        <view class="images-box" style="display: block;width: auto;padding: 30rpx;" v-if="info.type == 12">
          <view style="width: 100%">
            <image style="width: 100%" :src="info.picture.largePictureUrl" mode="widthFix"></image>
          </view>
        </view>
        <!--文章详情-->
        <view class="desc-body-box">
          <mp-html :content="info.description" /><!--<rich-text :nodes="info.description"></rich-text>-->
        </view>
        <!--图集-->
        <view style="width: 100%;max-width: 480px">
          <view class="images-box" v-if="info.type != 2">
            <view class="images">
              <uni-row class="img-box-1">
                <uni-col :span="8" style="padding-left: 5px;" v-for="(item, index) in info.pictureList">
                  <fast-lazy-load @click="previewImg(info.pictureList, item)" class="img-list" :radius="'8rpx'"
                    :src="item" :width="'100%'" :height="'180rpx'" mode="aspectFill">
                    <template v-slot:loading>
                      <image class="lazy-image" :src="loadingImg"></image>
                    </template>
                    <template v-slot:error>
                      <image class="lazy-image" :src="loadingImg"></image>
                    </template>
                  </fast-lazy-load>
                </uni-col>
              </uni-row>
            </view>
          </view>
        </view>
        <!--广告轮播图区域-->
        <view class="v-interaction">
          <ads :listPicture="listPicture"></ads>
        </view>
        <!--粉丝区域-->
        <!--        <view class="fans-top">
          <img src="../../static/img/forum/liwu.png" class="title">
          <span class="huanghua">
            <img src="../../static/img/forum/jinbi.png">
            <label>0</label>
          </span>
          <span class="honghua">
            <img src="../../static/img/forum/honghua.png">
            <label>0</label>
          </span>
          <span class="more">查看更多 &gt;</span>
        </view>-->
        <!--排行榜-->
        <!--        <div class="gift">
          <div class="liwu-list van-row">
            <div class="van-col van-col&#45;&#45;8">
              <div class="user-img-box">
                <div class="user-img-top top2">
                  <img
                      src="https://img.sycccf.com:4949/unite49files/user/2021/10/25/1746885/1635162169865-20211025194249-1815455420.png"
                      class="userimg">
                  <img src="../../static/img/forum/two.png" class="userimgxs">
                </div>
              </div>
              <div class="name">沙场湫点兵</div>
              <div class="liwuname">
                <span>12000彩金</span>
                <span>325红花</span>
              </div>
            </div>
            <div class="van-col van-col&#45;&#45;8">
              <div class="user-img-box">
                <div class="user-img-top top1">
                  <img
                      src="https://img.sycccf.com:4949/unite49files/user/2022/08/18/1333445/20220818234143-1094191866.png"
                      class="userimg">
                  <img src="../../static/img/forum/one.png" class="userimgxs">
                </div>
              </div>
              <div class="name">浅月流歌</div>
              <div class="liwuname">
                <span>11546.11彩金</span><span>2464红花</span>
              </div>
            </div>
            <div class="van-col van-col&#45;&#45;8">
              <div class="user-img-box">
                <div class="user-img-top top3">
                  <img
                      src="https://img.sycccf.com:4949/unite49files/user/2021/12/01/1376523/1638360542399-20211201200902-1610491737.png"
                      class="userimg">
                  <img src="../../static/img/forum/three.png" class="userimgxs">
                </div>
              </div>
              <div class="name">东方神起</div>
              <div class="liwuname">
                <span>8969.77彩金</span>
                <span>9951红花</span>
              </div>
            </div>
          </div>&lt;!&ndash;&ndash;&gt;
        </div>-->
        <!--热门评论-->
        <comment ref="comment" :relatedId="id" :type="type" :isShow="true" :createTime="info.createTime"
          :userId="info.userId" @setIsLoadMore="setIsLoadMore" @openPopup="openPopup"></comment>
      </view>
      <!--底部悬浮框-->
      <view class="tool-bottom">
        <view class="tool-bottom-body">
          <view class="van-row">
            <view class="van-col van-col--16" @click="replyComment">
              <span class="left">
                <label for="commentInput">想说点什么...</label>
              </span>
            </view>
            <view class="van-col van-col--8">
              <view class="right van-row">
                <view class="van-col van-col--6" style="width: 26%">
                  <uni-icons type="hand-up" size="18" v-if="info.thumbUp == 0" @click="thumbUp()"></uni-icons>
                  <uni-icons type="hand-up-filled" size="18" color="#07c160" v-else @click="thumbUp()"></uni-icons>
                  <div class="label">{{ info.thumbUpCount | moneyFormat }}</div>
                </view>
                <view class="van-col van-col--6" @click="replyComment" style="width: 26%">
                  <uni-icons custom-prefix="iconfont" type="comment" size="18"></uni-icons>
                  <div class="label">{{ info.commentCount | moneyFormat }}</div>
                </view><!----><!---->
                <view class="van-col van-col--6" @click="fenxiang" style="width: 26%">
                  <image src="../../static/img/index/fenxiang.png" style="width: "></image>
                  <div class="label">分享</div>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!--评论弹窗-->
    <uni-popup ref="comentPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <reply-comment ref="replyComment" @closeComent="closeComent" :commentId="commentId" :relatedId="id"
          :createTime="info.createTime" :commentType="info.type"></reply-comment>
      </view>
    </uni-popup>
    <view class="jin-box">
      <uni-popup ref="jinPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="true">
        <view class="van-action-sheet__content">
          <button type="primary" class="action-button" @click="homepage(info)">查看用户主页</button>
          <button type="primary" class="action-button" @click="history">历史帖子</button>
          <button type="primary" v-if="info.highQuality == 0 && info.canRaise == 1 && info.applyBestStatus == 0"
            class="action-button" @click="jiajin">申请加精</button>
          <button type="primary" v-else-if="info.highQuality == 0 && info.canRaise == 1 && info.applyBestStatus == 1"
            class="action-button" style="color:#d0af7c">精华帖审核中</button>
          <button type="primary" v-else-if="info.highQuality == 1" class="action-button"
            style="color: #07c160;">加精成功</button>
          <button type="primary" class="action-button red" @click="report">举报</button>
        </view>
        <view class="van-action-sheet__gap"></view>
        <button type="primary" class="action-button" @click="closeJin">取消</button>
      </uni-popup>
    </view>
    <!-- 分享 -->
    <uni-popup class="share" ref="share" type="share" safeArea backgroundColor="#fff">
      <share @closefx="closefx"></share>
    </uni-popup>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--悬浮菜单栏-->
    <fab></fab>
    <AlertInjectLayer />
  </view>
</template>

<script>
import Fab from "../../components/common/fab/Fab";
import Lottery from '../../components/common/lottery/Lottery'
import Ads from '../../components/common/ad/Ad'
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import Comment from "../../components/common/comment/Comment";
import ReplyComment from "../../components/common/comment/ReplyComment";
import Login from "../../components/common/login/Login";
import Share from "../../components/common/share/Share";

import { period } from "../../utils/lottery/index.js"
import { detail, applyRaise } from '../../utils/forum/index.js'
import { advertList, listSpreadByType } from "../../utils/common/index.js"
import { concern, thumbUp } from '../../utils/user/index.js'
import Vote from "../../components/common/vote/Vote";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import NavBar from "../../components/common/navBar/navBar.vue"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "detail",
  components: {
    AlertInjectLayer, UniCol, UniRow, Vote, Fab, Lottery, cusPreviewImg, Ads, Comment, Login, ReplyComment, Share, NavBar,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '详情',
      loadingImg: '@/static/img/zw.png',
      scrollTop: 0,
      isTop: 0,           //吸附判断
      isGet: false,        //是否获取悬浮高度
      lotteryType: 0,      //
      old: {
        scrollTop: 0,
        myScroll: 0,
      },
      current: 0,
      status: 'more',    //触底加载状态
      isLoadMore: false,
      id: 0,
      createTime: '',
      type: 3,
      lastLottery: {}, //最后一次开奖信息
      info: {},//帖子详情
      listPicture: [],//广告图
      ImgList: [],
      commentId: 0,  //评论ID
      isOpen: false,
      msg: '',
      swiperHeight: 0,
      detailHeight: 0
    }
  },
  onLoad(option) {
    //方式一：接收参数
    this.id = parseInt(option.id)
    this.createTime = option.createTime
    this.type = parseInt(option.type)
    this.lotteryType = option.lotteryType
    uni.$on('emitParams', data => {
      this.msg = data.msg
    })
    this.detail()
    this.listSpreadByType()
    uni.setNavigationBarTitle({
      title: this.title
    });
    let configData = uni.getStorageSync('config')
    try {
      configData.forEach((item, index) => {
        if (item.type == 23) {
          this.loadingImg = item.url
          throw Error();
        }
      })
    } catch (err) {
      console.log(err)
    }
    this.$nextTick(function () {
      this.getDetailHeight()
    })
  },
  onShow() {
    if (this.msg) {
      pop(this.msg, 2000)
      this.msg = ''
    }
  },
  methods: {
    back: function () {
      backPage()
    },
    history: function (item) {
      uni.navigateTo({
        url: "history?userId=" + this.info.userId + "&lotteryType=" + this.info.lotteryType // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    report: function () {
      this.$refs.jinPopup.close()
      uni.navigateTo({
        url: "report?relatedId=" + this.info.articleId + "&type=" + this.info.type + "&title=" + this.info.title // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    //用户主页
    homepage: function (item) {
      uni.navigateTo({
        url: "/pages/user/homepage/homepage?userId=" + item.userId
      })
    },
    //编辑器
    editForum: function () {
      uni.navigateTo({
        url: '/pages/forum/add?id=' + this.info.articleId
      })
    },
    getDetailHeight: function () {
      /*下次 DOM 更新时，找到某个控件，再进行复杂计算并确定其高度后*/
      const query = uni.createSelectorQuery();
      query.select('#detail').boundingClientRect(data => {
        console.log(data.top)
        this.old.myScroll = data.top;
        this.detailHeight = data.height
      }).exec();
    },
    navY: function () {
      /*下次 DOM 更新时，找到某个控件，再进行复杂计算并确定其高度后*/
      const query = uni.createSelectorQuery();
      query.select('#detail').boundingClientRect(data => {
        console.log(data.top)
        this.old.myScroll = data.top;
        this.detailHeight = data.height
      }).exec();
    },
    lotteryName: function (lotteryId) {
      let lotteryName = ''
      this.navList.forEach((item, index) => {
        if (item.lotteryType == lotteryId) {
          lotteryName = item.name
          return
        }
      })
      return lotteryName
    },
    //分享弹窗
    fenxiang: function () {
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
        this.pageNum += 1
        this.$refs.comment.listLatest()
      }
    },
    //
    setIsLoadMore: function () {
      this.isLoadMore = false
    },
    //滚动条监听
    scroll: function (e) {
      this.old.scrollTop = e.detail.scrollTop
      if (!this.isGet) {
        this.isGet = true
        this.navY()
      }
      if ((this.old.scrollTop) >= this.old.myScroll) {
        this.isTop = 1
      } else {
        this.isTop = 0
      }
    },
    //开奖信息
    period: function () {
      let prams = { lotteryType: this.info.lotteryType, number: this.info.period, year: this.info.year }
      period(prams).then(res => {
        this.lastLottery = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    //文章详情获取
    detail: function () {
      let prams = { articleId: this.id, createTime: this.createTime }
      detail(prams).then(res => {
        this.info = res.result
        let title = '';
        if (this.info.lotteryType == 1) {
          title = '港彩';
        } else if (this.info.lotteryType == 2) {
          title = '澳彩';
        } else if (this.info.lotteryType == 3) {
          title = '台彩';
        } else {
          title = '新彩';
        }
        console.log(this.type)
        if (this.type != 4) {
          this.title = title + "第" + this.info.period + "期"
          if (this.type == 2) {
            let title = this.info.title.slice(0, 6) + "..."
            this.title = this.title + ":" + title
            this.info.pictureEntityList.forEach((item, index) => {
              this.info.pictureList.push(item.pictureUrl)
            })
          }
        }
        this.$refs.comment.commentLists()
        this.period()
        //动态设置swiper的高度
        this.$nextTick(() => {
          this.setSwiperHeight();
        });
        setTimeout(() => {
          this.setSwiperHeight()
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    },
    async changeSwiper(e) {
      this.current = e.detail.current;
      //动态设置swiper的高度，使用nextTick延时设置
      await this.setSwiperHeight();
    },
    //动态设置swiper的高度
    setSwiperHeight() {
      let element = "#content-wrap" + this.current;
      console.log(element)
      let query = uni.createSelectorQuery().in(this);
      query.select(element).boundingClientRect();
      query.exec((res) => {
        console.log(res)
        if (res && res[0]) {
          this.swiperHeight = res[0].height;
        }
      });
      console.log(this.swiperHeight)
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
    //关注接口
    concern: function () {
      let token = uni.getStorageSync('token');
      if (!token) {
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
      let prams = { userId: this.info.userId }
      concern(prams).then(res => {
        uni.showToast({
          title: res.message,
          duration: 2000,
          icon: 'none'
        })
        if (res.code == 200) {
          this.info.concern = !this.info.concern
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //点赞接口
    thumbUp: function () {
      let token = uni.getStorageSync('token');
      if (!token) {
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
      let prams = { relatedId: this.info.articleId, type: this.info.type, createTime: this.info.createTime }
      thumbUp(prams).then(res => {
        uni.showToast({
          title: res.message,
          duration: 2000,
          icon: 'none'
        })
        if (res.code == 200) {
          this.info.thumbUp = 1
          this.info.thumbUpCount++
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //申请加精
    jiajin: function () {
      let prams = { articleId: this.info.articleId }
      applyRaise(prams).then(res => {
        this.$refs.jinPopup.close()
        if (res.code == 200) {
          pop('提交成功', 2000)
          this.info.applyBestStatus = 1
        } else {
          pop(res.message, 2000)
        }
      })
    },
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
    openJin: function () {
      this.$refs.jinPopup.open('bottom')
    },
    closeJin: function () {
      this.$refs.jinPopup.close()
    },
    //图片弹窗
    previewImg: function (imgList, url) { // 点击预览图片
      this.ImgList = imgList
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
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
    closeComent: function (type = 1) {
      this.$refs.comentPopup.close()
      if (type == 2) {
        this.detail()
        this.$refs.comment.restComment()
      }
    },
    //轮播图加载报错
    onSwiperImageLoadingError() {

    }
  },
}
</script>

<style scoped>
.mint-tab-container-item {
  background: #fff;
}

.header-box,
.header,
.box-bg {
  height: 46px;
}

.scroll-Y {
  height: var(--vh);
}

.lottery {
  background: #fff;
  padding: 16rpx;
}

.detail-body {
  background: #fff;
}

.detail-body .hd-image {
  margin-bottom: 20rpx;
}

.detail-body .hd-image image {
  width: 100%;
}

.detail-body .detail-body-box {
  padding: 30rpx 30rpx 10rpx;
  background: #fff;
}

.detail-body .top {
  position: fixed;
  top: 46px;
  z-index: 99;
  width: 100%;
  max-width: 480px;
}

.detail-body .detail-body-box .cell-top {
  position: relative;
  height: 120rpx
}

.detail-body .detail-body-box .cell-top .user-img {
  padding-left: 140rpx;
  padding-top: 10rpx;
}

.user-img .left-image {
  position: absolute;
  left: 0;
  top: 0;
}

.detail-body .detail-body-box .cell-top .user-img .van-image {
  width: 120rpx;
  height: 120rpx;
}

.van-image--round {
  overflow: hidden;
  border-radius: 50%;
}

.van-image {
  position: relative;
  display: inline-block;
}

.van-image--round img {
  border-radius: inherit;
}

.van-image__error,
.van-image__img,
.van-image__loading {
  display: block;
  width: 100%;
  height: 100%;
}

.detail-body .detail-body-box .cell-top .user-img .m-follow {
  position: absolute;
  left: 6rpx;
  bottom: 0;
}

.m-follow .add-follow {
  display: inline-block;
  width: 108rpx;
  height: 50rpx;
  background: #07c160;
  color: #fff;
  border-radius: 30rpx;
  font-size: 28rpx;
  text-align: center;
  line-height: 50rpx;
}

.user-img .user-info .name {
  padding: 8rpx 0 6rpx 0;
  margin-right: 10rpx;
  font-style: normal;
  font-weight: 700;
  font-size: 28rpx;
  color: #999;
}

.user-img .user-info .time {
  font-size: 24rpx;
  color: #888;
}

.detail-body .detail-body-box .cell-top .right-tool {
  position: absolute;
  right: 0;
  top: 10rpx;
}

.right image {
  width: 15Px;
  height: 15Px;
}

.detail-body .detail-body-box .cell-top .right-tool image {
  width: 64rpx;
  height: 64rpx;
  float: left;
}

.detail-body .detail-body-box .cell-top .right-tool .editor-btn {
  float: left;
  background: #07c160;
  color: #fff;
  height: 64rpx;
  line-height: 64rpx;
  width: 120rpx;
  text-align: center;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-left: 30rpx;
}

.interaction-info {
  text-align: center;
  padding: 30rpx 0;
  display: inline-block;
  width: 100%;
}

.interaction-info .num {
  font-size: 32rpx;
}

.interaction-info .label {
  color: #999;
  font-size: 24rpx;
  padding-top: 16rpx;
}

.detail-body .content-box {
  margin: 40rpx 30rpx;
  color: #333;
  line-height: 44rpx;
  font-size: 32rpx;
  word-wrap: break-word;
  font-weight: 600;
}

.detail-body .desc-body-box {
  padding: 26rpx 30rpx;
  word-break: break-all;
  line-height: 48rpx;
  font-size: 28rpx;
  color: #333;
}

.detail-body .images-box {
  display: inline-block;
  width: 100%;
}

.detail-body .images-box .images {
  padding: 0 30rpx 20rpx;
}


.img-list {
  width: 100%;
  height: 180rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
  position: relative;
}

.v-interaction {
  padding: 0 0px;
}

.detail-body .fans-top {
  height: 104rpx;
  background-color: #f3fcf7;
  border-top: 2rpx solid #eee;
  padding: 0 30rpx;
}

.detail-body .fans-top .title {
  height: 64rpx;
  float: left;
  margin-top: 16rpx;
}

.detail-body .fans-top .honghua,
.detail-body .fans-top .huanghua {
  float: left;
  font-size: 32rpx;
  color: #fdc72f;
  margin-top: 26rpx;
  margin-left: 30rpx;
}

.detail-body .fans-top .honghua img,
.detail-body .fans-top .huanghua img {
  height: 44rpx;
  float: left;
}

.detail-body .fans-top .honghua label,
.detail-body .fans-top .huanghua label {
  float: left;
  margin-top: 4rpx;
  margin-left: 10rpx;
  font-weight: 600;
}

.detail-body .fans-top .more {
  color: #999;
  float: right;
  margin-top: 36rpx;
  font-size: 24rpx;
}

.detail-body .gift {
  padding: 30rpx;
}

.detail-body .gift .liwu-list {
  text-align: center;
  margin-bottom: 4rpx;
  display: inline-block;
  width: 100%;
}

.detail-body .gift .liwu-list .user-img-box {
  height: 218rpx;
  position: relative;
}

.detail-body .gift .liwu-list .user-img-box .user-img-top {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.user-img-top.top2,
.user-img-top.top3 {
  width: 136rpx;
  height: 136rpx;
}

.user-img-top.top1 {
  width: 182rpx;
  height: 182rpx;
}

.user-img-top {
  display: inline-block;
}

.user-img-top .userimg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-img-top .userimgxs {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: -4rpx;
}

.gift .liwu-list .name {
  font-size: 32rpx;
  padding-top: 20rpx;
}

.gift .liwu-list .liwuname {
  color: #ff5e4f;
  font-size: 24rpx;
  padding-top: 10rpx;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-weight: 600;
}

.tool-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  z-index: 5;
}

.tool-bottom .tool-bottom-body {
  background-color: #fff;
  max-width: 960rpx;
  margin: 0 auto;
  border-top: 2rpx solid #eee;
  padding: 0 20rpx;
  height: 100rpx;
}

.tool-bottom .left {
  width: 100%;
  height: 68rpx;
  background-color: #f1f1f1;
  border-radius: 40rpx;
  display: inline-block;
  margin-top: 16rpx;
  color: silver;
  text-align: left;
  line-height: 68rpx;
}

.tool-bottom .left label {
  margin-left: 30rpx;
  font-size: 24rpx;
  display: block;
}

.tool-bottom .tool-bottom-body .van-row.right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.tool-bottom .right {
  text-align: center;
}

.tool-bottom .right uni-text {
  margin-top: 16rpx;
}

.tool-bottom .right .label {
  font-size: 24rpx;
  color: #666;
  padding-top: 6rpx;
}

.tool-bottom .right .van-col {
  margin-top: 16rpx;
}

.tool-bottom .right img {
  width: 30rpx;
  height: 30rpx;
}

.action-button {
  font-size: 16px;
  background-color: #fff;
  display: block;
  width: 100%;
  color: #323233;
  height: 50px;
  line-height: 50px;
  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid #ebedf0;
}

.red {
  color: #d1827d;
}

.action-button:after {
  content: " ";
  width: 200%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  border: 0px solid rgba(0, 0, 0, .2);
  -webkit-transform: scale(.5);
  transform: scale(.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
  border-radius: 10px;
}

.van-action-sheet__gap {
  display: block;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100.1%;
  border: 0px solid rgba(0, 0, 0, 0.7);
}

.current-text {
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
  background: rgb(79 79 79 / 70%);
  width: 70rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  font-size: 26rpx;
}

.lazy-image {
  max-width: 80rpx;
  max-height: 80rpx;
  width: 50%;
  height: 50%;
}
</style>
