angular.module('ZamkaAdmin', ['ngMaterial','ngRoute'])
.config(function($mdThemingProvider,$routeProvider,$interpolateProvider,$locationProvider) {
  $routeProvider
      .when('/App', {
      templateUrl: '/partials/app/index.html',
      controller: 'indexCtrl'
      })
      .when('/App/Login', {
        templateUrl: '/partials/app/login.html',
        controller: 'loginCtrl'
      })
      .when('/App/Eventos', {
        templateUrl: '/partials/app/eventos.html',
        controller: 'indexCtrl'
      })
      .when('/App/Evento/:id', {
        templateUrl: '/partials/app/evento.html',
        controller: 'indexCtrl'
      })
      .when('/App/Perfil/:id', {
        templateUrl: '/partials/app/perfil.html',
        controller: 'indexCtrl'
      })
      .when('/App/ONG/:id', {
        templateUrl: '/partials/app/ong.html',
        controller: 'indexCtrl'
      });
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('grey');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
      $locationProvider.html5Mode(true);
})
.controller('AppCtrl', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
      $scope.timestamp = function(){
        return Date.now();
      }
})
.controller('indexCtrl',function($scope,$timeout,$location){
        $(".logo").hide();
        $timeout(function(){
            new WOW().init();
            $(".logo").show();
        },500,false);

        $timeout(function(){
            $(".logo").addClass("animated");
            $(".logo").addClass("fadeOutLeft");

            $location.path("/App/Login");
            $scope.$apply();

        },3000,false);
})
    .controller('loginCtrl',function($scope,$timeout,$location){
        $timeout(function(){
            new WOW().init();
        },500,false);

    });