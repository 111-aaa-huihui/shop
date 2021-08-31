<template>
	<view class="registerbg">
		<view class="head">
			<view class="Size">注册账号</view>
		</view>
		<view class="body">
			<view class="input_box">
				<view class="left">
					<u-icon size="32" name="/static/img/22.png" class="footIcon" v-if="zhshow"></u-icon>
					<u-icon size="32" name="/static/img/22s.png" class="footIcon" v-else></u-icon>
				</view>
				<view class="center">
					<u-input type="text" placeholder="账号" v-model="form.username" @input="onInput"/>
				</view>
				<view class="right">
					<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="zhshow"></u-icon>
					<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon>
				</view>
			</view>
			<view class="input_box">
				<view class="left">
					<u-icon size="32" name="/static/img/20.png" class="footIcon" v-if="pwdshow"></u-icon>
					<u-icon size="32" name="/static/img/17.png" class="footIcon" v-else></u-icon>
				</view>
				<view class="center">
					<u-input type="password" placeholder="密码" v-model="form.pwd" @input="onInput2"/>
				</view>
				<view class="right">
					<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="pwdshow"></u-icon>
					<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon>
				</view>
			</view>
			<view class="input_box">
				<view class="left">
					<u-icon size="32" name="/static/img/19.png" class="footIcon" v-if="mobshow"></u-icon>
					<u-icon size="32" name="/static/img/icon_phones.png" class="footIcon" v-else></u-icon>
				</view>
				<view class="center">
					<u-input type="number" placeholder="手机号" v-model="form.phone" @input="onInput3"/>
				</view>
				<view class="right">
					<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="mobshow"></u-icon>
					<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon>
				</view>
			</view>
			<view class="input_box">
				<view class="left">
					<u-icon size="32" name="/static/img/21.png" class="footIcon" v-if="codeshow"></u-icon>
					<u-icon size="32" name="/static/img/20s.png" class="footIcon" v-else></u-icon>
				</view>
				<view class="center">
					<u-input type="text" placeholder="验证码" v-model="form.code" @input="onInput4"/>
				</view>
				<view class="right">
					<view class="verify_btn" @click="getVerifyCode">{{verify_text}}</view>
					<!-- <u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="codeshow"></u-icon>
					<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon> -->
				</view>
			</view>
			<u-gap height="200"></u-gap>
			<view class="btns">
				<button type="default" class="btn_primary" :disabled="disabled" @click="submit">完成注册</button>
			</view>
			<u-gap height="120"></u-gap>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import validator from '@/common/validator'
	export default {
		data() {
			return {
				zhshow:false,
				pwdshow:false,
				mobshow:false,
				codeshow:false,
				second: 0,
				form:{
					username:"",
					pwd:"",
					phone:"",
					code:""
				},
				clockTimer: null,
				pid:"",
				fromway:""
			}
		},
		computed: {
			verify_text() {
				if (this.second == 0) {
					return '获取验证码';
				} else {
					if (this.second < 10) {
						return '0' + this.second + '秒后重新获取';
					} else {
						return this.second + '秒后重新获取';
					}
				}
			},
			disabled(){
				if(this.form.username!="" && this.form.pwd!="" && this.form.phone!="" && this.form.code!=""){
					return false;
				}else{
					return true;
				}
			}
		},
		methods: {
			onInput(e){
				if(e!=""){
					this.zhshow = true;
				}else{
					this.zhshow = false;
				}
			},
			onInput2(e){
				if(e!=""){
					this.pwdshow = true;
				}else{
					this.pwdshow = false;
				}
			},
			onInput3(e){
				if(e!=""){
					this.mobshow = true;
				}else{
					this.mobshow = false;
				}
			},
			onInput4(e){
				if(e!=""){
					this.codeshow = true;
				}else{
					this.codeshow = false;
				}
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
			//注册
			submit(){
				uni.hideKeyboard();
				if(this.form.username==""){
					this.$refs.uToast.show({
						title: '请输入账号'
					})
					return false;
				}
				if (!validator.checkPassword(this.form.pwd)) {
					return;
				}
				if (!validator.checkMobile(this.form.phone)) {
					return;
				}
				if(this.form.code==""){
					this.$refs.uToast.show({
						title: '请输入验证码'
					})
					return false;
				}
				let pram = {
					username:this.form.username,
					password:this.form.pwd,
					mobile:this.form.phone,
					code:this.form.code,
					pid:this.pid,
					from_way:this.fromway
				}
				this.$api.http.register(pram).then((res) => {
					if(res.code == 200){
						this.$refs.uToast.show({
							title: '注册成功',
							url: '/pages/login/login'
						})
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				});
			},
			getUrlCode(name) {
			    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
			}
		},
		onLoad(){
			let upid = this.getUrlCode('pid');
			if(upid !== null && upid !== "" && upid !== undefined) {
				this.pid = upid;
				this.fromway = "2";
			}else{
				const pid = uni.getStorageSync("upid");
				const fromway = uni.getStorageSync("way");
				if(pid && fromway){
					this.pid = pid;
					this.fromway = fromway;
				}else{
					this.pid = "";
					this.fromway = "";
				}
			}
		},
		onUnload() {
			clearInterval(this.clockTimer);
			this.second = 0;
		}
	}
</script>

<style lang="scss">
	page{
		background: transparent;
		height: 100%;
	}
.registerbg{
	width: 100%;
	height: 100%;
	background: url(../../static/img/167.png) no-repeat;
	background-size: 100% 100%;
	position: relative;
	.head{
		height: 21%;
		position: relative;
		margin-bottom:100rpx;
		.Size{
			position: absolute;
			left: 65rpx;
			bottom: 0;
			font-weight: 500;
			font-size: 50rpx;
		}
	}
	.body{
		margin:0 54rpx;
		.input_box{
			height: 110rpx;
			background: #ffffff;
			border-radius: 10rpx;
			box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
			margin-top:30rpx;
			display: flex;
			align-items: center;
			.left{
				display: flex;
				padding:0 52rpx;
			}
			.center{
				flex:1;
				input{
					color:#707070;
					font-size: 28rpx;
				}
			}
			.right{
				margin-left:20rpx;
				margin-right: 72rpx;
				.verify_btn{
					font-size: 28rpx;
					color:#FF9D00;
				}
			}
		}
		.btns{
			width:100%;
			.btn_primary{
				margin:0 120rpx;
				height:92rpx;
				line-height: 92rpx;
				border-radius: 10rpx;
				box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
				font-size: 28rpx;
				color:#ffffff;
				background:#FF9D00;
				&[disabled]:not([type]), &[disabled][type=default]{
					background: #d4d4d4;
				}
				&::after{
					border:0;
				}
			}
		}
	}
}
</style>