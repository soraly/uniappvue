<template>
	<view class="yeb-earnings">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
			<block slot="right">
				<view @click="show = true">筛选</view>
			</block>
		</NavBar>
		<u-popup v-model="show" mode="top">
			<scroll-view class="type-list-scroll" scroll-x="true">
				<view class="type-list">
					<view class="item" :class="{ selected: item.value === type }" v-for="(item, index) in typeList"
						:key="index" @click="type = item.value">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<view class="btns">
				<view class="btn close" @click="close">取消</view>
				<u-line color="#E3E3E3" direction="col" />
				<view class="btn confirm" @click="confirm">确定</view>
			</view>
		</u-popup>
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
					<view :class="['1', '5'].includes(item.type) ? 'red' : 'green'">
						{{ item.type === '2' ? '-' : '+' }}{{ item.amount }}
					</view>
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
				<view class="num red">{{ rollInAmount }}</view>
				<view class="text">转入</view>
			</view>
			<view class="item">
				<view class="num green">{{ rollOutAmount }}</view>
				<view class="text">转出</view>
			</view>
			<view class="item">
				<view class="num gyer">{{ totalProfit }}</view>
				<view class="text">累计收益</view>
			</view>
		</view>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";

import { yebDetail, yebDetailStat } from '@/utils/yeb'
import defaultTemplate from "../../utils/defaultTemplate";
export default {
	components: {
		NavBar
	},
	data() {
		return {
			title: "资金明细",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			show: false,
			oldType: '0',
			type: '0',
			typeList: [
				{ name: '全部', value: '0' },
				{ name: '转入', value: '1' },
				{ name: '转出', value: '2' },
				{ name: '收益', value: '5' },
			],
			loading: false,
			isLoading: true,
			list: [],
			totalProfit: 0.00,
			rollOutAmount: 0.00,
			rollInAmount: 0.00,
		}
	},
	onLoad() {
		this.getStatistical()
	},
	methods: {
		async getStatistical() {
			const res = await yebDetailStat()
			const { totalProfit, rollInAmount, rollOutAmount } = defaultTemplate({
				rollInAmount: 0,
				rollOutAmount: 0,
				totalProfit: 0
			}, res.result)
			this.totalProfit = totalProfit
			this.rollOutAmount = rollOutAmount
			this.rollInAmount = rollInAmount
		},
		async getList(pageNo) {
			this.oldType = this.type
			this.loading = this.isLoading
			this.isLoading = false
			const res = await yebDetail(
				{
					pageNo,
					pageSize: 20,
					type: this.type
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
		},
		close() {
			this.type = this.oldType
			this.show = false
		},
		confirm() {
			this.isLoading = true
			this.show = false
			this.$refs.paging.reload()
		},
	}
}
</script>

<style lang="scss" scoped>
.yeb-earnings {

	/deep/ {
		.u-drawer,
		.u-mask {
			top: 95rpx;
		}
	}

	.type-list-scroll {
		background: #F0F0F0;

		.type-list {
			display: flex;
			gap: 20rpx;
			padding: 30rpx 10rpx;
			white-space: nowrap;

			.item {
				background: #FFFFFF;
				border-radius: 30rpx;
				padding: 7rpx 37.5rpx;
				font-size: 26rpx;
				color: #000000;
			}

			.selected {
				background: #038DAF;
				color: #fff;
			}
		}
	}

	.btns {
		display: flex;
		height: 80rpx;
		align-items: center;
		justify-content: space-evenly;

		.btn {
			font-size: 30rpx;
			flex: 1;
			height: 100%;
			display: grid;
			place-content: center;
		}

		.close {
			color: #8CB2C9;
		}

		.confirm {
			color: #F8A408;
		}
	}

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
			}

			.red {
				color: #CC3333;
			}

			.green {
				color: #34B822;
			}

			.gyer {
				color: #666633;
			}

			.text {
				font-size: 20rpx;
				color: #B8A68B;
			}
		}
	}
}
</style>
