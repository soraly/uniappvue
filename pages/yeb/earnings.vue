<template>
	<view class="yeb-earnings">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="header">
			<view>类型</view>
			<view>金额</view>
			<view>余额</view>
			<view class="time">时间</view>
		</view>

		<z-paging :style="'height: calc(var(--vh) - 230rpx);background: #EEEEEE;'" class="paging" ref="paging"
			v-model="list" @query="getList" :lower-threshold="10" :refresher-enabled="true" :refresherAnimated="false"
			:show-refresher-update-time="true" :refresher-default-text="'松开刷新...'" :refresher-pulling-text="'松开刷新...'"
			:refresher-default-img="'/static/img/load.gif'" :refresher-pulling-img="'/static/img/load.gif'"
			:refresher-refreshing-img="'/static/img/load.gif'" :refresher-default-style="'#EEEEEE'"
			:refresher-background="'#EEEEEE'" :refresher-fixed-background="'#EEEEEE'"
			:refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
			:refresher-refreshing-text="'正在加载更多数据...'"
			:loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
			:loading-more-loading-icon-custom-image="'/static/img/load.gif'"
			:loading-more-custom-style="{ 'padding-top': '20rpx', 'background': '#EEEEEE' }"
			:loading-more-loading-animated="false" :loading-more-default-as-loading="true"
			:show-loading-more-no-more-view="true" :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false"
			:empty-view-center="true" :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/empty.png'" :fixed="false"
			:empty-view-style="{ 'margin-bottom': '170px' }"
			:empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
			:empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
			<view>
				<view class="list" v-for="(item, index) in list" :key="index">
					<view>{{ item.typeText }}</view>
					<view :class="item.amount > 0 ? 'red' : 'green'">{{ item.amount }}</view>
					<view>{{ item.balance }}</view>
					<view class="time">{{ item.createTime }}</view>
				</view>
			</view>
		</z-paging>
		<view v-if="loading" class="loading">
			<image src="/static/img/load.gif"></image>
			<view>加载中...</view>
		</view>
		<view class="statistical">
			<view class="item">
				<view class="num">{{ yesterdayProfit }}</view>
				<view class="text">昨日收益</view>
			</view>
			<view class="item">
				<view class="num">{{ weekProfit }}</view>
				<view class="text">本周收益</view>
			</view>
			<view class="item">
				<view class="num">{{ totalProfit }}</view>
				<view class="text">累计收益</view>
			</view>
		</view>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";

import { profitList, profitStat } from '@/utils/yeb'
import defaultTemplate from "../../utils/defaultTemplate";
export default {
	components: {
		NavBar
	},
	data() {
		return {
			title: "收益记录",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			loading: false,
			isLoading: true,
			list: [],
			totalProfit: 0.00,
			weekProfit: 0.00,
			yesterdayProfit: 0.00,
		}
	},
	onLoad() {
		this.getStatistical()
	},
	methods: {
		async getStatistical() {
			const res = await profitStat()
			const { totalProfit, weekProfit, yesterdayProfit } = defaultTemplate({
				totalProfit: 0,
				weekProfit: 0,
				yesterdayProfit: 0
			}, res.result || {
				totalProfit: 0,
				weekProfit: 0,
				yesterdayProfit: 0
			})
			this.totalProfit = totalProfit
			this.weekProfit = weekProfit
			this.yesterdayProfit = yesterdayProfit
		},
		async getList(pageNo) {
			this.loading = this.isLoading
			this.isLoading = false
			const res = await profitList(
				{
					pageNo,
					pageSize: 20
				}
			)
			const list = defaultTemplate([
				{
					id: '',
					amount: 0,
					balance: 0,
					type: '',
					typeText: '',
					createTime: '',
				}
			], res.result)
			this.$refs.paging.complete(list);
			this.loading = false
		}
	}
}
</script>

<style lang="scss" scoped>
.yeb-earnings {

	.header,
	.list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		text-align: center;
		font-size: 24rpx;
		color: #222222;
		background: #fff;
		padding: 10rpx 0;

		.time {
			width: 270rpx;
		}

		.red {
			color: #CC3333;
		}

		.green {
			color: #34B822;
		}
	}

	.list {
		color: #999999;
		padding: 23rpx 0;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		image {
			width: 100rpx;
			height: 100rpx;
		}
	}

	.statistical {
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		text-align: center;
		background: #FFF2DF;

		.item {
			display: flex;
			flex-direction: column;
			gap: 5rpx;

			.num {
				font-size: 30rpx;
				color: #CC3333;
			}

			.text {
				font-size: 20rpx;
				color: #B8A68B;
			}
		}
	}
}
</style>
