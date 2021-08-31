<template>
	<view class="container">
		<topNav title="调整额度" @eventClick="goback" v-if="navshow">
			<view slot="subtit">额度变化记录</view>
		</topNav>
		<u-navbar class="topnav" back-text="调整额度" back-icon-color="#000000" :back-text-style="{color:'#000000'}" :border-bottom="false">
			<view slot="right" class="subtit">额度变化记录</view>
		</u-navbar>
		<view class="preview_con">
			<view class="preview_item">
				<text class="label">剩余额度</text>
				<text>￥ {{balance}}</text>
			</view>
			<view class="preview_item">
				<text class="label">可用额度</text>
				<text>￥ {{abalance}}</text>
			</view>
			<view class="sliderbox">
				<view class="price_wrap">
					<view class="pricebox">￥<text class="price">{{price}}</text></view>
					<view @click="edit">
						<u-icon name="/static/img/icon_edits.png" size="28"></u-icon>
					</view>
				</view>
				<view>
					<slider v-model="value" activeColor="#FFCC33" backgroundColor="#ff9d00" block-color="#ff9d00" block-size="15" step="1" :min="balance" :max="max" @change="sliderChange" />
				</view>
				<view class="txt_wrap">
					<view class="txtview">
						<text>最低额度</text>
						<text>￥{{balance}}</text>
					</view>
					<view class="txtview right">
						<text>最高额度</text>
						<text>￥{{mprice}}</text>
					</view>
				</view>
			</view>
		</view>
		<button type="default" class="btn_primary" @click="onSubmit">确定调额</button>
		<view class="tip">
			<text class="stit">提示：</text>
			<text>1.您额度调整后可用额度也会随之调整；</text>
			<text>2.如您在使用过程中有任何疑问,请联系客服</text>
		</view>
		<PriceModal :modshow="show" title="请输入金额" @confirm="confirm" @cancel="cancel"></PriceModal>
	</view>
</template>

<script>
	import topNav from '@/components/topnav.vue'
	import PriceModal from '@/components/PriceModal.vue'
	export default{
		components: {
			topNav,
			PriceModal
		},
		data(){
			return {
				navshow:false,
				price:"0.00",
				value:"",
				show:false,
				abalance:"0",
				balance:"0",
				mprice:"0",
				max:"0"
			}
		},
		methods: {
			goback() {
				uni.navigateBack();
			},
			sliderChange(e) {
				let num = e.detail.value;
				this.price = num.toFixed(2);
			},
			//修改
			edit(){
				this.show = true;
			},
			confirm(val){
				this.show = false;
				if(parseFloat(val)<=parseFloat(this.value)){
					this.price = parseFloat(this.value).toFixed(2);
					this.value = Number(this.value);
				}else if(parseFloat(val)>=parseFloat(this.mprice)){
					this.price = parseFloat(this.mprice).toFixed(2);
					this.value = Number(this.mprice);
				}else{
					this.price = parseFloat(val).toFixed(2);
					this.value = Number(val);
				}
			},
			cancel(){
				this.show = false;
			},
			//提交
			onSubmit(){
				this.$api.http.changeBalance(this.price).then((res)=>{
					if(res.code == 200){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack();
						}, 500);
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			}
		},
		onLoad(option){
			this.abalance = uni.getStorageSync("abalance");
			let fbalance = uni.getStorageSync("fbalance");
			let num = this.abalance - fbalance;
			this.balance = num==0?"0.00":num.toFixed(2);
			this.price = this.balance;
			this.value = this.balance;
			this.$api.http.webconfig().then((res)=>{
				if(res.code==200){
					this.mprice = parseFloat(res.data.vip_money).toFixed(2);
					this.max = res.data.vip_money;
				}
			})
		},
		onShow(){
			document.title = '批发商城';
		}
	}
</script>

<style lang="scss" scoped>
	.topnav{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.subtit{
			font-size: 22rpx;
			color:#000000;
			padding-right:40rpx;
		}
	}
	.preview_con{
		background:#ffffff;
		padding:52rpx 54rpx;
		.preview_item{
			display: flex;
			padding-bottom:24rpx;
			font-size: 24rpx;
			color:#B1B1B1;
			.label{
				flex:1;
				font-size: 24rpx;
				color:#000000;
			}
		}
		.sliderbox{
			.price_wrap{
				padding-top:16rpx;
				padding-bottom:28rpx;
				display: flex;
				align-items: baseline;
				justify-content: center;
				.pricebox{
					font-size: 40rpx;
					color:#FF9D00;
					margin-right:10rpx;
					.price{
						font-size: 60rpx;
					}
				}
			}
			.txt_wrap{
				margin-top:12rpx;
				display: flex;
				justify-content: space-between;
				.txtview{
					font-size: 20rpx;
					color:#707070;
					display: flex;
					flex-direction: column;
					&.right{
						text-align: right;
					}
				}
			}
		}
	}
	.btn_primary{
		margin:60rpx auto;
		width:580rpx;
		height: 80rpx;
		line-height:80rpx;
		font-size: 28rpx;
		color:#FFFFFF;
		background: #ff9d00;
		border-radius: 40rpx;
		box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16); 
	}
	.tip{
		margin-top:112rpx;
		padding:0 54rpx;
		font-size: 20rpx;
		color:#707070;
		display: flex;
		flex-direction: column;
		.stit{
			font-size: 24rpx;
			color:#000000;
			margin-bottom: 16rpx;
		}
	}
</style>
