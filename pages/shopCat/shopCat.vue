<template>
	<view class="container">
		<view class="cat_tit">购物车{{cartnum}}</view>
		<Empty height="400" v-if="cartList.length==0"></Empty>
		<block v-else>
			<view class="cart_list">
				<view class="cart_item" v-for="(item,index) in cartList" :key="index" v-if="item.sku_info!=null">
					<view class="icon_checkbox">
						<image :src="item.checked?'/static/img/icon_checked.png':'/static/img/icon_check.png'" mode="aspectFit" @click="check('item', index)"></image>
					</view>
					<view class="image_wrapper" v-for="(items,index) in item.pic_arr" :key="index" v-if="index==0">
						<image :src="items.domain+items.path.substr(1)" mode="aspectFill"></image>
					</view>
					<view class="item_right">
						<text class="title">{{item.product_info.title}}</text>
						<text class="price">￥{{item.sku_info.price}}</text>
						<view class="num_wrap">
						    <text class="minus disable" @click="sub(index,item.cart_id)"><text class="row"></text></text>
						    <view class="text_wrap"><input class="text" type="tel" v-model="item.stock" disabled="true"></view>
						    <text class="plus" @click="add(index,item.cart_id)"><text class="row"></text><text class="col"></text></text>
						</view>
					</view>
					<view class="del_btn icon_del" @click="deleteCartItem(index,item.cart_id)">
						<image src="/static/img/icon_close.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="nomore">
				<text>没有更多啦~</text>
			</view>
		</block>
		<view class="shoplist">
			<view class="titles">合作商家</view>
			<Empty height="300" v-if="prolist.length==0"></Empty>
			<v-prolist :plist="prolist" @eventClick="detail" v-else></v-prolist>
		</view>
		<view class="action_section">
			<view class="icon_checkbox" @click="check('all')">
				<image :src="allChecked?'/static/img/icon_checked.png':'/static/img/icon_check.png'" mode="aspectFit"></image>
				<text class="tits">全选</text>
			</view>
			<view class="total_box">
				<text>合计：</text>
				<text class="price">￥{{total}}</text>
			</view>
			<button type="default" class="confirm_btn disable" disabled="true" v-if="cklist.length==0">去结算</button>
			<button type="default" class="confirm_btn" @click="goSubmit" v-else>去结算</button>
		</view>
		<view class="place"></view>
	</view>
</template>

