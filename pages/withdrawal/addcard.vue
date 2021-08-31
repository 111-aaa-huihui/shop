<template>
	<view class="container">
		<topNav title="添加银行卡" @eventClick="goback" v-if="navshow"></topNav>
		<view class="hdtit">请绑定持卡人本人的银行卡</view>
		<view class="cardfrom">
			<view class="carditem">
				<view class="icon">
					<image src="/static/img/icon_user.png" style="width: 24rpx;height:28rpx;"></image>
				</view>
				<view class="inputbox">
					<view class="label">持卡人</view>
					<input type="text" v-model="form.realname" placeholder="请输入银行卡持卡人真实姓名" />
				</view>
			</view>
			<view class="carditem">
				<view class="icon">
					<image src="/static/img/icon_cards.png" style="width: 26rpx;height:21rpx;"></image>
				</view>
				<view class="inputbox">
					<view class="label">卡号</view>
					<input type="number" v-model="form.banknumber" @blur.prevent="changeCount()" placeholder="请输入银行卡卡号" />
					<image :src="bankImg" mode="aspectFit" v-if="bankImg" style="width: 30rpx;height: 30rpx;margin-left:10rpx;margin-right:48rpx;"></image>
				</view>
			</view>
			<view class="carditem">
				<view class="icon">
					<image src="/static/img/icon_phone.png" style="width: 24rpx;height:30rpx;"></image>
				</view>
				<view class="inputbox">
					<view class="label">手机号</view>
					<input type="text" v-model="form.phone" placeholder="请输入银行预留手机号" />
				</view>
			</view>
			<!-- <view class="carditem">
				<view class="icon">
					<image src="/static/img/icon_safety.png" style="width: 24rpx;height:29rpx;"></image>
				</view>
				<view class="inputbox last">
					<view class="label">验证码</view>
					<input type="text" v-model="form.code" />
					<view class="send" @click="getVerifyCode">{{verify_text}}</view>
				</view>
			</view> -->
		</view>
		<view class="btnbox">
			<button type="default" class="btn_primary" @click="onAdd">添加</button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	import topNav from '@/components/topnav.vue'
	import bankApi from '@/common/bankcardinfo'
	import validator from '@/common/validator'
	export default{
		components: {
			topNav
		},
		computed: {
			verify_text() {
				if (this.second == 0) {
					return '发送验证码';
				} else {
					if (this.second < 10) {
						return '(重新发送'+'0'+this.second+'s)';
					} else {
						return '(重新发送'+this.second+'s)';
					}
				}
			}
		},
		data(){
			return {
				navshow:false,
				index:1,
				second: 0,
				clockTimer: null,
				form:{
					realname:"",
					banknumber:"",
					phone:"",
					code:""
				},
				bankImg:""
			}
		},
		computed: {
		    ...mapGetters(['userInfo'])
		},
		methods: {
			goback() {
				uni.navigateTo({
					url:"/pages/withdrawal/deposit"
				})
			},
			changeCount(){
				this.getbank();
			},
			getbank(){
				bankApi.getBankBin(this.form.banknumber).then((data)=> {
					this.bankImg = "https://apimg.alipay.com/combo.png?d=cashier&t="+data.bankCode+"_s";
				}).catch(function (err) {
					console.log(err)
				})
			},
			//获取验证码
			getVerifyCode() {
				let that = this;
				if (this.second > 0) {
					return;
				}
				if (!validator.checkMobile(this.form.phone)) {
					return;
				}
				this.second = 60;
				this.clockTimer = setInterval(()=> {
					that.second--;
					if (that.second == 0) {
						clearInterval(this.clockTimer);
					}
				}, 1000)
				this.$api.http.smsSend(this.form.phone,"register").then((res)=>{
					if(res.code==200){
						this.$refs.uToast.show({
							title: "发送成功"
						})
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			onAdd(){
				if(this.form.realname==""){
					this.$refs.uToast.show({
						title: '请输入持卡人姓名'
					})
					return false;
				}
				if(this.form.banknumber==""){
					this.$refs.uToast.show({
						title: '请输入卡号'
					})
					return false;
				}
				if(this.form.phone==""){
					this.$refs.uToast.show({
						title: '请输入手机号'
					})
					return false;
				}
				let pram = {
					realname:this.form.realname,
					bank_number:this.form.banknumber,
					bank_mobile:this.form.phone
				}
				this.$api.http.addbank(pram).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:"添加成功",
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack();
						},1000);
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			}
		},
		onLoad(){
			this.form.phone = this.userInfo!=""?this.userInfo.mobile:"";
		},
		onUnload() {
			clearInterval(this.clockTimer);
			this.second = 0;
		}
	}
</script>

<style lang="scss" scoped>
	.hdtit{
		text-align: right;
		padding-top:40rpx;
		padding-bottom: 20rpx;
		padding-right: 48rpx;
		font-size: 24rpx;
		color:#707070;
	}
	.cardfrom{
		background:#ffffff;
		padding-left:52rpx;
		.carditem{
			display: flex;
			align-items: center;
			.icon{
				margin-right: 24rpx;
				display: flex;
			}
			.inputbox{
				flex:1;
				padding:40rpx 0;
				border-bottom: 2rpx solid #f8f8f8;
				display: flex;
				align-items: center;
				justify-content: space-between;
				input{
					flex:1;
					font-size: 28rpx;
					color:#000000;
					padding-left:24rpx;
				}
				.label{
					font-size: 28rpx;
					color:#707070;
				}
				.send{
					font-size: 20rpx;
					color:#FF9D00;
					margin-right: 48rpx;
				}
				&.last{
					border-bottom: 0;
				}
			}
		}
	}
	.btnbox{
		position: fixed;
		bottom:160rpx;
		left: 0;
		z-index: 90;
		width:100%;
		.btn_primary{
			margin:0 120rpx;
			height:92rpx;
			line-height: 92rpx;
			background:#FF9D00;
			border-radius: 46rpx;
			font-size: 28rpx;
			color:#ffffff;
			text-align: center;
		}
	}
</style>
