angular.module("chartservice", [])
    .factory("chartservice",function($http){
        var chart = {};
        chart.refresh = function(){
            // Pie chart
            $http({
                method:'get',
                url: '/api/ageState'
            }).then(function(response){
                console.log("draw piechart");
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
            }); //TODO error handling, pass state, rename, city

            console.log("bar chart");
            // bar chart
            $http({
                method:'get',
                url: '/api/testbarchart'
            }).then(function(response){
                console.log("draw barchart");
                bar_initialize(response.data[1],response.data[0],response.data[2]);
            });

            // Line chart
            $http({
                method:'get',
                url: '/api/eduState'
            }).then(function(response){
                console.log("draw line chart");
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
        }

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
                title: {
                    text: 'tweets number and medium income of chosen states'
                },
                tooltip: {},
                legend: {
                    selectedMode: false,
                    data:['medium income','tweets number']
                },
                xAxis: {
                    data:x
                },
                yAxis: [{
                    type: 'value',
                    name: 'income',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} dollars'
                    }
                },
                    {
                        type: 'value',
                        name: 'tweet number',
                        axisLabel: {
                            formatter: '{value} '
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                series: [{
                    name: 'medium income',
                    type: 'bar',
                    data:y

                },
                    {
                        name: 'tweet number',
                        type: 'line',
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
                    text: 'line chart of population in Australia'
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

        return chart;

    });