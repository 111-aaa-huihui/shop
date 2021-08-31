<template>
	<view class="container">
		<u-navbar class="head_nav" :class="{on:scrolltop>60}" :back-icon-color="backcolor" :background="navbg" :border-bottom="false">
			<view slot="right" class="share" v-if="shareShow">
				<button open-type="share" class="btn_share" @click="wxshares">
					<image src="/static/img/icon_shares.png" mode="aspectFit" style="width: 22rpx;height: 22rpx;margin-right: 16rpx;" v-if="iconshow"></image>
					<image src="/static/img/icon_share.png" mode="aspectFit" style="width: 22rpx;height: 22rpx;margin-right: 16rpx;" v-else></image>
					<text>分享</text>
				</button>
			</view>
		</u-navbar>
		<view class="mod_slider">
			<swiper class="carousel" :circular="true" :indicatorDots="true" interval="3000" duration="700" indicator-color="#ffffff" indicator-active-color="#ff9d00">
				<swiper-item v-for="(items,index) in goodsData.pic_arr" :key="index">
					<view class="image-wrapper">
						<image :src="items.domain+items.path.substr(1)" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="detail_decoration" v-if="show">
				<view class="title_price_wrap">
					<view class="title_wrap">
						<view class="price_wrap">
							<text>￥</text>
							<text class="price">{{price}}</text>
							<text></text>
						</view>
						<view class="purchase">限购{{goodsData.buy_limit}}件</view>
					</view>
					<view class="old_price">￥{{oldprice}}</view>
				</view>
				<view class="right">
					<view class="tag_tip">{{goodsData.buy_over}}件起买</view>
					<view class="tip">活动火爆进行中 ——</view>
				</view>
			</view>
		</view>
		<view class="fn_text_container">
			<view class="hd" v-if="hotshow">
				<view class="left">
					<view class="price_wrap">
						<text>￥</text>
						<text class="price">{{price}}</text>
						<text></text>
					</view>
					<view class="noprice">￥{{oldprice}}</view>
				</view>
				<view class="right">
					<button open-type="share" class="btn_share" @click="wxshares">
						<image src="/static/img/icon_share.png" mode="aspectFit" style="width: 22rpx;height: 22rpx;margin-right: 16rpx;"></image>
						<text>分享</text>
					</button>
				</view>
			</view>
			<view class="fn_text_wrap">{{goodsData.title}}</view>
			<view class="market_benefit">
				<view class="pro_addr" v-if="goodsData.growth!=''">
					<u-icon size="24" name="/static/img/icon_map.png"></u-icon>
					<text class="name">{{goodsData.growth}}</text>
				</view>
				<text class="fn_text">月销{{goodsData.month_sell_num}}</text>
				<text class="fn_text">{{goodsData.has_pay_num}}人付款</text>
			</view>
		</view>
		<view class="floor_item">
			<view class="sku_choose">
				<text class="title">选择规格</text>
				<view class="tags_wrap">
					<view class="i-tags" :class="{on:cur==index}" v-for="(items,index) in goodsData.sku_arr" :key="index" @click="tab(index,items)">{{items.size}}</view>
				</view>
			</view>
			<view class="num_choose">
				<text class="title">选择数量</text>
				<view class="num_wrap">
				    <view class="minus" @click="sub"><u-icon size="48" name="/static/img/minus.png"></u-icon></view>
				    <text class="text_wrap">{{number}}</text>
				    <view class="plus" @click="add"><u-icon size="48" name="/static/img/plus.png"></u-icon></view>
				</view>
			</view>
			<view class="detail_info">
				<text class="title">商品详情</text>
				<u-parse :html="goodsData.desc" :lazy-load="true"></u-parse>
			</view>
		</view>
		<view class="de_btn_bar">
			<view class="icon_home icon_bar" @click="pageTo('/pages/home/home')">
				<u-icon size="40" name="/static/img/tab_home.png"></u-icon>
				<text>首页</text>
			</view>
			<view class="icon_cart icon_bar" @click="pageTo('/pages/shopCat/shopCat')">
				<u-icon size="40" name="/static/img/tab_cart.png"></u-icon>
				<text>购物车</text>
				<text class="num" v-if="cartnum>0">{{cartnum}}</text>
			</view>
			<button type="default" class="btn_cart" @click="joinCart" v-if="hasLogin=='true'">加入购物车</button>
			<button type="default" class="btn_cart" @click="goLogin" v-else>立即登录</button>
		</view>
		<u-toast ref="uToast" />
		<shareMask :show="maskshow" @close="wxclose"></shareMask>
	</view>
</template>

