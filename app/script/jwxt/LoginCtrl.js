'use strict';

const http = require('http');
const app_session = require('electron').remote.session;

angular.module('mainApp')

.controller('LoginCtrl', function($scope, $http, $stateParams) {

	var vm = this;

	login_page(function(cookie) {

		vm.cookie = cookie;

		StartCaptchaServlet(vm.cookie, function(data) {
			initGeetest({
				gt: data.gt,
				challenge: data.challenge,
				product: "float",
				offline: !data.success
			}, handlerPopup);
		});
	});

	// handleCookie(vm.cookie);
});


var handleCookie = function(cookie) {

	var win = require('electron').remote.getCurrentWindow();

	const ses = win.webContents.session;

	console.log(ses.cookies)

	ses.cookies.set({
		name: "JSESSIONID",
		value: cookie,
		path: "/",
		domain: "/"
	}, function() {
		ses.cookies.get({}, function(error, cookies) {
			if (error) throw error;
			for (var i = cookies.length - 1; i >= 0; i--) {
				console.log(cookies[i]);
			};
		});
	});

}


var login_page = function(callback) {
	var options = {
		method: 'GET',
		host: 'uems.sysu.edu.cn',
		path: "/jwxt/",
		headers: {
			'Cache-Control': 'max-age=0',
			'Host': "uems.sysu.edu.cn",
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	}
	var request = http.request(options, function(res) {
		try {
			var data = "";
			res.on('data', function(chunk) {
				data += chunk;
			}).on('end', function() {
				var reg = new RegExp('id="rno"[^\s*]name="rno"[^\s*]value=([^>]*)')
				var rno = data.match(reg)[1];

				var cookieStr = res.headers['set-cookie'].toString();
				reg = new RegExp("(JSESSIONID=[^;]*)");
				var jsessionid = cookieStr.match(reg)[1];
				window.jsessionid = jsessionid;
				callback(jsessionid);
			})
		} catch (err) {
			console.error(err);
		}
	});
	request.on('error', function(e) {
		console.log(e);
	});
	request.end();
}

var StartCaptchaServlet = function(cookie, callback) {
	var request = http.request({
		method: 'GET',
		host: 'uems.sysu.edu.cn',
		path: "/jwxt/StartCaptchaServlet",
		headers: {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Cache-Control': 'max-age=0',
			'Host': "uems.sysu.edu.cn",
			'Content-Type': 'application/x-www-form-urlencoded',
			'Referer': 'http://uems.sysu.edu.cn/jwxt/',
			'X-Requested-With': 'XMLHttpRequest',
			'Connection': 'keep-alive',
			'Cookie': cookie
		}
	}, function(res) {
		try {
			var data = "";
			res.on('data', function(chunk) {
				data += chunk;
			}).on('end', function() {
				var obj = JSON.parse(data);
				callback(obj);
			})
		} catch (err) {
			console.error(err);
		}
	});
	request.on('error', function(e) {
		console.log(e);
	});
	request.end();
}


var handlerPopup = function(captchaObj) {
	jQuery(document).ready(function($) {
		// Code that uses jQuery's $ can follow here.
		$("#btnImg").click(function() {
			captchaValidate(captchaObj);
		});
		$("#btnImg").keydown(function() {
			if (event.keyCode == 13) {
				captchaValidate(captchaObj);
			}
		});
		$("#pwd").keydown(function() {
			if (event.keyCode == 13) {
				captchaValidate(captchaObj);
			}
		});
		captchaObj.appendTo("#popup-captcha");
	});

};