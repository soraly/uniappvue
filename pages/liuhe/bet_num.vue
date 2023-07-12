<template>
	<view class="bet-num">
		<nav-bar :title='title' :fontColor="'#FFFFFF'" :titleStyle="titleStyle" :header-style="headerStyle"></nav-bar>
		<view class="content">
			<view class="content-text">
				{{ betNum }}
			</view>
		</view>
		<AlertInjectLayer />
	</view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
	name: "bet_num",
	components: {
		AlertInjectLayer,
		NavBar
	},
	data() {
		return {
			title: '下注号码',
			betNum: 0,
			headerStyle: {
				backgroundColor: '#03536E',
			},
			titleStyle: {
				color: '#FFFFFF',
			},
		}
	},
	onLoad(opt) {
		this.betNum = opt.num
	}
}
</script>

<style lang='scss' scoped>
.bet-num {
	background-color: #eee;

	.content {
		border-radius: 10rpx;
		padding: 10rpx 20rpx;

		.content-text {
			border-radius: 10rpx;
			background-color: #fff;
			padding: 43rpx 53rpx;
			height: 85vh;
		}
	}
}
</style>
