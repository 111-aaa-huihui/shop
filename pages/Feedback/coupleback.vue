<template>
	<view class="container">
		<topNav title="留言反馈" @eventClick="goback" v-if="navshow"></topNav>
		<view class="tag_view" v-if="list.length">
			<view class="tag_uni" :class="{active:cur==1}" @click="tab(1)">
				<text>最新</text>
			</view>
			<view class="tag_uni" :class="{active:cur==2}" @click="tab(2)">
				<text>时间排序</text>
			</view>
		</view>
		<view class="msglist" v-if="list.length">
			<view class="msg_item" v-for="(item,index) in list" :key="index">
				<image :src="item.user_avatar==null?'/static/img/avatar.jpg':item.user_avatar" mode="aspectFill" class="avatar"></image>
				<view class="con">
					<text class="text">{{item.title}}</text>
					<text class="time">{{item.create_at}}</text>
					<view class="cmt_att">
						<!-- <view class="img">
							<image src="http://img30.360buyimg.com/shaidan/jfs/t1/57349/6/11845/98894/5d8c495cE60a8208d/c0d078e8a2087284.jpg!q70.dpg.webp" mode="aspectFill"></image>
						</view> -->
					</view>
					<text class="text">{{item.content}}</text>
				</view>
			</view>
		</view>
		<loadMore :status="status" :show="loadShow"></loadMore>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	import loadMore from '@/components/loadmore.vue'
	export default{
		components: {
			topNav,
			loadMore
		},
		data(){
			return {
				navshow:false,
				cur:1,
				list:[],
				status: 'loading',
				page:1,
				loadShow:false,
				way:"id"
			}
		},
		methods: {
			goback() {
				uni.switchTab({
					url: '/pages/about/about'
				})
			},
			tab(index){
				this.cur = index;
				if(index==1){
					this.way = "id";
				}else{
					this.way = "create_at";
				}
				this.loadData();
			},
			async loadData(){
				await this.$api.http.suggestlist(this.page,10,this.way).then((res)=>{
					if(res.code == 200){
						let total = res.data.total;
						if(this.page==1){
							this.list = res.data.data; 
						}else{
							this.list = this.list.concat(res.data.data);
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
			}
		},
		onLoad(){
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
			this.page = 1;
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.tag_view{
		padding:20rpx 40rpx;
		display: flex;
		justify-content: flex-end;
		.tag_uni{
			background: #ffffff;
			border-radius: 20rpx;
			padding:0 20rpx;
			height:40rpx;
			line-height: 40rpx;
			text-align: center;
			font-size:20rpx;
			color:#707070;
			margin-left:20rpx;
			&.active{
				background:#FF9D00;
				color:#fff;
			}
		}
	}
	.msglist{
		padding:0 24rpx;
		.msg_item{
			display: flex;
			background:#ffffff;
			border-radius: 20rpx;
			padding:30rpx 46rpx 20rpx 30rpx;
			margin-bottom:16rpx;
			.avatar{
				width: 62rpx;
				height:62rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			.con{
				display: flex;
				flex-direction: column;
				margin-left:20rpx;
				.text{
					font-size: 24rpx;
					color:#141313;
				}
				.time{
					font-size: 20rpx;
					color:#707070;
				}
				.cmt_att{
					margin:20rpx 0;
					.img{
						width: 180rpx;
						height: 180rpx;
						margin-right: 12rpx;
						overflow: hidden;
						text-align: center;
						vertical-align: middle;
						background-color: #f3f3f3;
						image{
							width: 180rpx;
							height: 180rpx;
						}
					}
				}
			}
			&:last-child{
				margin-bottom: 0;
			}
		}
	}
</style>
