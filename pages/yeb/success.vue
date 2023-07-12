<template>
	<view class="yeb-success">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="content">
			<image class="img" src="/static/img/yeb/success.png"></image>
			<view class="title">{{ title }}</view>
		</view>
		<u-button class="btn" hover-class="btn-hover" shape="circle" @click="back">返回</u-button>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";
import oneInput from '@/components/myp-one/myp-one'

import { rollOut } from '@/utils/yeb'
export default {
	components: {
		NavBar, oneInput
	},
	data() {
		return {
			title: "转出本金",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
		}
	},
	onLoad(option) {
		this.title = option.title
	},
	methods: {
		back() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.yeb-success {
	.content {
		padding: 140rpx 0;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;

		.img {
			width: 250rpx;
			height: 250rpx;
		}

		.title {
			font-size: 32rpx;
			color: #666666;
		}
	}

	.btn {
		background: #16A7FB;
		color: #fff;
		border: unset;
		margin: 0 22rpx;
		height: 90rpx;
	}

	.btn-hover {
		color: #fff;
	}
}
</style>
