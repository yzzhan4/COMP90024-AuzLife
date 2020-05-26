//angular.module("TweetMapApp", ['ngRoute','ngResource','mapservice','chartservice'])
angular.module("TweetMapApp", ['ngRoute','ngResource','mapservice'])
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

    // .controller('AppController', ['$scope','dataFactory','mapservice','chartservice', function($scope, dataFactory, mapservice, chartservice) {
    //     $scope.testHeader = "A big Map";
    //     //$scope.getTestLoc =  dataFactory.getTestLocData().get();
    //     mapservice.refresh();
    //     chartservice.refresh();
    // }])

    .controller('AppController', ['$scope','dataFactory','mapservice', function($scope, dataFactory, mapservice) {
        $scope.testHeader = "A big Map";
        //$scope.getTestLoc =  dataFactory.getTestLocData().get();
        mapservice.refresh();
    }])





