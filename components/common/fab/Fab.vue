<template>
  <view>
    <div class="van-overlay" style="z-index: 18; display: none;" v-show="isOpen" @click="isOpen = false"></div>
    <div class="float-bnt">
      <span :class="isOpen ? 'icon-btn oft0' : 'icon-btn' " @click="switchBtn"></span>
      <div v-if="isOpen" :class="isOpen ? 'icon-tool-btn oft' + (index+1) : 'icon-tool-btn' " v-for="(item,index) in menulist" :key="index" @click="tiaozhuan(item.url)">
        <span><image :src="item.icon"></image></span>
        <label>{{ item.text }}</label>
      </div>
    </div>
<!--    <img src="static/img/shuaxin.png" class="shuaxin-btn" v-show="!isOpen" @click="refresh"/>-->
  </view>
</template>

<script>
export default {
  name: "Fab",
  data() {
    return {
      isOpen:false,
      //菜单栏
      menulist:[
        {
          icon:'/static/img/index/kaijiangxianchang.png',
          text:'开奖现场',
          url:'/pages/live/Live'
        },
        {
          icon:'/static/img/index/jiaoliudating.png',
          text:'高手论坛',
          url:'/pages/forum/index'
        },
        {
          icon:'/static/img/index/tlsc.png',
          text:'淘料市场',
          url:'/pages/market/index'
        },
        {
          icon:'/static/img/index/zixuntongji.png',
          text:'资讯统计',
          url:'/pages/zxcount/liuhe'
        },
        {
          icon:'/static/img/index/ziliaodaquan.png',
          text:'资料大全',
          url:'/pages/data/Index/Index'
        },
      ],
    }
  },
  methods:{
    switchBtn:function (){
      this.isOpen = !this.isOpen
    },
    refresh:function (){
      var pages = getCurrentPages(); //获取所有页面的数组对象
      var currPage = pages[pages.length - 1]; //当前页面
      uni.reLaunch({
        url: currPage.$page.fullPath
      })
    },
    //跳转方法
    tiaozhuan:function (url){
      console.log(url)
      uni.switchTab({
        url:url
      })
      uni.navigateTo({
        url:url,
      })
    },
  }
}
</script>

<style scoped>
  .van-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 18;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
  }
  .float-bnt, .shuaxin-btn {
    position: fixed;
    right: 20rpx;
    width: 100rpx;
    height: 100rpx;
    z-index: 19;
  }
  .float-bnt{
    bottom: 180px;
  }
  .shuaxin-btn{
    bottom: 105px;
  }
  .float-bnt .icon-btn.oft0 {
    transform: rotate(180deg);
    background-image: url(/static/img/push-open.png);
  }
  .float-bnt .icon-btn {
    display: inline-block;
    background-image: url(/static/img/push.png);
    background-size: 100% 100%;
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 23;
    transition: all .4s;
  }
  .float-bnt .icon-tool-btn {
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    transition: all .4s;
    opacity: 0;
  }
  .float-bnt .icon-tool-btn span {
    width: 110rpx;
    height: 110rpx;
    display: inline-block;
    text-align: center;
    line-height: 110rpx;
    border-radius: 50%;
    font-size: 12px;
  }
  .float-bnt .icon-tool-btn span image {
    width: 108rpx;
    height: 108rpx;
    margin-top: 10rpx;
  }
  .float-bnt .icon-tool-btn uni-label {
    position: absolute;
    color: #fff;
    padding: 6rpx;
    white-space: nowrap;
    right: 120rpx;
    top: 40rpx;
    font-size: 28rpx;
  }
  .float-bnt .icon-tool-btn.oft1 {
    right: 6rpx;
    top: -260rpx;
    opacity: 1;
  }
  .float-bnt .icon-tool-btn.oft2 {
    right: 180rpx;
    top: -170rpx;
    opacity: 1;
  }
  .float-bnt .icon-tool-btn.oft3 {
    right: 260rpx;
    top: -20rpx;
    opacity: 1;
  }
  .float-bnt .icon-tool-btn.oft4 {
    right: 200rpx;
    top: 120rpx;
    opacity: 1;
  }
  .float-bnt .icon-tool-btn.oft5 {
    right: 40rpx;
    top: 220rpx;
    opacity: 1;
  }

</style>