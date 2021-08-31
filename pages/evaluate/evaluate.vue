<template>
	<view class="container">
		<topNav title="立即评价" @eventClick="goback" v-if="navshow"></topNav>
		<view class="evaluate_con">
			<view class="top">
				<block v-for="(image,index) in imageList" :key="index">
					<view class="uni-uploader_file">
						<view class="icon icon-cuo" @click="delect(index)">
							<u-icon name="close-circle" size="22" color="#FFFFFF"></u-icon>
						</view>
						<image class="uni-uploader_img" :src="image" :data-src="image" @click="previewImage"></image>
					</view>
				</block>
				<view class="imgfile" @click="chooseImages" v-if="ImagesShow">
					<image src="/static/img/icon_img.png" mode="aspectFit" style="width: 57rpx;height:52rpx;"></image>
					<text>添加图片</text>
				</view>
				<block v-if="videosrc">
					<view class="uni-uploader_file">
						<view class="icon icon-cuo" @click="delectVideo">
							<u-icon name="close-circle" size="22" color="#FFFFFF"></u-icon>
						</view>
						<video :src="videosrc" class="video"></video>
					</view>
				</block>
				<view class="imgfile" @click="chooseVideo" v-if="VideoShow">
					<image src="/static/img/icon_video.png" mode="aspectFit" style="width: 57rpx;height:50rpx;"></image>
					<text>添加视频</text>
				</view>
			</view>
			<view class="content">
			    <textarea class="textarea" v-model="msg" placeholder="这里是商品的描述" maxlength="100"></textarea>
				<view class="txtlen">{{len}}/100</view>
			</view>
		</view>
		<view class="btns">
			<button type="default" class="btn_primary" @click="onSubmit">提交评论</button>
		</view>
		<view class="fn_foot" @click="isCheck">
			<view class="icon">
				<image src="/static/img/icon_check.png" mode="aspectFit" style="width: 34rpx;height:34rpx" v-if="ischeck"></image>
				<image src="/static/img/icon_checked.png" mode="aspectFit" style="width: 34rpx;height:34rpx" v-else></image>
			</view>
			<text>匿名评价</text>
		</view>
	</view>
</template>

