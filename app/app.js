(function () {
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
					templateUrl: 'components/home/home.html',
					controller: 'HomeCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
		});

})();
