<template>
	<view class="collection-record">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="content">
			<view class="selects">
				<uni-data-select :clear="false" v-model="value1" :localdata="range1" @change="change"></uni-data-select>
				<view class="right">已领取佣金<text class="yellow">600.00</text></view>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index">
					<view class="left">
						<view class="title">{{ item.text1 }}</view>
						<view class="text">{{ item.text2 }}</view>
					</view>
					<view class="text yellow">
						{{ item.text3 }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";
export default {
	components: {
		NavBar,
	},
	data() {
		return {
			title: "领取记录",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			value1: 0,
			range1: [
				{ value: 0, text: "全部" },
				{ value: 1, text: "今日" },
				{ value: 2, text: "昨日" },
				{ value: 2, text: "本周" },
				{ value: 2, text: "上周" },
				{ value: 2, text: "本月" },
			],
			list: [
				{
					text1: '棋牌佣金',
					text2: '2023.05.23 00:01:42',
					text3: '300.00',
				}, {
					text1: '棋牌佣金',
					text2: '2023.05.23 00:01:42',
					text3: '300.00',
				}, {
					text1: '棋牌佣金',
					text2: '2023.05.23 00:01:42',
					text3: '300.00',
				}
			]
		}
	},
	methods: {

		change(e) {
			console.log("e:", e);
		},
	}
}
</script>

<style lang="scss" scoped>
.collection-record {
	.content {
		padding: 20rpx 30rpx;

		.selects {
			display: flex;
			align-items: center;
			gap: 38rpx;
			padding-bottom: 20rpx;

			.right {
				flex: 1;
				font-size: 22rpx;
				color: #222222;
				display: flex;
				gap: 10rpx;
				justify-content: flex-end;
			}

			/deep/ .uni-searchbar {
				width: 160rpx;
				padding: 0;

				.uni-searchbar__box {
					border-radius: 50rpx !important;
					flex-direction: row-reverse;
					padding-left: 16rpx;

					.uni-searchbar__box-icon-search {
						padding: 0;

						.uni-icons {
							color: #0DB9EE !important;
						}
					}
				}
			}

			/deep/ .uni-stat__select {
				width: auto;
				flex: none;

				.uni-stat__actived {
					width: auto;
					flex: none;
				}

				.uni-select {
					border: unset;
					background: #FFFFFF;
					border-radius: 50rpx;
					justify-content: center;
					width: 160rpx;

					.uni-select__input-box {
						flex: none;
						gap: 10rpx;

						.uni-icons {
							color: #0DB9EE !important;
						}
					}

					.uni-select__selector {
						top: 100%;

						.uni-popper__arrow {
							display: none !important;
						}

						.uni-select__selector-item {
							justify-content: center;
						}
					}
				}
			}
		}

		.list {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
			height: calc(var(--vh) - 220rpx);
			overflow: auto;

			.item {
				display: flex;
				justify-content: space-between;
				background: #FFFFFF;
				border-radius: 20px;
				padding: 22rpx 20rpx;
				font-size: 22rpx;
				align-items: center;

				.left {
					display: flex;
					flex-direction: column;
					gap: 10rpx;
				}

				.title {
					color: #444444;
					font-size: 22rpx;
				}

				.text {
					color: #999999;
					font-size: 22rpx;
				}
			}
		}
	}

	.yellow {
		color: #FDA200 !important;
	}
}
</style>
