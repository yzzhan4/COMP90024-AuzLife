const MAP_INIT_LOC = {lng:133, lat:-28};

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
                //console.log(location);
                var latitude = location["lat"];
                var longitude = location["lng"];
                // Then initialize the map.
                //initialize(latitude, longitude);
                initialize(MAP_INIT_LOC.lat, MAP_INIT_LOC.lng);
            }, function(error) {
                // TODO: Error handling
            });
        }

        // Radio input that changes map
        var radios = document.forms["mapAreaForm"].elements["mapArea"];
        for(var i = 0, max = radios.length; i < max; i++) {
            radios[i].onclick = function() {
                console.log("radio button checked");
                initialize(MAP_INIT_LOC.lat, MAP_INIT_LOC.lng);
            }
        }

        // Initialize map
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
            var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: myLatLng,
                styles: mapStyle
            });
            map.data.setStyle(styleFeature);
            map.data.addListener('mouseover', mouseInToRegion);
            map.data.addListener('mouseout', mouseOutOfRegion);
            map.data.addListener('click', clickOnMap);

            clearCensusData();
            // Display cities
            var polygon_list = [];
            var url = null;
            var propertyName = null;
            var displayName = null;
            if (document.mapAreaForm.mapArea[0].checked){ // cities
                console.log("city");
                //Added by Haoyue at 2020-05-23: change the geojson file
                polygon_list = [["count","REGION_CODE"],[10,"14"],[20,"06"],[30,"05"],[10,"03"],[2,"07"],[14,"04"],[25,"01"],[5,"09"],[34,"02"],[6,"15"],[80,"11"],[4,"13"],[56,"12"],[199,"14"],[3,"10"]];
                url = "../assets/City_geojson.json";
                propertyName = "REGION_CODE";
                displayName = "CITY_NAME";
            } else if (document.mapAreaForm.mapArea[1].checked) { // states
                console.log("state");
                polygon_list = [["count","STATE_NAME"],[10,"New South Wales"],[20,"Victoria"],[30,"Queensland"],[10,"South Australia"],[2,"Western Australia"],[14,"Tasmania"],[25,"Northern Territory"],[5,"Australian Capital Territory"]];
                url = "https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/australian-states.min.geojson"; // Added by Haoyue at 2020-05-23: change the geojson file
                propertyName = "STATE_NAME";
                displayName = "STATE_NAME";
            }

            if (polygon_list == [] || url == null || propertyName == null) {
                // TODO: error handling
                console.log("polygons or url or propertyName didn't load");
            }

            var geo = $.ajax({
                type: 'GET',
                //url:"../assets/City_geojson.json",
                url: url, // Added by Haoyue at 2020-05-23: change the geojson file
                dataType: "json",
                success: console.log("County data successfully loaded."),
                error: function (xhr) {
                    alert(xhr.statusText)
                }
            })

            //when reading finished, do following procedures
            $.when(geo).done(function() {
                //loadMapShapes();
                //map.data.addGeoJson(geo.responseJSON, {idPropertyName: 'SA4_CODE'});
                map.data.addGeoJson(geo.responseJSON, {idPropertyName: propertyName}); //Added by Haoyue at 2020-05-23: change the geojson file
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
                //document.getElementById('data-box').style.display = 'none';
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
                    e.feature.getProperty(displayName) + ": ";  //Added by Haoyue at 2020-05-23: change the geojson file
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

            function clickOnMap(e) {
                var state = e.feature.getProperty('STATE_CODE');
                console.log(state);
                $http({
                    method: 'POST',
                    url: '/api/mapstate',
                    data: {"region":state}
                }).then(function (response) {
                    //console.log('response:', httpResponse);
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
            }
        };

        var pie_initialize = function(data, region){
            document.getElementById('piechart').style.display = 'block';
            document.getElementById('barchart').style.display = 'none';
            document.getElementById('linechart').style.display = 'none';
            var myChart = echarts.init(document.getElementById('piechart'));
            myChart.setOption(get_pieoption(data, region));
        };
        var get_pieoption = function(data, region){
            var option = {
                title: {
                    text: 'Population of age group in ' + region
                },
                tooltip: {},
                series: [{
                    name: 'population',
                    type: 'pie',
                    radius:'55%',
                    data: data
                }]
            };
            return option;
        };

        return googleMapService;

});