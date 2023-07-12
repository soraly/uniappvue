<template>
	<view class="yeb-kefu">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="header">
			<view class="title">Hi,{{ userInfo.nickname }}</view>
			<view class="text">欢迎来到客服中心，服务让理财更简单</view>
		</view>
		<view class="content-box">
			<view class="content">
				<view class="title">常见问题</view>
				<view class="items">
					<empty style="height: 100%;" v-if="!list.length"></empty>
					<view class="item" v-for="item in list" @click="detail(item)">
						{{ item.title }}
					</view>
				</view>
			</view>
		</view>
		<u-button class="btn" shape="circle" @click="goToUrl('/pages/user/service/index')">联系客服</u-button>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";
import Empty from '../../components/common/empty/empty'

import { helps } from "../../utils/lottery/help";
import defaultTemplate from "../../utils/defaultTemplate";
export default {
	components: {
		NavBar,
		Empty
	},
	data() {
		return {
			title: "客服中心",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			list: [],
			userInfo: {}
		}
	},
	onLoad() {
		this.getList()
		this.userInfo = uni.getStorageSync('userInfo');
	},
	methods: {
		getList() {
			helps('6').then(res => {
				if (res.code == 200) {
					const list = defaultTemplate([
						{
							id: '',
							title: "这是余额宝的问题",
						}
					], res.result)
					this.list = list
				} else {
					pop(res.message, 2000)
				}
			}).catch(err => {
				console.log(err)
			})
		},
		detail(item) {
			let url = '/pages/liuhe/help/detail?id=' + item.id
			uni.navigateTo({ url: url })
		},
		goToUrl(url) {
			uni.navigateTo({ url: url })
		},
	}
}
</script>

<style lang="scss" scoped>
.yeb-kefu {
	display: flex;
	flex-direction: column;
	height: var(--vh);

	.header {
		background: #1794FF;
		padding: 70rpx 50rpx 40rpx;
		display: flex;
		flex-direction: column;
		gap: 10rpx;

		.title {
			font-size: 35rpx;
			color: #FFFFFF;
		}

		.text {
			font-size: 26rpx;
			color: #fff;
		}
	}

	.content-box {
		flex: 1;

		.content {
			padding: 20rpx 50rpx;
			background: #FFFFFF;

			.title {
				font-size: 35rpx;
				color: #222222;
			}

			.items {
				max-height: calc(var(--vh) - 550rpx);
				overflow: auto;

				.item {
					padding: 20rpx 10rpx;
					border-bottom: 1px solid #E9E8E8;
					font-size: 28rpx;
					color: #999999;

					&:last-child {
						border-bottom: unset;
					}
				}
			}
		}
	}

	.btn {
		margin: 10rpx 60rpx 100rpx;
		background: #36ACA9;
		font-size: 32rpx;
		color: #fff;
		border: unset;
	}
}
</style>
