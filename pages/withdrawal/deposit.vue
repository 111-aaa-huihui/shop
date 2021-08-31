<template>
	<view class="container">
		<topNav title="提现" @eventClick="goback" v-if="navshow"></topNav>
		<view class="txtypelist">
			<view class="typeitem" :class="{active:index==1}" @click="tab(1)" v-if="othershow">
				<view class="icon_empty"></view>
				<u-icon name="checkmark-circle-fill" size="26" color="#FF9D00" class="icon"></u-icon>
				<view class="typebox">
					<image src="/static/img/icon_wechat.png" mode="aspectFit" style="width: 48rpx;height:48rpx"></image>
					<text class="name">提现至微信</text>
					<view class="bind" v-if="bindShow" @click="bindwx">绑定微信</view>
					<view class="bind binds" v-else>
						<text>JAYJONE</text>
						<image src="" mode="aspectFit" style="width: 48rpx;height: 48rpx;margin-left:20rpx;"></image>
					</view>
				</view>
			</view>
			<view class="typeitem" :class="{active:index==2}" @click="tab(2)" v-if="othershow">
				<view class="icon_empty"></view>
				<u-icon name="checkmark-circle-fill" size="26" color="#FF9D00" class="icon"></u-icon>
				<view class="typebox">
					<image src="/static/img/icon_alipay.png" mode="aspectFit" style="width: 48rpx;height:48rpx"></image>
					<text class="name">提现至支付宝</text>
					<view class="bind" v-if="bindShow" @click="bindzfb">绑定支付宝</view>
					<view class="bind binds" v-else>
						<text>15050525363</text>
					</view>
				</view>
			</view>
			<view class="typeitem" :class="{active:index==3}" @click="tab(3)">
				<view class="icon_empty"></view>
				<u-icon name="checkmark-circle-fill" size="26" color="#FF9D00" class="icon"></u-icon>
				<view class="typebox">
					<image src="/static/img/icon_card.png" mode="aspectFit" style="width: 48rpx;height:48rpx"></image>
					<text class="name">提现至银行卡</text>
					<view class="bind" @click="addcard" v-if="bindbShow">
						<u-icon name="plus" size="22" color="#B1B1B1"></u-icon>
						<text class="text">添加银行卡</text>
					</view>
					<view class="bind binds" v-for="(item,index) in nbanklist" :key="index" @click="selectCard" v-else>
						<image :src="item.bankImg" mode="aspectFit" style="width: 24rpx;height: 24rpx;margin-right:10rpx;"></image>
						<text>{{item.bankNames}}</text>
						<u-icon name="arrow-right" size="20" color="#B1B1B1" style="margin-left:12rpx;"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="mountbox">
			<text class="title">提现金额</text>
			<view class="price_wrap">
				<text class="sn">￥</text>
				<input type="number" class="input" value="" v-model="money" @input="onInput"></input>
			</view>
			<view class="tip">
				<text>当前余额{{ymoney}}元，</text>
				<view class="light" @click="alltx">全部提现</view>
			</view>
			<view class="btnbox">
				<button type="default" class="btn_primary" v-if="money==0 || money==''">提现</button>
				<button type="default" class="btn_primary active" @click="onSubmit" v-else>提现</button>
			</view>
		</view>
		<u-popup class="popup_card" v-model="cardShow" mode="bottom" height="674rpx" border-radius="24" :closeable="true" close-icon-pos="top-left" close-icon-color="#333030">
			<view class="title">选择银行卡</view>
			<u-gap height="50"></u-gap>
			<view class="list">
				<view class="item" :class="{on:cardcur==index}" v-for="(item,index) in banklist" :key="index" @click="tabs(index,item)">
					<view class="icon">
						<image :src="item.bankImg" mode="aspectFit" style="width: 50rpx;height:50rpx;"></image>
					</view>
					<view class="iptbox">
						<text class="text">{{item.bankName}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<view class="item">
					<view class="icon">
						<image src="/static/img/icon_card.png" mode="aspectFit" style="width: 40rpx;height:40rpx;"></image>
					</view>
					<view class="iptbox" @click="newcard">
						<text class="text">使用新卡提现</text>
						<u-icon name="arrow-right" size="26" color="#B1B1B1" class="icon"></u-icon>
					</view>
				</view>
			</view>
			<button type="default" class="btn_primary" @click="onSub">确定</button>
		</u-popup>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	import topNav from '@/components/topnav.vue'
	import bankApi from '@/common/bankcardinfo'
	export default{
		components: {
			topNav
		},
		data(){
			return {
				othershow:false,
				navshow:false,
				index:3,
				cardShow:false,
				bindShow:true,
				bindbShow:true,
				money:"",
				ymoney:0,
				banklist:[],
				nbanklist:[],
				bankcode:"",
				bankid:0,
				cardcur:0
			}
		},
		computed: {
		    ...mapGetters(['userInfo'])
		},
		methods: {
			...mapMutations(['logout']),
			goback() {
				uni.navigateTo({
					url:"/pages/withdrawal/withdrawal"
				})
			},
			tab(index){
				this.index = index;
			},
			tabs(index,data){
				this.cardcur = index;
				this.nbanklist = [data];
				this.bankid = data.id;
			},
			addcard(){
				this.index = 3;
				uni.navigateTo({
					url:"/pages/withdrawal/addcard"
				})
			},
			selectCard(){
				this.cardShow = true;
			},
			onSub(){
				this.cardShow = false;
			},
			bindwx(){
				this.logout();
				setTimeout(()=>{
					uni.navigateTo({
						url:"/pages/login/login"
					})
				}, 1000);
			},
			bindzfb(){
				this.logout();
				setTimeout(()=>{
					uni.navigateTo({
						url:"/pages/login/login"
					})
				}, 1000);
			},
			//监测金额
			onInput(e){
				if(parseFloat(e.detail.value)>parseFloat(this.ymoney)){
					this.money = "";
				}
			},
			onSubmit(){
				this.$api.http.withdraw(this.money,this.bankid).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
						uni.navigateBack();
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			//获取银行卡
			getbanklist(){
				this.$api.http.banklist().then((res)=>{
					if(res.code==200){
						if(res.data.length>0){
							this.bindbShow = false;
							this.getbankName(res.data);
						}else{
							this.bindbShow = true;
						}
					}
				})
			},
			getbankName(datas){
				let data = datas.filter(item=>{
					let num = item.bank_number;
					bankApi.getBankBin(num).then((data)=> {
						item.bankCode = data.bankCode;
						item.bankName = data.bankName+data.cardTypeName+"("+num.slice(num.length-4)+")";
						item.bankNames = data.bankName+"("+num.slice(num.length-4)+")";
						item.bankImg = "https://apimg.alipay.com/combo.png?d=cashier&t="+data.bankCode+"_s";
					}).catch(function (err) {
						console.log(err)
					})
					return item;
				})
				setTimeout(()=>{
					this.banklist = data;
					this.nbanklist = data.slice(0,1);
					this.bankid = data[0].id;
				},1000)
			},
			newcard(){
				this.cardShow = false;
				uni.navigateTo({
					url:"/pages/withdrawal/addcard"
				})
			},
			alltx(){
				if(parseFloat(this.ymoney)>0){
					this.money = this.ymoney;
				}
			}
		},
		onShow(){
			this.ymoney = this.userInfo.balance!=undefined?parseFloat(this.userInfo.balance).toFixed(2):0;
			this.getbanklist();
		}
	}
</script>

<style lang="scss" scoped>
	.container{height: 100%;}
	.txtypelist{
		padding:30rpx 50rpx;
		.typeitem{
			margin-bottom: 22rpx;
			display: flex;
			align-items: center;
			.icon_empty{
				width:26rpx;
				height: 26rpx;
			}
			.icon{
				display: none;
			}
			.typebox{
				margin-left:24rpx;
				flex:1;
				height: 126rpx;
				background: #ffffff;
				border-radius: 46rpx;
				padding-left:32rpx;
				padding-right: 40rpx;
				display: flex;
				align-items: center;
				.name{
					margin-left:20rpx;
					font-size: 24rpx;
					color:#141313;
					flex:1;
				}
				.bind{
					font-size: 24rpx;
					color:#B1B1B1;
					text-align: right;
					display: flex;
					align-items: center;
					.text{
						margin-left:22rpx;
					}
					&.binds{
						color:#141313;
					}
				}
			}
			&.active{
				.icon_empty{display: none;}
				.icon{display: block;}
			}
		}
	}
	.mountbox{
		background:#ffffff;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding:48rpx 54rpx 0;
		max-height: 56%;
		height:calc(100vh - 586rpx);
		position: fixed;
		bottom:0;
		left:0;
		z-index: 50;
		.title{
			font-size: 24rpx;
			color:#141313;
		}
		.price_wrap{
			padding: 20rpx 0;
			border-bottom: 2rpx solid #f6f6f6;
			font-size: 64rpx;
			color:#141313;
			display: flex;
			.input{
				font-size: 64rpx;
				color:#141313;
				flex:1;
				height: 90rpx;
				line-height: 90rpx;
			}
		}
		.tip{
			padding:24rpx 0;
			font-size: 24rpx;
			color:#B1B1B1;
			display: flex;
			.light{
				color:#FF9D00;
			}
		}
		.btnbox{
			position: absolute;
			bottom:160rpx;
			left:0;
			width:100%;
			.btn_primary{
				margin:0 114rpx;
				height:92rpx;
				line-height:92rpx;
				border-radius: 46rpx;
				font-size: 28rpx;
				color:#707070;
				background:#F6F6F6;
				&.active{
					background:#ff9d00;
					color:#ffffff;
				}
			}
		}
	}
	.popup_card{
		.title{
			text-align: center;
			font-size: 34rpx;
			color: #141313;
			font-weight: bold;
			padding:20rpx 0;
			position: fixed;
			top:0;
			left:80rpx;
			z-index: 20;
			width: 80%;
		}
		.list{
			padding:60rpx 0 60rpx 36rpx;
			.item{
				display: flex;
				align-items: center;
				.icon{
					display: flex;
					align-items: center;
					width: 50rpx;
					height: 50rpx;
				}
				.iptbox{
					padding:40rpx 56rpx 40rpx 0;
					margin-left:32rpx;
					border-bottom:2rpx #d4d4d4 solid;
					display: flex;
					align-items: center;
					flex:1;
					.text{
						font-size: 30rpx;
						color: #141313;
						flex:1;
					}
					.icon{
						width:42rpx;
						height: 42rpx;
					}
				}
				&.on{
					.iptbox{
						.icon{
							width:42rpx;
							height: 42rpx;
							background:url(/static/img/icon_checked.png) no-repeat;
							background-size: 100%;
						}
					}
				}
			}
		}
		.btn_primary{
			width: 416rpx;
			height: 92rpx;
			line-height: 92rpx;
			margin:0 auto;
			padding-bottom:90rpx;
			text-align: center;
			font-size: 28rpx;
			color:#FFFFFF;
			background: #FF9D00;
			border-radius: 46rpx;
		}
	}
</style>
