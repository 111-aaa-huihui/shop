<template>
	<view class="bgm">
		<view class="head">
			<view class="Size">忘记密码</view>
		</view>
		<view class="body">
			<view class="input_box">
				<view class="top_box">验证手机号</view>
				<view class="bottom_box">
					<view class="left">
						<u-icon size="20" name="/static/img/19.png" class="footIcon" v-if="iconshow"></u-icon>
						<u-icon size="20" name="/static/img/icon_phones.png" class="footIcon" v-else></u-icon>
					</view>
					<view class="center">
						<u-input type="number" placeholder="请输入手机号" v-model="form.phone" @input="onInput" />
					</view>
					<view class="left">
						<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="iconshow"></u-icon>
						<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon>
					</view>
				</view>
			</view>
			<view class="input_box">
				<view class="top_box">验证码</view>
				<view class="bottom_box">
					<view class="left">
						<u-icon size="20" name="/static/img/21.png" class="footIcon" v-if="iconshow2"></u-icon>
						<u-icon size="20" name="/static/img/20s.png" class="footIcon" v-else></u-icon>
					</view>
					<view class="center">
						<u-input type="text" placeholder="请输入验证码" v-model="form.code" @input="onInput2" />
					</view>
					<view class="left">
						<view class="verify_btn" @click="getVerifyCode">{{verify_text}}</view>
						<!-- <u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="iconshow2"></u-icon>
						<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon> -->
					</view>
				</view>
			</view>
			<view class="input_box">
				<view class="top_box">重置密码</view>
				<view class="bottom_box">
					<view class="left">
						<u-icon size="20" name="/static/img/20.png" class="footIcon" v-if="iconshow3"></u-icon>
						<u-icon size="20" name="/static/img/17.png" class="footIcon" v-else></u-icon>
					</view>
					<view class="center">
						<u-input type="password" placeholder="请输入新的密码" v-model="form.pwd" @input="onInput3" />
					</view>
					<view class="left">
						<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="iconshow3"></u-icon>
						<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon>
					</view>
				</view>
			</view>
			<view class="input_box">
				<view class="top_box">重新密码</view>
				<view class="bottom_box">
					<view class="left">
						<u-icon size="20" name="/static/img/20.png" class="footIcon" v-if="iconshow4"></u-icon>
						<u-icon size="20" name="/static/img/17.png" class="footIcon" v-else></u-icon>
					</view>
					<view class="center">
						<u-input type="password" placeholder="请再次输入密码" v-model="form.newpwd" @input="onInput4" />
					</view>
					<view class="left">
						<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="iconshow4"></u-icon>
						<u-icon size="20" name="/static/img/4s.png" class="footIcon" v-else></u-icon>
					</view>
				</view>
			</view>
			<u-gap height="200"></u-gap>
			<view class="btns">
				<button type="default" class="btn_primary" :disabled="disabled" @click="submit">完成</button>
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
				iconshow:false,
				iconshow2:false,
				iconshow3:false,
				iconshow4:false,
				form:{
					phone:"",
					code:"",
					pwd:"",
					newpwd:""
				},
				second: 0,
				clockTimer: null
			}
		},
		computed:{
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
				if(this.form.phone!="" && this.form.code!="" && this.form.pwd!="" && this.form.newpwd!=""){
					return false;
				}else{
					return true;
				}
			}
		},
		methods: {
			onInput(e){
				if(e!=""){
					this.iconshow = true;
				}else{
					this.iconshow = false;
				}
			},
			onInput2(e){
				if(e!=""){
					this.iconshow2 = true;
				}else{
					this.iconshow2 = false;
				}
			},
			onInput3(e){
				if(e!=""){
					this.iconshow3 = true;
				}else{
					this.iconshow3 = false;
				}
			},
			onInput4(e){
				if(e!=""){
					this.iconshow4 = true;
				}else{
					this.iconshow4 = false;
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
				this.$api.http.smsSend(this.form.phone,"forget").then((res)=>{
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
			submit(){
				if (!validator.checkMobile(this.form.phone)) {
					return;
				}
				if(this.form.code==""){
					this.$refs.uToast.show({
						title: '请输入验证码'
					})
					return false;
				}
				if (!validator.checkPassword(this.form.pwd)) {
					return;
				}
				if (!validator.checkNewPassword(this.form.newpwd)) {
					return;
				}
				if (!validator.checkPwd(this.form.pwd,this.form.newpwd)) {
					return;
				}
				let pram = {
					mobile:this.form.phone,
					password:this.form.pwd,
					repassword:this.form.newpwd,
					code:this.form.code
				}
				this.$api.http.forgetPwd(pram).then((res) => {
					if(res.code == 200){
						this.$refs.uToast.show({
							title: '保存成功',
							url: '/pages/login/login'
						})
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				});
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
.bgm{
	width: 100%;
	height: 100%;
	background: url(../../static/img/167.png) no-repeat;
	background-size: 100% 100%;
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
		margin:0 9%;
		.input_box{
			margin-top:40rpx;
			.top_box{
				height: 20px;
				font-size: 24rpx;
				color: #D4D4D4;
			}
			.bottom_box{
				display: flex;
				align-items: center;
				height: 80rpx;
				border-bottom: 2rpx solid #E6E6E6;
				.left{
					display: flex;
					padding:0 28rpx;
					color:#FF9D00;
					font-size: 28rpx;
				}
				.center{
					flex: 1;
					padding-right:20rpx;
					input{
						color:#707070;
						font-size: 28rpx;
					}
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
			}
		}
	}
}
</style>
