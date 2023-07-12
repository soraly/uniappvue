<template>
  <view :style="{marginTop:safeHeight}">
    <NavBar :title="title"></NavBar>
    <view class="feedback">
      <view class="title">标题：</view>
      <input focus placeholder="请输入您反馈的标题" v-model="feedback.title"/>
      <view class="feedback-content">
        <view class="title">内容：</view>
        <view class="uni-textarea">
          <textarea placeholder-style="color:'#323233'" placeholder="请输入反馈内容或者建议..." v-model="feedback.description"/>
        </view>
      </view>
      <view class="file-upload">
        <uni-file-picker
            v-model="imageValue"
            fileMediatype="image"
            mode="grid"
            :image-styles="imageStyle"
            @select="select"
            @progress="progress"
            @success="success"
            @fail="fail"
        />
      </view>
    </view>
    <button @click="submitForm" class="primary-btn finish">保存</button>
    <AlertInjectLayer />
  </view>
</template>

<script>
  import NavBar from "../../../components/common/navBar/navBar";
  import {uploadImg, feedback, updateAvatar} from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
  import {config} from "../../../config/config";
  export default {
    components:{
    AlertInjectLayer,
      NavBar
    },
    data(){
      return {
        safeHeight:uni.getStorageSync('systemInfo').safeArea.top + "px",
        title : "意见反馈",
        feedback:{
          title : "",
          description : "",
          pictureIdList:[]
        },
        imageValue:[],
        imageStyle:{
          width: '25%',	// 边框宽度
          height: 0
        },

      }
    },
    methods: {
      bindTextAreaBlur: function (e) {
        console.log(e.detail.value)
      },
      //上传图片
      setUploadImg(file){
        const uploadTask = uni.uploadFile({
          url: config.me_base_url+'/api/user/upImg',
          header:{'X-Access-Token': uni.getStorageSync('token')},
          filePath: file,
          name: 'file',
          formData: {},
          success: (uploadFileRes) => {
            let res = JSON.parse(uploadFileRes.data);
            console.log(res);
            this.feedback.pictureIdList.push(res.result.id)
          }
        });

        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度' + res.progress);
          console.log('已经上传的数据长度' + res.totalBytesSent);
          console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

          // // 测试条件，取消上传任务。
          // if (res.progress > 50) {
          //   uploadTask.abort();
          // }
        });
      },
      // 获取上传状态
      select(e){
        console.log('选择文件：',e)
        e.tempFilePaths.forEach((item)=>{
          this.setUploadImg(item);
        })
      },
      // 获取上传进度
      progress(e){
        console.log('上传进度：',e)
      },

      // 上传成功
      success(e){
        console.log('上传成功',e)
      },

      // 上传失败
      fail(e){
        console.log('上传失败：',e)
      },
      //反馈接口
      submitForm(){
        feedback(this.feedback).then((res)=>{
          console.log(res);
          if(res.code === 200){
            this.feedback = {
              title : "",
              description : "",
              pictureIdList:[]
            }
            this.imageValue = [];
            uni.showToast({
              title: res.message,
            })
            setTimeout(()=>{
              uni.navigateBack()
            },1000)
          }
        })
      },
    }

  }
</script>
<style scoped>
    .file-upload  >>>  .file-picker__box {
      padding-top: 25%!important;
    }
</style>
<style lang="scss" scoped>
    .feedback{
      background-color: #ffffff;
      margin-top: 20rpx;
      padding: 16rpx;
      .title {
        font-size: 32rpx;
        margin: 16rpx 0 16rpx 0;
      }
      .feedback-content{
        margin-top: 48rpx;
        font-size: 32rpx;


      }
    }
    .finish {
      width: calc(100% - 36rpx);
      margin: 0 auto;
      background: #07c160;
      line-height: 96rpx;
      color: #fff;
      font-size: 32rpx;
      text-align: center;
      border-radius: 48rpx;
      margin-top: 32rpx;
    }
</style>
