<template>
  <view class="vo-video" v-html="item.content" ></view>
</template>

<script>
export default {
  name: "MyVideo",
  props:{
    videoUrl:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      item:[],
    }
  },
  mounted(){
    this.onloadCode()
  },
  methods:{
    onloadCode(){
      this.item.content = '<video style="width: 100%;height: 100%" controls="controls"  src="'+this.videoUrl+'"></video>'
    }
  }
}
</script>

<style scoped>

</style>