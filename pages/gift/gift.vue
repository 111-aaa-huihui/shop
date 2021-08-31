<template>
	<view class="container">
		<topNav title="商家礼品赠送" @eventClick="goback" v-if="navshow"></topNav>
		<view class="prolist">
			<Empty height="600" v-if="list.length==0"></Empty>
			<v-prolist :plist="list" @eventClick="detail" v-else></v-prolist>
			<loadMore :status="status" :show="loadShow"></loadMore>
		</view>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	import proList from '@/components/prolist.vue'
	import Empty from '@/components/empty.vue'
	import loadMore from '@/components/loadmore.vue'
	export default{
		components: {
			topNav,
			"v-prolist":proList,
			Empty,
			loadMore
		},
		data(){
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
			goback() {
				uni.switchTab({
					url: '/pages/about/about'
				})
			},
			navTo(url){
				uni.navigateTo({
				    url: url
				});
			},
			//详情
			detail(id){
				uni.navigateTo({
					url:'/pages/detail/detail?id='+id
				})
			},
			//请求数据
			async loadData(){
				this.$api.http.getProductlist(3,this.page,this.limit).then(res => {
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
	.prolist{
		padding:36rpx 45rpx;
	}
	.list{
		padding:36rpx 45rpx;
		display: flex;
		flex-direction: column;
		.hyml{
			width: 100%;
			padding:40rpx 0;
			display: flex;
			align-items: center;
			background:#ffffff;
			margin-bottom: 20rpx;
		}
	}
</style>
