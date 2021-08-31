<template>
	<view class="hc">
		<view class="bg" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">日常商品批发</span>
		</view>
		<view class="head">
			<view class="cate-section" v-if="moreShow">
				<view class="cate-item" v-for="(item,index) in navlists" :key="index" @click="goNav(item.category_id)">
					<image :src="navlist[index].src" v-if="navlist[index].title==item.title" mode="aspectFit"></image>
					<text>{{item.title}}</text>
				</view>
				<view class="cate-item" @click="navTo('/pages/category/category')">
					<image src="/static/img/temp/44.png" mode="aspectFit"></image>
					<text>全部分类</text>
				</view>
			</view>
			<view class="prolist" v-if="list.length>0">
				<v-prolist :plist="list" @eventClick="detail"></v-prolist>
			</view>
			<loadMore :status="status" :show="loadShow"></loadMore>
		</view>
	</view>
</template>

<script>
	import proList from '@/components/prolist.vue'
	import loadMore from '@/components/loadmore.vue'
	export default {
		components: {
			"v-prolist":proList,
			loadMore
		},
		data() {
			return {
				navshow:false,
				moreShow:false,
				navlists:[],
				navlist:[
					{
						src:"/static/img/temp/23.png",
						title:"新鲜蔬菜"
					},
					{
						src:"/static/img/temp/40.png",
						title:"时令水果"
					},
					{
						src:"/static/img/temp/24.png",
						title:"肉禽蛋品"
					},
					{
						src:"/static/img/temp/26.png",
						title:"海鲜水产"
					},
					{
						src:"/static/img/temp/68.png",
						title:"酒水饮料"
					},
					{
						src:"/static/img/temp/30.png",
						title:"休闲零食"
					},
					{
						src:"/static/img/temp/31.png",
						title:"粮油调味"
					},
					{
						src:"/static/img/temp/32.png",
						title:"速食冻品"
					},
					{
						src:"/static/img/temp/33.png",
						title:"日用百货"
					}
				],
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false
			}
		},
		methods: {
			routeAbout() {
				this.$u.route({
					type:'switchTab',
					url:'pages/home/home'
				})
			},
			//导航跳转
			navTo(url){
				uni.navigateTo({
				    url: url
				});
			},
			//详情
			detail(id){
				uni.navigateTo({
				    url: "/pages/detail/detail?type=2&id="+id
				});
			},
			//分类
			goNav(id){
				uni.navigateTo({
				    url: "/pages/category/category?id="+id
				});
			},
			//请求数据
			async getNav(){
				this.$api.http.getTopcategory().then(res => {
					if(res.code == 200){
						this.navlists = res.data;
						this.moreShow = true;
					}
				})
			},
			async loadData(){
				this.$api.http.getProductlist(0,this.page,this.limit).then(res => {
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
			queryData(){
				this.page = 1;
				this.loadData();
			}
		},
		onLoad(){
			this.getNav();
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
		    url:"/pages/index/index"
		  })
		  return true;
		}
	}
</script>

<style lang="scss">
	page{background: #f0f0f0;}
	.hc {
		width: 100%;
		height: 100%;

		.bg {
			background: #FFFFFF;
			// background-color: red;
			display: flex;
			flex: 1;
			padding: 30rpx 50rpx;
			text-align: center;
			.nav {
				margin-right: 20rpx;
				display: flex;
			}

			.title {
				font-size: 30rpx;
				font-weight: 550;
				color: #141313;
			}
		}
		.head{
			width: 100%;
			padding: 20upx;
			.headBox{
				width: 100%;
				height: 25%;
				background-color: #FFFFFF;
			}
			.headBox2{
				margin-top: 20upx;
				width: 100%;
				background-color: #FFFFFF;
			}
			.cate-section {
				display: flex;
				align-items: center;
				flex-wrap:wrap;
				background: #fff;
				padding:44rpx 26rpx 0;
				border-radius: 10rpx;
				.cate-item {
					width:20%;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-bottom:40rpx;
					font-size: 24rpx;
					color:#141313;
					image{
						width:65rpx;
						height: 69rpx;
						margin-bottom:20rpx;
					}
				}
			}
			.prolist{
				margin-top:20rpx;
				background: #fff;
				padding:40rpx 50rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
