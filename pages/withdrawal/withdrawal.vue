<template>
	<view class="container">
		<view class="topbg">
			<!-- <view class="head">
				<view class="nav" @click="goback">
					<u-icon name="arrow-left" color="#ffffff" size="28" class="icon"></u-icon>
				</view>
				<view class="title">提现</view>
			</view> -->
			<u-navbar back-text="提现" back-icon-color="#FFFFFF" :back-text-style="{color:'#FFFFFF'}" :border-bottom="false" :background="background"></u-navbar>
			<view class="price_con">
				<view class="left">
					<view class="title_wrap">现金奖励<text class="price">{{totalPrice}}</text>元</view>
					<!-- <text>今日可提现{{totalPrice}}元</text> -->
				</view>
				<view class="right">
					<button type="default" class="btn_primary" @click="deposit">提现</button>
					<button type="default" class="btn_default">提现记录</button>
				</view>
			</view>
		</view>
		<view class="withdrawal_con" v-if="list.length>0">
			<view class="hd">现金奖励账单</view>
			<view class="bd">
				<view class="time"></view>
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="icon icon_yq"></view>
					<view class="left">
						<text class="title">通过微信邀请</text>
						<text class="desc">{{item.create_at}}</text>
					</view>
					<view class="right">
						<text class="number">+{{item.money}}元</text>
					</view>
				</view>
			</view>
			<loadMore :status="status" :show="loadShow"></loadMore>
		</view>
	</view>
</template>

<script>
	import loadMore from '@/components/loadmore.vue'
	export default{
		components: {
			loadMore
		},
		data(){
			return {
				background: {
					background: 'url(/static/img/txbg.png) no-repeat',
					backgroundSize: 'cover',
					// 渐变色
					// backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				},
				totalPrice:0,
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false
			}
		},
		methods:{
			goback(){
				uni.navigateBack();
			},
			deposit(){
				if(this.totalPrice==0){
					uni.showToast({
						title:"金额为0，无法提现",
						icon:"none"
					})
					return false;
				}
				uni.navigateTo({
					url:"/pages/withdrawal/deposit"
				})
			},
			async loadData(){
				await this.$api.http.getinvitelog(this.page,this.limit).then((res)=>{
					if(res.code == 200){
						// this.totalPrice = res.data.total;
						this.totalPrice = res.data.able;
						let odata = res.data.list.data;
						this.list = this.list.concat(odata);
						this.total = res.data.list.total;
						if(odata.length<this.total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(odata.length == 0) {
							this.status = 'nomore';
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		},
		onLoad(){
			this.loadData();
		},
		onShow(){
			document.title = '批发商城';
		},
		//上拉加载
		onReachBottom(){
			if (this.status == 'nomore'){
				return;
			}
			this.loadShow = true;
			this.status = 'loading';
			this.page ++;
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh(){
			uni.stopPullDownRefresh();
			this.list = [];
			this.page = 1;
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.topbg{
		background: url(/static/img/txbg.png) no-repeat;
		background-size: 100% 100%;
		width:100%;
		height: 290rpx;
		.head{
			position: fixed;
			top:0;
			left:0;
			z-index: 50;
			width: 100%;
			display: flex;
			align-items: center;
			padding:20rpx 40rpx;
			.nav{
				display: flex;
			}
			.title{
				margin-left:20rpx;
				font-size: 36rpx;
				color:#ffffff;
				flex:1;
			}
		}
		.price_con{
			display: flex;
			justify-content: space-between;
			padding:0 42rpx 0 64rpx;
			.left{
				font-size: 20rpx;
				color:#FFFFFF;
				.title_wrap{
					.price{
						font-size: 60rpx;
						padding:0 16rpx;
					}
				}
			}
			.right{
				display: flex;
				flex-direction: column;
				.btn_primary{
					width:190rpx;
					height:58rpx;
					line-height: 58rpx;
					border-radius: 30rpx;
					border:0;
					text-align: center;
					font-size: 24rpx;
					color:#FF7700;
					background:#ffd36f;
					padding-left:0;
					padding-right: 0;
					&::after{
						border:0;
					}
				}
				.btn_default{
					padding-left:0;
					padding-right: 0;
					margin-top:10rpx;
					width:190rpx;
					height:58rpx;
					line-height: 54rpx;
					border:4rpx #ffffff solid;
					background:transparent;
					border-radius: 30rpx;
					text-align: center;
					font-size: 24rpx;
					color:#ffffff;
					&::after{
						border:0;
					}
				}
			}
		}
	}
	.withdrawal_con{
		margin:20rpx 24rpx;
		background:#ffffff;
		border-radius: 24rpx;
		padding:0 32rpx;
		.hd{
			height:80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color: #141313;
			border-bottom: 1px solid #f6f6f6;
		}
		.bd{
			border-bottom: 1px solid #f6f6f6;
			.time{
				text-align: center;
				padding:22rpx 0;
				font-size: 24rpx;
				color: #141313;
			}
			.item{
				display: flex;
				align-items: center;
				padding-bottom: 50rpx;
				position: relative;
				.icon{
					width:20rpx;
					height: 20rpx;
					border:4rpx #ffffff solid;
					border-radius: 50%;
					position: absolute;
					left: 0;
					top: 10rpx;
					&.icon_yq{
						border-color:#1AB818;
					}
					&.icon_ewm{
						border-color:#FF9D00;
					}
				}
				.left{
					display: flex;
					flex-direction: column;
					flex:1;
					margin-left:38rpx;
					.title{
						font-size: 20rpx;
						color: #141313;
					}
					.desc{
						font-size: 24rpx;
						color: #B1B1B1;
					}
				}
				.right{
					.number{
						font-size: 24rpx;
						color:#1AB818;
						&.orange{
							color:#FF9D00;
						}
					}
				}
				&::before {
				    content: " ";
				    position: absolute;
				    left: 10rpx;
				    top: 28rpx;
				    width: 2rpx;
				    bottom: 0;
				    border-left: 2rpx solid #eeeeee;
				    transform-origin: 0 0;
				    transform: scaleX(.5);
				}
				&:last-child{
					&::before {
						content:none;
					}
				}
			}
			&:last-child{
				border-bottom: 0;
			}
		}
	}
</style>
