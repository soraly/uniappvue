<template>
	<view class="feedback" :class="{ loadingBg: loading }">
		<NavBar :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
			<block slot="title">
				<view class="nav-title">
					<view class="nav-tabs">
						<view v-for="item in headerTab" :key="item.key"
							:class="dataType === item.key ? 'nav-tabs-item active' : 'nav-tabs-item'"
							@click="onChangeTab(item.key)">
							{{ item.value }}</view>
					</view>
				</view>
			</block>
		</NavBar>
		<view class="content" v-show="dataType === 1">
			<view class="title">
				反馈内容<text class="tip">（你提我改）</text>
			</view>
			<u-input class="textarea" auto-height height="120" maxlength="200" v-model="formData.description"
				type="textarea" :clearable="false" placeholder="您的任何意见对我们都很重要，凡是有价值意见都将被采纳，一旦采纳将视重要程度给予不同现金奖励，欢迎您畅所欲言！" />
			<view class="size">{{ formData.description.length }}/200</view>
			<view class="title">
				有图有真相<text class="tip">（更容易被采纳）</text>
			</view>
			<u-upload @on-choose-complete="onChooseComplete" @on-uploaded="onUploaded" ref="upload" class="upload" deletable
				:show-tips="false" upload-text="" :action="action" max-count="3"
				:limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :maxSize="5000000" showTips
				@on-success="handleUploadSuccess" @on-remove="handleUploadRemove"></u-upload>
			<text class="text-tip">支持图片，大小不得超过5M</text>
			<view class="title">
				奖励规则
			</view>
			<text class="text-tip">我们已经设置巨额奖金，专门收集反馈意见，以便我们优化系统和功能，给您带来更好的体验！一旦被采纳，将根据重要程度给予奖励（未采纳除外）。</text>
			<view class="button" @click="confirmNext">下一步</view>
		</view>
		<div class="content" v-show="dataType === 2">
			<z-paging height="calc(100vh - 148rpx)" ref="paging" v-model="dataList" @query="getFeedbackList"
				:lower-threshold="10" :refresher-enabled="true" :refresherAnimated="false"
				:show-refresher-update-time="true" :refresher-default-text="'松开刷新...'" :refresher-pulling-text="'松开刷新...'"
				:refresher-default-img="'/static/img/loading.gif'" :refresher-pulling-img="'/static/img/loading.gif'"
				:refresher-refreshing-img="'/static/img/loading.gif'"
				:refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
				:refresher-refreshing-text="'正在加载更多数据...'"
				:loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
				:loading-more-loading-icon-custom-image="'/static/img/loading.gif'" :loading-more-loading-animated="false"
				:loading-more-default-as-loading="true" :show-loading-more-no-more-view="false"
				:show-loading-more-no-more-line="false" :hide-empty-view="false" :empty-view-center="true"
				:empty-view-text="'暂无数据'" :empty-view-img="'/static/img/wu.png'" :fixed="false"
				:empty-view-style="{ 'margin-bottom': '170px' }"
				:empty-view-img-style="{ 'width': '100rpx', 'height': '100rpx' }"
				:empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">


				<view v-if="loading" class="loading">
					<image src="/static/img/load.gif"></image>
					<view>加载中...</view>
				</view>
				<view class="items">
					<view class="item" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
						<view class="left">
							<view class="title">反馈ID:{{ item.id }}</view>
							<view class="description">{{ item.description }}</view>
							<view class="time">{{ item.updateTime }}</view>
						</view>
						<view class="right">
							{{ item.status === 1 ? '已处理' : '未处理' }}
							<u-icon class="icon" name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</z-paging>
		</div>
	</view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { config } from '@/config/config.js'