<script>
	import shareMask from '@/components/shareMask.vue'
	import wxShare from '@/common/wechatMP.js'
	import { mapGetters,mapMutations } from 'vuex';
	export default {
		components: {
			shareMask
		},
		data() {
			return {
				shareShow:true,
				scrolltop:0, //滚动距离
				backcolor:"#ffffff",
				navbg:{
					background:"transparent"
				},
				iconshow:true,
				imgList: [],
				goodsData:[],
				show:true,
				hotshow:false,
				pid:0, //产品ID
				skuid:0, //规格ID
				price:"0",
				oldprice:"0",
				cur:0, //规格是否选中
				number:1, //数量
				cartnum:0,
				maskshow:false,
				share:{
					title:"",
					imgsrc:""
				}
			}
		},
		computed: {
		    ...mapGetters(['hasLogin','getAllCount'])
		},
		methods:{
			...mapMutations(['addToCart']),
			goback(){
				uni.navigateBack();
			},
			//主导航跳转
			pageTo(url){
				uni.switchTab({
					url:url
				})
			},
			//登录
			goLogin(){
				uni.setStorage({key:"loginOriginUrl",data:this.$mp.page.route});
				uni.navigateTo({
					url:"/pages/login/login"
				})
			},
			async loadData(){
				this.$api.http.getProDetail(this.pid).then(res => {
					if(res.code == 200){
						this.goodsData = res.data;
						this.price = res.data.sku_arr[0].price;
						this.oldprice = res.data.sku_arr[0].history_price;
						this.skuid = res.data.sku_arr[0].sku_id;
						this.number = res.data.buy_over;
						this.share.title = res.data.title;
						this.share.imgsrc = res.data.pic_arr[0].domain+res.data.pic_arr[0].path.substr(1);
						this.initMPShare();
						this.getcart();
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			//规格切换
			tab(index,data){
				this.cur = index;
				this.price = data.price;
				this.oldprice = data.history_price;
				this.skuid = data.sku_id;
			},
			//获取购物车数量
			getcart(){
				this.$api.http.cartList().then((res) => {
					if(res.code == 200){
						this.cartnum = res.data.total;
					}
				})
			},
			// 加入购物车
			joinCart(){
				this.$api.http.addCart(this.pid,this.skuid,this.number).then((res) => {
					if(res.code == 200){
						this.$refs.uToast.show({
							title: '加入购物车成功'
						})
						// let nlist = {
						// 	id:this.goodsData.id,
						// 	count:this.number
						// }
						// this.addToCart(nlist);
						this.getcart();
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			//减少数量
			sub(){
				if(this.number<=1){
					return;
				}
				if(this.number<=this.goodsData.buy_over){
					return;
				}
				this.number--;
			},
			//增加数量
			add(){
				this.number++;
				if(this.number>this.goodsData.buy_limit){
					this.number--;
				}
				if(this.number>this.goodsData.stock){
					this.number--;
					uni.showToast({
						title:"库存不足",
						icon:"none"
					})
				}
			},
			wxshares(){
				if(this.hasLogin=="false"){
					uni.showToast({
						title:"请立即登录，进行分享",
						icon:"none"
					})
				}else{
					this.$api.http.userenQrcode().then((res)=>{
						if(res.code==200){
							uni.setStorage({key:"upid",data:res.data});
							uni.setStorage({key:"way",data:"1"});
						}
						this.maskshow = true;
					})
				}
			},
			wxclose(){
				this.maskshow = false;
			},
			initMPShare(){
				let urls = window.location.href;
				let title = this.share.title;
				let imgsrc = this.share.imgsrc;
				let upid = uni.getStorageSync("upid");
				if(upid){
					urls = window.location.href+"?pid="+upid
				}
				wxShare.initShare({
					title: title,
					desc: title,
					link: urls,
					imgUrl: imgsrc
				});
			}
		},
		onPageScroll(e) {
			//导航栏渐变
			let tmpY = 375;
			e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			this.scrolltop = e.scrollTop;
			if(e.scrollTop>60){
				this.iconshow = false;
				this.backcolor = "#000000";
				this.navbg = {background:"#ffffff"};
			}else{
				this.iconshow = true;
				this.backcolor = "#ffffff";
				this.navbg = {background:"transparent"};
			}
		},
		onLoad(option) {
			let num = parseInt(option.type);
			this.pid = option.id;
			if(option.type!=undefined){
				this.show = false;
				this.hotshow = true;
				this.shareShow = false;
			}else{
				if(option.pid){
					uni.setStorage({key:"upid",data:option.pid});
					uni.setStorage({key:"way",data:"1"});
				}
				this.show = true;
				this.hotshow = false;
				this.shareShow = true;
			}
			this.loadData();
		},
		onShow(){
			document.title = '批发商城';
		}
	}
</script>

<style lang="scss">
	page{background: #ffffff;}
	.status {
		width: 100%;
		position: fixed;
		z-index: 10;
		top: 0;
		height: var(--status-bar-height); //覆盖样式
	}
	.head_nav{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		top:0;
		left:0;
		.share{
			display: flex;
			.btn_share{
				display: flex;
				align-items: center;
				background: none;
				border:0;
				padding-left: 0;
				padding-right: 0;
				font-size: 18rpx;
				color:#ffffff;
				margin:0 14rpx;
			}
		}
		&.on{
			background: #ffffff;
			position: relative;
			.share{
				.btn_share{
					color:#707070;
				}
			}
		}
	}
	.mod_slider {
		position: relative;

		.carousel {
			height: 526rpx;
			background: #eee;

			.image-wrapper {
				display: flex;
				justify-content: center;
				align-content: center;
				width: 100%;
				height: 100%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.detail_decoration {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 160rpx;
			background: url(../../static/img/detail_bg.png) no-repeat;
			background-size: 100% 100%;
			display: flex;
			.title_price_wrap {
				flex:1;
				padding-top: 34rpx;
				padding-left: 52rpx;
				.title_wrap {
					display: flex;
					flex: 1;
					align-items: center;
					.price_wrap {
						font-size: 30rpx;
						color: #fff;
						.price {
							font-size: 50rpx;
						}
					}
					.purchase {
						margin-left: 6rpx;
						height: 32rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #ffffff;
						border-radius: 14rpx;
						padding: 0 20rpx;
						font-size: 22rpx;
						color: #FF0000;
					}
				}
				.old_price{
					font-size: 20rpx;
					color:#fff;
					text-decoration: line-through;
				}
			}
			.right{
				width:228rpx;
				padding-top:48rpx;
				.tag_tip{
					background:#ff9d00;
					height: 34rpx;
					line-height: 34rpx;
					font-size: 20rpx;
					color:#fff;
					border-top-left-radius:34rpx;
					border-bottom-left-radius:34rpx;
					padding: 0 24rpx;
				}
				.tip{
					margin-top:14rpx;
					font-size: 24rpx;
					color:#D20000;
				}
			}
		}
	}
	.fn_text_container{
		background:#fff;
		padding:28rpx 54rpx;
		border-bottom:6rpx #eee solid;
		.hd{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom:12rpx;
			.left{
				display: flex;
				align-items: center;
				.price_wrap{
					font-size: 30rpx;
					color:#FF9D00;
					.price{
						font-size: 40rpx;
					}
				}
				.noprice{
					margin-left: 20rpx;
					font-size: 20rpx;
					color:#B1B1B1;
					text-decoration: line-through;
					display: flex;
					align-items: center;
				}
			}
			.right{
				display: flex;
				align-items: center;
				.btn_share{
					display: flex;
					align-items: center;
					background:none;
					border:0;
					padding-left: 0;
					padding-right: 0;
					font-size: 20rpx;
					color:#707070;
					line-height: 60rpx;
				}
			}
		}
		.fn_text_wrap{
			font-size: 28rpx;
			color:#141313;
			font-weight: bold;
		}
		.market_benefit{
			margin-top:16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.pro_addr{
				font-size: 20rpx;
				color:#141313;
				display: flex;
				align-items: center;
				.name{
					margin-left:24rpx;
				}
			}
			.fn_text{
				font-size: 20rpx;
				color:#B1B1B1;
			}
		}
	}
	.floor_item{
		background: #fff;
		padding:0 52rpx 88rpx;
		.title{
			display: flex;
			font-size: 24rpx;
			color:#141313;
			padding:24rpx 0;
			font-weight: bold;
		}
		.sku_choose{
			.tags_wrap{
				display: flex;
				.i-tags{
					padding:10rpx 26rpx;
					background:#d4d4d4;
					border-radius: 12rpx;
					font-size: 24rpx;
					color:#fff;
					margin-right: 30rpx;
					&.on{
						background:#ff9d00;
					}
				}
			}
		}
		.num_choose{
			padding-bottom:11rpx;
			.num_wrap{
				display: flex;
				align-items: center;
				.minus,.plus{
					width:48rpx;
					height: 48rpx;
				}
				.text_wrap{
					color:#D4D4D4;
					font-size: 24rpx;
					padding:0 30rpx;
				}
			}
		}
		.detail_info{
			border-top:2rpx #eee solid;
			margin-bottom: 88rpx;
		}
	}
	.de_btn_bar{
		position: fixed;
		bottom:0;
		left:0;
		z-index:50;
		width: 100%;
		height:88rpx;
		background:#ffffff;
		box-shadow: 0px -1px 1px 0px rgba(0,0,0,0.16); 
		display: flex;
		align-items: center;
		.icon_bar{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 20rpx;
			color:#B1B1B1;
			margin-left:54rpx;
		}
		.icon_cart{
			position: relative;
			.num{
				position: absolute;
				top:0;
				right:0;
				font-size: 24rpx;
				color:#fff;
				background: #ff9d00;
				border-radius: 50%;
				padding:0 10rpx;
			}
		}
		.btn_cart{
			width: 436rpx;
			height:70rpx;
			line-height: 70rpx;
			background: #ff9d00;
			border:0;
			border-radius: 36rpx;
			font-size: 24rpx;
			color:#fff;
		}
	}
</style>
