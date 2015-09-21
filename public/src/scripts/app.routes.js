(function() {
  'use strict';

  angular
    .module('app.routes', [
      'ngRoute'
    ])

  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'src/scripts/home/home.html',
        controller: 'homeController',
        controllerAs: 'home'
      })
      .otherwise('/');

    $locationProvider.html5Mode(true);

  });

})();