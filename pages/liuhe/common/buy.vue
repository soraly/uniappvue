<template>
	<view class="buy">
		<view class="top">
			<view class="expand" @click="onExpandChange">
				<image class="cart" src="./../../../static/img/liuhe/cart.png"></image>
				<text class="sum">{{ setSum() }}</text>
				<image class="arrow" :src="isExpand ? down : up"></image>
			</view>
			<view class="price">共{{ setPrice() }}元</view>
			<view class="right-part" v-if="isExpand">
				<image v-if="isOpened === 'right'" src="./../../../static/img/liuhe/finish.png" @click="toFinish">
				</image>
				<image v-else src="./../../../static/img/liuhe/edit.png" @click="closeBuy"></image>
				<text v-if="isOpened === 'right'" style="color: #fff;" @click="toFinish">完成</text>
				<text v-else style="color: #fff;" @click="closeBuy">编辑</text>
			</view>
			<view class="right-part" v-else>
				<text>最高中奖金额{{ setAmount(orderList.length * amount * ballItem.odds) }}元</text>
				<image src="./../../../static/img/liuhe/delete.png" @click="closeBuy"></image>
			</view>
		</view>
		<scroll-view scroll-y :class="isExpand ? 'content-list active' : 'content-list'">
			<uni-swipe-action v-if="orderList.length>0">
				<uni-swipe-action-item ref="swipe" :show="isOpened" v-for="(item, index) in orderList" :key="index"
					:right-options="options" @click="(e) => bindClick(e)" @change="swipeChange($event, index)">
					<view class="content-list-item">
						<uni-row>
							<uni-col :span="8">
								<view class="left">
									<view class="amount">
										{{ amount === "" ? 1 : amount }}
									</view>
								</view>
							</uni-col>
							<uni-col :span="8">
								<view class="center">
									{{ item.methodName }}
									<text>@[{{ item.name }}]</text>
								</view>
							</uni-col>
							<uni-col :span="8">
								<view class="right">{{ item.stakeCount }}注</view>
							</uni-col>
						</uni-row>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</scroll-view>
		<view class="bottom">
			<view class="close-bottom" v-if="stampType === 3 || stampType === 1">
				<view class="close-mask">
					封单中
				</view>
			</view>
			<uni-row>
				<uni-col :span="18">
					<view class="coins">
						<view
							:class="`${coinCurrent === index ? 'coin-item active' : 'coin-item'} ${getCoinFontSizeClasss(item)}`"
							v-for="(item, index) in coins" @click="setCustomAmount(item, index)">
							<text class="num-text">{{ item }}</text>
						</view>
					</view>
				</uni-col>
				<uni-col :span="6">
					<view class="edit">
						<view class="btn" @click="setEdit">编辑</view>
						<uni-popup ref="popup" type="dialog" background-color="#fff">
							<view class="msg-box">
								<view class="header">
									<view class="close">
										<image mode="widthFix" src="./../../../static/img/liuhe/close.png" @click="close">
										</image>
									</view>
									编辑预设
								</view>
								<view class="content">
									<uni-forms ref="baseForm" :modelValue="baseFormData">
										<uni-forms-item label="预设金额1" required>
											<uni-easyinput maxlength="6" type="number" v-model="baseFormData.amount1"
												placeholder="预设金额" />
										</uni-forms-item>
										<uni-forms-item label="预设金额2" required>
											<uni-easyinput maxlength="6" type="number" v-model="baseFormData.amount2"
												placeholder="预设金额" />
										</uni-forms-item>
										<uni-forms-item label="预设金额3" required>
											<uni-easyinput maxlength="6" type="number" v-model="baseFormData.amount3"
												placeholder="预设金额" />
										</uni-forms-item>
										<uni-forms-item label="预设金额4" required>
											<uni-easyinput maxlength="6" type="number" v-model="baseFormData.amount4"
												placeholder="预设金额" />
										</uni-forms-item>
										<uni-forms-item label="预设金额5">
											<uni-easyinput maxlength="6" type="number" v-model="baseFormData.amount5"
												placeholder="预设金额" />
										</uni-forms-item>
										<view class="dividing-line"></view>
										<uni-forms-item label="预设倍数1">
											<uni-easyinput maxlength="2" type="number" v-model="baseFormData.multiple1"
												placeholder="预设倍数" />
										</uni-forms-item>
										<uni-forms-item label="预设倍数2">
											<uni-easyinput maxlength="2" type="number" v-model="baseFormData.multiple2"
												placeholder="预设倍数" />
										</uni-forms-item>
									</uni-forms>
								</view>
								<view class="footer">
									<uni-row>
										<uni-col :span="12">
											<view class="btn-group">
												<view class="btn-group-btn cancel" @click="close">取消</view>
											</view>
										</uni-col>
										<uni-col :span="12">
											<view class="btn-group">
												<view class="btn-group-btn confirm" @click="setValue">确认更改</view>
											</view>
										</uni-col>
									</uni-row>
								</view>
							</view>
						</uni-popup>
					</view>
				</uni-col>
			</uni-row>
			<view class="input-text">
				<view class="times" @click="times(baseFormData.multiple1)">{{ `x${baseFormData.multiple1}` }}</view>
				<view class="times" @click="times(baseFormData.multiple2)">{{ `x${baseFormData.multiple2}` }}</view>
				<view class="text">
					<input maxlength="7" v-model="amount" type="number" placeholder="输入下注金额" @input="onChangeAmount" />
					<view class="clear" @click="clearAmount">清</view>
				</view>
				<uni-badge size="small" :text="carts.length" absolute="rightTop" type="error">
					<view class="btn" @click="toBuy">
						{{ isCart && carts.length > 0 ? '购物车' : '确认' }}
					</view>
				</uni-badge>
			</view>
		</view>
	</view>
