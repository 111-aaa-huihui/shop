<template>
	<view class="hc">
		<view class="bg" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">意见反馈</span>
		</view>
		<view class="body">
			<view class="titles">
				您有什么问题或者建议想对我们说？
			</view>
			<view class="titleInput">
				<u-input type="text" placeholder="标题:" v-model="title"></u-input>
			</view>
			<view class="textareaInput">
				<u-input type="textarea" placeholder="您的意见:" height="250" :auto-height="true" v-model="msg"></u-input>
			</view>
			<view class="footTitle">
				请详细表述您遇到的问题，有助于我们快速定位并解决问题，我们会认真进行评估！
			</view>
			<view class="footButton">
				<u-button :custom-style="customStyle" shape="circle" :ripple="true" hover-class="none" @click="submit">提交问题</u-button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navshow:false,
				customStyle:{
					background: '#ff9d00',
					color:'#FFFFFF',
				},
				title:"",
				msg:""
			}
		},
		methods: {
			routeAbout(){
				this.$u.route({
					type:'switchTab',
					url:'pages/about/about'
				})
			},
			//提交
			submit(){
				if(this.title==""){
					this.$refs.uToast.show({
						title: '请填写标题'
					})
					return false;
				}
				if(this.msg==""){
					this.$refs.uToast.show({
						title: '请填写您的意见'
					})
					return false;
				}
				let pram = {
					title:this.title,
					content:this.msg,
				}
				this.$api.http.suggestion(pram).then(res => {
					if(res.code == 200){
						this.$refs.uToast.show({
							title: '提交成功',
							url: '/pages/about/about',
							isTab: true
						})
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				});
			}
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
		.body{
			padding: 50rpx;
			.titles{
				color: #FF9D00;
				font-size: 24rpx;
				width: 100%;
			}
			.titleInput{
				margin-top: 20rpx;
				width: 100%;
				height: 75rpx;
				background-color: #FFFFFF;
				border-radius: 24rpx;
				padding-left:24rpx;
			}
			.textareaInput{
				margin-top: 20rpx;
				width: 100%;
				height: 270rpx;
				background-color: #FFFFFF;
				border-radius: 24rpx;
				padding-left:24rpx;
			}
			.footTitle{
				margin-top: 20rpx;
				font-size: 24rpx;
				font-weight: Regular;
				color: #B1B1B1;
			}
			.footButton{
				margin: 70% 50rpx 0;
				border-radius: 50rpx;
				opacity: 1;
				box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16); 
				// background-color: red;
			}
		}
	}
</style>
