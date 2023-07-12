<template>
	<view class="yeb-out">
		<NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
			:title-style="titleStyle">
		</NavBar>
		<view class="header">
			<image class="img" src="/static/img/yeb/qianbao.png"></image>
			<view class="text">可转出金额：{{ totalAmount }}</view>
		</view>
		<view class="content">
			<view class="title">可转出金额(元)</view>
			<view class="input-box">
				<input class="input" type="number" @input="blur" v-model="money" placeholder="请输入转出金额" />
				<view class="all" @click="inputAll">全部</view>
			</view>
			<view class="tip">转出后，本期不再计算收益</view>
		</view>
		<u-button :disabled="disabled" class="btn" hover-class="btn-hover" shape="circle" @click="confrim">确定转出</u-button>

		<uni-popup ref="popup" type="center" :mask-click="false">
			<view class="pwd-box">
				<view class="top-box">
					<view class="title">请输入支付密码</view>
					<view class="close" @click="closed">
						<uni-icons type="closeempty" style="color: #C6C6C6;" size="25"></uni-icons>
					</view>
				</view>
				<one-input v-model="pinCode" :maxlength="6" :isPwd="true" @finish="finishedOne" ref="hi" type="box">
				</one-input>
				<view class="forget" @click="toUrl('/pages/user/service/index')">忘记密码</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar";
import oneInput from '@/components/myp-one/myp-one'

import { rollOut } from '@/utils/yeb'
export default {
	components: {
		NavBar, oneInput
	},
	data() {
		return {
			title: "转出本金",
			headerStyle: {
				backgroundColor: "#1794FF"
			},
			fontColor: "#FFFFFF",
			titleStyle: {
				color: "#FFFFFF"
			},
			totalAmount: 12,
			money: '',
			pinCode: ''
		}
	},
	computed: {
		disabled() {
			return !this.money || this.money <= 0
		}
	},
	onLoad(option) {
		this.totalAmount = option.totalAmount
	},
	methods: {
		toUrl(url) {
			uni.navigateTo({
				url: url
			})
		},
		closed() {
			this.$refs.popup.close()
		},
		blur(e) {
			if (e.detail.value > this.totalAmount) {
				setTimeout(() => {
					this.inputAll()
				});
			}
		},
		inputAll() {
			this.money = this.totalAmount
		},
		async finishedOne() {
			const res = await rollOut({
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
		},
		confrim() {
			this.$refs.popup.open()
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
		background: #fff;
		padding: 30rpx 50rpx;
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
			margin: 75rpx 0;

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

		.tip {
			font-size: 24rpx;
			color: #FFAA3C;
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

	.pwd-box {
		height: 290rpx;
		width: 710rpx;
		border-radius: 20rpx;
		background: #FFFFFF;

		.top-box {
			display: flex;
			height: 80rpx;
			margin-bottom: 16rpx;

			.title {
				width: 85%;
				font-weight: 400;
				font-size: 30rpx;
				line-height: 30rpx;
				text-align: center;
				color: #222222;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.close {
				width: 15%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.forget {
			margin-top: 22rpx;
			font-weight: 400;
			font-size: 24rpx;
			line-height: 30rpx;
			text-align: center;
			color: #CC3333;
		}
	}
}
</style>