</template>

<script>
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import {
	mapGetters
} from "vuex";
import Playing from "../../../utils/common/playing";
export default {
	name: "buy",
	components: {
		UniCol,
		UniRow
	},
	props: {
		ballItem: {

		},
		orders: {

		},
		stampType: {},
		total: {

		},
		isCart: {

		},
		carts: {

		},
		lotteryId: {
			type: String,
			default: ""
		}
	},
	computed: {
		...mapGetters(['orderList']),
		menuListStoregeKey() {
			return "menuList:" + this.lotteryId;
		}
	},
	watch: {
		orders(newV, oldV) {
			//console.log("newV",newV,oldV);
		},
		total(newV, oldV) {
			// //console.log("newV",newV);
		},

	},

	data() {
		return {
			price: "0.00",
			sum: 0,
			isExpand: false,
			coinCurrent: null,
			up: require('./../../../static/img/liuhe/up.png'),
			down: require('./../../../static/img/liuhe/down.png'),
			coin: require('./../../../static/img/liuhe/coin.png'),
			coinSelect: require('./../../../static/img/liuhe/coin-select.png'),
			coins: [5, 10, 50, 100, 500],
			// 基础表单数据
			baseFormData: {
				amount1: 5,
				amount2: 10,
				amount3: 50,
				amount4: 100,
				amount5: 500,
				multiple1: 2,
				multiple2: 3
			},
			amount: '',
			playing: new Playing(),
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#CC6666'
				}
			}],
			isOpened: 'none'
		}
	},
	mounted() {
		this.getHistoryAmount();
	},
	methods: {
		/**
		 * 根据不同数值获取不同字体大小配置
		 * @param {Object} coinMsg
		 */
		getCoinFontSizeClasss(coinMsg) {
			let cssClassName = "big";
			if (!coinMsg) {
				console.warn("coinMsg is undefined");
				return cssClassName;
			}
			if (coinMsg < 1000) {
				cssClassName = "big";
			} else if (coinMsg < 100000) {
				cssClassName = "medium";
			} else if (coinMsg < 1000000) {
				cssClassName = "small";
			}
			return cssClassName;
		},

		getHistoryAmount() {
			if (this.playing.getStorage(this.menuListStoregeKey)[6].isOpen) {
				this.amount = this.playing.getStorage('amount');
			}
		},
		setSum() {
			if (this.total.stakeCount > 0) {
				return this.total.stakeCount
			} else {
				return 0
			}
		},
		setPrice() {
			if (this.orderList.length > 0) {
				return this.orderList[0].content === "" ? this.setAmount(this.orderList.length * this.amount) : this
					.setAmount(this.orderList[0].stakeCount * this.amount)
			} else {
				return 0
			}
		},
		bindClick(e) {
			console.log("删除按钮点击",e);
			let _this=this;
			// this.$nextTick(function () {
			// 	_this.$emit('removeOrder', e.index)
			// })
			setTimeout(function () {
				_this.$emit('removeOrder', e.index);
			},100);

		},
		swipeChange(e, index) {
			//console.log('当前状态：'+ e +'，下标：' + index)
		},
		setAmount(val) {
			return this.playing.setAmount(val, 2, '.', ',');
		},
		onExpandChange() {
			this.isExpand = !this.isExpand;
		},
		clearAmount() {
			this.coinCurrent = null;
			this.amount = "";
			this.total.totalPrice = 0;
		},
		setCustomAmount(item, index) {
			this.coinCurrent = index;
			this.amount = Number(this.amount) + Number(item)
			this.total.totalPrice = this.total.stakeCount * this.amount;
			if (this.playing.getStorage(this.menuListStoregeKey)[6].isOpen) {
				this.playing.setStorage('amount', this.amount);
			}
			let _this = this;
			setTimeout(function () {
				_this.onTouchend();
			}, 100);
		},
		onChangeAmount(event) {
			//console.log(event.detail.value);
			//@mrz 限制输入负数
			let memAmount = Number(event.detail.value);
			if (memAmount < 0) memAmount = 0;
			this.amount = memAmount;
			this.total.totalPrice = this.total.stakeCount * this.amount;
			if (this.playing.getStorage(this.menuListStoregeKey)[6].isOpen) {
				this.playing.setStorage('amount', this.amount);
			}
		},
		times(num) {
			//@mrz 限制翻倍导致超出输入限制
			let caculationAmount = this.amount * num;
			if (caculationAmount > 9999999) caculationAmount = 99999999;
			if (caculationAmount < 0) caculationAmount = 0;
			this.amount = caculationAmount;

			this.total.totalPrice = this.total.stakeCount * this.amount;
			if (this.playing.getStorage(this.menuListStoregeKey)[6].isOpen) {
				this.playing.setStorage('amount', this.amount);
			}
		},
		onTouchend() {
			this.coinCurrent = null;
		},
		setBgColor(isClick) {
			if (isClick) {
				return {
					backgroundImage: `url(${this.coinSelect})`,
					backgroundSize: '100% 100%',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center'
				}
			} else {
				return {
					backgroundImage: `url(${this.coin})`,
					backgroundSize: '100% 100%',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center'
				}
			}

		},
		setEdit() {
			this.$refs.popup.open()
		},
		toFinish() {
			this.isOpened = "none";
		},
		closeBuy() {
			if (this.isExpand) {
				this.isOpened = "right";
				// this.$refs.swipe.resize()
			} else {
				this.$emit("closeBuy")
			}
		},
		close() {
			this.$refs.popup.close()
		},
		setValue() {
			this.coins = [this.baseFormData.amount1, this.baseFormData.amount2, this.baseFormData.amount3, this
				.baseFormData.amount4, this.baseFormData.amount5,
			];
			this.close()
		},


		toBuy() {
			let obj = {
				unitPrice: this.amount,
				stakeCount: this.total.stakeCount,
				totalPrice: this.total.totalPrice,
			}
			this.$emit('toBuy', obj)
		}
	}
}
</script>

