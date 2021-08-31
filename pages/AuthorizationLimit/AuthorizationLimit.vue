<template>
	<view class="hc">
		<view class="bg" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">授权额度</span>
		</view>
		<block v-if="pageShow">
			<view class="head">
				<view class="userBox">
					<view class="userNumber">
						<view class="numberbox" :style="{height:percent+'%'}"></view>
						<view class="text">
							<text>可用</text>
							<text>{{percent}}%</text>
						</view>
					</view>
					<view class="rightBox">
						<view class="userFont">已用额度：{{fbalance}}</view>
						<view class="userFontWo">可用额度：<text class="spanSize">￥{{abalance}}</text></view>
					</view>
				</view>
				<view class="footBox">
					<view class="left">基础额度：<text class="spanSize">{{abalance}}</text></view>
					<view class="center"></view>
					<view class="right">
						<view @click="quantity">调整额度</view>
					</view>
				</view>
			</view>
			<view class="account_list">
				<view class="title">账单</view>
				<view class="tabs_box">
					<view class="inv_h_w">
						<view :class="['inv_h',Inv==1?'active':'']" @click="changeTab(1)">本月应还</view>
						<view :class="['inv_h',Inv==2?'active':'']" @click="changeTab(2)">下月待还</view>
					</view>
					<view class="inv_con">
						<view class="invitem nomore" v-if="show">
							<view class="tit">
								<text>应还金额</text>
								<text class="money">￥0.00</text>
							</view>
							<view class="con">
								<image src="/static/img/nomore.png" mode="aspectFit" style="width:76px;height:69px;"></image>
								<text class="notip" v-if="Inv==1">本月无需还清~</text>
								<text class="notip" v-if="Inv==2">下月无需还清~</text>
							</view>
						</view>
						<view class="invitem" v-for="(item,index) in list" :key="index" v-else>
							<view class="tit">{{item.pay_time|parseDateFull}}</view>
							<view class="con" @click="toggleList(index)">
								<view class="left" v-for="(items,index) in item.order_info" :key="index" v-if="index==0">
									<text class="name">{{items.title}}</text>
									<text class="name" v-if="items.size">*{{items.size}}</text>
								</view>
								<view class="price">{{item.op_able_balance}}</view>
								<view class="icon" v-if="item.order_info.length>1">
									<u-icon name="arrow-up" size="22" color="#D4D4D4" v-if="indexNow===index"></u-icon>
									<u-icon name="arrow-down" size="22" color="#D4D4D4" v-else></u-icon>
								</view>
							</view>
							<view class="cons" v-if="indexNow===index">
								<view class="item" v-for="(items,index) in item.order_info" :key="index">
									<view class="lft">
										<text>{{items.title}}</text>
										<text v-if="items.size">*{{items.size}}</text>
									</view>
									<view class="rht">
										<text>{{items.price}}</text>
									</view>
								</view>
							</view>
						</view>
						<loadMore :status="status" :show="loadShow"></loadMore>
					</view>
				</view>
			</view>
			<u-gap height="100"></u-gap>
			<view class="btn_actions" v-if="!show">
				<button type="default" class="btn_back btns" @click="payshow = true">还款</button>
				<button type="default" class="btn_primary btns" @click="settle">提前结清</button>
			</view>
		</block>
		<block v-if="auditShow">
			<view class="tipbox">
				<image src="/static/img/noauthor.png" mode="aspectFit" style="width: 434rpx;height:352rpx"></image>
				<text>还未拥有授权额度</text>
				<text>请点击下方“支付宝”“商家交纳押金”进行授权</text>
			</view>
			<u-gap height="200"></u-gap>
			<view class="author_actions">
				<view class="title">授权项</view>
				<view class="btnbox">
					<!-- <view class="alipay_box btnsbox" @click="accredit">
						<image src="/static/img/4073.png" mode="aspectFit" style="width:74px;height:21px;"></image>
					</view> -->
					<view class="amount_box btnsbox" @click="pay">
						<image src="/static/img/111.png" mode="aspectFit" style="width:42rpx;height:44rpx;"></image>
						<text class="text">商家交纳押金</text>
					</view>
				</view>
			</view>
		</block>
		<v-pay :popupShow="payshow" :totalShow="false" :tabIndexs="2" @eventClick="eventClick" @close="close"></v-pay>
	</view>
</template>

