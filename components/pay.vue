<template>
	<view>
		<u-popup class="paypopup" v-model="show" mode="bottom" :closeable="true" close-icon-pos="top-left" border-radius="40" @close="close">
			<view class="popupcon">
				<view class="price" v-if="totalShow">￥{{totals}}</view>
				<view class="paytit">选择支付方式</view>
				<view class="typebox">
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in typelist" :key="index" @click="tab(index,item.type)" v-if="tabIndexs==3">
						<u-icon :name="item.icon" size="38"></u-icon>
						<text class="label">{{item.title}}</text>
						<view class="icon"></view>
					</view>
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in typelists" :key="index" @click="tab(index,item.type)" v-if="tabIndexs==2">
						<u-icon :name="item.icon" size="38"></u-icon>
						<text class="label">{{item.title}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<u-gap height="120"></u-gap>
				<u-button :ripple="true" class="btn_primary" @click="eventClick">立即支付</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				id:0,
				show:false,
				cur:0,
				typelist:[
					{
						title:"微信支付",
						icon:"/static/img/icon_wechat.png",
						type:"wechat"
					},
					{
						title:"支付宝支付",
						icon:"/static/img/icon_alipay.png",
						type:"ali"
					},
					{
						title:"余额支付",
						icon:"/static/img/icon_kf.png",
						type:"balance"
					}
				],
				typelists:[
					{
						title:"微信支付",
						icon:"/static/img/icon_wechat.png",
						type:"wechat"
					},
					{
						title:"支付宝支付",
						icon:"/static/img/icon_alipay.png",
						type:"ali"
					}
				],
				payway:"wechat"
			}
		},
		watch:{
			popupShow(val){
				this.show = val;
			},
			orderid(val){
				this.id = val;
			}
		},
		props:{
			popupShow:{
				type:Boolean,
				default:false
			},
			totals:{
				type:String,
				default:"0"
			},
			orderid:{
				type:Number,
				default:0
			},
			totalShow:{
				type:Boolean,
				default:true
			},
			tabIndexs:{
				type:Number,
				default:3
			}
		},
		methods:{
			//支付类型切换
			tab(index,type){
				this.cur = index;
				this.payway = type;
			},
			eventClick(){
				if(this.totalShow==false){
					this.$emit('eventClick',this.payway);
					this.cur = 0;
					return false;
				}
				this.$emit('close');
				switch(this.payway){
					case "ali":
						this.alipay();
					break;
					case "wechat":
						this.wepay();
					break;
					default:
						this.moneypay();
					break;
				}
				this.cur = 0;
			},
			alipay(){
				this.$api.http.payOrder(this.id,this.payway).then((res)=>{
					if(res.code==401){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}else{
						const div = document.createElement('div');
						/* 此处form就是后台返回接收到的数据 */
						div.innerHTML = res;
						document.body.appendChild(div);
						document.forms[0].submit();
					}
				})
			},
			wepay(){
				this.$api.http.payOrder(this.id,this.payway).then((res)=>{
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
								  window.location.href = window.location.origin+"/#/pages/index/index";
								},
								fail: (res)=> {
								  console.log('支付失败')
								  window.location.href = window.location.origin+"/#/pages/index/index";
								},
								complete: (res)=> {
								  console.log(res, 'complete')
								}
							})
						})
					}
				})
			},
			moneypay(){
				this.$api.http.payOrder(this.id,this.payway).then((res)=>{
					if(res.code == 200){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			close(){
				this.$emit('close');
				this.cur = 0;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paypopup{
		/deep/.u-close--top-left{
			left:60rpx;
		}
		.popupcon{
			padding-left: 60rpx;
			.price{
				text-align: center;
				font-size: 27rpx;
				color:#FD4E1F;
				font-weight: bold;
				padding-top:65rpx;
				padding-bottom: 15rpx;
				border-bottom: 2rpx solid #e5e5e5;
			}
			.paytit{
				padding:15rpx 0 28rpx;
				font-size: 31rpx;
				color:#141313;
				text-align: center;
				font-weight: bold;
			}
			.typebox{
				display: flex;
				flex-direction: column;
				position: relative;
				padding-bottom: 38rpx;
				.item{
					display: flex;
					align-items: center;
					padding:21rpx 56rpx 21rpx 0;
					.label{
						flex:1;
						margin-left: 18rpx;
						font-size: 27rpx;
						color:#141313;
					}
					.icon{
						width: 33rpx;
						height: 33rpx;
					}
					&.active{
						.icon{
							background: url(/static/img/icon_checked.png) no-repeat;
							background-size: 100% 100%;
						}
					}
				}
			}
			.coupons{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding:23rpx 56rpx 50rpx 0;
				.label{
					font-size: 22rpx;
					color:#FF1E10;
					font-weight: bold;
				}
				.right{
					font-size: 22rpx;
					color:#ABABAB;
					font-weight: bold;
				}
			}
			.btn_primary{
				position: fixed;
				bottom:0;
				left:0;
				right: 0;
				z-index: 20;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 22rpx;
				color:#ffffff;
				text-align: center;
				background: #FF9D00;
				border-radius: 0;
			}
		}
	}
</style>