<script>
	import configdata from '../../utils/config'
	import topNav from '@/components/topnav.vue'
	export default{
		components: {
			topNav
		},
		data(){
			return {
				navshow:false,
				msg:"",
				len:0, //文字长度
				id:0, //订单id
				pid:0,//商品id
				ischeck:true,
				checkval:"0",
				imageList:[],
				videosrc:"",
				ImagesShow:true,
				VideoShow:true,
				compress: true,
				ids:[] //图片id
			}
		},
		watch: {
		    msg(txt) {
				this.len = txt.length;
		        if(txt.indexOf('\n') != -1 ){
		            uni.hideKeyboard();
		        }
		    }
		},
		methods: {
			goback() {
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			isCheck(){
				if(!this.ischeck){
					this.ischeck = true;
					this.checkval = "0";
				}else{
					this.ischeck = false;
					this.checkval = "1";
				}
			},
			// 上传图片
			chooseImages(){
				let that = this;
				uni.chooseImage({
					count: 1,
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success:(res)=> {
						let igmFile = res.tempFilePaths;
						uni.showLoading({
							title: ''
						});
						uni.uploadFile({
							url:configdata.APIHOST+"/user/upload_commit_attach",
							method:"POST",
							header:{
								'token':uni.getStorageSync('token')
							},
							filePath: igmFile[0],
							name: 'file',
							success: (res) =>{
								let data = JSON.parse(res.data);
								if(data.code == 200){
									uni.hideLoading();
									this.ids.push(data.data.attachment_id.id);
									this.imageList = this.imageList.concat(igmFile);
									if(this.imageList.length>=6) {
										this.ImagesShow = false;
									} else {
										this.ImagesShow = true;
									}
								}else{
									uni.hideLoading();
									uni.showToast({
										title:data.message,
										icon:"none"
									})
								}
							}
						})
					},
				});
			},
			chooseVideo(){
				uni.chooseVideo({
					maxDuration:10,
					count: 1,
					compressed: true,
					sourceType: ['album'],
					success: (res) => {
						let videoFile = res.tempFilePath;
						if (this.compress && (res.size / 1024 > 4096)) {
							// this.videoCompress(videoFile);
							uni.showToast({
								title:"视频太大，请重新上传",
								icon:"none"
							})
						} else {
							this.videoUpload(videoFile);
						}
					}
				})
			},
			// 上传视频
			videoUpload(tempFilePath){
				uni.uploadFile({
					url:configdata.APIHOST+"/user/upload_commit_attach",
					method:"POST",
					header:{
						'token':uni.getStorageSync('token')
					},
					filePath:tempFilePath,
					name:'file',
					success: (res) => {
						let data = JSON.parse(res.data);
						if(data.code==200){
							this.ids.push(data.data.attachment_id.id);
							this.videosrc = tempFilePath;
							if(this.videosrc!="") {
								this.VideoShow = false;
							} else {
								this.VideoShow = true;
							}
						}else{
							uni.showToast({
								title:data.message,
								icon:"none"
							})
						}
					}
				})
			},
			//处理视频
			videoCompress(tempFilePath){
				uni.showLoading({
					title: '处理中...'
				});
				var that = this;
				uni.compressVideo({
					src: tempFilePath,  
					quality: 'low',
					success: function (res){
						that.videoUpload(res.tempFilePath);
					},
					fail: function (err) {
						uni.showToast({  
							title:'视频处理失败',
							icon:'none'
						},2000)
					}
				})
				uni.hideLoading();
			},
			//预览图片
			previewImage: function(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			delect(index){
				uni.showModal({
					title: "提示",
					content: "是否要删除该图片",
					confirmColor:"#FF9D00",
					success: (res) => {
						if (res.confirm) {
							this.imageList.splice(index, 1);
						}
					}
				})
			},
			delectVideo(){
				uni.showModal({
					title:"提示",
					content:"是否要删除此视频",
					confirmColor:"#FF9D00",
					success:(res) =>{
						if(res.confirm){
							this.videosrc = "";
							this.VideoShow = this.videosrc == ""?true:false;
						}
					}
				})
			},
			onSubmit(){
				if(this.msg==""){
					uni.showToast({
						title:"请输入评价内容",
						icon:"none"
					})
					return false;
				}
				let ids = this.ids.join(",");
				this.$api.http.addCommit(this.id,this.pid,this.msg,ids,this.checkval).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
						setTimeout(()=> {
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
			this.id = option.id;
			this.pid = option.pid;
		}
	}
</script>

<style lang="scss" scoped>
	.evaluate_con{
		background: #ffffff;
		padding:50rpx 54rpx 44rpx;
		.top{
			display: flex;
			flex-wrap: wrap;
			.uni-uploader_file{
			    position: relative;
			    z-index: 1;
			    width: 180rpx;
			    height: 180rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				.uni-uploader_img {
				    width: 180upx;
				    height: 180upx;
				}
				.icon-cuo {
				    position: absolute;
				    right: 0;
				    top: 0;
				    z-index: 999;
					background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
					z-index: 999;
					border-top-right-radius: 20upx;
					border-bottom-left-radius: 20upx;
				}
				.video{
				    width: 100%;
				    height: 100%;
				}
			}
			.imgfile{
				width: 180rpx;
				height: 180rpx;
				border: 2rpx dashed #b1b1b1;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				font-size: 22rpx;
				color:#707070;
				image{
					margin-bottom: 10rpx;
				}
			}
		}
		.content{
			padding:40rpx 0;
			position: relative;
			.textarea{
				background:#ffffff;
				height: 320rpx;
				font-size: 28rpx;
				color: #141313;
			}
			.txtlen{
				position: absolute;
				right:0;
				bottom:0;
				text-align: right;
				font-size: 20rpx;
				color:#B1B1B1;
			}
		}
	}
	.btns{
		margin:60rpx 54rpx 20rpx;
		.btn_primary{
			width:100%;
			height: 80rpx;
			line-height: 80rpx;
			background: #ff9d00;
			border-radius: 40rpx;
			box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.16);
			font-size: 28rpx;
			color:#ffffff;
		}
	}
	.fn_foot{
		padding:0 54rpx;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color:#B1B1B1;
		.icon{
			display: flex;
			margin-right: 20rpx;
		}
	}
</style>
