/* Team 46
* Haoyue Xie 1003068 @Melbourne
* Jiayu Li 713551 @Melbourne
* Ruqi Li 1008342 @Melbourne
* Yi Zhang 1032768 @Melbourne
* Zimeng Jia 978322 @Hebei, China
* */

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

    .controller('AppController', ['$scope','dataFactory','mapservice', function($scope, dataFactory, mapservice) {
        $scope.testHeader = "A big Map";
        //$scope.getTestLoc =  dataFactory.getTestLocData().get();
        mapservice.refresh(CITY);

        // Radio input that changes map (show as cities or states)
        var radios = document.forms["mapRegionForm"].elements["mapRegion"];
        radios[CITY].onclick = function () {
            //console.log("initialize map by cites");
            //mapRegionLevel = CITY;
            mapservice.refresh(CITY);
        }
        radios[STATE].onclick = function () {
            //console.log("initialize map by states");
            //mapRegionLevel = STATE;
            mapservice.refresh(STATE);
        }

    }])





