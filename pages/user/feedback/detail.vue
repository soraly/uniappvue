<template>
	<view>
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="content">
			<template v-for="(item, index) in data.pictureIdList">
				<image v-if="checkMediaType(item.pictureUrl, 'image')" mode="widthFix" :src="item.pictureUrl"
					style="width: 100%;" />
				<video v-if="checkMediaType(item.pictureUrl, 'video')" style="width: 100%;height: 300rpx;"
					:src="item.pictureUrl" controls></video>
			</template>
			<text class="text">{{ data.description }}</text>
		</view>
	</view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { feedbackDetail } from '@/utils/user/feedback'
import defaultTemplate from '@/utils/defaultTemplate'
export default {
	components: {
		NavBar
	},
	data() {
		return {
			title: '反馈详情',
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
	onLoad(option) {
		this.getFeedbackDetail(option.id)
	},
	methods: {
		checkMediaType(url, type) {
			// 获取链接的扩展名
			const extension = this.getExtension(url);

			// 根据扩展名判断媒体类型
			if (extension === 'jpg' || extension === 'png' || extension === 'gif') {
				return type === 'image';
			} else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg' || extension === 'mov') {
				return type === 'video';
			} else {
				return false;
			}
		},
		getExtension(url) {
			// 从链接中提取扩展名
			const parts = url.split('.');
			return parts[parts.length - 1].toLowerCase();
		},
		async getFeedbackDetail(id) {
			const res = await feedbackDetail({ id })
			const result = defaultTemplate({
				title: "有奖反馈",
				description: "",
				pictureIdList: [{
					id: '',
					pictureUrl: "",
				}],
			}, res.result)
			this.data = result
			this.title = result.title
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
	padding: 30rpx;

	.text {
		color: #444;
		font-size: 24rpx;
	}
}
</style>
