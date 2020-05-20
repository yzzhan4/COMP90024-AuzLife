angular.module("TweetMapApp", ['ngRoute', 'ngResource'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../index.html',
                controller: 'AppController'
            });
    })

    .service('dataFactory', ['$resource', function($resource) {
        this.getTestLocData = function () {
            return $resource("api/testloc", null, {'get': {method: 'GET'}});
        };
    }])

    .controller('AppController', ['$scope', 'dataFactory', function($scope, dataFactory) {
        $scope.testHeader = "A big Map";
        $scope.getTestLoc =  dataFactory.getTestLocData().get();
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





