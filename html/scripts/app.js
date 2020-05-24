angular.module("TweetMapApp", ['ngRoute','ngResource','mapservice','chartservice'])
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

    .controller('AppController', ['$scope','dataFactory','mapservice','chartservice', function($scope, dataFactory, mapservice, chartservice) {
        $scope.testHeader = "A big Map";
        //$scope.getTestLoc =  dataFactory.getTestLocData().get();
        mapservice.refresh();
        chartservice.refresh();

        // $scope.initMap = function() {
        //     var map;
        //     function initMap() {
        //         map = new google.maps.Map(document.getElementById('map'), {
        //             center: $scope.getTestLoc(),
        //             //center: {lat: -34.397, lng: 150.644},
        //             zoom: 8
        //         });
        //     }
        // }
    }])





