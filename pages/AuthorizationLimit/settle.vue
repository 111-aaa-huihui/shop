<template>
	<view class="container">
		<topNav title="提前结清" @eventClick="goback" v-if="navshow"></topNav>
		<view class="settle_list">
			<view class="settle_item">
				<text class="time">还款日 {{backday}}</text>
				<view class="right">
					<text>本期剩余应还</text>
					<text class="money">￥{{price}}</text>
				</view>
			</view>
			<view class="settle_item">
				<view class="left">
					<u-icon name="/static/img/icon_ck.png" size="24"></u-icon>
					<view class="tit_wrap">
						<text>还 款</text>
						<text class="subtit">自定义编辑还款金额</text>
					</view>
				</view>
				<view class="right">
					<view>
						<text class="sn">￥</text>
						<text class="price">{{price}}</text>
					</view>
					<view @click="hkShow">
						<u-icon name="/static/img/icon_edit.png" size="32"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="btn_actions">
			<text class="subtit">还款金额：￥{{price}}</text>
			<button type="default" class="btn_primary" :disabled="disabled" @click="payshow = true">确认还款</button>
		</view>
		<PriceModal :modshow="show" title="请输入您要还款的金额" :price="price" @confirm="confirm" @cancel="cancel"></PriceModal>
		<v-pay :popupShow="payshow" :totalShow="false" :tabIndexs="2" @eventClick="eventClick" @close="close"></v-pay>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	import PriceModal from '@/components/PriceModal.vue'
	import Pay from '@/components/pay.vue'
	export default{
		components: {
			topNav,
			PriceModal,
			"v-pay":Pay
		},
		data(){
			return {
				navshow:false,
				show:false,
				backday:"",
				price:"0",
				disabled:false,
				payshow:false
			}
		},
		methods: {
			goback() {
				uni.navigateTo({
					url: '/pages/AuthorizationLimit/AuthorizationLimit'
				})
			},
			hkShow(){
				this.show = true;
			},
			confirm(val){
				this.show = false;
				this.price = val;
			},
			eventClick(val){
				this.payshow = false;
				this.$api.http.payearly(val,this.price,"2").then((res)=>{
					if(val=="ali"){
						const div = document.createElement('div');
						div.innerHTML = res;
						document.body.appendChild(div);
						document.forms[0].submit();
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			close(){
				this.payshow = false;
			},
			cancel(){
				this.show = false;
			}
		},
		onLoad(){
			this.backday = uni.getStorageSync("backday");
			this.price = uni.getStorageSync("backprice");
		}
	}
</script>

<style lang="scss">
	.settle_list{
		padding:16rpx 24rpx;
		.settle_item{
			background:#fff;
			border-radius: 20rpx;
			padding:20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom:16rpx;
			.time{
				font-size:20rpx;
				color: #FF9D00;
			}
			.right{
				font-size: 20rpx;
				color:#707070;
				display: flex;
				align-items: center;
				.money{
					margin-left:30rpx;
					color:#141313;
				}
				.sn{
					font-size:24rpx;
					color:#141313;
				}
				.price{
					font-size: 34rpx;
					color:#141313;
					margin-right:24rpx;
				}
			}
			.left{
				display: flex;
				.tit_wrap{
					margin-left:20rpx;
					font-size:24rpx;
					color:#141313;
					display: flex;
					flex-direction: column;
					.subtit{
						font-size:20rpx;
						color: #707070;
					}
				}
			}
		}
	}
	.btn_actions{
		position:fixed;
		left: 0;
		bottom:0;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background:#fff;
		box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
		width:100%;
		height:100rpx;
		.subtit{
			font-size: 24rpx;
			color:#141313;
			margin-left:60rpx;
			flex:1;
		}
		.btn_primary{
			width:252rpx;
			height:100rpx;
			line-height: 100rpx;
			font-size: 28rpx;
			color:#fff;
			background:#ff9d00;
			text-align: center;
			border-radius: 0;
		}
	}
	
	
</style>
