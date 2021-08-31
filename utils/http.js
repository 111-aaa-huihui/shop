import configdata from './config'
import cache from './cache'
import store from '../store/index';

module.exports = {
	config: function(name) {
		var info = null;
		if (name) {
			var name2 = name.split("."); //字符分割
			if (name2.length > 1) {
				info = configdata[name2[0]][name2[1]] || null;
			} else {
				info = configdata[name] || null;
			}
			if (info == null) {
				let web_config = cache.get("web_config");
				if (web_config) {
					if (name2.length > 1) {
						info = web_config[name2[0]][name2[1]] || null;
					} else {
						info = web_config[name] || null;
					}
				}
			}
		}
		return info;
	},
	post: function(url, data, xAuthToken = true) {
		url = this.config("APIHOST")+url;
		let header = {
            "content-type": "application/x-www-form-urlencoded"
        }
        if (xAuthToken) {
			header = {
				"content-type": "application/x-www-form-urlencoded",
				"token": store.getters.token
			}
        }
		return new Promise((succ, error) => {
			uni.showLoading({
				title:'',
				mask:true
			});
			uni.request({
				url: url,
				data: data,
				method: "POST",
				header: header,
				success: function(result) {
					if(result.statusCode!=200){   //请求失败显示报错信息
						uni.hideLoading();
						return;
					}
					setTimeout(()=>{
						uni.hideLoading();
						succ.call(self, result.data);
					},1000);
				},
				fail: function(e) {
					uni.hideLoading();
					uni.showToast({
						title: "请求超时",
						icon: "none"
					})
					error.call(self, e)
				}
			})
		})
	},
	get: function(url, data, xAuthToken = true) {
		url = this.config("APIHOST")+url;
        let header = {
            "content-type": "application/json; charset=utf-8"
        }
        if (xAuthToken) {
            header = {
                "content-type": "application/json; charset=utf-8",
                "token": store.getters.token
            }
        }
		return new Promise((succ, error) => {
			uni.showLoading({
				title:'',
				mask:true
			});
			uni.request({
				url: url,
				data: data,
				method: "GET",
				header: header,
				success: function(result) {
					if(result.statusCode!=200){   //请求失败显示报错信息
						uni.hideLoading();
						return;
					}
					setTimeout(()=>{
						uni.hideLoading();
						succ.call(self, result.data)
					},1000);
				},
				fail: function(e) {
					uni.hideLoading();
					uni.showToast({
						title: "请求超时",
						icon: "none"
					})
					error.call(self, e)
				}
			})
		})
	}
}