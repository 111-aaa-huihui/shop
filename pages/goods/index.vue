<template>
	<view class="content">
		<u-navbar back-icon-color="#FFFFFF" :background="bg">
			<view class="slot-wrap">
				<view class="search-wrap">
					<u-search v-model="keyword" height="56" :action-style="{color: '#fff'}" @search="goSearch" @custom="goSearch"></u-search>
				</view>
			</view>
		</u-navbar>
		<Empty height="600" data="search" v-if="list.length==0"></Empty>
		<view class="goodslist" v-else>
			<view class="proitem" v-for="(item,index) in list" :key="index" @click="toGoods(item.id,item.product_type)">
				<view class="proimage" v-for="(items,indexs) in item.pic_arr" :key="items.pic_id" v-if="indexs==0">
					<image :src="items.domain+items.path.substr(1)" mode="widthFix"></image>
				</view>
				<text class="proname">{{item.title}}</text>
				<view class="proinfo" v-for="(items,indexss) in item.sku_arr" :key="items.sku_id" v-if="indexss==0">
					<text class="proinfo_price">￥{{items.price}}</text>
				</view>
			</view>
			<loadMore :status="status" :show="loadShow"></loadMore>
		</view>
	</view>
</template>

<script>
	import Empty from '@/components/empty.vue'
	import loadMore from '@/components/loadmore.vue'
	export default {
		components: {
			Empty,
			loadMore
		},
		data() {
			return {
				bg:{
					backgroundColor: '#FF9D00'
				},
				list: [],
				keyword:"",
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
				this.$api.http.getProductlist(0,this.page,this.limit,this.keyword).then(res => {
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
			toGoods(id,index){
				if(index==1){
					uni.navigateTo({
						url:'/pages/detail/detail?id='+id
					})
				}else{
					uni.navigateTo({
						url:'/pages/detail/detail?type=2&id='+id
					})
				}
			}
		},
		onLoad(e){
			this.keyword = e.key;
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
			this.goSearch();
		}
	}
</script>

<style lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		.search-wrap {
			margin: 0 20rpx;
			flex: 1;
		}
	}
	.goodslist{
		width: 100%;
		padding: 3vw 4%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.proitem {
			width: 48%;
			border-radius: 20rpx;
			background-color: #fff;
			margin: 0 0 30rpx 0;
			box-shadow: 0rpx 5rpx 25rpx rgba(0,0,0,0.1);
			.proimage {
				width: 100%;
				height: 332rpx;
				overflow: hidden;
				margin-bottom: 20rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 20rpx 20rpx 0 0;
				}
			}
			.proname {
				width: 92%;
				height: 72rpx;
				padding: 0 20rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 28rpx;
			}
			.proinfo {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10rpx 4%;
				.proinfo_price {
					color: #FF9D00;
					font-size: 30rpx;
					font-weight: 600;
				}
				.proinfo_slogan {
					color: #807c87;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
