<template>
	<view class="head">
		<view class="bg" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">活动商品批发</span>
		</view>
		<view class="search_input">
			<view class="search_box">
				<u-search placeholder="搜一搜" :clearabled="true" :show-action="false" border-color="#ffffff"
					search-icon="/static/img/23.png" search-icon-color="#FFFFFF" bg-color="#ffffff"
					input-align="center" placeholder-color="#B1B1B1" color="#B1B1B1" v-model="keyword" @search="goSearch">
				</u-search>
			</view>
		</view>
		<view class="ShopList" v-if="list.length>0">
			<view class="list-item" v-for="(item,index) in list" :key="index" @click="detail(item.id)">
				<view class="image-wrapper" v-for="(items,index) in item.pic_arr" :key="index" v-if="index==0">
					<image :src="items.domain+items.path.substr(1)" mode="aspectFit"></image>
					<text class="tip" v-if="item.has_pay_num>1">{{item.has_pay_num}}件起买</text>
				</view>
				<view class="right">
					<text class="shop-title clamp">{{item.title}}</text>
					<view class="price-box" v-for="(items,index) in item.sku_arr" :key="index" v-if="index==0">
						<text class="price">￥{{items.price}}</text>
						<text class="noprice">原价 ￥ {{items.history_price}}</text>
					</view>
					<view class="btnwrap">
						<text class="purchase">限购{{item.buy_limit}}件</text>
						<view class="action-btn" @click.stop="joinCart(item.id)">
							<u-icon size="23" name="/static/img/icon_cart.png" class="footIcon"></u-icon>
							<text class="text">加入购物车</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<loadMore :status="status" :show="loadShow"></loadMore>
	</view>
</template>

<script>
	import loadMore from '@/components/loadmore.vue'
	export default {
		components: {
			loadMore
		},
		data() {
			return {
				navshow:false,
				keyword:"",
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false
			}
		},
		methods: {
			//请求数据
			async loadData(){
				this.$api.http.getProductlist(1,this.page,this.limit,this.keyword).then(res => {
					if(res.code == 200){
						this.list = this.list.concat(res.data.data);
						this.total = res.data.total;
						if(res.data.data.length<=this.total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(res.data.data.length == 0) {
							this.status = 'nomore';
							this.loadShow = false;
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			goSearch(){
				this.page = 1;
				this.list = [];
				this.loadData();
			},
			routeAbout() {
				this.$u.route({
					type: 'switchTab',
					url: 'pages/home/home'
				})
			},
			detail(id){
				uni.navigateTo({
					url:'/pages/detail/detail?id='+id
				})
			},
			// 加入购物车
			joinCart(id){
				uni.navigateTo({
					url: '/pages/detail/detail?id='+id
				})
				// uni.switchTab({
				// 	url:"/pages/shopCat/shopCat"
				// })
			}
		},
		onLoad(){
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
			this.goSearch();
		}
	}
</script>

<style lang="scss">
	page{background-color: #f0f0f0;}
	.head {
		width: 100%;
		height: 100%;
		background-color: #F0F0F0;

		.bg {
			background: #FFFFFF;
			// background-color: red;
			display: flex;
			flex: 1;
			padding: 30rpx 50rpx;
			text-align: center;
			line-height: 100%;

			.nav {
				margin-right: 20rpx;
			}

			.title {
				font-size: 30rpx;
				font-weight: 550;
				color: #141313;
			}
		}

		.search_input {
			height: 7%;
			// background-color: red;
			display: flex;
			flex: 1;
			padding: 20rpx 5%;

			.search_box {
				flex: 1
			}
		}

		.ShopList {
			margin: 20rpx 5%;
			background: #FFFFFF;
			border-radius: 24rpx;
			.list-item{
				padding:26rpx 0 32rpx 0;
				margin:0 26rpx;
				display: flex;
				border-bottom: 2rpx solid #eeeeee;
				.image-wrapper{
					width:258rpx;
					height: 152rpx;
					margin-right: 20rpx;
					position: relative;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
					}
					.tip{
						position: absolute;
						top:30rpx;
						right:0;
						background:#ff9d00;
						height: 34rpx;
						line-height: 34rpx;
						font-size: 20rpx;
						color:#fff;
						border-top-left-radius:34rpx;
						border-bottom-left-radius:34rpx;
						padding: 0 24rpx;
					}
				}
				.right{
					flex: 1;
					display: flex;
					flex-direction: column;
					overflow: hidden;
					.shop-title{
						font-size:24rpx;
						color:#141313;
						font-weight: bold;
					}
					.price-box{
						margin-top:10rpx;
						.price{
							font-size: 28rpx;
							color:#FF9D00;
							font-weight: bold;
						}
						.noprice{
							padding-left:20rpx;
							font-size: 18rpx;
							color:#B1B1B1;
							text-decoration:line-through;
						}
					}
					.btnwrap{
						margin-top:20rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.purchase{
							font-size: 20rpx;
							color:#FF0000;
						}
						.action-btn{
							padding:0 30rpx;
							height: 50rpx;
							line-height: 50rpx;
							background: #FF9D00;
							border-radius: 25rpx;
							font-size: 20rpx;
							margin: 0;
							color:#fff;
							display: flex;
							align-items: center;
							justify-content: space-between;
							.text{
								margin-left: 12rpx;
							}
						}
					}
				}
				&:last-child{border-bottom: 0;}
			}
		}
	}
</style>
