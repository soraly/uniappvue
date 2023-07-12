<template>
	<view class="toolbox-warp1" :style="{ marginTop: safeHeight }">
		<NavBar :title="title"></NavBar>
		<view class="turntable-body" style="">
			<notice :content="content" :styleContent="styleContent"></notice>
			<p class="num">{{ titles }}</p>
			<view class="table-box" @click="startDraw">
				<table border="0">
					<tr v-for="(item, index) in prizeList" :key="index">
						<td v-for="(val, key) in item" :key="key" :colspan="index == 1 && key == 1 ? 2 : 1"
							:rowspan="index == 1 && key == 1 ? 2 : 1">
							<view :class="isDraw ? 'text-box' : 'start-btn'" v-if="index == 1 && key == 1">
								<view v-if="isDraw">
									<p><span v-for="(v, k) in prizeArr">{{ v }}</span></p>
									<p>{{ data.color }}</p>
								</view>
								<p v-else>开始</p>
							</view>
							<view class="ani-box" v-else
								:class="{ 'active': actives == val.keys || prizeArr.includes(val.name) }">
								<image mode="aspectFit" :src="val.img"></image>
							</view>
						</td>
					</tr>
				</table>
			</view>
			<view class="footer-text">提示：每期只能进行一次波肖转盘</view>
		</view>
		<AlertInjectLayer />
	</view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import {
	animalAndColorWheel
} from "../../utils/toolbox/index"

export default {
	name: "turntable",
	components: {
		AlertInjectLayer,
		NavBar,
		Notice
	},
	data() {
		return {
			safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
			title: '波肖转盘',
			content: '转转转！转出本期的生肖和波色，激动不如行动，赶紧来转出心目中的生肖和波色！',
			styleContent: {
				'font-size': '24rpx',
				'margin-top': '6rpx',
				'line-height': '28rpx',
				'text-align': 'left',
				'box-sizing': 'border-box',
				padding: '0 20rpx'
			},
			actives: '',
			prizeKeys: ['ma', 'hou', 'niu', 'ji', 'yang', 'tu', 'gou', 'zhu', 'she', 'hu', 'shu', 'long'],
			prizeList: [
				[
					{
						name: '马',
						keys: 'ma',
						img: '../../static/img/toolbox/turntable/ma.png'
					},
					{
						name: '猴',
						keys: 'hou',
						img: '../../static/img/toolbox/turntable/hou.png'
					},
					{
						name: '牛',
						keys: 'niu',
						img: '../../static/img/toolbox/turntable/niu.png'
					},
					{
						name: '鸡',
						keys: 'ji',
						img: '../../static/img/toolbox/turntable/ji.png'
					},
				],
				[
					{
						name: '龙',
						keys: 'long',
						img: '../../static/img/toolbox/turntable/long.png'
					},
					{
						name: '龙',
						keys: 'long',
						img: '../../static/img/toolbox/turntable/long.png'
					},
					{
						name: '羊',
						keys: 'yang',
						img: '../../static/img/toolbox/turntable/yang.png'
					},
				],
				[
					{
						name: '鼠',
						keys: 'shu',
						img: '../../static/img/toolbox/turntable/shu.png'
					},
					{
						name: '兔',
						keys: 'tu',
						img: '../../static/img/toolbox/turntable/tu.png'
					},
				],
				[
					{
						name: '虎',
						keys: 'hu',
						img: '../../static/img/toolbox/turntable/hu.png'
					},
					{
						name: '蛇',
						keys: 'she',
						img: '../../static/img/toolbox/turntable/she.png'
					},
					{
						name: '猪',
						keys: 'zhu',
						img: '../../static/img/toolbox/turntable/zhu.png'
					},
					{
						name: '狗',
						keys: 'gou',
						img: '../../static/img/toolbox/turntable/gou.png'
					},
				]
			],
			isDraw: false,
			titles: '',
			color: '',
			animals: [],
			prizeArr: [],
			data: {
				color: '',
				title: '',
			},
		}
	},
	methods: {
		getAnimalAndColorWheel() {
			let prams = {
				jpushId: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
				create: 1
			}
			animalAndColorWheel(prams).then(res => {
				this.animals = res.result.animals?.split(' ')
				this.titles = res.result.title
				this.color = res.result.color
			}).catch(err => {
				console.log(err)
			})
		},
		startDraw() {
			this.getAnimalAndColorWheel()
			var i = 0;
			var l = 1;
			var pushKey = 0
			this.prizeArr = []
			this.isDraw = true
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				if (i >= this.prizeKeys.length || !this.animals.length) {
					i = 0
					l++
					if (!this.animals.length) {
						l = 1
					}
				}
				this.actives = this.prizeKeys[i]
				if (this.animals.length) {
					if (i === 0 && l % Math.floor(this.prizeKeys.length / this.animals.length) === 0) {
						this.prizeArr.push(this.animals[pushKey])
						pushKey++
					}
					if (pushKey === this.animals.length) {
						clearInterval(this.timer)
						this.actives = ''
						this.data.color = this.color
					}
				}
				i++
			}, 50);
		}
	}
}
</script>

<style lang="scss" scoped>
.toolbox-warp1 {
	height: 94vh;
}

.turntable-body {
	position: relative;
	min-height: calc(100% - 12rpx);
	background: #fff;
	padding: 20rpx 24rpx;
	box-sizing: border-box;
	padding-bottom: 100Px;
	margin-top: 6px;

	.num {
		color: #333;
		font-size: 36rpx;
		line-height: 50rpx;
		margin: 16rpx 0 64rpx;
		text-align: center;
	}

	.table-box {
		box-sizing: border-box;
		padding: 4rpx 18rpx;
		background: #e55e5b;
		width: 688rpx;
		height: 652rpx;
		margin: 0 auto;

		table {
			border: none;
			width: 100%;
			border-spacing: 0;

			td {
				width: 25%;
				padding: 10rpx 12rpx;

				.ani-box {
					height: 140rpx;
					width: 140rpx;
					box-sizing: border-box;
					background: #fff;

					image {
						display: block;
						height: 100%;
						width: 100%;
					}
				}

				.text-box {
					text-align: center;

					p:first-of-type {
						font-size: 50rpx;
						line-height: 72rpx;
						color: #ffb416;

						span {
							margin-left: 30rpx;
						}

						span:first-of-type {
							margin-left: 0;
						}
					}

					p:nth-of-type(2) {
						color: #fff;
						font-size: 38rpx;
						line-height: 52rpx;
						margin-top: 6rpx;
					}
				}

				.active {
					border: 6rpx solid #ffe007;
				}

				.start-btn {
					height: 164rpx;
					width: 164rpx;
					color: #f1b711;
					border-radius: 50%;
					background: #fff;
					line-height: 164rpx;
					margin: 0 auto;
					text-align: center;
					font-size: 50rpx;
				}
			}
		}
	}

	.footer-text {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		color: #333;
		font-size: 24rpx;
		text-align: center;
		line-height: 34rpx;
		bottom: 34rpx;
	}
}
</style>