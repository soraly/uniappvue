<template>
    <view class="websocket-error-alert" v-if="webSocketError!=1">
<!--        <image  class="loading-image" src="/static/img/loading.gif"></image>-->
        <text class="net-error-txt01">
           <span v-if="webSocketError==-1">网络异常</span>
           <span v-else>网络优化中</span>
        </text>
        <text class="net-error-txt02">
            <span v-if="num>=1">.</span>
            <span v-if="num>=2">.</span>
            <span v-if="num>=3">.</span>
            <span v-if="num>=4">.</span>
            <span v-if="num>=5">.</span>
            <span v-if="num>=6">.</span>
        </text>
    </view>
</template>

<script>
    export default {
        name: "WebsocketAlert",
        desc: "",
        onShow(){
            console.log("onShow")
        },
        onHide(){
            console.log("onHide")
        },
        destroyed(){

        },
        mounted(){
          let _this=this;
          this.interval=setInterval(function () {
              if(_this.num>6) _this.num=0;
              _this.num++;
          },500)
        },
        data(){
            return {
                interval:-1,
                num:0,
            }
        },
        computed:{
            webSocketError(){
                return this.$store.state.websocketStore.status;
            }
        }

    }
</script>

<style lang="scss" scoped>
    .websocket-error-alert{
        width: 100%;
        height: 100rpx;
        top: 0px;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        z-index: 1000;
        display:flex;
        justify-content: center;
        max-width: 480px;
        /*border-color: rgba(0, 0, 0, 0.5);*/
        /*border-bottom-style: outset;*/
        /*border-top-style: outset;*/
        .loading-image{
            width: 120rpx;
            height: 100rpx;
        }
        .net-error-txt01{
            line-height: 100rpx;
            font-size: 30rpx;
            color: #ffffff;
            font-weight: bold;
        }
        .net-error-txt02{
            line-height: 100rpx;
            font-size: 30rpx;
            color: #ffffff;
            font-weight: bold;
        }
    }
</style>