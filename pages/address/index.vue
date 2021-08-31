<template>
	<view class="container">
		<view class="list">
			<view class="row" v-for="(item,index) in list" :key="index" @click="Goquery(item)">
				<view class="hd">
					<view class="num" v-if="index<10">0{{index+1}}</view>
					<view class="num" v-else>{{index+1}}</view>
				</view>
				<view class="bd">
					<view class="left">
						<view>
							<text class="name">收货人：{{item.name}}</text>
							<text>联系方式：{{item.number}}</text>
						</view>
						<view class="address">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</view>
					</view>
					<view class="right" @click.stop="onEdit(item)">
						<u-icon name="/static/img/arrow-right.png" size="12"></u-icon>
					</view>
				</view>
				<!-- <view class="left">
					<view class="head">{{item.name.substr(0,1)}}</view>
				</view>
				<view class="center">
					<view class="info">
						<view class="name">{{item.name}}</view>
						<view class="tel">{{item.number}}</view>
						<view class="default" v-if="item.is_default==1">默认</view>
					</view>
					<view class="address">
						{{item.province}}{{item.city}}{{item.area}}{{item.address}}
					</view>
				</view>
				<view class="right">
					<view class="icon" @click.stop="edit(item)">
						<u-icon name="edit-pen" size="22" color="#707070"></u-icon>
					</view>
				</view> -->
			</view>
		</view>
		<view class="add">
			<u-button shape="circle" :ripple="true" class="btn" @click="onAdd">新建地址</u-button>
		</view>
		<u-gap height="120"></u-gap>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[]
			}
		},
		methods:{
			loadData(){
				this.$api.http.addresslist().then(res => {
					if(res.code == 200){
						this.list = res.data;
					}else if(res.code==402){
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
						uni.setStorage({key:"loginOriginUrl",data:"/pages/address/index"});
						uni.navigateTo({
							url:"/pages/login/login"
						})
					}
				});
			},
			Goquery(data){
				let newdata = [];
				newdata.push(data);
				uni.setStorage({
					key:"address",
					data:JSON.stringify(newdata)
				})
				uni.navigateBack();
			},
			onEdit(data){
				uni.setStorage({key:"address",data:data});
				uni.navigateTo({
					url:"/pages/address/address?type=edit"
				})
			},
			onAdd(){
				uni.navigateTo({
					url:"/pages/address/address"
				})
			}
		},
		onShow(){
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		display: flex;
		flex-wrap: wrap;
		.row{
			flex:1;
			margin:20rpx 20rpx 0;
			display: flex;
			flex-direction: column;
			height: 214rpx;
			background: url(../../static/img/addressbg.png) no-repeat;
			background-size: 100% 100%;
			.hd{
				padding:27rpx 0 30rpx 0;
				position: relative;
				display: flex;
				align-items: center;
				.num{
					font-size: 25rpx;
					color:#000000;
					margin-left: 31rpx;
					font-weight: bold;
					&::after{
						content:"";
						position: absolute;
						top:30rpx;
						left:9rpx;
						width: 9rpx;
						height: 31rpx;
						background: #ff9d00;
					}
				}
			}
			.bd{
				padding-left:56rpx;
				font-size: 22rpx;
				color:#000000;
				display: flex;
				.left{
					flex:1;
					display: flex;
					flex-direction: column;
					.name{
						margin-right: 54rpx;
					}
					.address{
						margin-top:13rpx;
					}
				}
				.right{
					padding-left: 20rpx;
					padding-right: 57rpx;
					display: flex;
					align-items: center;
				}
			}
			// .left{
			// 	width: 90rpx;
			// 	flex-shrink: 0;
			// 	display: flex;
			// 	align-items: center;
			// 	.head{
			// 		width: 70rpx;
			// 		height: 70rpx;
			// 		background:linear-gradient(to right,#ccc,#aaa);
			// 		color: #fff;
			// 		display: flex;
			// 		justify-content: center;
			// 		align-items: center;
			// 		border-radius: 60rpx;
			// 		font-size: 35rpx;
			// 	}
			// }
			// .center{
			// 	width: 100%;
			// 	display: flex;
			// 	flex-wrap: wrap;
			// 	.info{
			// 		width: 100%;
			// 		display: flex;
			// 		align-items: baseline;
			// 		margin-bottom:10rpx;
			// 		.name{
			// 			font-size: 34rpx;
			// 		}
			// 		.tel{
			// 			margin-left: 30rpx;
			// 			font-size: 24rpx;
			// 			color: #777777;
			// 		}
			// 		.default{
			// 			font-size: 22rpx;
			// 			background-color: #ff9d00;
			// 			color: #ffffff;
			// 			padding: 0 18rpx;
			// 			border-radius: 24rpx;
			// 			margin-left: 20rpx;
			// 		}
			// 	}
			// 	.address{
			// 		width: 100%;
			// 		font-size: 24rpx;
			// 		display: flex;
			// 		align-items: baseline;
			// 		color: #777;
			// 	}
			// }
			// .right{
			// 	flex-shrink: 0;
			// 	display: flex;
			// 	align-items: center;
			// 	margin-left: 20rpx;
			// 	.icon{
			// 		display: flex;
			// 		justify-content: center;
			// 		align-items: center;
			// 		width: 80rpx;
			// 		height: 60rpx;
			// 	}
			// }
		}
	}
	.add{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0rpx 5rpx 10rpx rgba(0,0,0,0.4);
			width: 70%;
			height: 80rpx;
			border-radius: 80rpx;
			background-color: #ff9d00;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			font-size: 30rpx;
		}
	}
</style>
