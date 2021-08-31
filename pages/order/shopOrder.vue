<template>
	<view class="container">
		<topNav title="商家订单" @eventClick="goback" v-if="navshow"></topNav>
		<view class="tabsbox">
			<view class="tabs_item" :class="{active:current==index}" v-for="(item,index) in tablist" :key="index" @click="tabchange(index)">
				<text class="text">{{item.name}}</text>
			</view>
		</view>
		<u-gap height="80"></u-gap>
		<Empty height="600" v-if="list.length==0"></Empty>
		<view v-else>
			<view class="page_box">
				<view>
					<view class="hd"></view>
					<view class="order" v-for="(item,index) in list" :key="index">
						<!-- <view class="top">
							<view class="left">
								<view class="text"><text class="label">收货人</text><text class="value">周周</text></view>
								<view class="text">
									<text class="label">电话</text>
									<text class="value">17345454457</text>
									<view class="btn">拨打电话</view>
								</view>
							</view>
							<view class="right">
								<text class="type" v-if="current==0">待发货</text>
								<text class="type green" v-if="current==1">交易成功</text>
							</view>
						</view> -->
						<block v-for="(items,indexs) in item.product_arr" :key="indexs">
						<view class="item">
							<view class="imgwrap">
							    <image :src="items.images" mode="aspectFill"></image>
							</view>
							<view class="content">
							    <view class="title">{{items.title}}</view>
							    <view class="number">
									<text>数量：{{items.buy_number}}</text>
									<text>实付款：￥{{items.total_price}}</text>
								</view>
							</view>
							<!-- <view class="right">
								<view class="btn">申请退款</view>
							</view> -->
						</view>
						</block>
						<view class="foot">
							<view class="left">
								<text>订单编号：{{item.order_no}}</text>
								<!-- <text>下单时间：2021/04/26 13:45</text> -->
							</view>
							<!-- <view class="btn">发货</view> -->
						</view>
					</view>
				</view>
				<loadMore :status="status" :show="loadShow"></loadMore>
			</view>
		</view>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	import Empty from '@/components/empty.vue'
	import loadMore from '@/components/loadmore.vue'
	export default{
		components: {
			topNav,
			Empty,
			loadMore
		},
		data(){
			return {
				navshow:false,
				tablist: [
					{
						name: '待收货'
					}
				],
				current: 0,
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false
			}
		},
		methods: {
			goback() {
				uni.switchTab({
					url: '/pages/about/about'
				})
			},
			// tab栏切换
			tabchange(index) {
				this.current = index;
				this.list = [];
				this.loadData();
			},
			//请求数据
			async loadData(){
				this.$api.http.orderList(3,this.page,this.limit).then((res) => {
					if(res.code==200){
						let list = res.data.data.map(item=>{
							let price = 0;
							item.product_arr.map(val=>{
								price += val.buy_number * parseFloat(val.total_price);
								item.total = price.toFixed(2);
							})
							return item;
						});
						this.list = this.list.concat(list);
						this.total = res.data.total;
						if(res.data.data.length<=this.total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(res.data.data.length == 0) {
							this.status = 'nomore';
							this.loadShow = false;
						}
					}
				});
			},
			queryData(){
				this.page = 1;
				this.loadData();
			}
		},
		onShow(){
			this.list = [];
			this.loadData();
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
			this.queryData();
		}
	}
</script>

<style lang="scss">
	page{background:#F8F8F8;}
</style>
<style lang="scss" scoped>
	.tabsbox{
		background:#ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top:44px;
		left:0;
		width: 100%;
		z-index: 50;
		.tabs_item{
			font-size: 28rpx;
			color: #707070;
			flex:1;
			text-align: center;
			padding:20rpx 0;
			.text{
				padding-bottom: 20rpx;
			}
			&.active{
				color:#FF9D00;
				.text{
					border-bottom: 3px solid #ff9d00;
				}
				
			}
		}
	}
	.page_box{
		padding:0 24rpx;
		.hd{
			padding:20rpx 0;
			font-size: 28rpx;
			color:#000000;
		}
		.order{
			background: #ffffff;
			border-radius: 20rpx;
			padding:0 32rpx;
			.top{
				padding:20rpx 0;
				display: flex;
				border-bottom: 2rpx solid #f5f5f5;
				.left{
					flex:1;
					.text{
						font-size: 20rpx;
						color:#B1B1B1;
						display: flex;
						align-items: center;
						padding:8rpx 0;
						.label{
							width:80rpx;
						}
						.value{
							margin-left: 40rpx;
							color:#141313;
						}
						.btn{
							width: 128rpx;
							height: 40rpx;
							line-height: 36rpx;
							background: #ffffff;
							border: 2rpx solid #ff9d00;
							border-radius: 20rpx;
							color:#FF9D00;
							text-align: center;
							margin-left:26rpx;
						}
					}
				}
				.right{
					.type{
						color:#000000;
						font-size: 24rpx;
						&.green{
							color:#0D9E3D;
						}
					}
				}
			}
			.item{
				padding:40rpx 0;
				border-bottom: 2rpx solid #f5f5f5;
				display: flex;
				.imgwrap{
					width:140rpx;
					height: 140rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
					image{
						width:100%;
						height: 100%;
					}
				}
				.content{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					flex:1;
					.title{
						font-size: 24rpx;
						color:#141313;
						font-weight: bold;
					}
					.number{
						font-size: 20rpx;
						color:#B1B1B1;
						display: flex;
						flex-direction: column;
					}
				}
				.right{
					.btn{
						width: 128rpx;
						height: 40rpx;
						line-height: 36rpx;
						background: #ffffff;
						border: 2rpx solid #b1b1b1;
						border-radius: 26rpx;
						font-size: 20rpx;
						color:#B1B1B1;
						text-align: center;
					}
				}
			}
			.foot{
				padding:20rpx 0;
				display: flex;
				justify-content: space-between;
				.left{
					display: flex;
					flex-direction: column;
					font-size: 20rpx;
					color:#B1B1B1;
				}
				.btn{
					width: 176rpx;
					height: 60rpx;
					line-height: 60rpx;
					background: #FF9D00;
					border-radius: 30rpx;
					font-size: 20rpx;
					color:#ffffff;
					text-align: center;
				}
			}
		}
	}
</style>
