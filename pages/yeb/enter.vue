<template>
	<view class="yeb-out">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="header">
			<view class="title">
				<image class="img" src="/static/img/yeb/qianbao.png"></image>
				<view class="text">可转入金额：{{ totalAmount }}</view>
			</view>
			<view class="tip">转入后，预计收益时间48小时后</view>
		</view>
		<view class="content">
			<view class="title">可转入金额(元)</view>
			<view class="input-box">
				<input class="input" type="number" @input="blur" v-model="money" placeholder="请输入转入金额" />
				<view class="all" @click="inputAll">全部</view>
			</view>
		</view>
		<u-button :disabled="disabled" class="btn" hover-class="btn-hover" shape="circle" @click="confrim">确定转入</u-button>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";
import oneInput from '@/components/myp-one/myp-one'

import { getRollInAmount, rollIn } from '@/utils/yeb'
import defaultTemplate from "../../utils/defaultTemplate";
export default {
	components: {
		NavBar, oneInput
	},
	data() {
		return {
			title: "转入",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			totalAmount: 0.00,
			money: '',
			pinCode: ''
		}
	},
	computed: {
		disabled() {
			return !this.money || this.money <= 0
		}
	},
	onLoad() {
		this.getRollInAmountData()
	},
	methods: {
		async getRollInAmountData() {
			const res = await getRollInAmount()
			const { result } = defaultTemplate({ result: 0 }, res)
			this.totalAmount = result
		},
		toUrl(url) {
			uni.navigateTo({
				url: url
			})
		},
		closed() {
			this.$refs.popup.close()
		},
		blur(e) {
			if (parseFloat(e.detail.value) > parseFloat(this.totalAmount)) {
				setTimeout(() => {
					this.inputAll()
				});
			}
		},
		inputAll() {
			this.money = this.totalAmount
		},
		async confrim() {
			const res = await rollIn({
				amount: this.money,
				pinCode: this.pinCode
			})
			if (res.code == 200) {
				uni.redirectTo({
					url: `/pages/yeb/success?title=${res.message}`
				})
			} else {
				pop(res.message, 2000)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.yeb-out {
	display: flex;
	flex-direction: column;
	gap: 20rpx;

	.header {
		padding: 30rpx 50rpx;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		background: #fff;

		.title {
			display: flex;
			align-items: center;
			gap: 20rpx;

			.img {
				width: 90rpx;
				height: 90rpx;
				font-size: 36rpx;
				color: #222222;
			}
		}

		.tip {
			font-size: 24rpx;
			color: #FFAA3C;
		}
	}

	.content {
		background: #fff;
		padding: 50rpx 30rpx;
		display: flex;
		flex-direction: column;

		.title {
			font-size: 34rpx;
			color: #666666;
		}

		.input-box {
			display: flex;
			align-items: cneter;
			margin-top: 75rpx;

			.input {
				flex: 1;
				color: #000000;
				font-size: 36rpx;

				&::placeholder {
					font-size: 32rpx;
					color: #CCCCCC;
				}
			}

			.all {
				font-size: 32rpx;
				color: #03536E;
			}
		}
	}

	.btn {
		background: #16A7FB;
		color: #fff;
		border: unset;
		height: 90rpx;
		margin: 20rpx;
	}

	.btn-hover {
		color: #fff;
	}

	/deep/ .u-btn--default--disabled {
		background: linear-gradient(90deg, #D2D2D2 0%, #C8C9CC 52.89%, #CCCCCC 100%);
	}

}
</style>
