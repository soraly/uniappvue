<template>
  <view class="comment-list">
    <!--热门评论-->
    <view class="hot-list">
      <view class="details-title"><span>热门评论</span></view>
      <view class="title-bk"></view>
      <view class="comment-item" v-for="(value, keys) in listComment" :key="keys">
        <view class="user-img" @click="homepage(value)">
          <view class="left-image">
            <view class="van-image van-image--round">
              <img :src="value.headPic" class="van-image__img">
            </view>
            <view class="floor">{{ keys + 1 }}楼</view>
          </view>
          <view class="user-info">
            <view class="name" :class="{ red: value.vip == 1 }">
              {{ value.nickname }}
              <span class="reportInfo"></span>
            </view>
            <view class="time"></view>
          </view><!---->
        </view>
        <view class="comment-item-bd">
          <view class="text">
            <span class="clamp-body" style="overflow: hidden;">
              <span style="box-shadow: transparent 0px 0px;">
                <text-overflow :dt="value.content" :line="3" expandText="展开" foldHint="收起" />
              </span>
            </span>
          </view>
          <view class="images-box">
            <view class="images">
              <view class="img-box-1 van-row">
                <view class="van-col van-col--8" v-for="(val, key) in value.pictureList" :key="key"
                  @click="previewImg(value.pictureList, val)">
                  <image class="image-body" :src="val" style="object-fit: cover;" mode="aspectFill"></image>
                </view>
              </view><!----><!----><!---->
            </view>
          </view>
          <view style="clear: both"></view>
          <view class="secs">
            <span class="time">{{ value.createTimeStr }}</span>
            <view class="btn-hf" @click="replyComment(value)">
              <span><label for="commentInput">回复</label></span>
            </view>
            <span class="zan post" @click="thumbUp(value)">
              <uni-icons type="hand-up" size="18" v-if="value.thumbUp == 0"></uni-icons>
              <uni-icons type="hand-up-filled" size="18" color="#07c160" v-else></uni-icons>
              {{ value.thumbUpCount }}
            </span>
          </view>
          <!--二级评论-->
          <second-comment @restComment="restComment" :type="type" :commentId="value.id" :commentCount="value.commentCount"
            :relatedId="relatedId"></second-comment>
        </view>
      </view><!---->
    </view>
    <!--最新评论-->
    <view class="new-list">
      <view class="jhs">
        <view class="mc-title">
          <span :class="newPrams.postUserId == '' ? 'active' : ''" @click="postUserId('')">最新评论</span>
          <span :class="newPrams.postUserId != '' ? 'active' : ''" @click="postUserId(userId)" v-if="isShow">只看楼主</span>
        </view>
        <view class="mc-tab">
          <span :class="newPrams.sort == 0 ? 'active' : ''" @click="sort(0)">正序</span>
          <span :class="newPrams.sort == 1 ? 'active' : ''" @click="sort(1)">倒序</span>
        </view>
      </view>
      <view class="title-bk"></view><!---->
      <view role="feed" class="van-list" v-if="newList.length > 0">
        <view class="comment-item" v-for="(item, index) in newList">
          <view class="user-img" @click="homepage(item)">
            <view class="left-image">
              <view class="van-image van-image--round">
                <img :src="item.headPic" class="van-image__img">
              </view>
              <view class="floor">{{ index + 1 }}楼</view>
            </view>
            <view class="user-info">
              <view class="name" :class="{ red: item.vip == 1 }">
                {{ item.nickname }}
                <span class="reportInfo"></span>
              </view>
              <div class="time"></div>
            </view><!---->
          </view>
          <view class="comment-item-bd">
            <view class="text">
              <span class="clamp-body" style="overflow: hidden;">
                <span style="box-shadow: transparent 0px 0px;">
                  <span aria-label="">
                    <text-overflow :dt="item.content" :line="3" expandText="展开" foldHint="收起" />
                  </span>
                </span>
              </span>
            </view><!---->
            <view class="images-box">
              <view class="images">
                <view class="img-box-1 van-row">
                  <view class="van-col van-col--8" v-for="(val, key) in item.pictureList" :key="key"
                    @click="previewImg(item.pictureList, val)">
                    <image class="image-body" :src="val" style="object-fit: cover;" mode="aspectFill"></image>
                  </view>
                </view><!----><!----><!---->
              </view>
            </view>
            <view class="secs">
              <span class="time">{{ item.createTimeStr }}</span>
              <view class="btn-hf" @click="replyComment(item)">
                <span>
                  <label for="commentInput">回复</label>
                </span>
              </view>
              <span class="zan post" @click="thumbUp(item)">
                <uni-icons type="hand-up" size="18" v-if="item.thumbUp == 0"></uni-icons>
                <uni-icons type="hand-up-filled" size="18" color="#07c160" v-else></uni-icons>
                {{ item.thumbUpCount }}
              </span>
            </view><!----><!----><!---->
            <!--二级评论-->
            <second-comment @restComment="restComment" :commentId="item.id" :commentCount="item.commentCount"
              :relatedId="relatedId" :type="type"></second-comment>
          </view>
        </view>
        <view class="van-list__placeholder"></view>
      </view>

      <div class="van-empty" v-else>
        <div class="van-empty__image" style="width: 50px; height: 50px;">
          <img src="https://img01.yzcdn.cn/vant/empty-image-default.png">
        </div>
        <p class="van-empty__description">还没有评论,您的机会来了</p>
      </div>
    </view>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--评论弹窗-->
    <uni-popup ref="comentPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <reply-comment ref="replyComment" @closeComent="closeComent" @restComment="restComment" :commentId="commentId"
          :relatedId="relatedId" :createTime="createTime" :commentType="type" :toUserId="toUserId"
          :placeholder="placeholder">
        </reply-comment>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import SecondComment from "./SecondComment"
