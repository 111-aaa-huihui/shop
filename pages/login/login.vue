<template>
	<view class="bgm">
		<view class="loginbg"><image src="/static/img/165.png" mode="aspectFill"></image></view>
		<view class="login_bg">
			<view class="center">
				<view class="register" @click="register">
					<text>注册账号</text>
					<u-icon name="arrow-right" color="#FFFFFF" size="16" class="icon"></u-icon>
				</view>
				<view class="title">
					<image src="/static/img/logo.png" mode="aspectFit" class="img"></image>
				</view>
				<view class="input" :class="{on:username!=''}">
					<view class="input_left">
						<u-icon size="30" name="/static/img/22.png" class="footIcon" v-if="iconshow"></u-icon>
						<u-icon size="30" name="/static/img/22s.png" class="footIcon" v-else></u-icon>
					</view>
					<view class="input_class">
						<u-input :type="type" :border="border" :height="height" placeholder="请输入账号" input-align="center"
							:focus="true" class="placeColor" v-model="username" @input="onInput"></u-input>
					</view>
					<view class="input_right">
						<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="iconshow"></u-icon>
						<u-icon size="20" name="/static/img/5.png" class="footIcon" v-else></u-icon>
					</view>
				</view>
				<view class="input" :class="{on:pwd!=''}">
					<view class="input_left">
						<u-icon size="30" name="/static/img/20.png" class="footIcon" v-if="iconshows"></u-icon>
						<u-icon size="30" name="/static/img/8.png" class="footIcon" v-else></u-icon>
					</view>
					<view class="input_class">
						<u-input :type="password" :border="border" placeholder="请输入密码" :height="height" input-align="center" class="placeColor" v-model="pwd" @input="onInputpwd"></u-input>
					</view>
					<view class="input_right">
						<u-icon size="20" name="/static/img/4.png" class="footIcon" v-if="iconshows"></u-icon>
						<u-icon size="20" name="/static/img/5.png" class="footIcon" v-else></u-icon>
					</view>
				</view>
				<view class="center_foot">
					<view class="right" @click="ForgetPasswordRouter">忘记密码?</view>
				</view>
				<view class="btn">
					<button type="default" class="loginbtn" @click="login">登录</button>
					<button type="default" class="weixinbtn" @click="wxlogin">微信授权登录</button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				type: 'text',
				border: false,
				height: 100,
				password: 'password',
				customStyle: {
					backgroundColor: '#FF9D00',
					border: '#FF9D00',
					color: '#FFFFFF'
				},
				username:"",
				pwd:"",
				iconshow:false,
				iconshows:false,
				originUrl: ''
			}
		},
		methods: {
			...mapMutations(['storeToken']),
			//监听账号
			onInput(e){
				if(e!=""){
					this.iconshow = true;
				}else{
					this.iconshow = false;
				}
			},
			//监听密码
			onInputpwd(e){
				if(e!=""){
					this.iconshows = true;
				}else{
					this.iconshows = false;
				}
			},
			ForgetPasswordRouter() {
				this.$u.route({
					url: 'pages/login/ForgetPassword'
				})
			},
			login(){
				if(this.username==""){
					this.$refs.uToast.show({
						title: '请输入账号'
					})
					return false;
				}
				if(this.pwd==""){
					this.$refs.uToast.show({
						title: '请输入密码'
					})
					return false;
				}
				let pram = {
					mobile:this.username,
					password:this.pwd,
				}
				this.$api.http.htmlLogin(pram).then(res => {
					if(res.code == 200){
						this.storeToken(res.data.token);
						this.$refs.uToast.show({
							title: '登录成功'
						})
						setTimeout(()=>{
							if (this.originUrl) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url: '/pages/about/about',
								});
							}
						},1000);
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			wxlogin(){
				this.$api.http.getWxCode().then((res)=>{
					if(res.code == 200){
						window.location.replace(res.data.wxurl);
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			wxtoken(code){
				this.$api.http.getWxToken(code).then((res)=>{
					if(res.code == 200){
						this.storeToken(res.data);
						this.$refs.uToast.show({
							title: '登录成功'
						})
						setTimeout(()=>{
							if (this.originUrl) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url: '/pages/about/about',
								});
							}
						},1000);
					}else{
						this.$refs.uToast.show({
							title: "授权失败"
						})
					}
				})
			},
			wxCode(){
				this.$api.http.getWxCode().then((res)=>{
					if(res.data.code==200){
						console.log(res.data.random_code)
					}
				})
			},
			register(){
				this.$u.route({
					url: 'pages/login/register',
				})
			},
			getUrlCode(name) {
			    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
			}
		},
		onLoad(e) {
		    let code = this.getUrlCode('code');
		    if(code !== null && code !== "") {
		        this.wxtoken(code);
		    }
			let loginOriginUrl = uni.getStorageSync('loginOriginUrl');
			if (loginOriginUrl) {
				this.originUrl = loginOriginUrl;
				setTimeout(() => {
					uni.removeStorageSync('loginOriginUrl');
				}, 1000);
			}
		},
		onShow(){
			// this.myInterval = window.setInterval(() => {
			//     setTimeout(() => {
			//       this.wxCode();
			//     }, 1)
			// }, 5000);
		},
		onUnload(){
			// clearInterval(this.myInterval);
		}
	}
</script>

<style lang="scss">
	page{
		background: transparent;
	}
	.bgm {
		width: 100%;
		height: 100%;
		// background: url(../../static/img/165.png) no-repeat;
		// background-size: 100% 100%;
		.loginbg{
			display: flex;
			width: 100%;
			height: 100%;
			position: absolute;
			top:0;
			left:0;
			image{
				width: 100%;
				height: 100%;
			}
		}

		.login_bg {
			width: 100%;
			height: 100%;
			text-align: center;
			display: flex;
			flex: 1;
			flex-direction: row;
			padding: 0 16%;
			position: relative;
			.center {
				flex: 1;

				.title {
					margin-top: 50%;

					.img {
						width: 50%;
						height: 105.75rpx;
					}
				}
				.register{
					position: absolute;
					top:130rpx;
					right:48rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					display: flex;
					align-items: center;
					text-align: right;
					.icon{
						margin-left: 30rpx;
					}
				}

				.input {
					margin-top: 10%;
					width: 100%;
					height: 100rpx;
					border: solid 2rpx #FFFFFF;
					vertical-align: middle;
					border-radius: 20rpx;
					display: flex;
					flex: 1;
					align-items: center;
					color:#ffffff;
					/*指定垂直居中*/
					/deep/.placeColor {
						.u-input__input {
							color: #ffffff !important; //颜色在这里
						}
					}

					.input_left {
						width: 80rpx;
					}

					.input_right {
						width: 80rpx;
					}

					.input_class {
						flex: 1;
						color:#ffffff;
						/deep/ .u-input__input{
							color: #ffffff !important; //颜色在这里
						}
					}
					&.on{
						background: #ffffff;
						/deep/.placeColor {
							.u-input__input {
								color: #707070 !important; //颜色在这里
							}
						}
					}
				}

				.center_foot {
					margin-top: 20rpx;
					display: flex;
					flex: 1;

					.right {
						flex: 0.98;
						text-align: right;
						font-size: 20rpx;
						color: #FFFFFF;

						&:active {
							width: 90%;
							color: #B1B1B1;
							border-radius: 5px;
							opacity: 0.9; //这里重要，就是通过这个透明度来设置
						}
					}
				}

				.btn {
					margin-top: 25%;
					.loginbtn{
						width: 100%;
						height: 83rpx;
						line-height: 83rpx;
						background: #ff9d00;
						border-radius: 9rpx;
						box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16); 
						font-size: 25rpx;
						color: #FFFFFF;
					}
					.weixinbtn {
						margin-top: 10%;
						width: 100%;
						height: 83rpx;
						line-height: 83rpx;
						background: #1bac69;
						border-radius: 9rpx;
						background: url(../../static/img/3.png) no-repeat;
						background-size: 100% 100%;
						background-color: #1BAC69;
						color: #FFFFFF;
						font-size: 25rpx;
						&:active {
							opacity: 0.8; //这里重要，就是通过这个透明度来设置
						}
					}
				}
			}
		}
	}
</style>
