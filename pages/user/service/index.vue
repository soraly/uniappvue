<template>
	<view class="kf-box" :style="{ marginTop: safeHeight }">
		<nav-bar title="联系客服" :font-color="fontColor" :title-style="titleStyle" :headerStyle="headerStyle" is-back>
		</nav-bar>
		<view class="kf-box-body">
			<view class="tips">
				<view class="pro">如遇问题，请咨询我们！</view>
				<view class="time">分享赚钱.充值提现等均可咨询</view>
			</view>
			<view class="menus">
				<button v-for="(item, index) in qqList"
					style="background: #fff;font-size: 30rpx;width: 100%;height: 88rpx;line-height: 88rpx;display: flex; align-items: center; justify-content: center;"
					type="success" @click="handleQq">
					<image style="height: 40rpx;width: 40rpx;margin-right: 10rpx;" src="/static/img/qq.png"></image>
					QQ客服{{ index + 1 }}
				</button>
				<uni-link :href="serviceUrl" text="在线客服" showUnderLine="false" color="#fff">
					<button class="btn" type="default" @click="handleZx">
						<image class="icon" src="/static/img/kf.png"></image>
						人工客服
					</button>
				</uni-link>
			</view>
		</view>
		<AlertInjectLayer />
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar.vue";
import { aboutUs } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
	components: {
		AlertInjectLayer, NavBar
	},
	data() {
		return {
			safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
			fontColor: "#fff",
			titleStyle: {
				color: "#fff"
			},
			headerStyle: {
				backgroundColor: "#1794FF",
			},
			qqList: [],
			serviceUrl: ""
		}
	},
	onLoad() {
		this.getUrl()
	},
	methods: {
		getUrl() {
			aboutUs().then(res => {
				for (let i = 0; i < res.result.length; i++) {
					if (res.result[i].type == "1") {
						this.serviceUrl = res.result[i].url;
						this.qqList = res.result[i].qqList;
						break;
					}
				}
				console.log(this.serviceUrl)
			})
		},
		handleQq() {
			console.log('点击QQ客服按钮');
		},
		handleZx() {
			console.log('点击在线客服按钮');
		}
	}
}
</script>

<style lang="scss" scoped>
.kf-box-body {
	width: 100%;
	height: calc(100% - 58px);
	position: absolute;
	display: flex;
	flex-direction: column;
	background: #fff;

	&::before {
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		content: " ";
		pointer-events: none;
		top: 0;
		left: 0;
		border-top: 1px solid #ebedf0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}

	&>.tips {
		display: flex;
		flex-direction: column;
		padding: 128rpx 40rpx 40rpx;
		position: relative;
		box-sizing: border-box;

		&>.img {
			width: 33.3333%;
			display: flex;
			height: 100%;
		}


		&>.pro {
			font-size: 36rpx;
			font-weight: 500;
			color: #000;
			line-height: 50rpx;
		}

		&>.time {
			font-size: 18rpx;
			color: #666;
			line-height: 25rpx;
			margin-top: 10rpx;
		}
	}

	&>.menus {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 52rpx 0;
		padding: 40rpx;
		box-sizing: border-box;

		.btn {
			background: linear-gradient(90deg, #AAACFE 0%, #6684FC 100%);
			color: #fff;
			font-size: 24rpx;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 100px;
			display: flex;
			align-items: center;
			justify-content: center;

			.icon {
				height: 50rpx;
				width: 50rpx;
				margin-right: 20rpx;
			}
		}
	}
}
</style>
