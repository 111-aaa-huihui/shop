<template>
	<view class="container">
		<topNav title="交纳押金" @eventClick="gobacks" v-if="navshow"></topNav>
		<view class="payinfo">
			<view class="paytit" v-if="price">
				<text>交{{price}}元押金</text>
				<text class="subtit">随时可退</text>
			</view>
			<view class="zftit">支付方式</view>
			<view class="zftype_list">
				<view class="zftype_item" :class="{active:cur==index}" v-for="(item,index) in typelist" :key="index" @click="tab(index,item.type)">
					<u-icon :name="item.icon" class="icon" size="50"></u-icon>
					<text class="name">{{item.name}}</text>
					<text class="icon_check"></text>
				</view>
			</view>
		</view>
		<view class="action_section">
			<view class="total">
				合计：<text class="price">￥{{price}}</text>
			</view>
			<button type="default" class="btn_primary" @click="applyMoney">立即支付</button>
		</view>
		<u-modal v-model="show">
			<view class="slot_content">
				<vue-qr :size="150" :text="ewmsrc" />
				<text class="text">请联系客服进行支付</text>
			</view>
		</u-modal>
		<u-modal v-model="kfshow">
			<view class="slot_content">
				<view>客服微信号：<text class="light">{{wxin}}</text></view>
				<text class="text">请联系客服进行支付</text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue';
	import VueQr from 'vue-qr';
	export default{
		components: {
			topNav,
			VueQr
		},
		data(){
			return {
				navshow:false,
				cur:0, //支付方式选择
				typelist:[
					{
						icon:"/static/img/icon_alipay.png",
						name:"支付宝支付",
						type:"ali"
					},
					{
						icon:"/static/img/icon_wechat.png",
						name:"微信支付",
						type:"wechat"
					},
					{
						icon:"/static/img/icon_kf.png",
						name:"联系客服辅助支付",
						type:"kf"
					}
				],
				payway:"ali",  //balance|余额 ali|支付宝 wechat|微信
				vipid:0,
				show:false,
				ewmsrc:"",
				kfshow:false,
				wxin:"",
				price:""
			}
		},
		methods: {
			gobacks() {
				uni.switchTab({
					url: '/pages/SignContract/SignContract'
				})
			},
			tab(index,type){
				this.cur = index;
				this.payway = type;
			},
			//支付
			pay(){
				if(this.payway=="ali"){
					var ua = window.navigator.userAgent.toLowerCase();
					if (ua.match(/AlipayClient/i) == "alipayclient") {
						this.$api.http.vipPay(this.vipid,this.payway).then((res)=>{
							ap.tradePay({
							    orderStr:res
							},function(res){
							    console.log(res.resultCode);
								setTimeout(()=>{
									uni.navigateBack();
								},1000);
							});
						})
					}else{
						this.show = true;
						this.ewmsrc = window.location.href;
					}
					return false;
				}
				if(this.payway=="wechat"){
					this.$api.http.vipPay(this.vipid,this.payway).then((res)=>{
						if(res.code==401){
							uni.showToast({
								title:res.message,
								icon:"none"
							})
						}else{
							let config = res.data;
							jWeixin.config({
								debug: false,
								appId: config.appId, // 必填，公众号的唯一标识  
								timestamp: config.timeStamp.toString(), // 必填，生成签名的时间戳  
								nonceStr: config.nonceStr, // 必填，生成签名的随机串  
								signature: config.paySign, // 必填，签名
								jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
							});
							jWeixin.ready(() => {
								jWeixin.chooseWXPay({
									timestamp: config.timeStamp.toString(), 
									nonceStr: config.nonceStr, 
									package: config.package,
									signType: config.signType,
									paySign: config.paySign,
									success: (res)=> {
									  // 支付成功后的回调函数
									  window.location.href = window.location.origin+"/#/pages/SignContract/SignContract";
									},
									fail: (res)=> {
									  console.log('支付失败')
									  window.location.href = window.location.origin+"/#/pages/SignContract/SignContract";
									},
									complete: (res)=> {
									  console.log(res, 'complete')
									}
								})
							})
						}
					})
					return false;
				}
				if(this.payway=="kf"){
					this.$api.http.vipPay(this.vipid,"").then((res)=>{
						this.kfshow = true;
					})
				}
			},
			//押金申请
			applyMoney(){
				this.$api.http.applyMoney().then((res)=>{
					if(res.code == 200){
						this.vipid = res.data.vip_apply_id;
						this.pay();
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			}
		},
		onLoad(){
			this.$api.http.webconfig().then((res)=>{
				if(res.code==200){
					this.price = res.data.vip_money;
					this.wxin = res.data.wechat_account;
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.payinfo{
		padding:40rpx 52rpx;
		.paytit{
			display: flex;
			flex-direction: column;
			justify-content: center;
			height:196rpx;
			font-size: 40rpx;
			color:#FF9D00;
			background:#fff;
			padding-left:52rpx;
			position: relative;
			background:url(../../static/img/paybg.png) no-repeat;
			background-size:100%;
			.subtit{
				font-size: 24rpx;
				color:#707070;
				margin-top:10rpx;
			}
			&::after{
				content:"";
				position: absolute;
				top:48rpx;
				left:0;
				width: 8rpx;
				height: 100rpx;
				background: #ff9d00;
			}
		}
		.zftit{
			display: inline-block;
			font-size: 30rpx;
			color:#141313;
			font-weight: bold;
			margin-top:50rpx;
			margin-bottom:40rpx;
			border-bottom: #FFCE7F 4rpx solid;
		}
		.zftype_list{
			.zftype_item{
				display: flex;
				align-items: center;
				height: 100rpx;
				background: #ffffff;
				border-radius: 20rpx;
				margin-bottom:20rpx;
				padding-left:36rpx;
				padding-right: 44rpx;
				.icon{
					margin-right:24rpx;
				}
				.name{
					font-size: 24rpx;
					color:#707070;
					flex:1;
				}
				.icon_check{
					display: none;
					width:24rpx;
					height:24rpx;
					background:#fff;
					border:4rpx #ff9d00 solid;
					border-radius: 50%;
				}
				&.active{
					.icon_check{
						display: block;
					}
				}
			}
		}
	}
	.action_section{
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
		padding:0 50rpx;
		.total{
			font-size: 20rpx;
			color:#B1B1B1;
			flex:1;
			.price{
				font-size: 28rpx;
				color:#FF9D00;
			}
		}
		.btn_primary{
			width: 426rpx;
			height: 60rpx;
			background: #ff9d00;
			border-radius: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			color:#ffffff;
		}
	}
	.slot_content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 28rpx;
		color: #000000;
		padding:40rpx 0;
		.img{
			width:300rpx;
			height:300rpx;
		}
		.text{
			margin-top:20rpx;
		}
		.light{
			font-size: 32rpx;
			color:#ff9d00;
		}
	}
</style>
