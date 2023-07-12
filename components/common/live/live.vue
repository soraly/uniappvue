<template>
  <view class="video-display-wrap" v-if="isRefresh">

    <view></view>

    <!-- 播放器最终在view的子级显示 -->
    <view class="video-js" ref="video" style="width: 100%; height: 100%"></view>
    <!-- 播放器最终在view的子级显示 -->
    <!--  自定义播放按钮（图片自行替换） -->
    <image v-if="!isPlaying" src="../../../static/img/bofang.png" mode="heightFix" class="play-btn-icon" @click="playVideo"></image>
    <!--  自定义播放按钮 -->

    <!-- 视频蒙版用于点击视频能够切换播放状态 -->
    <view class="video-mask" @click="switchPlayVideo"></view>
    <!-- 视频蒙版用于点击视频能够切换播放状态 -->
  </view>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-flash'
import flvjs from "flv.js"
export default {
  name: "live",
  props:{
    src:{
      type:String,
      default:'',
    }
  },
  data(){
   return{
     //视频播放器
     videoPlayer: null,
     //是否正在播放
     isPlaying: false,
     dp: {},
     isFlv:false,
     isRefresh:true
   }
  },
  mounted(){
    this.$once('hook:beforeDestroy', () => {
      this.videoPlayer.dispose();
    })
    this.$nextTick(function () {
      if(this.src.indexOf('.flv') !== -1) {
        //flv类型
        this.isFlv = true
        this.initFlv()
      } else {
        //rtmp类型
        this.initVideo()
      }
    })
  },
  methods:{
    //初始化播放器
    initVideo:function (){
      console.log("document",document);
      let video = document.createElement('video')
      video.id = 'myVideo'
      //如果需要全屏幕展现播放器需要增加 object-fit: cover;
      video.style = 'width: 100%; height: 100%;'
      video.controls = false
      video.setAttribute('playsinline', true) //IOS微信浏览器支持小窗内播放
      video.setAttribute('webkit-playsinline', true) //这个bai属性是ios 10中设置可以让视频在小du窗内播放，也就是不是全屏播放的video标签的一个属性
      video.setAttribute('x5-video-player-type', 'h5') //安卓 声明启用同层H5播放器 可以在video上面加东西
      let source = document.createElement('source')
      source.src = this.src  //设定的流地址
      //根据流地址的后缀设置好播放类型
      if (source.src.indexOf('.mp4') !== -1) {
        //mp4类型
        source.type = 'video/mp4'
      } else if (source.src.indexOf('.m3u8') !== -1) {
        //hls类型
        source.type = 'application/x-mpegURL'
      } else if (source.src.indexOf('.flv') !== -1) {
        //flv类型
        source.type = 'video/flv'
      } else {
        //rtmp类型
        source.type = 'rtmp/hls'
      }
      //将播放源添加到video的子级
      video.appendChild(source)
      //挂载到视频容器中
      this.$refs.video.$el.appendChild(video)
      let aspectRatio = '16:9'   //默认横屏
      let that = this

      let option = {
        //视频封面图(activityDetail变量是我业务中用到的，请自行根据实际情况做调整)
        poster: '',
        //视频标题(activityDetail变量是我业务中用到的，请自行根据实际情况做调整)
        title: '',
        width: '100%',
        height: '100%',
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoDisable: true,
        preload: 'none', //auto - 当页面加载后载入整个视频 meta - 当页面加载后只载入元数据 none - 当页面加载后不载入视频
        language: 'zh-CN',
        fluid: true, // 自适应宽高
        muted: false, //  是否静音
        aspectRatio: aspectRatio, // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        controls: false, //是否拥有控制条 【默认true】,如果设为false ,那么只能通过api进行控制了。也就是说界面上不会出现任何控制按钮
        autoplay: true, //如果true,浏览器准备好时开始回放。 autoplay: "muted", // //自动播放属性,muted:静音播放
        loop: true, // 导致视频一结束就重新开始。 视频播放结束后，是否循环播放
        techOrder: ['html5', 'flash'], //播放顺序
        screenshot: true,
        controlBar: {
          volumePanel: {
            //声音样式
            inline: false // 不使用水平方式
          },
          timeDivider: true, // 时间分割线
          durationDisplay: true, // 总时间
          progressControl: true, // 进度条
          remainingTimeDisplay: true, //当前以播放时间
          fullscreenToggle: true, //全屏按钮
          pictureInPictureToggle: true //画中画
        }
      }
      this.videoPlayer = videojs('myVideo',option,function (){
        this.on('error', function () {
          //请求数据时遇到错误
          console.log('请求数据时遇到错误')
        })
        this.on('stalled', function () {
          //网速失速
          console.log('网速失速')
        })
        this.on('play', function () {
          //开始播放
          console.log('开始播放')
          that.isPlaying = true
        })
        this.on('pause', function () {
          //暂停
          console.log('暂停')
          that.isPlaying = false
        })
        this.on('timeupdate', function () {})
      })
    },
    //初始化flv播放器
    //切换播放视频
    switchPlayVideo() {
      if (this.isPlaying) {
        //正在播放就暂停
        this.pauseVideo()
      } else {
        //暂停就播放
        this.playVideo()
      }
    },
    //播放视频
    playVideo() {
      if(this.isFlv){
        this.flv_start()
      }else{
        this.videoPlayer.play()
      }
      console.log(11111)
      this.$emit('refreshVideo')
    },
    //暂停播放视频
    pauseVideo() {
      if(this.isFlv){
        this.flv_pause()
      }else{
        this.videoPlayer.pause()
      }
    },
    initFlv() {  // 生成需要的video 组件
      console.log("document",document);
      // var player = document.getElementById('videoElement');
      var player = document.createElement('video')
      player.id = 'video'
      player.style = 'width: 100%; height: 100%;'
      player.enableProgressGesture = false
      player.controls = false
      player.showCenterPlayBtn= false
      player.showPlayBtn = false
      player.showFullscreenBtn= false
      player.x5VideoPlayerType='h5-page'
      player.x5VideoPlayerFullscreen="false"
      player.autoplay= true   // 以上均为 video标签的属性配置
      /*document.getElementById("myPlayer").appendChild(player);*/
      //挂载到视频容器中
      this.$refs.video.$el.appendChild(player)
      console.log(player)
      console.log(flvjs.isSupported())
      if (flvjs.isSupported()) {
        this.player = flvjs.createPlayer({
          type: 'flv',
          isLive: true, //<====直播的话，加个这个
          url: this.src, //<==自行修改
        });
        console.log(this.player)
        this.player.attachMediaElement(player);
        this.player.load(); //加载
        player.play()
        this.isPlaying = true
        // this.flv_start();
      }
    },
    flv_start() {   //开始
      console.log(this.player)
      this.player.play()
      this.isPlaying = true
    },
    flv_pause() {  //暂停
      this.player.pause();
      this.isPlaying = false
    },
    flv_destroy() { //停止
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
    },
    flv_seekto() {   // 复制其他人的  我还没用这个
      this.player.currentTime = parseFloat(document.getElementsByName('seekpoint')[0].value);
    },
  }
}
</script>

<style scoped>
.video-display-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-btn-icon {
  position: absolute !important;
  z-index: 998;
  width: 100rpx;
  height: 100rpx;
}
.video-mask {
  position: absolute;
  z-index: 998;
  width: 100%;
  height: 100%;
}
</style>
