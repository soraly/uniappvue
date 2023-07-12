<template>
  <view>
    <!--展开更多列表-->
    <view v-show="isShow" class="reply-info-box">
      <view class="reply-info" v-for="(item, index) in SecondCommentList" :key="index">
        <view class="reply-info-user">
          <view class="user-img-to" @click="homepage(item)">
            <view class="left-image">
              <view class="van-image van-image--round" style="width: 40rpx; height: 40rpx;">
                <img :src="item.headPic" class="van-image__img">
              </view>
            </view>
            <view class="user-info van-ellipsis">
              <span class="moren">{{ item.nickname }}</span>
              <span></span>
            </view>
          </view>
        </view>
        <view class="content">
          <span class="user-img-to-text">
            <uni-icons custom-prefix="iconfont" type="sanjiaoright" size="14"></uni-icons>
            <label :class="item.toUserVip == 1 ? 'moren red' : 'moren'">{{ item.toNickname }}</label>
          </span>
          <view class="content-box">
            <span class="clamp-body" style="overflow: hidden;">
              <span style="box-shadow: transparent 0px 0px;" @click="openComment">
                <text-overflow :dt="item.content" :line="3" expandText="展开" foldHint="收起" />
              </span>
            </span>
          </view>
        </view>
        <view class="images">
          <view class="img-box-1 van-row">
            <view class="van-col van-col--8" v-for="(val, key) in item.pictureList" :key="key"
              @click="previewImg(item.pictureList, val)">
              <image class="image-body" :src="val" style="object-fit: cover;" mode="aspectFill"></image>
            </view>
          </view><!----><!----><!---->
        </view>
        <view style="clear: both"></view>
        <view class="myfot" style="margin-left: 25px; margin-bottom: 10px; margin-top: 10px;">
          <view class="fotright">
            <view class="etime">
              {{ item.createTimeStr }}
            </view>
            <view class="zan pot" style="position: relative;" @click="replyComment(item)">
              <span class="reply-btn">回复</span>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--展开更多-->
    <view class="operate">
      <span><!---->
        <span class="m-nus" @click="showMore()" v-show="!isShow && commentCount > 0">
          <b class="minus"></b>
          <span style="padding: 0px 5px;">展开{{ commentCount }}条回复</span>
          <uni-icons type="bottom" size="14"></uni-icons>
        </span>
        <span class="m-nus" @click="listSecondComment()" v-show="isShow && totalPage == 1">
          <b class="minus"></b>
          <span style="padding: 0px 5px;">展开更多回复</span>
          <uni-icons type="bottom" size="14"></uni-icons>
        </span>
      </span>
      <span style="margin-left: 10px;" v-show="isShow && commentCount > 0" @click="hidAll()">收起
        <uni-icons type="top" size="14" style="margin-left: 5px;"></uni-icons>
      </span>
    </view><!---->
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--评论弹窗-->
    <uni-popup ref="comentPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <reply-comment ref="replyComment" @closeComent="closeComent" @restComment="restComment" :commentId="toCommentId"
          :relatedId="relatedId" :commentType="type" :toUserId="toUserId" :placeholder="placeholder">
        </reply-comment>
      </view>
    </uni-popup>
    <!--评论详情-->
    <uni-popup ref="commentDetail" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <comment-detail :commentId="commentId" :relatedId="relatedId" :createTime="createTime" :commentType="type"
          @closeCommentDetail="closeCommentDetail"></comment-detail>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { listSecondComment } from "../../../utils/comment/index.js"
import ReplyComment from "./ReplyComment";
import CommentDetail from "./CommentDetail";
import Login from "../login/Login";
import TextOverflow from "@/components/text-over-flow/text-over-flow.vue"

