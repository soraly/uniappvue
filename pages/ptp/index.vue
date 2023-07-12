<template>
	<view class="ptp">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="content">
			<view class="header">
				<image class="img" :src="$store.state.appInfoStore.userInfo.headImgUrl"></image>
				<view class="text user">
					<view>账号 {{ $store.state.appInfoStore.userInfo.nickname }}</view>
					<view>我的上级 {{ $store.state.appInfoStore.userInfo.inviteCode }}</view>
				</view>
				<view class="text money">
					<view>可领取</view>
					<view class="num">{{ '0.00' }}</view>
				</view>
			</view>
			<view class="flex">
				<view class="nav">
					<view class="item" :class="{ active: navActive === item.key }" v-for="(item) in navList" :key="item.key"
						@click="navActive = item.key">
						{{ item.name }}
					</view>
					<view class="buts" :style="{ backgroundColor: item.color }" v-for="(item) in btns" :key="item.key"
						@click="handleBtnClick(item)">
						{{ item.name }}
					</view>
				</view>
				<view class="body">
					<components :is="navActive" />
					<!-- <Course v-if="navActive === 'course'" /> -->
				</view>
			</view>
		</view>
		<AlertInjectLayer />
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";

import Course from './components/Course'
import Promotion from './components/Promotion'
import Commission from './components/Commission'
import Performance from './components/Performance'
import TeamData from './components/TeamData'
import CommissionRatio from './components/CommissionRatio'
import AccountDirectly from './components/AccountDirectly'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
	components: {
		AlertInjectLayer,
		NavBar,
		Course,
		Promotion,
		Commission,
		Performance,
		TeamData,
		CommissionRatio,
		AccountDirectly,
	},
	data() {
		return {
			title: "推广赚钱",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			navActive: 'Course',
			navList: [
				{ key: 'Course', name: '教程' },
				{ key: 'Promotion', name: '我的推广' },
				{ key: 'Commission', name: '我的佣金' },
				{ key: 'Performance', name: '我的业绩' },
				{ key: 'TeamData', name: '团队数据' },
				{ key: 'CommissionRatio', name: '返佣比例' },
				{ key: 'AccountDirectly', name: '直属开户' },
			],
			btns: [
				{ key: 'collection', name: '一键领取', color: '#04BE02' },
				{ key: 'collectionRecord', name: '领取记录', color: '#0089FF' },
			]
		}
	},
	methods: {
		handleBtnClick(item) {
			if (item.key === 'collectionRecord') {
				uni.navigateTo({
					url: "./collectionRecord",
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.ptp {
	background: #eff6fe;

	.content {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		/*gap: 20rpx;*/

		.header {
			background: #1794FF;
			border-radius: 10px;
			display: flex;
			justify-content: center;
			/*gap: 20rpx;*/
			padding: 18rpx 20rpx;
			margin-bottom: 20rpx;
			.img {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;/*修改兼容*/
			}

			.user {
				flex: 1;
				margin-right: 20rpx;/*修改兼容*/
			}

			.text {
				font-size: 24rpx;
				color: #FFFFFF;
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				justify-content: space-between;

				.num {
					color: #FDA200;
				}
			}

			.money {
				align-items: center;
			}
		}

		.flex {
			display: flex;
			/*gap: 20rpx;*/
		}

		.nav {
			display: flex;
			flex-direction: column;
			/*gap: 20rpx;*/
			align-items: center;
			margin-right: 20rpx;
			.item {
				width: 150rpx;
				height: 70rpx;
				margin-bottom: 20rpx;
				display: grid;
				place-content: center;
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(0, 0, 0, 0.10),
					0rpx 0rpx 1rpx 0rpx rgba(0, 0, 0, 0.10),
					0rpx 1rpx 1rpx 0rpx rgba(0, 0, 0, 0.09),
					0rpx 2rpx 1rpx 0rpx rgba(0, 0, 0, 0.05),
					0rpx 4rpx 2rpx 0rpx rgba(0, 0, 0, 0.01),
					0rpx 6rpx 2rpx 0rpx rgba(0, 0, 0, 0.00);
				border-radius: 10rpx;
				font-size: 24rpx;
				color: #444444;
			}

			.active {
				background: linear-gradient(180deg, #1BAEFA 0%, #0591FE 100%);
				color: #FFFFFF;
			}

			.buts {
				width: 120rpx;
				height: 50rpx;
				border-radius: 10rpx;
				font-size: 20rpx;
				color: #F6F6F6;
				display: grid;
				place-content: center;
				margin-bottom: 20rpx;
			}
		}

		.body {
			flex: 1;
			height: calc(var(--vh) - 270rpx);
			overflow: auto;
		}
	}

}
</style>