<script>
	import loadMore from '@/components/loadmore.vue'
	import Pay from '@/components/pay.vue'
	export default {
		components: {
			loadMore,
			"v-pay":Pay
		},
		data() {
			return {
				navshow:false,
				WeixinStyle: {
					// backgroundColor: '#FF9D00',
					border: '#FF9D00 solid 2upx',
					color: '#FF9D00'
				},
				pageShow:false,
				auditShow:false,
				Inv:1, //选中
				show:true,
				fbalance:"0", //已用额度
				abalance:"0", //可用额度
				balance:"0",
				percent:"100",
				list:[],
				status: 'loading',
				page:1,
				limit:10,
				total:0,
				loadShow:false,
				indexNow:"",
				payshow:false,
				totalprice:0
			}
		},
		filters:{
			parseDateFull(time) {
				let date = new Date(time*1000);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM;
				let d = date.getDate();
				d = d < 10 ? "0" + d : d;
				let h = date.getHours();
				h = h < 10 ? "0" + h : h;
				let m = date.getMinutes();
				m = m < 10 ? "0" + m : m;
				let s = date.getSeconds();
				s = s < 10 ? "0" + s : s;
				return MM + "月" + d + "日" + "" + h + ":" + m + ":" + s;
		    }
		},
		methods: {
			routeAbout(){
				this.$u.route({
					type:'switchTab',
					url:'pages/about/about'
				})
			},
			toggleList(index){
			    if(this.indexNow === index){
					this.indexNow = "";
				}else{
					this.indexNow = index;
				}
			},
			changeTab(Inv){
			    this.Inv = Inv;
				if(this.Inv==1){
					this.totalprice = uni.getStorageSync("should_pay_money");
				}else{
					this.totalprice = uni.getStorageSync("wait_pay_money");
				}
				uni.setStorage({key:"backprice",data:this.totalprice.toString()});
				this.list = [];
				this.page = 1;
				this.getlist();
			},
			quantity(){
				uni.navigateTo({
					url:'/pages/AuthorizationLimit/quantity'
				})
			},
			eventClick(val){
				this.payshow = false;
				this.$api.http.payearly(val,this.totalprice.toString(),"1").then((res)=>{
					if(val=="ali"){
						if(res.code==401){
							uni.showToast({
								title:res.message,
								icon:"none"
							})
						}else{
							const div = document.createElement('div');
							div.innerHTML = res;
							document.body.appendChild(div);
							document.forms[0].submit();
						}
					}else{
						if(res.code==401){
							uni.showToast({
								title:res.message,
								icon:"none"
							})
						}
					}
				})
			},
			close(){
				this.payshow = false;
			},
			settle(){
				uni.navigateTo({
					url:'/pages/AuthorizationLimit/settle'
				})
			},
			accredit(){
				this.$api.http.getUserAli().then((res)=>{
					if(res.code == 200){
						window.location.href = res.data;
					}
				})
				// uni.navigateTo({
				// 	url: '/pages/SignContract/bound'
				// })
			},
			pay(){
				uni.navigateTo({
					url: '/pages/SignContract/pay'
				})
			},
			async loadData(){
				await this.$api.http.getVipinfo().then((res)=>{
					if(res.code == 200){
						this.pageShow = res.data.is_vip == 1?true:false;
						this.auditShow = res.data.is_vip == 1?false:true;
						this.abalance = res.data.able_balance;
						this.fbalance = res.data.frozen_balance;
						this.balance = (this.abalance - this.fbalance).toFixed(2);
						let mount = this.calc2(this.balance,this.abalance);
						this.percent = mount>0?mount.toFixed(2):0;
						uni.setStorage({key:"should_pay_money",data:res.data.should_pay_money});
						uni.setStorage({key:"wait_pay_money",data:res.data.wait_pay_money});
						uni.setStorage({key:"abalance",data:res.data.able_balance});
						uni.setStorage({key:"fbalance",data:res.data.frozen_balance});
						uni.setStorage({key:"backday",data:res.data.pay_back_day});
					}
				})
			},
			calc2(data1,data2) {
				let c = data1/data2;
				let d = c*100;
				return d;
			},
			async getlist(){
				this.$api.http.vipMoneylog(this.Inv,this.page,this.limit).then((res)=>{
					if(res.code == 200){
						this.show = res.data.data.length==0?true:false;
						this.list = this.list.concat(res.data.data);
						// let totalprice = 0;
						// this.list.forEach(item=>{
						// 	totalprice+= parseFloat(item.op_able_balance);
						// })
						this.total = res.data.total;
						if(res.data.data.length<=this.total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(res.data.data.length == 0) {
							this.status = 'nomore';
							this.loadShow = false;
						}
					}else if(res.code==402){
						uni.navigateTo({
							url:"/pages/login/login"
						})
					}
				})
			},
			queryData(){
				this.page = 1;
				this.loadData();
				this.getlist();
			}
		},
		onShow(){
			document.title = '批发商城';
			this.loadData();
			this.list= [];
			this.getlist();
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
			// background-color: red;
			padding: 20upx;
			.userBox{
				width: 100%;
				height: 223rpx;
				background: url(../../static/img/userbg.png) no-repeat center;
				border-radius: 20rpx;
				padding:37rpx 60rpx;
				position: relative;
				display: flex;
				align-items: center;
				// box-shadow:4px 4px 2px #dcdcdc;
				.userNumber{
					width: 149rpx;
					height: 149rpx;
					border: 5rpx solid #ff9d00;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-size:20rpx;
					color:#141313;
					position: relative;
					overflow: hidden;
					.numberbox{
						position: absolute;
						bottom:0;
						left:0;
						right: 0;
						height: 0px;
						background:#FFDFAC;
					}
					.text{
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						position: relative;
						z-index: 20;
					}
				}
				.rightBox{
					margin-left: 36rpx;
					.userFont{
						font-size: 22rpx;
						font-weight: bold;
						color: #000000;
					}
					.userFontWo{
						color: #141313;
						font-weight: bold;
						font-size: 22rpx;
						.spanSize{
							color: #FF9D00;
							font-size: 45rpx;
						}
					}
				}
			}
			.footBox{
				width: 100%;
				height: 82rpx;
				background: #ffffff;
				display: flex;
				line-height: 82rpx;
				padding: 0 43rpx;
				margin-top: 20upx;
				border-radius: 20upx;
				// box-shadow:4px 4px 2px #dcdcdc;
				.left{
					font-size: 22rpx;
					color: #000000;
					.spanSize{
						font-size: 25rpx;
						font-weight: 550;
					}
				}
				.center{
					flex:1
				}
				.right{
					margin-top: 18rpx;
					width: 172rpx;
					height: 47rpx;
					background: #FFFFFF;
					line-height: 43rpx;
					text-align: center;
					border: #FF9D00 solid 2rpx;
					border-radius: 25rpx;
					color: #FF9D00 ;
					font-size: 22rpx;
					&:active {
						opacity: 0.5; //这里重要，就是通过这个透明度来设置
					}
				}
			}
		}
		.account_list{
			padding: 20rpx;
			.title{
				font-size: 30rpx;
				color:#141313;
				font-weight: bold;
				border-bottom: #FFCE7F 4rpx solid;
				display: inline-block;
				margin-bottom:50rpx;
				margin-left:40rpx;
			}
			.tabs_box{
				.inv_h_w{
					display: flex;
					justify-content: center;
					margin-bottom:40rpx;
					.inv_h{
						flex:1;
						text-align: center;
						font-size: 30rpx;
						color:#707070;
						padding-bottom:20rpx;
						position: relative;
						&.active{
							color:#FF9D00;
							&::after{
								content:"";
								width:46rpx;
								height:2rpx;
								background:#FF9D00;
								position: absolute;
								bottom:0;
								left:50%;
								margin-left:-23rpx;
							}
						}
					}
				}
				.inv_con{
					.invitem{
						background:#fff;
						border-radius: 20rpx;
						padding:0 32rpx;
						margin-bottom: 20rpx;
						.tit{
							height:70rpx;
							line-height:70rpx;
							font-size: 20rpx;
							color:#000000;
							border-bottom: 2rpx solid #eeeeee;
						}
						.con{
							padding:20rpx 0;
							display: flex;
							align-items: center;
							.left{
								flex:1;
								font-size:24rpx;
								color:#000000;
								margin-right:40rpx;
								.name{
									font-weight: bold;
								}
							}
							.price{
								font-size:28rpx;
								color:#000000;
								font-weight: bold;
							}
							.icon{
								display: flex;
								margin-left: 22rpx;
							}
						}
						&.nomore{
							padding-bottom:48rpx;
							.tit{
								display: flex;
								justify-content: space-between;
								.money{
									font-size:28rpx;
									color:#FF9D00;
									font-weight: bold;
								}
							}
							.con{
								flex-direction: column;
								padding:56rpx 0 0 0;
								.notip{
									font-size: 24rpx;
									color:#D4D4D4;
									margin-top:30rpx;
								}
							}
						}
						.cons{
							.item{
								padding:12rpx 0;
								display: flex;
								align-items: center;
								.lft{
									font-size: 22rpx;
									color:#000000;
									flex:1;
									margin-right:40rpx;
								}
								.rht{
									font-size: 18rpx;
								}
							}
						}
					}
				}
			}
		}
		.btn_actions{
			position: fixed;
			bottom:0;
			left:0;
			z-index: 50;
			width:100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding:0 48rpx;
			.btns{
				border:0;
				width: 392rpx;
				height: 80rpx;
				line-height:80rpx;
				border-radius: 40rpx;
				box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
				font-size:28rpx;
				margin:0 10rpx 68rpx;
			}
			.btn_primary{
				background: #ff9d00;
				color:#FFFFFF;
			}
			.btn_back{
				background: #ffffff;
				color:#707070;
			}
		}
		.author_actions{
			padding:0 54rpx;
			.title{
				display: inline-block;
				font-size: 30rpx;
				color:#141313;
				border-bottom: #FFCE7F 5rpx solid;
			}
			.btnbox{
				display: flex;
				align-items: center;
				flex-direction: column;
				.btnsbox{
					width: 468rpx;
					height: 86rpx;
					border-radius: 44rpx;
					box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top:28rpx;
				}
				.alipay_box{
					background: #ffffff;
				}
				.amount_box{
					background: #ff9d00;
					font-size: 24rpx;
					color:#FFFFFF;
					.text{
						margin-left:22rpx;
					}
				}
			}
		}
		.tipbox{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			margin-top:140rpx;
			font-size: 20rpx;
			color: #707070;
		}
	}
</style>
