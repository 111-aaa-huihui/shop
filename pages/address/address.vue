<template>
	<view class="addressH5">
		<view class="body" v-if="navshow">
			<view class="nav" @click="routeAbout()">
				<u-icon size="28" name="/static/img/3258.png" class="footIcon"></u-icon>
			</view>
			<span class="title">收货地址</span>
		</view>
		<view class="ZT">
			<view class="icon">
				<u-icon size="28" name="/static/img/icon_user.png" class="footIcon"></u-icon>
			</view>
			<view class="input">
				<view class="size">收货人</view>
				<u-input type="text" class="foot" v-model="form.name"></u-input>
			</view>
		</view>
		<view class="ZT">
			<view class="icon">
				<u-icon size="28" name="/static/img/icon_phone.png" class="footIcon"></u-icon>
			</view>
			<view class="input">
				<view class="size">联系方式</view>
				<u-input type="number" class="foot" v-model="form.phone"></u-input>
			</view>
		</view>
		<view class="ZT">
			<view class="icon">
				<u-icon size="28" name="/static/img/icon_maps.png" class="footIcon"></u-icon>
			</view>
			<view class="input" @click="showRegionPicker">
				<view class="size">所在地区</view>
				<view class="city">{{form.province}} {{form.city}} {{form.area}}</view>
			</view>
			<view class="right">
				<u-icon size="10" name="/static/img/202.png" class="footIcon"></u-icon>
			</view>
		</view>
		<view class="ZT">
			<view class="icon"></view>
			<view class="input">
				<view class="size">详细地址</view>
				<u-input type="text" class="foot" v-model="form.address"></u-input>
			</view>
		</view>
		<view class="tip">
			<view class="icon" :class="{checked:!isCheck}">
				<image src="/static/img/icon_cked.png" mode="aspectFit" style="width: 24rpx;height: 24rpx;"></image>
			</view>
			<text>默认地址</text>
		</view>
		<view class="btn">
			<u-button :custom-style="customStyle" shape="circle" :ripple="true" hover-class="none" @click="submit">保存并使用</u-button>
		</view>
		<u-picker mode="region" ref="uPicker" v-model="show" @confirm="confirm" />
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navshow:false,
				customStyle: {
					backgroundColor: '#FF9D00',
					border: '#FF9D00',
					color: '#FFFFFF'
				},
				form:{
					name:"",
					phone:"",
					province:"",
					city:"",
					area:"",
					address:""
				},
				isCheck:true,
				show:false,
				editType:"",
				address_id:0
			}
		},
		methods: {
			routeAbout() {
				this.$u.route({
					type: 'navigateBack',
					delta: 1,
				})
			},
			showRegionPicker() {
				this.show = true;
			},
			//地址确认
			confirm(e){
				this.form.province = e.province.label;
				this.form.city = e.city.label;
				this.form.area = e.area.label;
			},
			//提交
			submit(){
				if(this.form.name==""){
					this.$refs.uToast.show({
						title: '请填写收货人'
					})
					return false;
				}
				if(this.form.phone==""){
					this.$refs.uToast.show({
						title: '请填写联系方式'
					})
					return false;
				}
				if(this.form.province==""){
					this.$refs.uToast.show({
						title: '请选择所在地区'
					})
					return false;
				}
				if(this.form.address==""){
					this.$refs.uToast.show({
						title: '请填写详细地址'
					})
					return false;
				}
				let pram = {
					city:this.form.city,
					province:this.form.province,
					area:this.form.area,
					name:this.form.name,
					number:this.form.phone,
					address:this.form.address,
					is_default:this.isCheck==true?1:0
				}
				if(this.editType=="edit"){
					let epram = {
						address_id:this.address_id,
						city:this.form.city,
						province:this.form.province,
						area:this.form.area,
						name:this.form.name,
						number:this.form.phone,
						address:this.form.address,
						is_default:this.isCheck==true?1:0
					}
					this.$api.http.addressEdit(epram).then(res => {
						if(res.code == 200){
							this.$refs.uToast.show({
								title: '保存成功'
							})
							setTimeout(()=>{
								uni.navigateBack();
							},1000);
						}else{
							this.$refs.uToast.show({
								title: res.message
							})
						}
					});
				}else{
					this.$api.http.addressAdd(pram).then(res => {
						if(res.code == 200){
							this.$refs.uToast.show({
								title: '保存成功'
							})
							setTimeout(()=>{
								uni.navigateBack();
							},1000);
						}else{
							this.$refs.uToast.show({
								title: res.message
							})
						}
					});
				}
			},
		},
		onLoad(e){
			this.editType = e.type;
			if(e.type=='edit'){
				uni.getStorage({
					key:'address',
					success: ((e) => {
						this.address_id = e.data.address_id;
						this.form.name = e.data.name;
						this.form.phone = e.data.number;
						this.form.province = e.data.province;
						this.form.city = e.data.city;
						this.form.area = e.data.area;
						this.form.address = e.data.address;
						this.isCheck = e.data.is_default==0?false:true;
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.addressH5 {
		background: #F8F8F8;
		width: 100%;
		height: 100%;

		.body {
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

		.ZT {
			padding: 0 50rpx;
			background: #FFFFFF;
			display: flex;
			align-items: center;
			text-align: left;
			flex: 1;
			font-size: 24rpx;
			color: #707070;

			.icon {
				display: flex;
				width: 50rpx;
			}

			.input {
				flex: 1;
				margin-left: 20rpx;
				color: #141313;
				display: flex;
				align-items: center;
				padding-top:36rpx;
				padding-bottom:34rpx;
				
				border-bottom: 2rpx solid #F8F8F8;
				/deep/.u-input__input{
					height: 36rpx;
					min-height: 36rpx !important;
					line-height: 36rpx;
				}
				.size {
					width:112rpx;
					color: #707070;
				}
				.city{
					margin-left: 10rpx;
				}

				.right {
					width: 20rpx;
				}
			}
		}
		.tip{
			padding:26rpx 54rpx;
			font-size: 24rpx;
			color: #707070;
			display: flex;
			align-items: center;
			.icon{
				margin-right: 24rpx;
				display: flex;
				&.checked{
					width:24rpx;
					height: 24rpx;
					border:4rpx #D4D4D4 solid;
					border-radius: 8rpx;
					image{
						display: none;
					}
				}
			}
		}
		.btn {
			margin-top: 30%;
			padding: 0 100rpx;
		}
	}
</style>