<script>
	import proList from '@/components/prolist.vue'
	import Empty from '@/components/empty.vue'
	export default {
		components: {
			"v-prolist":proList,
			Empty
		},
		data() {
			return {
				cartnum:"",
				cartList:[],
				total: 0, //总价格
				allChecked: false,
				prolist:[],
				cklist:[]
			}
		},
		methods: {
			//请求数据
			async loadData(){
				this.$api.http.cartList().then((res) => {
					if(res.code == 200){
						this.cartList = res.data.data;
						if(res.data.total>0){
							this.cartnum = "("+res.data.total+")";
							let cartList = this.cartList.map(item=>{
								item.checked = false;
								return item;
							});
							this.allChecked = false;
							this.cartList = cartList;
						}else{
							this.cartnum = "";
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				});
			},
			//请求商家数据
			async loadshopData(){
				this.$api.http.getProductlist(2,1,10).then(res => {
					if(res.code == 200){
						this.prolist = res.data.data;
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
			//选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.cklist = [];
				this.cartList.map(item=>{
					item.checked ? this.cklist.push(item):""
				})
				this.calcTotal();
			},
			// 减少数量
			sub(index,id){
				if(this.cartList[index].stock<=1){
					return;
				}
				if(this.cartList[index].stock<=this.cartList[index].product_info.buy_over){
					return;
				}
				let number = this.cartList[index].stock;
				this.$api.http.changeCartnum(id,number,0).then((res) => {
					if(res.code == 200){
						this.cartList[index].stock--;
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
				this.calcTotal();
			},
			// 增加数量
			add(index,id){
				let number = this.cartList[index].stock;
				let limit = this.cartList[index].product_info.buy_limit;
				if(number>limit){
					return false;
				}
				this.$api.http.changeCartnum(id,number,1).then((res) => {
					if(res.code == 200){
						this.cartList[index].stock++;
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
				this.calcTotal();
			},
			//删除
			deleteCartItem(index,id){
				let that = this;
				let list = this.cartList;
				uni.showModal({
				    title: '提示',
				    content: '确定是否删除该商品？',
					confirmColor:"#FF9D00",
				    success: function (res) {
				        if (res.confirm) {
				            that.$api.http.delCart(id).then((res) => {
				            	if(res.code == 200){
				            		that.cartList.splice(index, 1);
				            		that.loadData();
				            	}else{
				            		uni.showToast({
				            			title: res.message,
				            			icon: "none"
				            		})
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += parseFloat(item.sku_info.price) * item.stock;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = total.toFixed(2);
			},
			//结算
			goSubmit(){
				let that = this;
				if(this.cklist.length){
					uni.removeStorageSync("isbuy");
					uni.removeStorageSync("cartlist");
					setTimeout(()=>{
						uni.setStorage({key: 'isbuy', data:"0"});
						uni.setStorage({key: 'cartlist', data: {data:JSON.stringify(this.cklist),total:this.total}});
						uni.navigateTo({
							url:"/pages/order/orderConfirm"
						})
					},800)
				}
			}
		},
		onLoad(){
			this.loadData();
			this.loadshopData();
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/micromessenger/i) == 'micromessenger') {
				this.$wxin({
					title: "批发商城",
					desc: '一起分享吧...',
					link: window.location.origin+"/#/pages/index/index",
					imgUrl:window.location.origin+"/static/img/shareimg.jpg"
				});
			}
		},
		onShow(){
			document.title = '批发商城';
			this.cartList = [];
			this.allChecked = false;
			this.loadData();
			this.loadshopData();
		}
	}
</script>

<style lang="scss">
	page{background:#FFFFFF;}
.cat_tit{
	/* #ifdef H5 */
	padding-top:50rpx;
	/* #endif */
	padding-left:49rpx;
	font-size: 45rpx;
	color:#000000;
}
.cart_list{
	.cart_item{
		margin:0 48rpx;
		padding:40rpx 0;
		border-bottom:2rpx #eee solid;
		display: flex;
		&:last-child{
			border-bottom:0;
		}
		.icon_checkbox{
			width: 34rpx;
			height: 34rpx;
			margin-top:60rpx;
			image{
				width:100%;
				height:100%;
			}
		}
		.image_wrapper{
			width:150rpx;
			height: 150rpx;
			margin:0 30rpx;
			background:#eee;
			image{
				width:100%;
				height: 100%;
			}
		}
		.item_right{
			display: flex;
			flex-direction: column;
			flex:1;
			.title{
				font-size: 28rpx;
				color:#141313;
				margin-bottom:8rpx;
				margin-right: 40rpx;
			}
			.price{
				font-size: 24rpx;
				color:#FF9D00;
			}
			.num_wrap{
				display: flex;
				width:120rpx;
				height:40rpx;
				background:#F8F8F8;
				margin-top:30rpx;
				border-radius: 20rpx;
				.minus,.plus{
					position: relative;
					max-width: 30rpx;
					min-width: 30rpx;
					height: 40rpx;
					line-height: 40rpx;
					background: #f7f7f7;
					text-align: center;
					flex:1;
					.row{
						position: absolute;
						top: 50%;
						left: 50%;
						margin-left: -3px;
						width: 7px;
						height: 1px;
						background-color: #b1b1b1;
					}
					.col{
						position: absolute;
						top: 50%;
						left: 50%;
						margin-top: -3px;
						width: 1px;
						height: 7px;
						background-color: #b1b1b1;
					}
				}
				.text_wrap{
					flex:1;
					text-align: center;
					display: flex;
					align-items: center;
					.text{
						font-size: 22rpx;
						color:#B1B1B1;
						line-height: 34rpx;
					}
				}
			}
		}
		.icon_del{
			width:18rpx;
			height: 18rpx;
			image{
				width:100%;
				height: 100%;
			}
		}
	}
}
.nomore{
	font-size: 20rpx;
	color:#B1B1B1;
	padding:30rpx 0;
	text-align: center;
	border-bottom:2rpx #eee solid;
	margin:0 54rpx;
}
.shoplist{
	padding:40rpx 54rpx 120rpx;
	.titles{
		font-size: 30rpx;
		color:#141313;
		font-weight: bold;
		border-bottom: #FFCE7F 4rpx solid;
		display: inline-block;
		margin-bottom:34rpx;
	}
}
.action_section{
	/* #ifdef H5 */
	margin-bottom:90rpx;
	/* #endif */
	position:fixed;
	left: 0;
	bottom:0;
	z-index: 95;
	display: flex;
	align-items: center;
	background:#fff;
	box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
	width:100%;
	height:100rpx;
	padding:0 40rpx;
	.icon_checkbox{
		display: flex;
		align-items: center;
		.tits{
			font-size: 20rpx;
			color:#B1B1B1;
			margin-left:20rpx;
		}
		image{
			width:34rpx;
			height: 34rpx;
		}
	}
	.total_box{
		flex:1;
		text-align: right;
		margin-right:20rpx;
		font-size:20rpx;
		color:#B1B1B1;
		.price{
			font-size: 28rpx;
			color:#FF9D00;
		}
	}
	.confirm_btn{
		width: 180rpx;
		height: 60rpx;
		background: #ff9d00;
		border-radius: 30rpx;
		font-size: 20rpx;
		color:#FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		&.disable{
			background: #f7f7f7;
			color:rgb(192, 196, 204);
		}
	}
}
.place{
	height: 100rpx;
}
</style>
