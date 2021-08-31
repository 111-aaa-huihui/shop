<template>
	<view class="container">
		<view class="order_hd">
			<view class="shopbox">
				<view class="box" v-for="(item,index) in list.product_arr" :key="index" v-if="buyshow">
					<view class="imgwrap">
						<image :src="item.images" mode="aspectFill"></image>
					</view>
					<view class="info">
						<text class="title">{{item.title}}</text>
						<view class="price">￥<text class="bold">{{item.total_price}}</text></view>
						<text class="num">×{{item.buy_number}}</text>
					</view>
				</view>
				<view class="box" v-for="(item,index) in list" :key="index" v-if="goshow">
					<view class="imgwrap" v-for="(items,index) in item.pic_arr" :key="index" v-if="index==0">
						<image :src="items.domain+items.path.substr(1)" mode="aspectFill"></image>
					</view>
					<view class="info">
						<text class="title">{{item.product_info.title}}</text>
						<view class="price">￥<text class="bold">{{item.sku_info.price}}</text></view>
						<text class="num">×{{item.stock}}</text>
					</view>
				</view>
			</view>
			<view class="address_box obox">
				<view class="title">收件信息</view>
				<view class="address_info">
					<button type="default" class="btn_primary" v-if="addresslist.length==0" @click="goAddress">新建收件人信息</button>
					<view class="itop" v-for="(item,index) in addresslist" :key="index" @click="goAddress" v-else>
						<view class="left">
							<view class="text">
								<text>收货人：{{item.name}}</text>
								<text class="phone">联系方式：{{item.number}}</text>
							</view>
							<view class="text">收货地址：{{item.province}}{{item.city}}{{item.area}}{{item.address}}</view>
						</view>
						<u-icon name="arrow-right" size="22" color="#FF9D00"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<u-gap height="80"></u-gap>
		<view class="btn_actions">
			<view class="total">
				<text>合计</text>
				<text class="price">￥{{totals}}</text>
			</view>
			<button type="default" class="btn_primary" @click="onSubmit">提交订单</button>
		</view>
		<u-popup class="paypopup" v-model="payshow" mode="bottom" :closeable="true" close-icon-pos="top-left" border-radius="40">
			<view class="popupcon">
				<view class="price">￥{{totals}}</view>
				<view class="paytit">选择支付方式</view>
				<view class="typebox">
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in typelist" :key="index" @click="tab(index,item.type)">
						<u-icon :name="item.icon" size="38"></u-icon>
						<text class="label">{{item.title}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<u-gap height="120"></u-gap>
				<u-button :ripple="true" class="btn_primary" @click="pay">立即支付</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[],
				addresslist:[],
				totals:0,
				remark:"",
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
						icon:"/static/img/icon_money.png",
						type:"balance"
					}
				],
				cur:0, //支付类型选中判断
				orderid:0, //订单id
				payway:"wechat", //支付类型balance 余额 wechat 微信 ali 支付宝
				payshow:false, //支付弹框
				isOrder:false,
				goshow:false,
				buyshow:false,
				cartarr:""
			}
		},
		computed:{
			total(){
				let totals = 0;
				this.list.forEach((item) => {
					totals += parseFloat(item.sku_info.price);
				})
				return totals==0?0:totals.toFixed(2);
			}
		},
		methods:{
			//获取地址
			getAddress(){
				this.$api.http.addresslist().then((res)=>{
					if(res.code==200){
						let list = res.data;
						let newData = list.filter(item => item.is_default == 1);
						this.addresslist = newData;
					}
				})
			},
			//跳转地址页
			goAddress(){
				uni.navigateTo({
					url:"/pages/address/index"
				})
			},
			//提交订单
			onSubmit(){
				let ids = [];
				let aid = 0;
				const isbuy = uni.getStorageSync('isbuy');
				if(isbuy=="1"){
					ids = this.cartarr;
				}else{
					if(this.list.length>0){
						let glist = [];
						this.list.map((item)=>{
							glist.push(item.cart_id)
						})
						ids = glist.join(",");
					}
				}
				if(this.addresslist.length>0){
					aid = this.addresslist[0].address_id;
				}
				if(aid==0){
					uni.showToast({
						title:"请填写收货地址"
					})
					return false;
				}
				if(this.isOrder == false){
					this.$api.http.postOrder(ids,aid,this.remark).then((res)=>{
						if(res.code==200){
							this.orderid = res.data.order_id;
							let ordernum = res.data.order_no;
							this.isOrder = true;
							this.payshow = true;
						}else{
							uni.showToast({
								title:res.message,
								icon:"none"
							})
						}
					})
				}else{
					this.payshow = true;
				}
			},
			//支付类型切换
			tab(index,type){
				this.cur = index;
				this.payway = type;
			},
			//支付
			pay(){
				this.$api.http.payOrder(this.orderid,this.payway).then((res)=>{
					uni.removeStorageSync("cartlist");
					uni.removeStorageSync("address");
					if(res.code==401){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}else{
						if(this.payway == "ali"){
							const div = document.createElement('div');
							div.innerHTML = res.message;
							document.body.appendChild(div);
							document.forms[0].submit();
						}else if(this.payway == "wechat"){
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
									  window.location.href = window.location.origin+"/#/pages/order/order?type=2";
									},
									fail: (res)=> {
									  console.log('支付失败')
									  window.location.href = window.location.origin+"/#/pages/order/order";
									},
									complete: (res)=> {
									  console.log(res, 'complete')
									}
								})
							})
						}else{
							uni.showToast({
								title:"支付成功",
								icon:"none"
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:"/pages/order/order?type=2"
								})
							},800);
						}
					}
				})
			}
		},
		onShow(){
			const isbuy = uni.getStorageSync('isbuy');
			const values = uni.getStorageSync('blist');
			if(isbuy=="1"){
				if (values) {
					this.buyshow = true;
					this.list = JSON.parse(values.data);
					let totals = 0;
					this.list.product_arr.forEach((item) => {
						totals += parseFloat(item.total_price);
					})
					totals==0?0:parseFloat(totals).toFixed(2);
					this.totals = totals;
					this.cartarr = values.cartarr;
				}else{
					uni.navigateBack();
				}
			}else{
				this.goshow = true;
				const value = uni.getStorageSync('cartlist');
				if (value) {
					this.list = JSON.parse(value.data);
					this.totals = parseFloat(value.total).toFixed(2);
				}else{
					uni.navigateBack();
				}
			}
			let address = uni.getStorageSync("address");
			if(address){
				this.addresslist = JSON.parse(address);
			}else{
				this.getAddress();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding:18rpx 24rpx;
	}
	.order_hd{
		position: relative;
		.shopbox{
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			padding: 0 53rpx 0 31rpx;
			.box{
				display: flex;
				padding:31rpx 0;
				border-bottom: 2rpx #eeeeee solid;
				.imgwrap{
					width:132rpx;
					height: 132rpx;
					flex-shrink: 0;
					background: #eeeeee;
					border-radius: 18rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.info{
					margin-left: 29rpx;
					flex:1;
					display: flex;
					flex-direction: column;
					.title{
						height: 67rpx;
						font-size: 22rpx;
						color:#000000;
						margin-bottom: 4rpx;
					}
					.price{
						font-size: 22rpx;
						color:#FD4E1F;
						.bold{
							font-weight: bold;
						}
					}
					.num{
						font-size: 18rpx;
						color:#707070;
						margin-top:7rpx;
					}
				}
				&:last-child{
					border-bottom: 0;
				}
			}
		}
	}
	.address_box{
		// background: #ffffff;
		// border-radius: 18rpx;
		// box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
		background: url(../../static/img/addressbg.png) no-repeat;
		background-size: 100% 100%;
		margin-top: 22rpx;
		padding:27rpx 0 45rpx;
		height: 214rpx;
		.address_info{
			margin:30rpx 58rpx 0;
			.itop{
				display: flex;
				align-items: center;
				.left{
					flex:1;
					font-size: 22rpx;
					color:#000000;
					.text{
						margin-bottom: 13rpx;
						.phone{
							margin-left: 54rpx;
						}
					}
				}
			}
			.btn_primary{
				height: 62rpx;
				line-height: 62rpx;
				font-size: 22rpx;
				color:#ffffff;
				background: #FF9D00;
				border-radius: 18rpx;
			}
		}
	}
	.obox{
		.title{
			font-size: 25rpx;
			color:#000000;
			font-weight: bold;
			padding-left: 36rpx;
			position: relative;
			&::after{
				content:"";
				width: 9rpx;
				height: 31rpx;
				opacity: 1;
				background: #FF9D00;
				position: absolute;
				top:0;
				left:4rpx;
			}
		}
	}
	.btn_actions{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 80rpx;
		background: #ffffff;
		box-shadow: 0rpx -2rpx 4rpx 0rpx rgba(0,0,0,0.16); 
		z-index: 50;
		display: flex;
		align-items: center;
		.total{
			flex:1;
			font-size: 18rpx;
			color:#000000;
			padding-left: 49rpx;
			.price{
				font-size: 22rpx;
				color:#FD4E1F;
				font-weight: bold;
				margin-left: 9rpx;
			}
		}
		.btn_primary{
			width: 505rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 22rpx;
			color:#ffffff;
			background: #FF9D00;
			border-radius: 0;
		}
	}
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
