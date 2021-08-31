<template>
	<view class="hc">
		<view class="bg" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">签约商家商品列表</span>
		</view>
		<view class="body">
			<Empty height="600" v-if="list.length==0"></Empty>
			<view class="box" v-else>
				<v-prolist :plist="list" @eventClick="detail"></v-prolist>
			</view>
		</view>
		<loadMore :status="status" :show="loadShow"></loadMore>
	</view>
</template>

<script>
	import proList from '@/components/prolist.vue'
	import Empty from '@/components/empty.vue'
	import loadMore from '@/components/loadmore.vue'
	export default {
		components: {
			"v-prolist":proList,
			Empty,
			loadMore
		},
		data() {
			return {
				navshow:false,
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false
			}
		},
		methods: {
			routeAbout(){
				this.$u.route({
					type:'switchTab',
					url:'pages/home/home'
				})
			},
			//请求数据
			loadData(){
				this.$api.http.getProductlist(2,this.page,this.limit).then(res => {
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
			//详情
			detail(id){
				uni.navigateTo({
					url:'/pages/detail/detail?type=2&id='+id
				})
			},
			queryData(){
				this.page = 1;
				this.loadData();
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
			this.queryData();
		}
	}
</script>

<style lang="scss">
	page{background: #f0f0f0;}
	.hc {
		background: #f0f0f0;
		width: 100%;
		height: 100%;
		.bg {
			background: #FFFFFF;
			// background-color: red;
			display: flex;
			flex: 1;
			padding: 30rpx 50rpx;
			text-align: center;
			line-height: 100%;
			.nav{
				margin-right: 20rpx;
			}
			.title{
				font-size: 30rpx;
				font-weight: 550;
				color: #141313;
			}
		}
		.body{
			width: 100%;
			padding: 20rpx;
			.box{
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				padding:40rpx 50rpx;
			}
		}
	}
</style>
