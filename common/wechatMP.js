import configdata from '../utils/config'

/*初始化分享*/
function initShare(share) {
	let ushare = uni.getStorageSync("ushare");
	let url = location.href.split('#')[0];
	let token = uni.getStorageSync("token");
	if(token){
		if(ushare){
			wxshare(ushare,share);
		}else{
			uni.request({
				url: configdata.APIHOST+"/user/share",
				method: 'post',
				header:{
					"content-type": "application/json; charset=utf-8",
					"token": token
			    },
				data:{
					url:url
				},
				success: res => {
					if (res.data.code == 200) {
						uni.setStorage({key:"ushare",data:res.data.data});
						wxshare(res.data.data,share);
					} else {
						console.log(res.data.message)
					}
				},
				fail: res => {
					console.log(res)
				}
			});
		}
	}
}

function wxshare(data,share){
	let config = data;
	/*授权api*/
	let jsApiList = [
		'updateAppMessageShareData',
		'updateTimelineShareData',
		'hideOptionMenu',
		'showOptionMenu',
		'chooseWXPay'
	];
	jWeixin.config({
		debug: false,
		appId: config.appid, // 必填，公众号的唯一标识  
		timestamp: config.timestamp, // 必填，生成签名的时间戳  
		nonceStr: config.noncestr, // 必填，生成签名的随机串  
		signature: config.signature, // 必填，签名
		jsApiList: jsApiList // 必填，需要使用的JS接口列表          
	});
	jWeixin.ready(() => {
		/*初始化公众号配置，获取js授权签名*/
		let shareUrl = share.link+"?way=1&pid="+config.pid; //通过中转方法解决微信分享会截断#号路径问题
		/*分享到朋友圈*/
		jWeixin.updateAppMessageShareData({
			title: share.title, // 分享标题  
			desc: share.desc, // 分享描述  
			link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致  
			imgUrl: share.imgUrl, // 分享图标  
			success: () => {
				// share.success();
				console.log('分享至朋友圈成功')
			},
			cancel: () => {
				console.log('分享至朋友圈失败')
			}
		});
		/*分享给朋友*/
		jWeixin.updateTimelineShareData({
			title: share.title, // 分享标题  
			link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致  
			imgUrl: share.imgUrl, // 分享图标  
			success: () => {
				// share.success();
				console.log('分享给朋友成功')
			},
			cancel: () => {
				console.log('分享给朋友失败')
			}
		});
	})
}

module.exports = {
	initShare: initShare,
	wxshare:wxshare
}
