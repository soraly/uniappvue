<template>
	<view class="yeb-index">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
			<block slot="right">
				<image class="mark" src="/static/img/yeb/mark.png" @click="toUrl('/pages/yeb/kefu')"></image>
			</block>
		</NavBar>
		<view class="content">
			<view class="monty-card">
				<view class="card">
					<view class="title">总金额（元）</view>
					<view class="money">{{ data.totalAmount }}</view>
					<view class="yesterday">昨日收益：{{ data.yesterdayProfit }}</view>
					<view class="count">
						<view class="item">
							<view class="name">累计收益</view>
							<view class="num">{{ data.totalProfit }}</view>
						</view>
						<view class="item">
							<view class="name">近七日年利率</view>
							<view class="num">{{ data.avgProfit }}%</view>
						</view>
					</view>
					<view class="btns">
						<u-button class="btn out" shape="circle" :hair-line="false"
							@click="toUrl(`/pages/yeb/out?totalAmount=${data.totalAmount}`)">转出</u-button>
						<u-button class="btn enter" shape="circle" :hair-line="false"
							@click="toUrl('/pages/yeb/enter')">转入</u-button>
					</view>
				</view>
			</view>
			<view class="center">
				<view class="item">
					上期收益：
					<view class="num">{{ data.preProfit }}</view>
				</view>
				<view class="item">
					<image class="time" src="/static/img/yeb/time.png"></image>
					{{ data.preTime }}
				</view>
			</view>
			<view class="jump">
				<view class="item" @click="toUrl('/pages/yeb/earnings')">
					<image class="img" src="/static/img/yeb/shouyi.png"></image>
					收益记录
				</view>
				<u-line length="50rpx" color="#DADADA" direction="col" />
				<view class="item" @click="toUrl('/pages/yeb/capital')">
					<image class="img" src="/static/img/yeb/zijin.png"></image>
					资金明细
				</view>
			</view>
			<view class="tip">每天计算收益</view>
		</view>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";

import { init } from '@/utils/yeb'
import defaultTemplate from "../../utils/defaultTemplate";
export default {
	components: {
		NavBar
	},
	data() {
		return {
			title: "余额宝",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			data: {}
		}
	},
	onShow() {
		this.initData()
	},
	methods: {
		toUrl(url) {
			uni.navigateTo({
				url
			})
		},
		async initData() {
			const res = await init()
			const data = defaultTemplate({
				totalAmount: 0,
				yesterdayProfit: 0,
				totalProfit: 0,
				avgProfit: '',
				preProfit: 0,
				preTime: ''
			}, res.result)
			this.data = data
		}
	}
}
</script>

<style lang="scss" scoped>
.yeb-index {
	.mark {
		width: 40rpx;
		height: 40rpx;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 30rpx;

		.monty-card {
			background: linear-gradient(180deg, #1794FF 0%, #fff 100%);
			padding: 20rpx;
			padding-bottom: 0;

			.card {
				background: #FFFFFF;
				border-radius: 10rpx;
				padding: 50rpx;
				display: flex;
				flex-direction: column;
				gap: 20rpx;
				align-items: center;

				.title {
					font-size: 24rpx;
					color: #666666;
					margin-top: 20rpx;
				}

				.money {
					font-size: 60rpx;
					color: #222222;
				}

				.yesterday {
					background: #F4F4F4;
					border-radius: 50rpx;
					padding: 4rpx 67rpx;
				}

				.count {
					display: flex;
					width: 100%;
					justify-content: space-around;

					.item {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 20rpx;

						.name {
							font-size: 24rpx;
							color: #999999;
						}

						.num {
							font-size: 36rpx;
							color: #222222;
						}
					}
				}

				.btns {
					display: flex;
					width: 100%;
					gap: 110rpx;

					.btn {
						flex: 1;
						font-size: 30rpx;
						border: unset;
					}

					.out {
						background: #EBF2F6;
						color: #16A7FB;
					}

					.enter {
						background: #16A7FB;
						color: #FFFFFF;
					}

				}
			}
		}

		.center {
			display: flex;
			justify-content: space-between;
			background: #FFFFFF;
			padding: 30rpx;

			.item {
				display: flex;
				align-items: center;
				gap: 10rpx;
				font-size: 24rpx;
				color: #999999;

				.num {
					color: #CC3333;
				}

				.time {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}

		.jump {
			display: flex;
			justify-content: space-around;
			padding: 30rpx 0;
			background: #FFFFFF;

			.item {
				display: flex;
				gap: 20rpx;

				.img {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}

		.tip {
			font-size: 24rpx;
			width: 100%;
			text-align: center;
			color: #666666;
			position: absolute;
			bottom: 50rpx;
		}
	}
}
</style>
