<template>
	<view class="modal_price" v-if="show">
		<u-modal v-model="show" @confirm="confirm" @cancel="cancel" :title="title" :title-style="{color:'#000000','font-size':'34rpx'}" :show-cancel-button="true" cancel-color="#707070" confirm-color="#FF9D00">
			<view class="slot_content">
				<input type="digit" class="input" :focus="true" v-model="prices" />
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				show:false,
				prices:""
			}
		},
		watch: {
			modshow(val) {
				this.show = val;
			},
			prices(val){
				if(this.price!=NaN){
					if(parseFloat(val)>=parseFloat(this.price)){
						this.prices = parseFloat(this.price);
					}else{
						this.prices = val;
					}
				}else{
					this.prices = val;
				}
			}
		},
		props:{
			title:{
				type:String,
				default:""
			},
			modshow:{
				type:Boolean,
				default:false
			},
			price:{
				type:String,
				default:""
			}
		},
		methods:{
			confirm(){
				this.$emit('confirm',this.prices.toString());
				this.prices = "";
			},
			cancel(){
				this.prices = "";
				this.$emit('cancel');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal_price{
		/deep/.u-model{
			background-color:#DFDFDF !important;
			.u-border-top::after{
				border-top: 2rpx solid rgba(60,60,67,0.36);
			}
			.u-model__footer__button{
				position: relative;
			}
			.hairline-left::after {
			    position: absolute;
			    box-sizing: border-box;
			    content: ' ';
			    pointer-events: none;
			    top: -50%;
			    right: -50%;
			    bottom: -50%;
			    left: -50%;
			    border-left: 2rpx solid rgba(60,60,67,0.36);
			    -webkit-transform: scale(0.5);
			    transform: scale(0.5);
			}
		}
		.slot_content{
			padding:34rpx;
			.input{
				background:#ffffff;
				color:#FF9D00;
				padding:6rpx 20rpx;
			}
		}
	}
</style>
