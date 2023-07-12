<template>
	<view class="backroom-box" :style="{ marginTop: safeHeight }">
		<nav-bar title="小黑屋" is-back>
			<uni-icons slot="right" @click="handleToSearch" type="search" color="rgb(7, 193, 96)" size="20"
				style="font-weight: bold;margin-right: 10px" />
		</nav-bar>
		<view class="backroom-box-body">
			<view class="userinfo">
				<view class="img">
					<image style="width: 128rpx;height: 128rpx"
						:src="userinfo.headImgUrl ? userinfo.headImgUrl : '/static/img/user/Frame21.png'"></image>
				</view>
				<view class="name">{{ userinfo.nickname }}</view>
				<view class="count">
					个人违规记录：
					<text v-if="times == 0">无</text>
					<text v-else style="color: red;">禁言{{ times }}次</text>
				</view>
				<view class="tips">
					{{ times == 0 ? '和谐社区靠大家，您是遵守社区规则的好彩民，暂无禁言记录继续保持哦！' : '最新处罚结果：' }}
					{{ setRes }}
				</view>
			</view>
			<view class="tipsimg">
				<image mode="widthFix" src="/static/img/blackroomimg.png"></image>
			</view>
			<view class="content">

				<view class="list-box">
					<template v-if="this.list.length > 0">
						<view v-for="(item, index) in list" :key="index" class="list-item">
							<view class="top">
								<view class="img">
									<image style="width: 84rpx; height: 84rpx; border-radius: 50%" :src="item.headPic">
									</image>
								</view>
								<view class="info">
									<view class="username">{{ item.nickname }}</view>
									<view class="createTime">{{ item.createTime }}</view>
								</view>
								<view class="count">
									<view class="menu" @click="toDetail(item)">
										共{{ item.punishTime }}次违规
									</view>
								</view>
							</view>
							<view class="bottom">
								<view class="content">
									<view class="reason"><text class="title">违规理由：</text>{{ item.reason }}</view>
									<view class="result">
										<text class="title">处罚结果：</text>
										<text v-if="item.punishDay > 0" style="color: red;">禁言{{ item.punishDay }}天</text>
										<text v-else style="color: #000;font-weight: bold;">永久禁言</text>
									</view>
									<view v-if="item.punishDay > 0" class="result">
										<text class="title">解封时间：</text>{{ item.endTime }}
									</view>
								</view>
								<view class="tag">
									<image style="width: 90rpx;height: 88rpx" src="/static/img/wg.png"></image>
								</view>
							</view>
						</view>
						<uni-load-more :status="status" @clickLoadMore="loadMore"
							:contentText="contentText"></uni-load-more>
					</template>
					<empty v-else> </empty>
				</view>
			</view>
		</view>
		<AlertInjectLayer />
	</view>
</template>

<script>
import NavBar from '@/components/common/navBar/navBar.vue';
import empty from "@/components/common/empty/empty.vue";
import { info, punish } from '../../../utils/user';
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
	components: {
		AlertInjectLayer, NavBar, empty
	},
	data() {
		return {
			safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
			userinfo: {},
			list: [],
			pageNum: 1,
			status: 'more',//more, loading, no-more
			setRes: '',
			contentText: {
				contentdown: '查看更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			},
			times: 0
		};
	},
	onLoad() {
		this.getUserinfo();
		this.getList();
	},
	onReachBottom() {
		if (this.status === "no-more") {
			return
		}
		console.log("上拉")
		this.loadMore()
	},
	methods: {
		toDetail(item) {
			uni.navigateTo({
				url: '/pages/user/backroom/detail?id=' + item.userId
			});
		},
		loadMore() {
			this.pageNum++
			this.userId = ""
			this.getList()
		},
		getUserinfo() {
			info().then(res => {
				if (res.code === 200) {
					this.userinfo = res.result;
					punish({ pageNum: 1, userId: res.result.id }).then(data => {
						if (data.code === 200) {
							this.times = data.result.records.length;
							let userPunishDay = data.result.records[data.result.records.length - 1].punishDay;
							if (userPunishDay > 0) {
								this.setRes = `禁言${userPunishDay}天`
							} else {
								this.setRes = "永久禁言"
							}
							console.log(this.times)
						}
					})
				}
			})
		},
		getList() {
			punish({ pageNum: this.pageNum, userId: this.userId }).then(res => {
				if (res.code === 200) {
					this.list = this.list.concat(res.result.records)
					if (res.result.records.length === 0) {
						this.status = "no-more"
					}
				}
			})
		},
		handleToSearch() {
			uni.navigateTo({
				url: '/pages/user/backroom/search'
			})
		}
	},
};
</script>

<style lang="scss">
.list-item {
	display: flex;
	flex-direction: column;
	padding: 28rpx;
	background-color: #fff;
	border-radius: 8rpx;

	&>.top {
		display: flex;
		align-items: center;
		height: 84rpx;
		gap: 0 20rpx;
		margin-bottom: 20rpx;

		&>.info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;

			.username {
				font-size: 28rpx;
				color: #333;
			}

			.createTime {
				font-size: 24rpx;
				color: #888;
			}
		}

		&>.count {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: end;

			&>.menu {
				width: 146rpx;
				height: 40rpx;
				background: #fff;
				border: 2rpx solid rgba(255, 0, 0, .5);
				box-sizing: border-box;
				border-radius: 40rpx;
				font-size: 24rpx;
				line-height: 40rpx;
				color: red;
				text-align: center;
			}
		}
	}

	&>.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;

		&>.content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 28rpx;
			color: #000;
			min-height: 88rpx;

			& .title {
				font-weight: 700;
			}
		}
	}
}

.backroom-box-body {
	width: 100%;
	height: calc(100% - 58px);
	//   position: absolute;
	display: flex;
	flex-direction: column;

	&>.userinfo {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20rpx auto;
		width: 710rpx;
		border: 8rpx solid #07c160;
		background-color: #fff;
		padding: 32rpx 40rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		font-size: 28rpx;

		&>.img {
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
			overflow: hidden;
		}

		&>.name {
			color: #07c160;
			margin-top: 10rpx;
			font-weight: 700;
			font-size: 32rpx;
			line-height: 44rpx;
			height: 44rpx;
		}

		&>.count {
			color: #000;
			margin-top: 8rpx;
		}

		&>.tips {
			margin-top: 8rpx;
			// width: 630rpx;
			width: 100%;
			height: 100rpx;
			background: #fff;
			box-shadow: inset 0 2rpx 0 #ededed;
			color: #666;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	&>.content {
		flex: 1;

		&>.list-box {
			display: flex;
			flex-direction: column;
			padding: 20rpx;
			gap: 20rpx 0;
			background-color: #000;
		}
	}

	.tipsimg {
		width: 100%;
		background-color: #000;

		// height: 500rpx;
		// background-image: url('@/static/img/blackroomimg.png');
		// background-repeat: no-repeat;
		// background-size: 100%;
		image {
			width: 100%;
		}
	}
}</style>
