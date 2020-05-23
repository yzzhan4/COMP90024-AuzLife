angular.module("TweetMapApp", ['ngRoute', 'ngResource','mapservice'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../index.html',
                controller: 'AppController'
            });
    })

    .service('dataFactory', ['$resource', function($resource) {
        this.getTestText = function () {
            return $resource("api/testText", null, {'get': {method: 'GET'}});
        };
    }])

    .controller('AppController', ['$scope', 'dataFactory', 'mapservice', function($scope, dataFactory,mapservice) {
        $scope.testHeader = "If you can see this text, Angular.js is working";
        $scope.getTestText =  dataFactory.getTestText().get({});
        mapservice.refresh();
    }])