export default {
  name: "SecondComment",
  components: { ReplyComment, CommentDetail, TextOverflow, Login, },
  props: {
    relatedId: {
      type: Number,
      default: 0,
    },
    createTime: {
      type: String,
      default: ''
    },
    commentId: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShow: false,
      SecondCommentList: [],
      totalPage: 0,
      prams: { pageNum: 0 },
      ImgList: [],
      toCommentId: 0,
      toUserId: '',
      placeholder: '',//回复人昵称
    }
  },
  methods: {
    //收起
    hidAll: function () {
      this.isShow = false
    },
    //重置
    restComment: function () {
      this.$emit("restComment")
    },
    //展开更多
    showMore: function () {
      if (this.prams.pageNum == 0) {
        this.listSecondComment()
      }
      this.isShow = true
    },
    //用户主页
    homepage: function (item) {
      uni.navigateTo({
        url: "/pages/user/homepage/homepage?userId=" + item.userId
      })
    },
    //获取更多评论
    listSecondComment: function () {
      this.prams.pageNum++
      let prams = { commentId: this.commentId, pageNum: this.prams.pageNum }
      listSecondComment(prams).then(res => {
        this.totalPage = res.result.moreSecondComments
        this.SecondCommentList.push(...res.result.list)
      }).catch(err => {
        console.log(err)
      })
    },
    //打开评论
    replyComment: function (item) {
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
      this.toCommentId = this.commentId
      this.toUserId = item.userId
      this.placeholder = "回复@" + item.nickname
      this.$refs.comentPopup.open('right')
    },
    //关闭评论
    closeComent: function () {
      this.$refs.comment.close()
    },
    previewImg: function (imgList, url) { // 点击预览图片
      const list = []
      imgList.forEach((item, index) => {
        list.push(item)
      })
      this.ImgList = list
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    //打开评论详情页
    openComment() {
      this.$refs.commentDetail.open('right')
    },
    //关闭评论详情页
    closeCommentDetail() {
      this.$refs.commentDetail.close()
    },
  }
}
</script>

<style scoped>
.reply-info-box {
  padding-left: 20rpx;
  padding-right: 10rpx;
  margin-top: 20rpx;
  border-radius: 8rpx;
}

.reply-info {
  padding: 10rpx 0 10rpx 0;
}

.reply-info .reply-info-user {
  position: relative;
  float: left;
}

.user-img-to {
  display: inline-block;
  position: relative;
  padding-left: 50rpx;
}

.user-img-to .left-image {
  position: absolute;
  left: 0;
  bottom: 0;
}

.images .img-box-1 .image-body,
.images .img-box-2 .image-body,
.images .img-box-3 .image-body {
  width: 100%;
  height: 180rpx;
  border-radius: 8rpx;
}

.images .image-body {
  margin-bottom: 10rpx;
  position: relative;
}

.van-image {
  position: relative;
  display: inline-block;
}

.images .image-body .van-image__img {
  border-radius: 10rpx;
  overflow: hidden;
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

.van-image__img {
  display: block;
  width: 100%;
  height: 100%;
}

.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.user-img-to .user-info {
  padding: 6rpx 0 6rpx 0;
}

.user-img-to .moren {
  color: #999;
  font-style: normal;
  font-weight: 700;
  font-size: 28rpx;
}

.user-img-to-text .red {
  color: red !important;
}

.user-img-to-text {
  margin-top: 6rpx;
  display: inline-block;
}

.user-img-to-text .iplay {
  margin: 0 8rpx 0 12rpx;
}

.content-box {
  display: flex;
  width: 100%;
  margin-top: 20rpx;
  font-size: 28rpx;
}

.content-box .clamp-body {
  margin-left: 50rpx;
}

.van-icon,
.van-icon:before {
  display: inline-block;
}

.van-icon {
  position: relative;
  font: normal normal normal 28rpx/1 vant-icon;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}

.user-img-to-text .moren {
  color: #999;
  font-style: normal;
  font-weight: 700;
  font-size: 28rpx;
}

.myfot,
.myfot .fotright {
  display: flex;
  align-items: center;
}

.myfot .etime {
  margin-right: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.myfot .reply-btn {
  padding: 6rpx 30rpx 8rpx;
  background-color: #ededed;
  border-radius: 40rpx;
  display: inline-block;
  text-align: center;
  font-size: 24rpx;
  color: #555;
}

.operate {
  font-size: 28rpx;
  margin-top: 30rpx;
  font-weight: 600;
  color: #8c8c8c;
  display: flex;
}

.operate .m-nus {
  display: flex;
  align-items: center;
}

.operate .minus {
  width: 60rpx;
  height: 2rpx;
  background: #8c8c8c;
  display: inline-block;
}
</style>