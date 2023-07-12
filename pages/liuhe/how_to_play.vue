<template>
  <view class="play-box">
    <nav-bar :title="title" :fontColor="'#FFFFFF'" :titleStyle="titleStyle" :header-style="headerStyle">
    </nav-bar>
    <uni-collapse accordion v-model="accordionVal">
      <uni-collapse-item :show-arrow="false" v-for="(item, index) in data">
        <template v-slot:title>
          <view class="title">{{ item.name }}</view>
        </template>
        <view class="content">
          <view class="text" v-for="(i, k) in item.children">
            <view class="text-item" v-for="(v, key) in i.children">
              <view class="text">{{ v.name }}</view>
              <rich-text :nodes="v.helpStr" class="text"></rich-text>
            </view>
          </view>
        </view>
      </uni-collapse-item>
    </uni-collapse>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import WholeSelector from '@/config/templateMemSelector/WholeSelector.js'

export default {
  name: "how_to_play",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      title: "玩法说明",
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      titleStyle: {
        color: '#FFFFFF',
      },
      data: [],
      accordionVal: '',
    }
  },
  onLoad(option) {
    console.log("load",option)
    this.getData(option.id)
  },
  methods: {
    getData(lotteyId) {
      let data = WholeSelector.getMiniplayTemplate(+lotteyId);


      console.log(data)
      this.data = data
      /*if(data.length>0){
        data.forEach((item,index)=>{
          let obj = {}
          obj.name = item.name
          item.children.forEach((i,k)=>{

          })
          this.data.push({
            title:item.name,
            content:item.children[0].children[0].helpStr
          })
        })
      }*/
    }
  }
}
</script>

<style lang="scss" scoped>
.play-box {
  font-family: 'PingFang SC';

  .title {
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 34rpx;
    color: #03536E;
  }

  .content {
    background: #F6F6F6;
    padding: 20rpx;
    font-weight: 400;
    font-size: 25rpx;
    line-height: 35rpx;
    text-align: justify;
    color: #000000;
  }
}
</style>