import ReplyComment from "./ReplyComment";
import TextOverflow from "@/components/text-over-flow/text-over-flow.vue"

import { commentList, listLatest } from "../../../utils/comment/index.js"
import { thumbUp } from '../../../utils/user/index.js'

export default {
  name: "Comment",
  components: { cusPreviewImg, SecondComment, ReplyComment, TextOverflow },
  props: {
    //文章ID
    relatedId: {
      type: Number,
      default: 0,
    },
    //类型
    type: {
      type: Number,
    },
    //是否显示
    isShow: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: '',
    },
    createTime: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      //评论请求参数
      commentPrams: {
        pageSize: 10,     //每页的数量
        pageNum: 1       //当前页数
      },
      //更多回复请求参数
      listComment: [], //评论
      SecondCommentList: [], //更多回复
      ImgList: [],
      //最新评论
      newPrams: {
        sort: 0,
        postUserId: '',
        pageNum: 0,//当前页数
        pageSize: 10,//每页数量
      },
      //最新评论
      newList: [],
      commentId: 0,  //评论ID
      toUserId: '',  //回复用户ID
      placeholder: '',//回复人昵称
    }
  },
  mounted() {
    this.commentLists()
    this.listLatest()
  },
  methods: {
    //用户主页
    homepage: function (item) {
      uni.navigateTo({
        url: "/pages/user/homepage/homepage?userId=" + item.userId
      })
    },
    //获取热门评论
    commentLists: function () {
      let prams = {
        relatedId: this.relatedId,
        type: this.type,
        sort: 1,
        createTime: this.createTime,
        pageSize: this.commentPrams.pageSize,
        pageNum: this.commentPrams.pageNum
      }
      console.log("评论")
      commentList(prams).then(res => {
        this.listComment = res.result.records
        console.log(this.listComment)
      }).catch(err => {
        console.log(err)
      })
    },
    //
    postUserId: function (id) {
      this.newPrams.postUserId = id
      this.newPrams.pageNum = 0
      this.newList = []
      this.listLatest()
    },
    //排序
    sort: function (sort) {
      this.newPrams.sort = sort
      this.newPrams.pageNum = 0
      this.newList = []
      this.listLatest()
    },
    //重置评论
    restComment: function () {
      this.listComment = []
      this.commentLists()
      this.newPrams.pageNum = 0
      this.newList = []
      this.listLatest()
    },
    //最新评论
    listLatest: function () {
      this.newPrams.pageNum++
      let prams = this.newPrams
      prams.relatedId = this.relatedId
      prams.type = this.type
      listLatest(prams).then(res => {
        this.newList.push(...res.result.records)
        this.$emit('setIsLoadMore')
      }).catch(err => {
        console.log(err)
      })
    },
    //点赞接口
    thumbUp: function (item) {
      if (!isLogin()) {
        this.$emit('openPopup')
        return false
      }
      let prams = { relatedId: item.id, type: 6 }
      thumbUp(prams).then(res => {
        if (res.code == 200) {
          item.thumbUp = 1
          item.thumbUpCount++
        } else {
          uni.showToast({
            title: res.message,
            duration: 2000,
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //打开评论
    replyComment: function (item) {
      if (!isLogin()) {
        this.$emit('openPopup')
        return false
      }
      this.commentId = item.id
      this.toUserId = item.userId
      this.placeholder = "回复@" + item.nickname
      this.$refs.comentPopup.open('right')
    },
    //关闭评论
    closeComent: function () {
      this.$refs.comentPopup.close()
    },

    previewImg: function (imgList, url) { // 点击预览图片
      console.log(1111)
      this.ImgList = imgList
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    }

  }

}
</script>

<style scoped>
.comment-list {
  padding: 0 20rpx 120rpx 20rpx;
  background-color: #fff;
}

.details-title {
  padding: 20rpx 0;
}

.details-title span {
  font-size: 32rpx;
  position: relative;
}

.details-title span:after {
  content: "";
  position: absolute;
  height: 6rpx;
  width: 100%;
  left: 0;
  bottom: -10rpx;
  background: #07c160;
}

.comment-list .title-bk {
  border-bottom: 2rpx solid #e8e8e8;
  margin-left: -20rpx;
  margin-right: -20rpx;
  margin-top: 20rpx;
}

.comment-item {
  padding: 20rpx 0;
  position: relative;
}

.user-img {
  display: inline-block;
  position: relative;
  padding-left: 96rpx;
}

.user-img .left-image {
  position: absolute;
  left: 0;
  top: 0;
}

.user-img .left-image .van-image {
  width: 72rpx;
  height: 72rpx;
}

.van-image--round {
  overflow: hidden;
  border-radius: 50%;
}

.van-image--round {
  overflow: hidden;
  border-radius: 50%;
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

.user-img .left-image .floor {
  text-align: center;
  font-size: 24rpx;
  color: #888;
  padding-top: 4rpx;
}

.user-img .user-info .name.red {
  color: red !important;
}

.user-img .user-info .name {
  padding: 8rpx 0 6rpx 0;
  margin-right: 10rpx;
  font-style: normal;
  font-weight: 700;
  font-size: 28rpx;
  color: #999;
}

.user-img .user-info .name .reportInfo {
  padding: 8rpx 0 6rpx 0;
  margin-right: 10rpx;
  font-size: 30rpx;
  color: #ec0808;
}

.user-img .user-info .time {
  font-size: 24rpx;
  color: #888;
}

.comment-list .comment-item .comment-item-bd {
  padding: 20rpx 0 0 96rpx;
}

.comment-list .comment-item .comment-item-bd .text {
  font-size: 26rpx;
}

.clamp-body {
  position: relative;
  word-break: break-all;
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

.van-col--8 {
  width: 33.33333333%;
  padding: 0 6rpx;
}

.van-image__error,
.van-image__img,
.van-image__loading {
  display: block;
  width: 100%;
  height: 100%;
}

.secs {
  clear: both;
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.secs .time {
  font-size: 24rpx;
  color: #888;
}

.secs .btn-hf {
  padding-top: 0 !important;
  margin: 0 20rpx;
}

.comment-list .comment-item .comment-item-bd .btn-hf span {
  padding: 6rpx 30rpx 8rpx;
  background-color: #ededed;
  border-radius: 30rpx;
  display: inline-block;
  text-align: center;
  font-size: 24rpx;
  color: #555;
}

.comment-list .comment-item .comment-item-bd .btn-hf span label {
  font-size: 24rpx;
  margin-left: 0;
}

.comment-list .comment-item .zan {
  position: absolute;
  right: 0;
  color: #666;
  font-size: 24rpx;
}

.secs .post {
  position: relative !important;
  top: 0 !important;
}

.comment-list .new-list {
  margin-top: 20rpx;
  padding-top: 20rpx;
}

.comment-list .new-list .jhs {
  display: flex;
  justify-content: space-between;
}

.comment-list .new-list .mc-title {
  padding: 10rpx 0;
  display: flex;
}

.comment-list .new-list .mc-title span {
  font-weight: 400;
  font-size: 32rpx;
  position: relative;
  margin-right: 40rpx;
}

.comment-list .new-list .mc-title span.active:after {
  content: "";
  position: absolute;
  height: 6rpx;
  width: 100%;
  left: 0;
  bottom: -10rpx;
  background: #07c160;
}

.comment-list .new-list .mc-tab {
  display: flex;
  background: #eee;
  font-weight: 400;
  font-size: 28rpx;
  color: #ccc;
  border-radius: 30rpx;
  align-items: center;
  width: 200rpx;
  height: 60rpx;
  text-align: center;
  justify-content: space-around;
}

.comment-list .new-list .mc-tab span.active {
  color: #fff;
  background: #07c160;
  border-radius: 30rpx;
}

.comment-list .new-list .mc-tab span {
  width: 50%;
  height: 60rpx;
  line-height: 60rpx;
}

.comment-list .title-bk {
  border-bottom: 1px solid #e8e8e8;
  margin-left: -20rpx;
  margin-right: -20rpx;
  margin-top: 20rpx;
}

.comment-list .comment-item {
  padding: 20rpx 0 20rpx 0;
  position: relative;
}

.van-empty {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 32px 0;
}

.van-empty__description {
  margin-top: 16px;
  padding: 0 60px;
  color: #969799;
  font-size: 14px;
  line-height: 20px;
}

.van-empty__image img {
  width: 100%;
  height: 100%;
}

.van-list__placeholder {
  height: 0;
  pointer-events: none;
}</style>