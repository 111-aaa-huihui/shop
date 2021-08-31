<template>
	<view class="container">
		<topNav title="用户订单" @eventClick="goback" v-if="navshow"></topNav>
		<view class="tabsbox">
			<view class="tabs_item" v-for="(item,index) in tablist" :key="index" @click="tabchange(item.id)" :class="{active:current==item.id}">{{item.name}}</view>
		</view>
		<u-gap height="80"></u-gap>
		<view class="emptybox" v-if="list.length==0">
			<image src="/static/img/nomores.png" mode="aspectFill" style="width: 453rpx;height: 284rpx;"></image>
			<text class="text">没有更多内容啦～</text>
		</view>
		<view v-else>
		    <view class="page_box">
				<view class="order" v-for="(item,index) in list" :key="index">
					<block v-if="current==4">
					<view class="item">
						<view class="imgwrap">
						    <image :src="item.images" mode="aspectFill"></image>
						</view>
						<view class="content">
						    <view class="title">{{item.title}}</view>
						    <view class="number">数量：{{item.buy_number}}</view>
						</view>
						<view class="right">
							<view class="type">{{item.status|order_status}}</view>
						    <view class="price">￥{{item.total_price}}</view>
						</view>
					</view>
					</block>
					<block v-for="(items,indexs) in item.product_arr" :key="indexs" v-else>
					<view class="item">
						<view class="imgwrap">
						    <image :src="items.images" mode="aspectFill"></image>
						</view>
						<view class="content">
						    <view class="title">{{items.title}}</view>
						    <view class="number">数量：{{items.buy_number}}</view>
						</view>
						<view class="right">
							<view class="type">{{item.status|order_status}}</view>
						    <view class="price">￥{{items.total_price}}</view>
						</view>
					</view>
					</block>
					<view class="total">
					    实付：￥<text class="total_price">{{item.total}}</text>
					</view>
					<view class="bottom" v-if="current==1">
					    <view class="btn" @click="cancelOrder(item.id,index)">取消订单</view>
					    <view class="active btn" @click="pay(item.total,item.id)">立即支付</view>
					</view>
					<view class="bottom" v-if="current==2">
					    <!-- <view class="btn" @click="replay(item.id)">申请退款</view> -->
						<view class="btn" @click="gobuy(item.id,item)">再次购买</view>
					    <!-- <view class="btn">催发货</view> -->
					</view>
					<view class="bottom" v-if="current==3">
					    <!-- <view class="btn" @click="replay(item.id)">申请退款</view> -->
					    <view class="active btn" @click="deliver(item.id,index)">确认收货</view>
					</view>
					<view class="bottom" v-if="current==4">
					    <!-- <view class="btn" @click="replay(item.id)">申请退款</view> -->
					    <view class="active btn" @click="evaluate(item.id,item.pid)">立即评价</view>
					</view>
				</view>
				<loadMore :status="status" :show="loadShow"></loadMore>
			</view>
		</view>
		<v-pay :popupShow="payshow" :totals="totals" :orderid="orderid" @close="close"></v-pay>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	import loadMore from '@/components/loadmore.vue'
	import Pay from '@/components/pay.vue'
	export default{
		components: {
			topNav,
			loadMore,
			"v-pay":Pay
		},
		data(){
			return {
				navshow:false,
				tablist: [
					{
						id:1,
						name: '待付款'
					},
					{
						id:2,
						name: '待发货'
					},
					{
						id:3,
						name: '待收货'
					},
					{
						id:4,
						name: '待评价'
					}
				],
				current: 0,
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false,
				totals:"0",
				payshow:false,
				orderid:0,
				cklist:[]
			}
		},
		filters:{
			order_status(status){
				switch(status){
					case 1:
						return "待付款"
					break;
					case 2:
						return "待发货"
					break;
					case 3:
						return "待收货"
					break;
					case 4:
						return "待评价"
					break;
					default:
						return "待确认"
					break;
				}
			}
		},
		computed: {
			// 价格小数
			priceDecimal() {
				return val => {
				  if (val !== parseInt(val)) return val.slice(-2);
				  else return '00';
				};
			},
			// 价格整数
			priceInt() {
				return val => {
				  if (val !== parseInt(val)) return val.split('.')[0];
				  else return val;
				};
			}
		},
		methods: {
			goback() {
				uni.switchTab({
					url: '/pages/about/about'
				})
			},
			evaluate(id,pid){
				uni.navigateTo({
					url: '/pages/evaluate/evaluate?id='+id+"&pid="+pid
				})
			},
			// 总件数
			totalNum(item) {
				let num = 0;
				item.map(val => {
				  num += val.number;
				});
				return num;
			},
			// tab栏切换
			tabchange(index) {
				this.current = index;
				this.list = [];
				this.loadData();
			},
			//请求数据
			async loadData(){
				if(this.current==4){
					this.$api.http.waitcommit(this.page,this.limit).then((res) => {
						if(res.code==200){
							let total = res.data.total;
							let list = res.data.data.map(item=>{
								let price = 0;
								price += item.buy_number * parseFloat(item.total_price);
								item.total = price.toFixed(2);
								item.pid = item.product_id;
								return item;
							});
							if(this.page==1){
								this.list = list; 
							}else{
								this.list = this.list.concat(list);
								res.data.data.length < total ? (this.status = 'nomore') : (this.status = 'loadmore');
							}
							if(res.data.data.length<=total && this.page==1){
								this.status = 'nomore';
								this.loadShow = false;
							}
							if(res.data.data.length == 0) {
								this.status = 'nomore';
								this.loadShow = false;
							}
						}
					})
				}else{
					this.$api.http.orderList(this.current,this.page,this.limit).then((res) => {
						if(res.code==200){
							let list = res.data.data.map(item=>{
								let price = 0;
								item.product_arr.map(val=>{
									price += val.buy_number * parseFloat(val.total_price);
									item.total = price.toFixed(2);
									item.pid = val.product_id;
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
				}
			},
			cancelOrder(id,index){
				uni.showModal({
				    title: '提示',
				    content: '确定是否取消该订单？',
					confirmColor:"#FF9D00",
				    success: (res)=> {
				        if (res.confirm) {
				            this.$api.http.cancelOrder(id).then((res) => {
				            	if(res.code==200){
				            		this.list.splice(index, 1);
				            	}else{
				            		uni.showToast({
				            			title:res.message,
				            			icon:"none"
				            		})
				            	}
				            });
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			gobuy(id,data){
				this.$api.http.buyagain(id).then((res)=>{
					if(res.code==200){
						uni.removeStorageSync("isbuy");
						uni.removeStorageSync("blist");
						setTimeout(()=>{
							uni.setStorage({key: 'isbuy', data:"1"});
							uni.setStorage({key: 'blist', data: {data:JSON.stringify(data),cartarr:res.data.pay_cart_arr}});
							uni.navigateTo({
								url:"/pages/order/orderConfirm"
							})
						},800)
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
				// uni.navigateTo({
				// 	url:"/pages/detail/detail?id="+id
				// })
			},
			//确认收货
			async deliver(id,index){
				this.$api.http.deliver(id).then((res) => {
					if(res.code==200){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
						this.list.splice(index, 1);
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				});
			},
			//申请退款
			replay(id){},
			//支付
			pay(val,id){
				this.totals = val;
				this.orderid = id;
				this.payshow = true;
			},
			close(){
				this.payshow = false;
			},
			queryData(){
				this.page = 1;
				this.loadData();
			}
		},
		onLoad(option) {
			let num = parseInt(option.type);
			if(option.type!=undefined){
				this.current = num;
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
		},
		//监听返回
		onBackPress(e){
		  uni.switchTab({
		    url:"/pages/about/about"
		  })
		  return true;
		}
	}
</script>

<style lang="scss">
	page{background:#F8F8F8;}
</style>
<style lang="scss" scoped>
	.tabsbox{
		width: 100%;
		padding:20rpx 0;
		background:#ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top:44px;
		left:0;
		z-index: 50;
		.tabs_item{
			font-size: 28rpx;
			color: #707070;
			flex:1;
			text-align: center;
			&.active{
				color:#FF9D00;
				font-weight: bold;
			}
		}
	}
	.emptybox{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top:217rpx;
		.text{
			font-size: 22rpx;
			color:#707070;
			margin-top: 65rpx;
		}
	}
	.page_box{
		padding:20rpx 24rpx;
		.order{
			background: #ffffff;
			border-radius: 20rpx;
			padding:0 32rpx 0;
			margin-bottom: 36rpx;
			.item{
				padding-top:36rpx;
				padding-bottom:34rpx;
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
						margin-right: 40rpx;
					}
					.number{
						font-size: 20rpx;
						color:#B1B1B1;
					}
				}
				.right{
					.type{
						font-size: 24rpx;
						color:#FF9D00;
					}
					.price{
						font-size: 20rpx;
						color:#141313;
					}
				}
				&:last-child{
					margin-bottom:0;
				}
			}
			.total{
				padding:16rpx 0;
				font-size: 24rpx;
				color:#141313;
				border-bottom: 2rpx solid #f5f5f5;
				text-align: right;
				.total_price{
					font-size: 32rpx;
				}
			}
			.bottom{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding:20rpx 0;
				.btn{
					width: 150rpx;
					height: 48rpx;
					line-height: 44rpx;
					background: #ffffff;
					border: 2rpx solid #b1b1b1;
					border-radius: 26rpx;
					font-size: 20rpx;
					color:#B1B1B1;
					text-align: center;
					margin:0 10rpx;
					&.active{
						background: #FF9D00;
						border-color: #FF9D00;
						color:#ffffff;
					}
				}
			}
		}
	}
</style>
