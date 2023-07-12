<template>
    <view class="liuhe-live-box">

        <view class="ui-layer">
            <view class="close-btn" @click="doCloseLiveBox">X</view>
        </view>
        <view class="ui-waiting-layer" v-if="liveStatus==LiuHeBoxStatus.waiting">
            <image @click="downLoad" style="width: 100%" mode="widthFix" :src="require('@/static/frame.png')"></image>
        </view>


        <view class="ui-loading-layer" v-if="liveStatus==LiuHeBoxStatus.unloading||(liveStatus==LiuHeBoxStatus.closed&&isLoading)">
            <image class="ui-loading-image" :src="require('@/static/img/loading.gif')"></image>
            <text class="ui-loading-txt">加载中</text>
        </view>



        <template name="live-notice" v-if="liveStatus==LiuHeBoxStatus.closed">
            <view  class="ui-layer-close">
                <text>{{ lotteryType == 1 ? '香港六合彩' : '澳门六合彩' }}揽珠直播时间为开奖日{{ liveInfo.startTime }}-{{ liveInfo.endTime
                    }}(北京时间)，</text>
                <text>敬请查看</text>
                <text style="padding-top: 20px" @click="freshGameLiveMsg">点击刷新</text>
            </view>
        </template>

        <template name="live-player" v-if="liveStatus==LiuHeBoxStatus.opend">
            <!-- 播放器显示区域 -->
            <!--#ifndef H5-->
            <lives @refreshVideo="refreshVideo" v-if="isRefresh" :src="liveInfo.live"></lives>
            <!--#endif-->
            <!--#ifdef APP_PLUS-->
            <AppLives @refreshVideo="refreshVideo" v-if="isRefresh" :src="liveInfo.live"></AppLives>
            <!--#endif-->
            <!-- 播放器显示区域 -->
        </template>



    </view>
</template>

<script>
    import Lives from './live'
    import AppLives from './applive'
    import { videoList, lotteryDetail, live } from "@/utils/live/index.js";


    export default {
        name: "LiuheLiveBox",
        desc: "",
        props:{
          gameHeaderInfo:{
              type:Object,
              default:()=>{ return null }
          },
          openFreshTimmer:{
              type:Boolean,
              default:true
          }
        },

        computed:{
            liveStatus(){
                if(!this.liveInfo) return this.LiuHeBoxStatus.unloading;
                if(this.liveInfo.live && this.liveInfo.timer >= 0){
                    return this.LiuHeBoxStatus.waiting;
                }else if(this.liveInfo.targetUrl && this.liveInfo.timer <= 0){
                    return this.LiuHeBoxStatus.opend;
                }
                return this.LiuHeBoxStatus.closed
            },
            lotteryType(){
                return  this.gameHeaderInfo.lotteryType!==undefined?this.gameHeaderInfo.lotteryType:-1;
            }
        },

        data(){
           return {
               isRefresh:true,
               //直播接口返回resultInfo
               liveInfo:null,
               liveInfoWaitTimmer:-1,
               LiuHeBoxStatus:{
                   closed:-1,//关闭中
                   unloading:0,//数据加载中
                   waiting:1,//倒计时钟
                   opend:2,//开启
               },
               isLoading:false
           }
        },
        components:{
            Lives,
            AppLives
        },

        watch:{
            //前端loading加载数据 异步条件穿插比较复杂 暂时使用这种进行初始化 兼容数据异步变化触发刷新
            gameHeaderInfo(newInfo,oldInfo){
                if(oldInfo.lotteryType!=newInfo.lotteryType){
                    this.freshGameLiveMsg();
                }
            }
        },

        mounted(){
            this.freshGameLiveMsg();
        },

        methods:{
            /**
             * 初始化相关的直播信息
             */
            freshGameLiveMsg(){
                let _this=this;
                console.log("freshGameLiveMsg");
                if(!this.gameHeaderInfo) return console.warn("game headerinfo is null");
                if(!this.gameHeaderInfo.lotteryType) return console.warn("game headerinfo  lotteryType null");
                let lotteryType = this.gameHeaderInfo.lotteryType;
                this.isRefresh = false;
                this.isLoading=true;
                let prams = { lotteryType: lotteryType };
                live(prams).then(response=>{
                    _this.isRefresh = true
                    _this.isLoading=false;
                    if(response.code==200){
                        _this.liveInfo=response.result;
                        _this.doActionAfterFresh();
                    }
                })
            },

            refreshVideo() {
                this.isRefresh = false
                setTimeout(() => {
                    this.isRefresh = true
                }, 500);
            },

            doActionAfterFresh(){
                let _this=this;
                // 倒计时模式
                clearInterval(this.liveInfoWaitTimmer)
                if (this.liveInfo.live && this.liveInfo.timer >= 0) {
                    _this.liveInfoWaitTimmer = setInterval(() => {
                        _this.liveInfo.timer--
                        if (_this.liveInfo.timer <= 0) {
                            clearInterval(_this.timer)
                        }
                        _this.liveInfo=Object.assign({},_this.liveInfo);
                    }, 1000);
                }
            },


            // 用户左上角点击按钮点击
            doCloseLiveBox(){
                this.$emit("onClose");
            },
            //下载视频
            downLoad: function () {
                //TODO 其它方式实现此处应该标记 避免后续打包出现问题
                //#ifdef H5
                    this.liveInfo&&this.liveInfo.targetUrl&&window.open(this.liveInfo.targetUrl)
                //#endif
            },
        }



    }
</script>

<style lang="scss" scoped>
    .liuhe-live-box{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .ui-layer{
        .close-btn{
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            background: #EEEEEE;
            line-height: 40rpx;
            position: absolute;
            left: 30rpx;
            top: 30rpx;
            text-align: center;
            font-weight: bold;
            font-size: 30rpx;
            color: grey;
            position: absolute;
            z-index: 10;
        }
    }

    .ui-loading-layer{
        width: 100%;
        height: 100%;
        background: #ccdbed;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        .ui-loading-image{
            width: 100rpx;
            height: 100rpx;
        }
        .ui-loading-txt{
            font-size: 30rpx;
            color: #333333;
        }
    }

    .ui-layer-close {
        height: 200px;
        background: #3a3a3a;
        color: red;
        text-align: center;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-bottom: 30px;
    }

</style>