<template>
  <view style="height: var(--vh)">
    <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
      <!--顶部导航栏-->
      <nav-bar :isBack="true">
        <block slot="title">
          <view class="input-view" style="color:#000;font-weight: 600;font-size:36rpx">{{ title }}</view>
        </block>
      </nav-bar>
      <!--标题-->
      <view class="form-box">
        <view class="pcTitle pcCom">
          <view class="tips">标题</view>
          <view class="conts">
            <input placeholder-style="color:#999" v-model="form.title" class="title" type="text" placeholder="请输入图解标题" />
            <uni-icons class="deletes" type="closeempty" @click="form.title = ''"></uni-icons>
          </view>
        </view>
        <view class="pcConts">
          <view class="tips">内容</view>
          <view class="conts">
            <textarea placeholder-style="color:#999" v-model="form.description" id="contents" class="cont"
              name="description" placeholder="请输入图解内容..." style="height: 135px;"></textarea>
          </view>
        </view>
      </view>
      <view class="submits" @click="fabu">发布</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import { detail } from '../../utils/picture/index.js'
import { submitArticle } from '../../utils/forum/index.js'
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "add",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '发布图解',
      pictureId: 0,
      info: {},
      form: {
        title: '',
        description: '',
        type: 12
      }
    }
  },
  onLoad(option) {
    uni.setNavigationBarTitle({
      title: this.title
    });
    this.pictureId = option.id
    this.detail()
  },
  //返回
  methods: {
    back: function () {
      uni.navigateBack()
    },
    //详情
    async detail() {
      let prams = { pictureId: this.pictureId }
      await detail(prams).then(res => {
        this.info = res.result
        this.form.title = "第" + this.info.year + this.info.period + "期" + this.info.pictureName + "图解"
      }).catch(err => {
        console.log(err)
      })
    },
    //发布帖子
    fabu: function () {
      let prams = this.form;
      console.log(prams)
      prams.lotteryType = this.info.lotteryType
      prams.pictureId = this.info.pictureId
      if (prams.title == '') {
        pop('请输入标题')
        return false
      }
      if (!prams.description) {
        pop('请输入要写的内容')
        return false
      }
      submitArticle(prams).then(res => {
        let msg = ''
        if (res.code != 200) {
          msg = res.message
          pop(msg, 2000)
        } else {
          /*uni.setStorageSync('addForum',new Date().getTime());*/
          msg = "发布成功"
          uni.$emit('emitParams', { msg: msg })
          uni.navigateBack()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style scoped>
.header,
.header-box,
.box-bg {
  height: 44px;
}

.mint-tab-container-item {
  padding: 0 0 100rpx 0;
  font-family: PingFang SC;
  background-color: #f5f5f5;
}

.form-box {
  width: 100%;
}

.pcCom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24rpx;
  height: 96rpx;
  background: #fff;
  box-shadow: inset 0 -2rpx 0 #ededed;
  margin-top: 16rpx;
  color: #333;
}

.pcCom .tips {
  font-size: 32rpx;
  line-height: 38rpx;
}

.pcCom>uni-view {
  width: 702rpx;
  height: 44rpx;
}

.pcCom .conts {
  font-size: 28rpx;
  line-height: 32rpx;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.conts .title,
.conts .cont {
  width: 100%;
  font-size: 26rpx;
  line-height: 32rpx;
}

.pcCom .deletes {
  right: 2rpx;
  background-size: 100% 100%;
  height: 36rpx;
  width: 36rpx;
  font-size: 36rpx !important;
  position: absolute;
  color: #a6a6a6 !important;
}

.pcConts {
  margin-top: 0;
  height: auto;
  clear: both;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24rpx;
  background: #fff;
  color: #333;
}

.pcConts>uni-view {
  width: 702rpx;
  height: 44rpx;
}

.pcConts .conts {
  min-height: 100rpx;
  height: auto;
}

.conts #contents {
  display: block;
  width: 100%;
  overflow: hidden;
  resize: both;
  min-height: 240rpx;
  line-height: 40rpx;
  border: unset;
}

.submits {
  width: 702rpx;
  height: 88rpx;
  background: #07c160;
  border-radius: 200rpx;
  margin: 20rpx auto;
  font-size: 32rpx;
  line-height: 38rpx;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>