<style lang="scss" scoped>
.buy {
	height: 100%;
	width: 100%;
	box-sizing: border-box;

	.top {
		padding: 5rpx 10rpx;
		height: 60rpx;
		background: #0099CC;
		position: relative;

		.expand {
			background: #DDE5F0;
			border-radius: 5px;
			width: 154rpx;
			height: 38rpx;
			position: absolute;
			padding: 10rpx;
			text-align: center;
			line-height: 38rpx;

			.cart {
				width: 27rpx;
				height: 27rpx;
				float: left;
				margin-top: 8rpx;
			}

			.sum {
				font-weight: 600;
				font-size: 25rpx;
				line-height: 35rpx;
				text-align: center;
				color: #3881A8;
				flex: none;
				order: 1;
				flex-grow: 0;
			}

			.arrow {
				width: 20rpx;
				height: 10rpx;
				float: right;
				margin-top: 16rpx;
			}
		}

		.price {
			position: absolute;
			font-weight: 400;
			font-size: 25rpx;
			line-height: 35rpx;
			text-align: center;
			color: #FFFFFF;
			flex: none;
			order: 1;
			flex-grow: 0;
			left: 200rpx;
			top: 16rpx
		}

		.right-part {
			line-height: 60rpx;
			float: right;
			display: flex;
			justify-content: space-around;
			align-items: center;

			text {
				color: #A3C6DC;
				font-size: 25rpx;
				margin-right: 9rpx;
			}

			image {
				width: 31rpx;
				height: 33rpx;
			}
		}
	}

	.content-list {
		background: #DEEAFA;
		height: 0;
		transition: .3s;

		.content-list-item {
			background: #DEEAFA;
			border-bottom: 2rpx solid #B5D4E6;
			height: 80rpx;

			.left {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80rpx;

				.amount {
					padding: 8.5rpx 27rpx;
					background: #FFFFFF;
					border: 2rpx solid #E7E7E7;
					border-radius: 5rpx;
				}
			}

			.center {
				text-align: center;
				line-height: 80rpx;
				color: #353535;
				font-size: 25rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				text {
					color: #3489B7;
				}
			}

			.right {
				text-align: center;
				line-height: 80rpx;
				color: #353535;
				font-size: 25rpx;
			}
		}
	}

	.content-list.active {
		height: 240rpx;
		transition: .3s;
	}

	.bottom {
		background: #FFFFFF;
		height: 202rpx;
		padding: 12rpx 20rpx;
		position: relative;

		.close-bottom {
			height: 100%;
			width: 100%;
			z-index: 1;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;

			.close-mask {
				width: 100%;
				height: 100%;
				background: rgba(78, 108, 145, 0.7);
				font-weight: 500;
				font-size: 40rpx;
				line-height: 202rpx;
				text-align: center;
				color: #FFFFFF;
			}
		}

		.coins {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.coin-item {
				width: 94rpx;
				height: 99rpx;
				text-align: center;
				line-height: 88rpx;
				//font-size: clamp(24rpx, 10vw, 38rpx);
				color: #000000;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center;
				background-image: url('./../../../static/img/liuhe/coin.png');
			}

			.coin-item .num-text {
				user-select: none;
			}

			.coin-item.big .num-text {
				font-size: 18px;
			}

			.coin-item.medium .num-text {
				font-size: 12px;
				transform: scale(0.9);
				display: block;
				text-align: center;
			}

			.coin-item.small .num-text {
				font-size: 12px;
				transform: scale(0.7);
				display: block;
				text-align: center;
				font-weight: bold;
			}

			.coin-item.active {
				background-image: url('./../../../static/img/liuhe/coin-select.png');

			}

			.coin-item:first-child {
				font-size: 38rpx;
			}

			.coin-item:nth-child(2) {
				font-size: 34rpx;
			}

			.coin-item:nth-child(3) {
				font-size: 34rpx;
			}
		}

		.edit {
			position: relative;

			.msg-box {
				background: #FFFFFF;
				width: 580rpx;
				//height: 464rpx;
				border-radius: 10rpx;
				padding: 22rpx 40rpx;

				.header {
					text-align: center;
					font-size: 32rpx;
					line-height: 40rpx;
					letter-spacing: -1px;
					color: #9A9A9A;
					border-bottom: 2rpx solid #E7E7E7;
					position: relative;

					.close {
						position: absolute;
						right: 0;
						top: 0;

						image {
							width: 32rpx;
						}
					}
				}

				.content {
					padding: 22rpx 0;
					font-size: 29rpx;
					line-height: 41rpx;
					letter-spacing: -0.01em;
					color: #333333;
					flex: none;
					order: 0;
					flex-grow: 0;
					text-align: left;

					.dividing-line {
						background-color: #E6E6E6;
						height: 2rpx;
						margin: 30rpx 0 30rpx 0;
					}
				}

				.footer {
					height: 60rpx;

					.btn-group {
						display: flex;
						justify-content: center;
						align-items: center;

						.btn-group-btn {
							width: 200rpx;
							height: 60rpx;
							border-radius: 264rpx;
							color: #FFFFFF;
							text-align: center;
							line-height: 60rpx;
							font-size: 26rpx;
							letter-spacing: -1rpx;
						}

						.cancel {
							background: #8CB2C9;
						}

						.confirm {
							background: #FF9900;
						}
					}

				}
			}

			.btn {
				position: absolute;
				width: 106rpx;
				height: 55rpx;
				left: 59rpx;
				top: 18rpx;
				background: #8CB2C9;
				border-radius: 10rpx;
				font-size: 28rpx;
				line-height: 55rpx;
				text-align: center;
				color: #FFFFFF;
				flex: none;
				order: 0;
				flex-grow: 0;
			}
		}

		.input-text {
			display: flex;
			justify-content: space-around;
			padding: 12rpx 0;

			.times {
				width: 88rpx;
				height: 60rpx;
				background: linear-gradient(180deg, #FEFFFF 0%, #DFEBFA 100%);
				border-radius: 5rpx;
				text-align: center;
				line-height: 60rpx;
				color: #3881A8;
				border: 2rpx solid;
				box-sizing: border-box;
			}

			.text {
				width: 250rpx;
				height: 44rpx;
				background: #FFFFFF;
				border: 1rpx solid #CCDBEE;
				border-radius: 5rpx;
				padding: 8rpx 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				input {
					width: 144rpx;
					font-size: 24rpx;
				}

				.clear {
					background: #B8CFDD;
					border-radius: 5px;
					width: 54rpx;
					height: 44rpx;
					text-align: center;
					line-height: 44rpx;
					color: #F4FFFF;
					font-size: 28rpx;
					margin-left: 46rpx;
				}
			}

			.btn {
				width: 190rpx;
				height: 60rpx;
				background: #3881A8;
				border-radius: 5rpx;
				text-align: center;
				line-height: 60rpx;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}
	}
}
</style>