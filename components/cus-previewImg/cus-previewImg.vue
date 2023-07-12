<template>
	<view class="previewImg" v-if="showBox" @touchmove.stop.prevent>
		<view class="mask" @click="close">
			<swiper @change="changeSwiper" class="mask-swiper" :current="currentIndex" :circular="circular"
				:duration="duration">
				<swiper-item v-for="(src, i) in list" :key="i">
					<image class="mask-swiper-img" :src="src" mode="aspectFit" />
				</swiper-item>
			</swiper>
		</view>
		<view class="pagebox" v-if="list.length > 0">{{ Number(currentIndex) + 1 }} / {{ list.length }}</view>
	</view>
</template>

<script>
export default {
	name: 'cus-previewImg',
	props: {
		list: {
			type: Array,
			required: true,
			default: () => {
				return [];
			}
		},
		circular: {
			type: Boolean,
			default: true
		},
		duration: {
			type: Number,
			default: 500
		}
	},
	data() {
		return {
			currentIndex: 0,
			showBox: false
		};
	},
	watch: {
		list(val) {
			console.log('图片预览', val)
		}
	},
	methods: {
		// 左右切换
		changeSwiper(e) {
			this.currentIndex = e.target.current;
		},
		open(current) {
			if (!current) return;
			this.currentIndex = this.list.indexOf(current)
			this.showBox = true;
			console.log(this.showBox)
		},
		close() {
			this.showBox = false;
		}
	}
}
</script>

<style lang="scss" scoped>
@mixin full {
	width: 100%;
	height: 100%;
}

.previewImg {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	@include full;

	.mask {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, .9);
		z-index: 5;
		@include full;

		&-swiper {
			@include full;
			text-align: center;

			&-img {
				@include full;
				max-width: 600px;
			}
		}
	}

	.pagebox {
		position: absolute;
		width: 100%;
		bottom: 20rpx;
		z-index: 6;
		color: #fff;
		text-align: center;
	}
}
</style>
