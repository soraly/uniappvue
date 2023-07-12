<template>
	<view class="ptp-sourse">
		<image mode="widthFix" src="/static/img/ptp/course.png" style="width: 100%;" />
		<view class="video-box" @click="videoShow = true">
			<u-popup v-model="videoShow" mode="center">
				<video class="video" :src="videoSrc" controls></video>
			</u-popup>
		</view>
	</view>
</template>

<script>
import { courseImage, courseVideo } from '@/utils/ptp'
export default {
	data() {
		return {
			videoShow: false,
			videoSrc: ''
		}
	},
	mounted() {
		this.getCourseImage()
		this.getCourseVideo()
	},
	methods: {
		async getCourseImage() {
			const res = await courseImage()
		},
		async getCourseVideo() {
			const res = await courseVideo()
			this.videoSrc = res.result
		}
	}
}
</script>

<style lang="scss" scoped>
.ptp-sourse {
	position: relative;

	.video-box {
		position: absolute;
		width: 150rpx;
		height: 50rpx;
		top: 100rpx;
		left: 200rpx;

		/deep/ .u-mode-center-box {
			background: unset;
		}

		.video {
			width: 600rpx;
			height: 340rpx;
			border-radius: 20rpx;
			overflow: hidden;
		}
	}
}
</style>
