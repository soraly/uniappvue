<template>
  <view class="van-list">
    <ul class="forum-list">
      <li v-for="(item,index) in dataList" :key="index">
        <view class="heads van-row">
          <view class="van-col van-col--20">
            <view class="user-img">
              <view class="left-image">
                <image :src="item.headPic"></image>
              </view>
              <view class="user-info">
                <view class="name red">
                  {{ item.username }}
                  <span class="reportInfo"></span>
                </view>
                <view class="time">{{ item.updateTime }}</view>
              </view><!---->
            </view>
          </view>
          <view class="van-col van-col--2">
            <image v-show="item.highQuality == 1" mode="aspectFit" class="jin" src="@/static/img/forum/jin.png"></image>
          </view>
        </view>
        <view class="title van-row" @click="detail(item)">
          <view class="van-col van-col--3" v-show="item.period">
            <label>{{ item.period }}</label>
          </view>
          <view class="van-col van-col--16">
            <view class="txt van-ellipsis"><!---->
              {{ " " + item.title + " " }}
            </view>
          </view>
          <view class="van-col van-col--5"></view>
        </view>
        <view class="text" @click="detail(item)">
          <view class="van-ellipsis" v-for="(val,key) in item.descriptionList" :key="key">
            {{ val }}
          </view>
        </view>
        <view class="img-box">
          <uni-row>
            <uni-col :span="7" v-for="(val,key) in item.pictureList.slice(0,3)" :key="key" style="margin: 0 12rpx;position: relative">
              <fast-lazy-load :radius="'8rpx'" :src="val" :width="'100%'" :height="'180rpx'" mode="aspectFill" @click="previewImg(item.pictureList,val)">
                <template v-slot:loading>
                  <image class="lazy-image" :src="loadingImg"></image>
                </template>
                <template v-slot:error>
                  <image class="lazy-image" :src="loadingImg"></image>
                </template>
              </fast-lazy-load>
              <view v-if="key == 2 && item.pictureList.length > 3" class="length" @click="previewImg(item.pictureList,val)">共{{ item.pictureList.length }}张</view>
            </uni-col>
          </uni-row>
        </view>
        <view class="verify-status" v-if="!userId">
          <span class="error" v-if="item.status == 2">审核失败</span>
          <span class="error-text" v-if="item.status == 2" @click="lookRemark(item.remark)">查看原因</span>
          <span class="error" v-if="item.status == 0">审核中</span>
          <span class="open" v-if="item.status == 1">审核通过</span>
        </view>
        <view class="tool-ft">
          <uni-row>
            <uni-col :span="6" class="van-col">
              <uni-icons type="hand-up" size="16"></uni-icons>
              <text class="num">{{ item.thumbUpCount|moneyFormat }}</text>
            </uni-col>
            <uni-col :span="6" class="van-col">
              <uni-icons type="eye" size="16"></uni-icons>
              <text class="num">{{ item.clickCount|moneyFormat }}</text>
            </uni-col>
            <uni-col :span="6" class="van-col">
              <uni-icons custom-prefix="iconfont" type="comment" size="16"></uni-icons>
              <text class="num">{{ item.commentCount|moneyFormat }}</text>
            </uni-col>
            <uni-col :span="6" class="van-col ntool">
              <view class="img">
                <image :src="'../../../static/img/menu/'+item.lotteryType+'.png'" alt="" />
                <span class="num">{{ lotteryName(item.lotteryType) }}</span>
              </view>
            </uni-col>
          </uni-row>
        </view>
      </li>
    </ul>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList"/>
    <uni-popup ref="tishi" type="dialog">
      <uni-popup-dialog type="info" mode="base" message="成功消息" :showCancel="false"
                        :okStyle="{color:'rgb(7, 193, 96)'}"
                        title="失败原因" :content="remark" :confirmText="'我知道了'"
      >

      </uni-popup-dialog>
    </uni-popup>
  </view>

</template>

<script>
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";

