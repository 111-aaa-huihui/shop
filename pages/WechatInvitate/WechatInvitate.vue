<template>
	<view class="hc">
		<view class="bg" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">邀请功能</span>
		</view>
		<view class="content">
			<view class="rewardbox">
				<text class="title">我累计获得的奖励</text>
				<view class="price_wrap">
					￥<text class="price">{{totalPrice}}</text>
				</view>
				<view class="btn" @click="withdrawal">去提现</view>
			</view>
			<view class="btnbox">
				<view class="wechat_btn btn_default" @click="wxinvite">
					<image src="/static/img/icon_wechats.png" mode="aspectFit" style="width: 39rpx;height:32rpx;"></image>
					<text class="text">微信邀请</text>
				</view>
				<view class="ewm_btn btn_default" @click="qrcode">
					<image src="/static/img/icon_ewm.png" mode="aspectFit" style="width: 32rpx;height:31rpx;"></image>
					<text class="text">邀请二维码</text>
				</view>
			</view>
			<view class="invitebox">
				<view class="tabview">
					<view class="tabview_item" :class="{active:current==1}" @click="tab(1)">
						<text class="label">通过微信邀请</text>
					</view>
					<view class="tabview_item" :class="{active:current==2}" @click="tab(2)">
						<text class="label">通过二维码邀请</text>
					</view>
				</view>
				<Empty height="600" v-if="list.length==0"></Empty>
				<view class="invite_list" v-else>
					<view class="invite_item" v-for="(item,index) in list" :key="index">
						<view class="avatar">
							<u-avatar src="/static/img/avatar.jpg" size="66"></u-avatar>
						</view>
						<view class="title_wrap">
							<view class="name">
								<text>{{item.nickname}}</text>
								<text v-if="item.city">（{{item.city}}）</text>
							</view>
							<text class="desc">你已获得{{item.money}}元！奖励次日到账~</text>
						</view>
					</view>
				</view>
				<loadMore :status="status" :show="loadShow"></loadMore>
			</view>
		</view>
		<shareMask :show="maskshow" @close="wxclose"></shareMask>
	</view>
</template>

<script>
	import Empty from '@/components/empty.vue'
	import loadMore from '@/components/loadmore.vue'
	import shareMask from '@/components/shareMask.vue'
	import wxShare from '@/common/wechatMP.js'
	export default {
		components: {
			Empty,
			loadMore,
			shareMask
		},
		data() {
			return {
				navshow:false,
				current:1,
				totalPrice:0,
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false,
				maskshow:false
			}
		},
		methods: {
			routeAbout(){
				this.$u.route({
					type:'switchTab',
					url:'pages/about/about'
				})
			},
			withdrawal(){
				if(this.totalPrice==0){
					uni.showToast({
						title:"没有奖励金额，暂时无法提现",
						icon:"none"
					})
					return false;
				}
				uni.navigateTo({
					url:"/pages/withdrawal/withdrawal"
				})
			},
			tab(index){
				this.current = index;
				this.list = [];
				this.page = 1;
				this.loadData();
			},
			wxinvite(){
				this.$api.http.userenQrcode().then((res)=>{
					if(res.code==200){
						uni.setStorage({key:"upid",data:res.data});
						uni.setStorage({key:"way",data:"1"});
					}
					this.maskshow = true;
				})
			},
			wxclose(){
				this.maskshow = false;
			},
			qrcode(){
				uni.navigateTo({
					url:"/pages/qrcode/qrcode"
				})
			},
			async loadData(){
				await this.$api.http.getinvitelog(this.page,this.limit).then((res)=>{
					if(res.code == 200){
						this.totalPrice = res.data.total;
						// this.totalPrice = res.data.able;
						let data = res.data.list.data.filter((item)=>{
							if(item.from_way==this.current){
								return item;
							}
						})
						this.list = this.list.concat(data);
						this.total = res.data.list.total;
						if(data.length<this.total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(data.length == 0) {
							this.status = 'nomore';
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			initMPShare(){
				wxShare.initShare({
					title: "批发商城",
					desc: '一起分享吧...',
					link: window.location.origin+"/#/pages/login/register?pid="+uni.getStorageSync("upid"),
					imgUrl: window.location.origin+"/static/img/shares.jpg"
				});
			}
		},
		onShow(){
			this.list = [];
			this.loadData();
			this.initMPShare();
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

<style lang="scss">
	.hc {
		background: #F8F8F8;
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

			.nav {
				margin-right: 20rpx;
			}

			.title {
				font-size: 30rpx;
				font-weight: 550;
				color: #141313;
			}
		}
		.content{
			padding:48rpx;
			.rewardbox{
				background:url(../../static/img/reward_bg.png) no-repeat;
				background-size: 100%;
				height:242rpx;
				padding:0 80rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;
				.title{
					font-size: 24rpx;
					color:#141313;
				}
				.price_wrap{
					font-size: 24rpx;
					color:#FF9D00;
					.price{
						font-size: 50rpx;
					}
				}
				.btn{
					margin-top:20rpx;
					width: 158rpx;
					height: 48rpx;
					line-height: 48rpx;
					background: #ff9d00;
					border-radius: 24rpx;
					text-align: center;
					font-size: 24rpx;
					color:#ffffff;
				}
			}
			.btnbox{
				margin:26rpx 0;
				display: flex;
				justify-content: space-between;
				.btn_default{
					width:90%;
					height:100rpx;
					border-radius: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.text{
						margin-left:24rpx;
						font-size: 24rpx;
						color:#ffffff;
					}
				}
				.wechat_btn{
					background:#1ab818;
				}
				.ewm_btn{
					background:#ff9d00;
					margin-left:16rpx;
				}
			}
			.invitebox{
				.tabview{
					display: flex;
					.tabview_item{
						flex:1;
						display: flex;
						align-items: center;
						justify-content: center;
						.label{
							font-size: 28rpx;
							color:#707070;
							padding:20rpx 0;
							position: relative;
						}
						&.active{
							.label{
								color: #FF9D00;
								&::after{
									content:"";
									position: absolute;
									bottom:0;
									left:0;
									width:100%;
									height:6rpx;
									background:#FF9D00;
								}
							}
						}
					}
				}
				.invite_list{
					background: #ffffff;
					border-radius: 24rpx;
					.invite_item{
						margin:0 18rpx;
						padding:20rpx;
						border-bottom: 2rpx solid #f6f6f6;
						display: flex;
						align-items: center;
						.avatar{
							width: 66rpx;
							height: 66rpx;
							// background: #141313;
							border-radius: 50%;
							flex-shrink: 0;
						}
						.title_wrap{
							margin-left:20rpx;
							display: flex;
							flex-direction: column;
							.name{
								font-size: 24rpx;
								color:#141313;
							}
							.desc{
								font-size: 24rpx;
								color:#707070;
							}
						}
						&:last-child{
							border-bottom:0;
						}
					}
				}
			}
		}
	}
</style>
