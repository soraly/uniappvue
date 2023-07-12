<template>
  <view class="calendar">
    <time-picker></time-picker>
  </view>
</template>

<script>
import Calendar from "./calendar";
import timePicker from "../../../components/common/time-picker";
export default {
  name: "calendar",
  components:{
    timePicker
  },
  data(){
    return {

    }
  },
  onLoad(){
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>

</style>