export default {
  name: "forum",
  components: {UniRow, UniCol,cusPreviewImg},
  props: {
    userId:{
      type: String,
      default: ''
    },
    dataList: {
      type: Array,
      default: false
    }
  },
  data(){
    return{
      ImgList: [],
      remark:'',
      loadingImg:'/static/img/zw.png',
      navList: [
        {lotteryType: 0, name: '全部'},
        {lotteryType: 2, name: '澳彩'},
        {lotteryType: 1, name: '港彩'},
        {lotteryType: 3, name: '台彩'},
        {lotteryType: 4, name: '新彩'}
      ],
    }
  },
  mounted(){
    let configData = uni.getStorageSync('config')
    try{
      configData.forEach((item,index)=>{
        if(item.type == 23){
          this.loadingImg = item.url
          throw Error();
        }
      })
    }catch (err){
      console.log(err)
    }
  },
  methods:{
    //图片弹窗
    previewImg:function (imgList,url) { // 点击预览图片
      this.ImgList = imgList
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    //查看原因
    lookRemark:function (remark){
      this.remark = remark
      this.$refs.tishi.open()
    },
    //跳转
    detail:function (item){
      console.log(item)
      if(item.status == 1) {
        uni.navigateTo({
          url: '/pages/forum/detail?id=' + item.articleId + '&type=' + item.type,
          success: function (res) {
            res.eventChannel.emit('argParams', {
              lotteryType: item.lotteryType
            })
          }
        })
      }else{
        uni.navigateTo({
          url: '/pages/user/homepage/detail?id=' + item.articleId + '&type=' + item.type,
          success: function (res) {
            res.eventChannel.emit('argParams', {
              lotteryType: item.lotteryType
            })
          }
        })
      }
    },
    lotteryName:function (lotteryId){
      let lotteryName = ''
      this.navList.forEach((item,index)=>{
        if(item.lotteryType == lotteryId){
          lotteryName = item.name
          return
        }
      })
      return lotteryName
    },
  }
}
</script>

<style lang="scss" scoped>
.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.forum-list {
  li{
    padding: 20rpx 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    border: 2rpx solid #eee;
    .heads{
      display: flex;
      justify-content: space-around;
      position: relative;
      height: 76rpx;
      .user-img{
        display: inline-block;
        position: relative;
        padding-left: 48px;
        .left-image{
          position: absolute;
          left: 0;
          top: 0;
          image{
            width: 72rpx;
            height: 72rpx;
            border-radius: 50%;
          }
        }
        .user-info{
          .red{
            color: red!important;
          }
          .name{
            padding: 2px 0 1px 0;
            margin-right: 10rpx;
            font-style: normal;
            font-weight: 700;
            font-size: 28rpx;
            color: #999;
            .reportInfo{
              margin-right: 10rpx;
              font-size: 15px;
              color: #ec0808;
            }
          }
          .time{
            font-size: 12px;
            color: #888;
            height: 13px;
          }
        }
      }
      .jin{
        width: 40rpx;
        height: 40rpx;
      }
    }
    .title{
      font-size: 28rpx;
      padding: 14rpx 20rpx;
      display: flex;
      height: 36rpx;
      label{
        background-color: #07c160;
        color: #fff;
        font-size: 24rpx;
        padding: 0 10rpx;
        border-radius: 8rpx;
      }
      .txt{
        font-weight: 700;
        max-width: 100%;
        display: inline-block;
        position: relative;
      }
    }
    .text{
      font-size: 26rpx;
      line-height:40rpx;
      padding: 0 20rpx;
      margin-bottom: 10rpx;
    }
    .img-box{
      padding: 0 20rpx;
      image{
        width: 100%;
        height: 180rpx;
        border-radius: 8rpx;
      }
      .length{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0,0,0,.2);
        text-align: center;
        color: #fff;
        padding-top: 68rpx;
        font-size: 28rpx;
      }
    }
    .verify-status{
      padding: 10rpx;
      .error{
        width: 140rpx;
        height: 44rpx;
        background: #ccc;
        color: #666;
        display: inline-block;
        line-height: 44rpx;
        text-align: center;
        font-size: 24rpx;
        border-radius: 22rpx;
      }
      .error-text {
        color: #07c160;
        margin-left: 20rpx;
      }
      .open{
        width: 140rpx;
        height: 44rpx;
        background: #cef2e0;
        border-radius: 22rpx;
        color: #07c160;
        display: inline-block;
        line-height: 44rpx;
        text-align: center;
        font-size: 24rpx;
      }
    }
    .tool-ft{
      border-top: 2rpx solid #eee;
      text-align: center;
      padding-top: 20rpx;
      .van-col{
        height: 48rpx;
        padding: 8rpx;
      }
      .num{
        font-weight: 500;
        font-size: 28rpx;
        margin-left: 6rpx;
      }
      .ntool{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .img{
          background: #f5f5f5;
          margin: 0 8rpx;
          padding: 4rpx 8rpx;
          display: flex;
          align-items: center;
          image{
            width: 30rpx;
            height: 30rpx;
          }
        }
      }
    }
  }

}
</style>