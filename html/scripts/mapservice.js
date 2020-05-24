angular.module("mapservice", [])
    .factory("mapservice",function($http){
        // Initializes the map
        var googleMapService = {};
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
                // TODO: Error handling
            });
        }

        var initialize = function(latitude, longitude) {
            // Uses the selected lat, long as starting point
            var myLatLng = {lat: latitude, lng: longitude};
            var mapStyle = [{
                'featureType': 'all',
                'elementType': 'all',
                'stylers': [{'visibility': 'off'}]
            }, {
                'featureType': 'landscape',
                'elementType': 'geometry',
                'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
            }, {
                'featureType': 'water',
                'elementType': 'labels',
                'stylers': [{'visibility': 'off'}]
            }, {
                'featureType': 'water',
                'elementType': 'geometry',
                'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
            }, {//Add by Haoyue at 2020-05-23: change the geojson file
                'featureType': 'administrative ',
                'elementType': 'geometry',
                'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
            }];
            // Create a new map and place in the index.html page
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: myLatLng,
                styles: mapStyle
            });
            map.data.setStyle(styleFeature);
            map.data.addListener('mouseover', mouseInToRegion);
            map.data.addListener('mouseout', mouseOutOfRegion);

            clearCensusData();
            var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;

            var mapArea = document.mapAreaForm.mapArea[0].value;
            if (mapArea.localeCompare("city") == 0){
                //var polygon_list = [["count","SA4_CODE"], [0, "212"],[0, "215"],[1, "506"],[0, "405"],[0, "201"],[0, "109"],[0, "111"],[0, "311"],[0, "317"],[0, "404"],[0, "303"],[0, "213"],[0, "115"],[0, "318"],[0, "108"],[1, "116"],[0, "301"],[0, "319"],[24, "208"],[0, "501"],[0, "701"],[0, "509"],[0, "314"],[0, "401"],[0, "125"],[0, "406"],[0, "210"],[0, "901"],[0, "304"],[0, "601"],[0, "505"],[0, "602"],[0, "118"],[0, "603"],[1, "801"],[0, "120"],[0, "316"],[0, "110"],[0, "121"],[0, "128"],[0, "123"],[1, "103"],[3, "403"],[0, "105"],[0, "203"],[0, "112"],[0, "507"],[0, "503"],[0, "402"],[0, "504"],[3, "206"],[0, "702"],[0, "126"],[0, "101"],[0, "124"],[0, "106"],[0, "209"],[0, "307"],[1, "202"],[0, "211"],[0, "604"],[0, "313"],[0, "308"],[0, "122"],[0, "205"],[0, "102"],[0, "117"],[0, "502"],[4, "302"],[1, "204"],[0, "114"],[1, "113"],[0, "306"],[0, "305"],[0, "107"],[0, "104"],[0, "216"],[0, "315"],[0, "511"],[0, "207"],[0, "119"],[15, "127"],[0, "407"],[0, "217"],[0, "312"],[0, "309"],[0, "510"],[0, "214"],[0, "310"]];
                //Added by Haoyue at 2020-05-23: change the geojson file
                var polygon_list = [["count","REGION_CODE"],[10,"14"],[20,"06"],[30,"05"],[10,"03"],[2,"07"],[14,"04"],[25,"01"],[5,"09"],[34,"02"],[6,"15"],[80,"11"],[4,"13"],[56,"12"],[199,"14"],[3,"10"]];
                var geo = $.ajax({
                    type: 'GET',
                    //url:"../assets/SA4_2016_AUST.json",
                    url:"../assets/City_geojson.json", // Added by Haoyue at 2020-05-23: change the geojson file
                    dataType: "json",
                    success: console.log("County data successfully loaded."),
                    error: function (xhr) {
                        alert(xhr.statusText)
                    }
                })
            } else if (mapArea.localeCompare("state") == 0) {
                // TODO: load state geojson
            }

            //when reading finished, do following procedures
            $.when(geo).done(function() {
                //loadMapShapes();
                //map.data.addGeoJson(geo.responseJSON, {idPropertyName: 'SA4_CODE'});
                map.data.addGeoJson(geo.responseJSON, {idPropertyName: 'REGION_CODE'}); //Added by Haoyue at 2020-05-23: change the geojson file
                google.maps.event.addListenerOnce(map.data, 'addfeature', function () {
                    google.maps.event.trigger(document.getElementById('census-variable'), 'change');
                });
                loadCensusData(polygon_list);
                map.data.setStyle(styleFeature);
            });

            function loadCensusData(data){
                data.shift();
                data.forEach(function(row) {
                    var censusVariable = parseFloat(row[0]);
                    var stateId = row[1];
                    //console.log(map.data)

                    // keep track of min and max values
                    if (censusVariable < censusMin) {
                        censusMin = censusVariable;
                    }
                    if (censusVariable > censusMax) {
                        censusMax = censusVariable;
                    }

                    // update the existing row with the new data
                    map.data
                        .getFeatureById(stateId)
                        .setProperty('census_variable', censusVariable);
                });

                // update and display the legend
                document.getElementById('census-min').textContent =
                    censusMin.toLocaleString();
                document.getElementById('census-max').textContent =
                    censusMax.toLocaleString();
            }

            /** Removes census data from each shape on the map and resets the UI. */
            function clearCensusData() {
                censusMin = Number.MAX_VALUE;
                censusMax = -Number.MAX_VALUE;
                map.data.forEach(function(row) {
                    row.setProperty('census_variable', undefined);
                });
                document.getElementById('data-box').style.display = 'none';
                document.getElementById('data-caret').style.display = 'none';
            }

            function styleFeature(feature) {
                // var low = [5, 69, 54];  // color of smallest datum
                // var high = [151, 83, 34];   // color of largest datum
                var low = [19, 96, 91];  // color of smallest datum
                var high = [2, 74, 51];   // color of largest datum

                // delta represents where the value sits between the min and max
                var delta = (feature.getProperty('census_variable') - censusMin) /
                    (censusMax - censusMin);

                var color = [];
                for (var i = 0; i < 3; i++) {
                    // calculate an integer color based on the delta
                    color[i] = (high[i] - low[i]) * delta + low[i];
                }

                // determine whether to show this shape or not
                var showRow = true;
                if (feature.getProperty('census_variable') == null ||
                    isNaN(feature.getProperty('census_variable'))) {
                    showRow = false;
                }

                var outlineWeight = 0.5, zIndex = 1;
                if (feature.getProperty('state') === 'hover') {
                    outlineWeight = zIndex = 2;
                }

                return {
                    strokeWeight: outlineWeight,
                    strokeColor: '#fff',
                    zIndex: zIndex,
                    fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
                    fillOpacity: 0.75,
                    visible: showRow
                };
            }

            /**
             * Responds to the mouse-in event on a map shape (state).
             *
             * @param {?google.maps.MouseEvent} e
             */
            function mouseInToRegion(e) {
                // set the hover state so the setStyle function can change the border
                e.feature.setProperty('state', 'hover');

                var percent = (e.feature.getProperty('census_variable') - censusMin) /
                    (censusMax - censusMin) * 100;

                // update the label
                document.getElementById('data-label').textContent =
                    //e.feature.getProperty('SA4_NAME') + ": ";
                    e.feature.getProperty('CITY_NAME');  //Added by Haoyue at 2020-05-23: change the geojson file
                document.getElementById('data-value').textContent =
                    e.feature.getProperty('census_variable').toLocaleString();
                document.getElementById('data-box').style.display = 'block';
                document.getElementById('data-caret').style.display = 'block';
                document.getElementById('data-caret').style.paddingLeft = percent + '%';
            }

            /**
             * Responds to the mouse-out event on a map shape (state).
             *
             * @param {?google.maps.MouseEvent} e
             */
            function mouseOutOfRegion(e) {
                // reset the hover state, returning the border to normal
                e.feature.setProperty('state', 'normal');
                document.getElementById('data-label').textContent = "";
                document.getElementById('data-value').textContent = "";
            }
        };

        return googleMapService;

});