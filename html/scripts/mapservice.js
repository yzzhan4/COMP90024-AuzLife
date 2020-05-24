angular.module("mapservice", [])
    .factory("mapservice",function($http){
        // Initializes the map
        var googleMapService = {};
        console.log("hiiiii");
        googleMapService.refresh = function(){
            return $http({
                    method:'get',
                    url: '/api/testloc'
                }).then(function(response){
                    // Convert the results into Google Map Format
                    var location = response.data;
                    console.log(location);
                    var latitude = location["lat"];
                    var longitude = location["lng"];
                    // Then initialize the map.
                    initialize(latitude, longitude);
            }, function(error) {

            });
        }


        var initialize = function(latitude, longitude) {

            // Uses the selected lat, long as starting point
            var myLatLng = {lat: latitude, lng: longitude};


            // Create a new map and place in the index.html page
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3,
                center: myLatLng
            });
            
        };
        return googleMapService;

});