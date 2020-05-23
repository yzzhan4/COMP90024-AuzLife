angular.module("barchart", [])
    .factory("barchart",function($http){
        var barchart = {};
        console.log("testbarcharthere");
        barchart.refresh = function(){
            return $http({
                method:'get',
                url: '/api/testbarchart'
            }).then(function(response){
                var cityInstance = response.data;
                console.log(cityInstance);
                var xData = cityInstance["keyslist"];
                var yValue = cityInstance["valuelist"];
                initialize(xData, yValue);
            }, function(error) {
            });
        }

        var initialize=function(xData, yValue){
            var myChart = echarts.init(document.getElementById('barchart'));

            var option = {
                title: {
                    text: 'bar chart of population'
                },
                tooltip: {},
                legend: {
                    data:['population']
                },
                xAxis: {
                    data:xData
                },
                yAxis: {},
                series: [{
                    name: 'population',
                    type: 'bar',
                    data:yValue
                }]
            };

            myChart.setOption(option);
        }
        return barchart;

    });
