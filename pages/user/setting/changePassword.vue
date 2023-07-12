<template>
  <view class="out-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :isBack="isBack"></NavBar>
    <uni-forms :modelValue="formData" class="form-box">
      <uni-forms-item name="name" class="input-item">
        <uni-row>
          <uni-col :span="6">
            <label class="input-label">旧密码:</label>
          </uni-col>
          <uni-col :span="18">
            <input type="text" password v-model="formData.oldPwd" placeholder-style="color: #c9c9cb;"
              placeholder="请输入旧密码" />
          </uni-col>
        </uni-row>
      </uni-forms-item>
      <uni-forms-item name="name" class="input-item">
        <uni-row>
          <uni-col :span="6">
            <label class="input-label">新密码:</label>
          </uni-col>
          <uni-col :span="18">
            <input type="text" password v-model="formData.newPwd" placeholder-style="color: #c9c9cb;"
              placeholder="请输入新密码" />
          </uni-col>
        </uni-row>
      </uni-forms-item>
      <uni-forms-item name="hobby" class="input-item">
        <uni-row>
          <uni-col :span="6">
            <label class="input-label">重复新密码:</label>
          </uni-col>
          <uni-col :span="18">
            <input v-model="formData.confirmNewPwd" password placeholder-style="color: #c9c9cb;"
              placeholder="请在一次输入新密码" />
          </uni-col>
        </uni-row>
      </uni-forms-item>
    </uni-forms>
    <button @click="submitForm" class="primary-btn finish">完成</button>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import { updatePassword } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '修改密码',
      isBack: true,
      formData: {
        oldPwd: "",
        newPwd: "",
        confirmNewPwd: ""
      }
    }
  },
  methods: {
    submitForm() {
      updatePassword(this.formData).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: res.result,
          })
        } else if (res.code === 500) {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-forms-item[data-v-61dfc0d0] {
  margin: 0;
}

.out-box {
  background-color: #f8f8f8;

  .form-box {
    padding-top: 16rpx;

    .input-item {
      background-color: #ffffff;
      padding: 20rpx 32rpx;
      line-height: 48rpx;
      font-size: 28rpx;
      margin-bottom: 1px;
      height: 48rpx;

      .input-label {
        line-height: 70rpx;
        color: #646566;
        font-size: 28rpx;
      }
    }
  }

  .primary-btn {
    margin-top: 56rpx;
  }

  .finish {
    width: calc(100% - 60rpx);
    background: #07c160;
    line-height: 88rpx;
    color: #fff;
    font-size: 32rpx;
    text-align: center;
    border-radius: 44rpx;
  }
}</style>
