const MAP_INIT_LOC = {lng:133, lat:-28};
const CITY = 0;
const STATE = 1;

const STATE_CODE_TO_NAME = {
    "NSW":"New South Wales",
    "VIC":"Victoria",
    "QLD":"Queensland",
    "SA":"South Australia",
    "WA":"Western Australia",
    "TAS":"Tasmania",
    "NT":"Northern Territory",
    "ACT":"Australian Capital Territory"
};

var curr_city = "Melbourne";
var curr_state = 2;

angular.module("mapservice", [])
    .factory("mapservice",function($http){
        // Initializes the map
        var googleMapService = {};
        googleMapService.refresh = function(level){
            // Initialise map at city level as default
            initialize(MAP_INIT_LOC.lat, MAP_INIT_LOC.lng, level);
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
                'elementType': 'labels',
                'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
            }];
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4.5,
                center: myLatLng,
                styles: mapStyle
            });
            map.data.setStyle(styleFeature);
            map.data.addListener('mouseover', mouseInToRegion);
            map.data.addListener('mouseout', mouseOutOfRegion);
            map.data.addListener('click', clickOnMap);

            var pieSelection = document.getElementById('pieselect');
            pieSelection.addEventListener('change', function() {
                console.log(pieSelection.value);
                if (level === CITY) {
                    update_pie(curr_city, level);
                } else if (level === STATE) {
                    update_pie(curr_state, level);
                    console.log(curr_state);
                }
            });

            var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;
            clearCensusData();
            // Display regions on map
            var polygon_list = null;
            var url = null;
            var propertyName = null;
            var displayName = null;
            var requestName = null;
            if (level === CITY){
                // polygon_list = new Array(["count","REGION_CODE"]);
                // $http({
                //     method: 'get',
                //     url: 'api/tweetsCity'
                // }).then(function (response) {
                //     for (var key in response.data){
                //         if (key<10) {
                //             polygon_list.push([response.data[key], "0"+key.toString()]);
                //         } else {
                //             polygon_list.push([response.data[key], key.toString()]);
                //         }
                //     }
                // });
                polygon_list = [["count","REGION_CODE"],[1809,"14"],[10207,"06"],[8326,"05"],[10325,"03"],[4893,"07"],[3629,"04"],[34220,"01"],[12789,"09"],[34201,"02"],[967,"15"],[5749,"11"],[3715,"13"],[3333,"12"],[1809,"14"],[5015,"10"]];
                // console.log("city polygon: ");
                // console.log(polygon_list);
                url = "../assets/City_geojson.json";
                propertyName = "REGION_CODE"; // 02
                displayName = "CITY_NAME"; // Melbourne
                requestName = "CITY_NAME"; // Melbourne
            } else if (level === STATE) {
                // polygon_list = new Array(["count","STATE_NAME"]);
                // $http({
                //     method: 'get',
                //     url: 'api/tweetsState'
                // }).then(function (response) {
                //     //console.log(response.data);
                //     for (var key in response.data){
                //         // console.log(response.data[key]);
                //         // console.log(STATE_CODE_TO_NAME[key]);
                //         polygon_list.push([response.data[key], STATE_CODE_TO_NAME[key]]);
                //     }
                // });
                polygon_list = [["count","STATE_NAME"],[46990,"New South Wales"],[39235,"Victoria"],[19703,"Queensland"],[11659,"South Australia"],[12016,"Western Australia"],[3715,"Tasmania"],[967,"Northern Territory"],[4893,"Australian Capital Territory"]];
                console.log("state polygon: ");
                console.log(polygon_list);
                //url = "https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/australian-states.min.geojson";
                url = "../assets/australian-states.min.geojson"
                propertyName = "STATE_NAME"; // Victoria
                displayName = "STATE_NAME";
                requestName = "STATE_CODE" // 2
            }

            if (polygon_list == null || url == null || propertyName == null || displayName == null || requestName == null) {
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
                console.log(polygon_list);
                loadCensusData(polygon_list);
                map.data.setStyle(styleFeature);
                // Set default region to Melbourne or Victoria
                var census = 0;
                if (level === CITY) {
                    census = map.data.getFeatureById("02").getProperty('census_variable');
                    if (census == null) {
                        console.log("can't get census_variable");
                    } else {
                        console.log("melbourne");
                        console.log(map.data.getFeatureById("02"));
                    }
                    document.getElementById('data-label').textContent = "Melbourne: ";
                    document.getElementById('data-value').textContent = census.toLocaleString();
                } else if (level === STATE) {
                    census = map.data.getFeatureById("Victoria").getProperty('census_variable');
                    if (census == null) {
                        console.log("can't get census_variable");
                    } else {
                        console.log("victoria");
                        console.log(map.data.getFeatureById("Victoria"));
                    }
                    document.getElementById('data-label').textContent = "Victoria: ";
                    document.getElementById('data-value').textContent = census.toLocaleString();
                }
                var percent = (census - censusMin) / (censusMax - censusMin) * 100;
                document.getElementById('data-box').style.display = 'block';
                document.getElementById('data-caret').style.display = 'block';
                document.getElementById('data-caret').style.paddingLeft = percent + '%';

                // Initialise charts
                if (level === CITY) {
                    update_pie("Melbourne", level);
                } else if (level === STATE) {
                    update_pie(2, level);
                }
                update_bar(level);
                update_line(level);

            });

            // Load census data
            function loadCensusData(data){
                console.log("load data");
                console.log(data);
                data.shift();
                data.forEach(function(row) {
                    var censusVariable = parseFloat(row[0]);
                    var stateId = row[1];
                    console.log(row);
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
                //console.log(map.data);
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

            function mouseInToRegion(e) {
                e.feature.setProperty('state', 'hover');
            }

            function mouseOutOfRegion(e) {
                e.feature.setProperty('state', 'normal');
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

                if (level === CITY) {
                    curr_city = e.feature.getProperty(requestName);
                } else if (level === STATE) {
                    curr_state = e.feature.getProperty(requestName);
                }
                // Update pie chart
                //console.log(e.feature.getProperty(requestName));
                update_pie(e.feature.getProperty(requestName), level);
            }

            var update_pie = function(code, level) {
                var pieSelection = document.getElementById('pieselect');
                console.log(code);
                var url = null;
                if (pieSelection.value === "Age") {
                    if (level === CITY) {
                        url = 'api/ageCity';
                    } else if (level === STATE) {
                        url = 'api/ageState';
                    }
                    $http({
                        method: 'POST',
                        url: url,
                        data: {"region":code}
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
                } else if (pieSelection.value === "Language") {
                    if (level === CITY) {
                        url = 'api/langCity';
                    } else if (level === STATE) {
                        url = 'api/langState';
                    }
                    $http({
                        method: 'POST',
                        url: url,
                        data: {"region":code}
                    }).then(function (response) {
                        console.log(response);
                        pie_initialize(response.data.value, response.data.key);
                    })
                }
            }

            var update_bar = function(level) {
                var url = null;
                if (level === CITY) {
                    url = 'api/incomeCity';
                } else if (level === STATE) {
                    url = '/api/incomeState';
                }
                $http({
                    method:'get',
                    url: url
                }).then(function(response){
                    bar_initialize(response.data[0],response.data[1],response.data[2]);
                });
            }

            var update_line = function(level) {
                var url = null;
                if (level === CITY) {
                    url = 'api/eduCity';
                } else if (level === STATE) {
                    url = '/api/eduState';
                }
                $http({
                    method:'get',
                    url:url
                }).then(function(response){
                    //console.log(response);
                    line_initialize(response.data);
                });
            }

            var pie_initialize = function(data, region){
                document.getElementById('piechart').style.display = 'block';
                // document.getElementById('barchart').style.display = 'none';
                // document.getElementById('linechart').style.display = 'none';
                var myChart = echarts.init(document.getElementById('piechart'));
                myChart.setOption(get_pieoption(data, region));
            };

            var bar_initialize = function(x,y,z){
                // document.getElementById('piechart').style.display = 'none';
                document.getElementById('barchart').style.display = 'block';
                // document.getElementById('linechart').style.display = 'none';
                var myChart = echarts.init(document.getElementById('barchart'));
                myChart.setOption(get_baroption(x,y,z));
            };

            var line_initialize = function(data_list){
                // document.getElementById('piechart').style.display = 'none';
                // document.getElementById('barchart').style.display = 'none';
                document.getElementById('linechart').style.display = 'block';
                var myChart = echarts.init(document.getElementById("linechart"));
                myChart.setOption(get_lineoption(data_list));
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

            var get_baroption = function(x,y,z){
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    title: {
                        text: 'Tweets number and medium income'
                    },
                    tooltip: {},
                    legend: {
                        selectedMode: false,
                        data:['medium income','Num of tweets']
                    },
                    xAxis: [{
                            type: 'category',
                            data:x,
                            axisLabel: {
                                interval: 0,
                                rotate: 10 //If the label names are too long you can manage this by rotating the label.
                            }
                    }],
                    yAxis: [
                        {
                            type: 'value',
                            name: 'Income',
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                formatter: '{value} dollars'
                            }
                        },
                        {
                            type: 'value',
                            name: 'Tweet number',
                            axisLabel: {
                                formatter: '{value} '
                            },
                            splitLine: {
                                show: false
                            }
                        }

                    ],
                    series: [{
                        name: 'medium income',
                        type: 'bar',
                        data:y

                    },
                        {
                            name: 'tweet number',
                            type: 'line',
                            yAxisIndex: 1,
                            data:z

                        }]
                };
                return option;
            };

            var get_lineoption = function(data_list){
                var series = [];
                var xaixes = [];
                var option = {
                    backgroundColor: '#FBFBFB',
                    title: {
                        text: 'Line chart of population in Australia'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['Victoria', 'NSW','Queensland']
                    },

                    calculable: true,


                    xAxis: [{
                        type: 'category',
                        // boundaryGap: false,
                        data: ["secondary", "uni_other", "furt_educ", "primary", "other"]
                    }],
                    yAxis: [{

                        type: 'value'
                    }],
                    series: data_list
                };
                return option;
            }

        };

        return googleMapService;

});