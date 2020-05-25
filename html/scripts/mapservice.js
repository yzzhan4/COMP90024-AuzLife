const MAP_INIT_LOC = {lng:133, lat:-28};
const CITY = 0;
const STATE = 1;

angular.module("mapservice", [])
    .factory("mapservice",function($http){
        // Initializes the map
        var googleMapService = {};
        googleMapService.refresh = function(){
            initialize(MAP_INIT_LOC.lat, MAP_INIT_LOC.lng, CITY);
        }

        // Radio input that changes map (show as cities or states)
        var radios = document.forms["mapRegionForm"].elements["mapRegion"];
        radios[0].onclick = function () {
            console.log("initialize map by cites");
            initialize(MAP_INIT_LOC.lat, MAP_INIT_LOC.lng, CITY);
        }
        radios[1].onclick = function () {
            console.log("initialize map by states");
            initialize(MAP_INIT_LOC.lat, MAP_INIT_LOC.lng, STATE);
        }

        // Initialize map
        var initialize = function(latitude, longitude, level) {
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
            var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4.5,
                center: myLatLng,
                styles: mapStyle
            });
            map.data.setStyle(styleFeature);
            map.data.addListener('click', clickOnMap);

            // Display regions on map
            clearCensusData();
            var polygon_list = [];
            var url = null;
            var propertyName = null;
            var displayName = null;
            if (level == CITY){
                console.log("city");
                //Added by Haoyue at 2020-05-23: change the geojson file
                polygon_list = [["count","REGION_CODE"],[10,"14"],[20,"06"],[30,"05"],[10,"03"],[2,"07"],[14,"04"],[25,"01"],[5,"09"],[34,"02"],[6,"15"],[80,"11"],[4,"13"],[56,"12"],[199,"14"],[3,"10"]];
                url = "../assets/City_geojson.json";
                propertyName = "REGION_CODE";
                displayName = "CITY_NAME";
            } else if (level == STATE) {
                console.log("state");
                polygon_list = [["count","STATE_NAME"],[10,"New South Wales"],[20,"Victoria"],[30,"Queensland"],[10,"South Australia"],[2,"Western Australia"],[14,"Tasmania"],[25,"Northern Territory"],[5,"Australian Capital Territory"]];
                url = "https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/australian-states.min.geojson"; // Added by Haoyue at 2020-05-23: change the geojson file
                propertyName = "STATE_NAME";
                displayName = "STATE_NAME";
            }
            if (polygon_list == [] || url == null || propertyName == null || displayName == null) {
                // TODO: error handling
                console.log("polygons or url or propertyName or displayName didn't load");
            }

            // Read region data
            var geo = $.ajax({
                type: 'GET',
                url: url, // Added by Haoyue at 2020-05-23: change the geojson file
                dataType: "json",
                success: console.log("County data successfully loaded."),
                error: function (xhr) {
                    alert(xhr.statusText)
                }
            })

            // When reading finished
            $.when(geo).done(function() {
                map.data.addGeoJson(geo.responseJSON, {idPropertyName: propertyName}); //Added by Haoyue at 2020-05-23: change the geojson file
                google.maps.event.addListenerOnce(map.data, 'addfeature', function () {
                    google.maps.event.trigger(document.getElementById('census-variable'), 'change');
                });
                loadCensusData(polygon_list);
                map.data.setStyle(styleFeature);
                // Set default region to Melbourne or Victoria
                var census = 0;
                if (level == CITY) {
                    census = map.data.getFeatureById("02").getProperty('census_variable');
                    document.getElementById('data-label').textContent = "Melbourne: ";
                    document.getElementById('data-value').textContent = census.toLocaleString();
                } else if (level == STATE) {
                    census = map.data.getFeatureById("Victoria").getProperty('census_variable');
                    document.getElementById('data-label').textContent = "Victoria: ";
                    document.getElementById('data-value').textContent = census.toLocaleString();
                }
                var percent = (census - censusMin) / (censusMax - censusMin) * 100;
                document.getElementById('data-box').style.display = 'block';
                document.getElementById('data-caret').style.display = 'block';
                document.getElementById('data-caret').style.paddingLeft = percent + '%';
            });

            // Load census data
            function loadCensusData(data){
                data.shift();
                data.forEach(function(row) {
                    var censusVariable = parseFloat(row[0]);
                    var stateId = row[1];
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

            // Removes census data from each shape on the map and resets the UI
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

            function clickOnMap(e) {
                // Update data box
                var percent = (e.feature.getProperty('census_variable') - censusMin) /
                    (censusMax - censusMin) * 100;
                document.getElementById('data-label').textContent =
                    e.feature.getProperty(displayName) + ": ";  //Added by Haoyue at 2020-05-23: change the geojson file
                document.getElementById('data-value').textContent =
                    e.feature.getProperty('census_variable').toLocaleString();
                document.getElementById('data-box').style.display = 'block';
                document.getElementById('data-caret').style.display = 'block';
                document.getElementById('data-caret').style.paddingLeft = percent + '%';

                // Update pie chart
                $http({
                    method: 'POST',
                    url: '/api/mapstate',
                    data: {"region":state}
                }).then(function (response) {
                    console.log('response:', response);
                    var pie_data = [{value:response.data.value[0],name:'0-4'},
                        {value:response.data.value[1],name:'5-9'},
                        {value:response.data.value[2],name:'10-14'},
                        {value:response.data.value[3],name:'15-19'},
                        {value:response.data.value[4],name:'20-24'},
                        {value:response.data.value[5],name:'25-29'},
                        {value:response.data.value[6],name:'30-34'},
                        {value:response.data.value[7],name:'35-39'},
                        {value:response.data.value[8],name:'40-44'},
                        {value:response.data.value[9],name:'45-49'},
                        {value:response.data.value[10],name:'50-54'}];
                    pie_initialize(pie_data, response.data.key);
                })

                // Update bar chart

                // Update line chart
            }
        };

        return googleMapService;

});