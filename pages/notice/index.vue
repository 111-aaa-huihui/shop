<template>
	<view class="container">
        <view class="chat-list">
			<view class="chat" v-for="(item,index) in list" :key="index">
				<view class="row" @click="toChat(item)">
					<view class="left">
						<u-icon name="bell-fill" size="40" color="#ffffff" class="icon"></u-icon>
					</view>
					<view class="right">
						<view class="top">
							<view class="username">{{item.title}}</view>
							<view class="time">{{item.create_at|parseDateFull}}</view>
						</view>
						<view class="bottom">
							<view class="msg">{{item.content}}</view>
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
				list:[],
				status: 'loading',
				page:1,
				loadShow:false
			}
		},
		filters:{
			parseDateFull(time) {
				let date = new Date(time*1000);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? "0" + MM : MM;
				let d = date.getDate();
				d = d < 10 ? "0" + d : d;
				let h = date.getHours();
				h = h < 10 ? "0" + h : h;
				let m = date.getMinutes();
				m = m < 10 ? "0" + m : m;
				let s = date.getSeconds();
				s = s < 10 ? "0" + s : s;
				return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
		    }
		},
		methods: {
			async loadData(){
				await this.$api.http.getNotice(this.page,10).then((res)=>{
					if(res.code==200){
						let total = res.data.total;
						if(this.page==1){
							this.list = res.data.data; 
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
			},
			toChat(data){
				uni.setStorage({key:"notice",data:data.content});
				uni.navigateTo({
					url:"/pages/notice/detail"
				})
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
			this.page = 1;
			this.loadData();
		}
	}
</script>
<style lang="scss" scoped>
	.chat-list{
		width: 100%;
		padding-top: 20rpx;
		.chat{
			width: 100%;
			height: 130rpx;
			padding: 20rpx;
			background:#ffffff;
			margin-bottom: 20rpx;
			.row{
				display: flex;
				justify-content: flex-start;
				.left{
					flex-shrink:0;
					width: 80rpx;
					height: 80rpx;
					background:#ff9d00;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.right{
					flex-shrink:1;
					width: 98%;
					padding-left: 2%;
					overflow: hidden;
					.top{
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.usernam{
							font-size: 26rpx;
						}
						.time{
							font-size: 22rpx;
							color: #bebebe;
						}
					}
					.bottom{
						width: 100%;
						height: 40rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.msg{
							font-size: 25rpx;
							color: #777777;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
						.tis{
							width: 35rpx;
							height: 35rpx;
							font-size: 22rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #eb4d3d;
							color: #fff;
							border-radius: 100%;
						}
					}
				}
			}
		}
	}
</style>