import { feedback, feedbackList } from '@/utils/user/feedback'
export default {
	components: {
		NavBar
	},
	data() {
		return {
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			dataType: 1,
			headerTab: [
				{
					key: 1,
					value: '有奖反馈',
				},
				{
					key: 2,
					value: '我的反馈',
				},
			],
			action: config.me_base_url + '/api/user/upImg',
			formData: {
				title: '有奖反馈',
				description: '',
				pictureIdList: []
			},
			dataList: [],
			loading: false,
			isFirstLoading: false,
			//来源类型
			feedbackType: this.$config.enumMgr.USER_FEEDBACK_TYPE.BBS,
		}
	},

	onLoad({ type }) {
		this.feedbackType = this.$config.enumMgr.USER_FEEDBACK_TYPE.BBS;
		//判断类型 避免误传其它类型
		if (type == this.$config.enumMgr.USER_FEEDBACK_TYPE.LOTTERY) {
			this.feedbackType = this.$config.enumMgr.USER_FEEDBACK_TYPE.LOTTERY;
		}
	},

	watch: {
		dataType(val) {
			if (val === 2) {
				if (!this.isFirstLoading) {
					this.$refs.paging.reload()
				}
			}
		}
	},
	methods: {
		onChangeTab(index) {
			this.dataType = index;
		},
		handleUploadSuccess(e) {
			this.formData.pictureIdList.push(e.result.id)
		},
		handleUploadRemove(e) {
			this.loading = false
			this.formData.pictureIdList.splice(e, 1)
		},
		async confirmNext() {
			if (this.loading) {
				pop('服务端正在处理文件', 1000)
				return
			}
			this.formData['project'] = this.feedbackType;
			const res = await feedback(this.formData)
			pop(res.message, 1000)
			if (res.code === 200) {
				this.formData = {
					title: '有奖反馈',
					description: '',
					pictureIdList: []
				}
				this.$refs.upload.clear()
				this.onChangeTab(2)
				this.loading = true
				this.getFeedbackList(1)
			}
		},
		async getFeedbackList(pageNo) {
			if (this.dataType === 1) {
				return
			}
			this.loading = !this.isFirstLoading
			const res = await feedbackList({ pageNum: pageNo })
			this.$refs.paging.complete(res.result.records);
			this.loading = false
			this.isFirstLoading = true
		},
		goDetail(item) {
			uni.navigateTo({
				url: "./detail?id=" + item.id
			})
		},
		onChooseComplete() {
			this.loading = true
		},
		onUploaded() {
			this.loading = false
		}
	}
}
</script>

<style lang="scss" scoped>
.loadingBg {
	background: #eeeeee;
}

.nav-title {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;

	.nav-tabs {
		display: flex;
		border-radius: 50rpx;
		margin: 0 auto;
		border: 1px solid #fff;

		.nav-tabs-item {
			font-size: clamp(20rpx, 26rpx, 26rpx);
			width: 140rpx;
			text-align: center;
			display: block;
			padding: 9rpx;
			transition: .3s;
		}

		.nav-tabs-item:nth-child(1) {
			border-top-left-radius: 50rpx;
			border-bottom-left-radius: 50rpx;
		}

		.nav-tabs-item:nth-child(2) {
			border-top-right-radius: 50rpx;
			border-bottom-right-radius: 50rpx;
		}

		.nav-tabs-item.active {
			background-color: #fff;
			color: #0089FF;
			transition: .3s;
		}
	}
}

.content {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
	padding: 20rpx;

	.title {
		color: #222;
		font-size: 30rpx;

		.tip {
			color: #666666;
		}
	}

	.textarea {
		height: 188rpx !important;
		color: #666;
		font-size: 24rpx;
		background: #FFF;
		border-radius: 10rpx;
		padding: 20rpx 10rpx 30rpx 20rpx !important;

		/deep/ .u-input__input {
			padding: 0;
		}
	}

	.size {
		color: #666;
		font-size: 24rpx;
		text-align: right;
		margin: 15rpx 20rpx;
	}

	.upload {
		margin: 30rpx 0;

		/deep/ .u-list-item {
			border: 1px dashed #cccccc;

			.u-delete-icon .u-icon__icon {
				font-size: 10rpx !important;
				color: #CCCCCC;
			}
		}
	}

	.text-tip {
		color: #666;
		font-size: 24rpx;
	}

	.button {
		height: 90rpx;
		border-radius: 50rpx;
		background: #16A7FB;
		display: grid;
		place-content: center;
		color: #FFF;
		font-size: 32rpx;
		margin-top: 74rpx;
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.item {
			border-radius: 10rpx;
			background: #FFF;
			display: flex;
			align-items: center;
			padding: 10rpx 20rpx;

			.left {
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				flex: 1;

				.title {
					color: #222;
					font-size: 30rpx;
					font-weight: 400;
				}

				.description {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #444444;
					font-weight: 300;
					font-size: 24rpx;
					max-width: calc(100vw - 250rpx);
				}

				.time {
					color: #444;
					font-size: 24rpx;
					margin-top: 10rpx;
					font-weight: 300;
				}
			}

			.right {
				color: #FDA200;
				font-size: 30rpx;

				.icon {
					color: #c7c7cc;
					margin-left: 10rpx;
				}
			}
		}
	}

	.loading {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
		width: 100%;
		height: calc(var(--vh) - 150rpx);

		image {
			width: 100rpx;
			height: 100rpx;
		}
	}
}
</style>
