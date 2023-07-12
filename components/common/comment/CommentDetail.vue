<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <view class="header-box">
      <view class="header">
        <view class="box-bg">
          <uni-nav-bar>
            <block slot="left">
              <uni-icons @click="back" type="back" color="#666" size="16" />
            </block>
            <view class="input-view">评论详情</view>
          </uni-nav-bar>
        </view>
      </view>
    </view>
    <!--评论详情-->
    <z-paging class="" :height="'85vh'" ref="paging" v-model="dataList" @query="listSecondComment"
      :refresher-enabled="false" :hide-empty-view="false" :empty-view-center="true" :empty-view-text="'暂无数据'"
      :hide-no-more-inside="false" :empty-view-img="'/static/img/wu.png'" :fixed="false"
      :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '128rpx', 'height': '130rpx' }"
      :empty-view-title-style="{ 'color': ' #a0a0a0', 'font-size': '32rpx', 'line-height': '44rpx', 'margin-top': '28rpx' }">
      <view class="comment-two-body">
        <view class="comment-item comment-item-hd" v-if="firstComment.headPic">
          <view class="user-img">
            <view class="left-image">
              <image model="widthFix" :src="firstComment.headPic"></image>
            </view>
            <view class="user-info">
              <view class="name">
                {{ ' ' + firstComment.username + ' ' }}
                <span class="reportInfo"></span>
              </view>
              <view class="time">

              </view>
            </view>
          </view>
          <view class="zan" @click="thumbUp()">
            <uni-icons color="rgb(153, 153, 153)" style="margin-right: 6rpx" type="hand-up" size="18"
              v-if="firstComment.thumbUp == 0"></uni-icons>
            <uni-icons type="hand-up-filled" style="margin-right: 6rpx" size="18" color="#07c160" v-else></uni-icons>
            {{ ' ' + firstComment.thumbUpCount + ' ' }}
          </view>
          <view class="comment-item-bd">
            <view class="text" v-if="firstComment.content.length > 0">
              <text-overflow :dt="firstComment.content" :line="3" expandText="展开" foldHint="收起" />
            </view>
            <view class="images-box">
              <view class="images">
                <uni-row class="van-row">
                  <uni-col v-for="(item, index) in firstComment.pictureList" :span="8" style="padding: 0 3px;">
                    <image class="image-body" :src="item" style="object-fit: cover;"
                      @click="previewImg(firstComment.pictureList, item)" mode="aspectFill"></image>
                  </uni-col>
                </uni-row>
              </view>
            </view>
          </view>
        </view>
        <view class="van-list">
          <view class="comment-item syx comment-item-for" v-for="(item, index) in dataList" :key="index">
            <view class="user-img">
              <view class="left-image">
                <image model="widthFix" :src="item.headPic"></image>
              </view>
              <view class="user-info">
                <view class="name">
                  {{ ' ' + item.nickname + ' ' }}
                  <span class="reportInfo"></span>
                  <span class="user-img-to-text">
                    <uni-icons custom-prefix="iconfont" type="sanjiaoright" size="14"
                      style="margin: 0 10rpx 0 14rpx;"></uni-icons>
                    <label class="moren">{{ item.toNickname }}</label>
                  </span>
                </view>
                <view class="time"></view>
              </view>
            </view>
            <view class="comment-item-bd">
              <view class="text poptext">
                <text-overflow :dt="item.content" :line="3" expandText="展开" foldHint="收起" />
              </view>
              <view class="images-box">
                <view class="images">
                  <uni-row class="van-row">
                    <uni-col :span="8" style="padding: 0 3px;" v-for="(val, key) in item.pictureList" :key="key">
                      <image @click="previewImg(item.pictureList, val)" class="image-body" mode="aspectFill" :src="val"
                        style="object-fit: cover;"></image>
                    </uni-col>
                  </uni-row>
                </view>
              </view>
            </view>
            <view class="myfot">
              <view class="fotright">
                <view class="etime">{{ item.createTimeStr }}</view>
                <view class="zan pot" style="position: relative;" @click="replyComment(item)">
                  <span class="reply-btn">回复</span>
                </view>
              </view>
              <view class="zan pot">
                <uni-icons color="rgb(153, 153, 153)" style="margin-right: 6rpx" type="hand-up" size="18"></uni-icons>
                {{ item.thumbUpCount | moneyFormat }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
    <!---->
    <view class="footer">
      <view class="comment-two-ft" @click="replyComment(firstComment)">
        <label for="commentTowInput">想说点什么...</label>
      </view>
    </view>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList" />
    <!--评论弹窗-->
    <uni-popup ref="comentPopup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw;height: var(--vh)">
        <reply-comment ref="replyComment" @closeComent="closeComent" @restComment="restComment" :commentId="toCommentId"
          :relatedId="relatedId" :createTime="createTime" :commentType="commentType" :toUserId="toUserId"
          :placeholder="placeholder">
        </reply-comment>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import TextOverflow from "@/components/text-over-flow/text-over-flow.vue"
import Login from "../../../components/common/login/Login";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import { listSecondComment } from "../../../utils/comment/index.js"
import ReplyComment from "./ReplyComment";
import { thumbUp } from "../../../utils/user";
export default {
  name: "CommentDetail",
  components: { UniCol, UniRow, TextOverflow, ReplyComment, Login, },
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
    commentType: {
      type: Number,
      default: 3,
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      pageNum: 1,
      firstComment: { content: '' },
      dataList: [],
      ImgList: [],
      toCommentId: 0,
      toUserId: '',
      placeholder: '',//回复人昵称
    }
  },
  mounted() {
    console.log(this.commentId)
  },
  methods: {
    back() {
      this.$emit('closeCommentDetail')
    },
    //点赞接口
    thumbUp: function () {
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
      let prams = { relatedId: this.firstComment.id, type: 6 }
      thumbUp(prams).then(res => {
        if (res.code == 200) {
          this.firstComment.thumbUp = 1
          this.firstComment.thumbUpCount++
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
      this.toCommentId = this.commentId
      this.toUserId = item.userId
      this.placeholder = "回复@" + item.nickname
      this.$refs.comentPopup.open('right')
    },
    //关闭评论
    closeComent: function () {
      this.$refs.comentPopup.close()
      this.$refs.paging.reload()
    },
    restComment: function () {
      this.$refs.paging.reload()
    },
    previewImg: function (imgList, url) { // 点击预览图片
      const list = []
      imgList.forEach((item, index) => {
        list.push(item)
      })
      this.ImgList = list
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    //获取更多评论
    listSecondComment: function (pageNo, pageSize = 10) {
      this.pageNum = pageNo
      let prams = { commentId: this.commentId, pageNum: this.pageNum }
      listSecondComment(prams).then(res => {
        this.$refs.paging.complete(res.result.list);
        if (this.pageNum == 1) {
          this.firstComment = res.result.firstLevelComment;
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  background-color: #f8f8f8;
  position: relative;
  height: var(--vh);
  max-width: 480px;
  margin: auto;
}

.header-box {
  height: 46px;

  .header {
    height: 46px;

    .box-bg {
      height: 46px;
    }
  }
}

.comment-two-body {
  padding: 0 16rpx 0 16rpx;

  .comment-item {
    background-color: #fff;
    padding: 20rpx;
    position: relative;

    .user-img {
      display: inline-block;
      position: relative;
      padding-left: 48Px;

      .left-image {
        position: absolute;
        left: 0;
        top: 0;

        image {
          width: 72rpx;
          height: 72rpx;
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          display: inline-block;
        }
      }

      .user-info {
        .name {
          padding: 4px 0 3px 0;
          margin-right: 10rpx;
          font-style: normal;
          font-weight: 700;
          font-size: 28rpx;
          color: #999;

          .reportInfo {
            padding: 4px 0 3px 0;
            margin-right: 10rpx;
            font-size: 15px;
            color: #ec0808;
          }

          .user-img-to-text {
            .moren {
              color: #999;
              font-style: normal;
              font-weight: 700;
              font-size: 28rpx;
            }
          }
        }

        .time {
          font-size: 12px;
          color: #888;
        }
      }
    }

    .zan {
      right: 20rpx;
      position: absolute;
      color: #666;
      font-size: 24rpx;
      top: 30rpx;
      display: flex;
      align-items: center;
    }

    .comment-item-bd {
      padding: 10px 0 0 48px;

      .text {
        font-size: 26rpx;
        line-height: 40rpx;
        overflow: hidden;
        word-break: break-all;
      }

      .images-box {
        padding-top: 16rpx;

        .images {
          .image-body {
            width: 100%;
            height: 180rpx;
            border-radius: 8rpx;
          }
        }
      }
    }
  }

  .comment-item-for {
    border-bottom: 1px solid #e8e8e8;
  }

  .comment-item-hd {
    margin: 6rpx 0;
    border-radius: 8rpx;
  }

  .myfot {
    justify-content: space-between;
    margin-left: 86rpx;
    display: flex;
    align-items: center;

    .fotright {
      display: flex;
      align-items: center;
    }

    .etime {
      margin-right: 20rpx;
      font-size: 12px;
      color: #666;
    }

    .pot {
      position: relative !important;
      right: inherit !important;
      top: inherit !important;
    }

    .zan {
      color: #666;
      font-size: 24rpx;

      .reply-btn {
        font-size: 24rpx;
        padding: 4rpx 20rpx;
        background-color: #d8d8d8;
        display: inline-block;
        border-radius: 30rpx;
      }
    }

  }
}

.footer {
  width: 100%;
  max-width: 480px;
  position: fixed;
  display: block;
  bottom: 0;

  .comment-two-ft {
    background: #fff;
    padding: 20rpx;

    label {
      line-height: 34Px;
      height: 34Px;
      background-color: #f1f1f1;
      border: 0;
      border-radius: 40rpx;
      font-size: 24rpx;
      padding-left: 30rpx;
      padding-right: 100rpx;
      display: block;
      color: #999;
    }
  }
}
</style>