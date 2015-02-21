'use strict';

/**
 * @ngdoc overview
 * @name gabtSkeletonApp
 * @description
 * # gabtSkeletonApp
 *
 * Main module of the application.
 */
angular
	.module('gabtSkeletonApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/about', {
				templateUrl: 'views/about.html',
				controller: 'AboutCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
