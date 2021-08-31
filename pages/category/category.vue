<template>
	<view class="container">
		<!-- <view class="navhead">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<text class="title">全部分类</text>
			<view class="search_box">
				<u-search placeholder="搜索活动或者商家" :clearabled="true" :show-action="false" border-color="#ffffff"
					search-icon="/static/img/23.png" search-icon-color="#FFFFFF" bg-color="#ffffff"
					input-align="center" placeholder-color="#B1B1B1" color="#B1B1B1">
				</u-search>
			</view>
		</view> -->
		<u-navbar class="navhead" back-text="全部分类" back-icon-color="#000000" :back-text-style="{color:'#000000'}"
			:border-bottom="false">
			<view class="search_box">
				<u-search placeholder="搜索产品" :clearabled="true" :show-action="false" border-color="#ffffff"
					search-icon="/static/img/23.png" search-icon-color="#FFFFFF" bg-color="#ffffff" input-align="center"
					placeholder-color="#B1B1B1" color="#B1B1B1" v-model="keywords" @search="goSearch">
				</u-search>
			</view>
		</u-navbar>
		<view class="content">
			<view class="leftside">
				<scroll-view scroll-y class="left-aside">
					<view class="f-item b-b" :class="{active: item.category_id === currentId,before: item.category_id === currentBeforeId,after: item.category_id === currentAfterId}" v-for="(item,index) in flist" :key="item.category_id" @click="tabtap(item,index)">
						<text>{{item.title}}</text>
					</view>
				</scroll-view>
				<scroll-view scroll-y class="left-asides" v-if="show">
					<view class="f-items" :class="{active: items.category_id === currentIds}" v-for="(items,index) in clist" :key="items.category_id" @click="tabtap(items,index,1)">
						<text>{{items.title}}</text>
					</view>
				</scroll-view>
			</view>
			<scroll-view scroll-with-animation scroll-y class="right-aside">
				<view class="t-list">
					<view @click="navToList(titem.id)" class="t-item" v-for="(titem,index) in plist" :key="titem.id">
						<view class="imgwrap" v-for="(items,index) in titem.pic_arr" :key="index" v-if="index==0">
							<image :src="items.domain+items.path.substr(1)" mode="scaleToFill"></image>
						</view>
						<text class="name">{{titem.title}}</text>
						<view class="price_wrap">
							<view class="picebox" v-for="(items,index) in titem.sku_arr" :key="index" v-if="index==0">
								<text>￥{{items.price}}</text>
							</view>
							<button type="default" class="btn_cart" @click.stop="addCart(titem)">
								<u-icon size="22" name="/static/img/icon_cart.png" class="footIcon"></u-icon>
							</button>
						</view>
					</view>
					<loadMore :status="status" :show="loadShow"></loadMore>
				</view>
			</scroll-view>
		</view>
		<view class="de_btn_bar">
			<view class="icon_cart icon_bar" @click="goCart">
				<u-icon size="40" name="/static/img/tab_cart.png"></u-icon>
				<text>购物车</text>
				<text class="num" v-if="cartnum>0">{{cartnum}}</text>
			</view>
			<button type="default" class="btn_cart" @click="goCart" v-if="hasLogin=='true'">{{totalPrice}} 去支付</button>
			<button type="default" class="btn_cart" @click="goLogin" v-else>立即登录</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	import loadMore from '@/components/loadmore.vue'
	export default {
		components: {
			loadMore
		},
		data() {
			return {
				currentId: 0,
				currentBeforeId:0,
				currentAfterId:0,
				currentIds: 0, //二级分类选中
				flist: [], //一级分类
				clist: [], //二级分类
				plist: [], //产品列表
				selectFoods: [],
				show: false,
				keywords:"",
				cateid:0,
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false,
				cartnum:0,
				hasLogin:true
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count
				})
				return total==0?"":"￥"+total.toFixed(2);
			},
			totalCount() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.count
				})
				return total;
			}
		},
		methods: {
			...mapMutations(['storehasLogin']),
			routeAbout() {
				uni.navigateBack();
			},
			//登录
			goLogin(){
				uni.navigateTo({
					url:"/pages/login/login"
				})
			},
			async loadData() {
				this.$api.http.getCategory().then(res => {
					let list = res.data;
					this.flist = list;
				});
				this.getcart();
			},
			async getplist(){
				this.$api.http.getProductlist(0,this.page,this.limit,this.keywords,this.cateid).then(res => {
					if(res.code == 200){
						this.plist = this.plist.concat(res.data.data);
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
				this.plist = [];
				this.getplist();
			},
			//一级分类点击
			tabtap(item,index,type) {
				// let index = this.clist.findIndex(sitem => sitem.pid === item.category_id);
				if(type==1){
					this.currentIds = item.category_id;
					this.cateid = item.category_id;
					this.show = false;
					setTimeout(()=>{
						this.plist = [];
						this.getplist();
					},1000)
				}else{
					this.currentId = item.category_id;
					this.currentBeforeId = index > 0 ? this.flist[index - 1].category_id : 0;
					index < this.flist.length - 1 ? this.currentAfterId = this.flist[index + 1].category_id : this.currentAfterId = 0;
					this.cateid = item.category_id;
					this.clist = [];
					if(item.children){
						this.clist = item.children;
						this.show = true;
					}else{
						this.plist = [];
						this.getplist();
						this.show = false;
					}
				}
			},
			goSearch(){
				this.page = 1;
				this.plist = [];
				this.getplist();
			},
			navToList(sid) {
				uni.navigateTo({
					url: "/pages/detail/detail"
				})
			},
			//获取购物车数量
			getcart(){
				this.$api.http.cartList().then((res) => {
					if(res.code == 200){
						this.cartnum = res.data.total;
					}else if(res.code==402){
						this.hasLogin = false;
						this.storehasLogin("false");
					}
				})
			},
			//跳转购物车
			goCart() {
				uni.navigateTo({
					url: "/pages/shopCat/shopCat"
				})
			},
			//加入购物车
			addCart(item) {
				this.$api.http.addCart(item.id,item.sku_arr[0].sku_id,1).then((res) => {
					if(res.code == 200){
						uni.showToast({
							title:"加入购物车成功",
							icon:"none"
						})
						// this.getCartnum(item);
						this.getcart();
					}else{
						uni.showToast({
							title:'请立即登录',
							icon:"none"
						})
					}
				})
			},
			getCartnum(item){
				// 每次添加都清零，防止重复添加
				let totalCount = 0;
				let totalPrice = 0;
				// 定义isHave判断这个商品是否已经存在于订单列表
				let isHave = false;
				// tableData循环
				for (let i = 0; i < this.selectFoods.length; i++) {
					if (this.selectFoods[i].id == item.id) {
						isHave = true;
					}
				}
				// 根据判断的值写业务逻辑
				if (isHave) {
					// 改变列表中的商品数量
					// 通过filter过滤tableData
					let arr = this.selectFoods.filter(o => o.id == item.id);
					arr[0].count++;
				} else {
					// 构造一个newGoods
					let newGoods = {
						id: item.id,
						title: item.title,
						price: item.sku_arr[0].price,
						skuid: item.sku_arr[0].sku_id,
						count: 1
					}
					this.selectFoods.push(newGoods);
				}
			}
		},
		onLoad(options) {
			this.cateid = options.id;
			this.currentId = parseInt(options.id);
			this.loadData();
			this.getplist();
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
			this.getplist();
		},
		//下拉刷新
		onPullDownRefresh(){
			uni.stopPullDownRefresh();
			this.list = [];
			this.goSearch();
		},
		//监听返回
		onBackPress(e){
		  uni.navigateTo({
		    url:"/pages/DailyWholesale/DailyWholesale"
		  })
		  return true;
		}
	}
</script>

<style lang='scss'>
	page {
		background: #ffffff;
		height: 100%;
	}
</style>

<style lang='scss' scoped>
	.container {
		height: 100%;
	}

	.content {
		display: flex;
		height: calc(100% - 88rpx);
	}

	.navhead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* padding: 16rpx 48rpx;
		background:#fff;
		position: fixed;
		top:0;
		left:0;
		z-index: 50; */
		width: 100%;

		.nav {
			display: flex;
		}

		.title {
			margin-left: 20rpx;
			font-size: 40rpx;
			color: #000000;
		}

		.search_box {
			margin: 0 24rpx;
			flex: 1;
			border: 2rpx solid #eeeeee;
			border-radius: 31rpx;

			/deep/.u-input {
				font-size: 22rpx;
			}

		}
	}

	.leftside {
		position: relative;
		&::before{
			content: "";
			width:168rpx;
			height: 100%;
			background: #f6f6f6;
			position: absolute;
			bottom:0;
			left:0;
		}
	}

	.left-aside {
		flex-shrink: 0;
		width: 168rpx;
		height: 100%;
	}

	.left-asides {
		flex-shrink: 0;
		width: 168rpx;
		height: 100%;
		background-color: #ffffff;
		border-top-right-radius: 40rpx;
		position: absolute;
		top: 0;
		left: 168rpx;
		z-index: 20;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		font-size: 28rpx;
		color: #707070;
		position: relative;
		background: #f6f6f6;

		&.active {
			color: #141313;
			background: #ffffff;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 50rpx;
				width: 8rpx;
				background-color: #ff9d00;
				border-radius: 0 4px 4px 0;
			}
		}
		&.before{
		    border-radius: 0 0 20rpx 0;
		}
		&.after{
		    border-radius: 0 20rpx 0 0;
		}
	}

	.f-items {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 24rpx;
		color: #141313;
		position: relative;
		&.active{
			color:#ff9d00;
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding: 0 38rpx;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 24rpx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}

		.t-item {
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			width: 48%;
			font-size: 24rpx;
			color: #141313;
			padding-bottom: 20rpx;
			.imgwrap{
				width: 100%;
				height: 230rpx;
				background:#eeeeee;
				overflow: hidden;
				margin-bottom: 14rpx;
				border-radius: 20rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.name {
				margin-bottom: 4rpx;
			}

			.price_wrap {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;
				color: #FF9D00;

				.btn_cart {
					width: auto;
					height: 40rpx;
					line-height: 40rpx;
					background: #FF9D00;
					border-radius: 20rpx;
					font-size: 20rpx;
					padding: 0 26rpx;
					margin: 0;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}

			&:nth-child(odd) {
				margin-right: 4%;
			}
		}
	}

	.de_btn_bar {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		height: 88rpx;
		background: #ffffff;
		box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, 0.16);
		display: flex;
		align-items: center;

		.icon_bar {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 20rpx;
			color: #B1B1B1;
			margin-left: 44rpx;
		}

		.icon_cart {
			position: relative;

			.num {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 24rpx;
				color: #fff;
				background: #ff9d00;
				border-radius: 50%;
				padding: 0 10rpx;
			}
		}

		.btn_cart {
			margin-left: 84rpx;
			margin-right: 52rpx;
			flex: 1;
			height: 70rpx;
			line-height: 70rpx;
			background: #ff9d00;
			border: 0;
			border-radius: 36rpx;
			font-size: 24rpx;
			color: #fff;
		}
	}
</style>
