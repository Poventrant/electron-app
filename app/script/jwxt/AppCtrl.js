'use strict';

const remote = require('electron').remote;

angular.module('mainApp', ['ui.router', 'ui.bootstrap'])

.controller('AppCtrl', function($scope) {

	var vm = this;
	vm.fullSize = false;

	var app_window = remote.getCurrentWindow();

	vm.frameClose = function() {
		swal({
			title: "确定要退出了？",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "退出",
			cancelButtonText: "取消",
			closeOnConfirm: false
		}, function() {
			app_window.close();
		});
	};
	vm.frameMax = function() {
		app_window.maximize();
	};
	vm.frameMin = function() {
		app_window.minimize();
	};

})

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/login");

	$stateProvider
		.state('jwxt', {
			url: "/jwxt",
			templateUrl: "./app/views/jwxt/home.html",
			controller: "HomeCtrl",
			controllerAs: "homeCtrl"
		}).state('login', {
			url: "/login",
			templateUrl: "./app/views/jwxt/login.html",
			controller: "LoginCtrl",
			controllerAs: "loginCtrl"
		});
});