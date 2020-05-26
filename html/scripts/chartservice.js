angular.module("chartservice", [])
    .factory("chartservice",function($http){
        var chart = {};
        chart.refresh = function(){

            $http({
                method:'get',
                url: '/api/testbarchart'
            }).then(function(response){
                // var data = response.data;
                // for (i=0; i<data.length; i++) {
                //     console.log(data[i]);
                //     pie_data += {value:data[i].key, name:data[i].value};
                // }
                console.log(response.data[0])
                bar_initialize(response.data[1],response.data[0],response.data[0]);

            }, function(error) {

            });

            $http({
                method:'get',
                url: '/api/numofcity'
            }).then(function(response){
                // var data = response.data;
                // for (i=0; i<data.length; i++) {
                //     console.log(data[i]);
                //     pie_data += {value:data[i].key, name:data[i].value};
                // }
                console.log(response.data[0])
                bar_initialize(response.data[1],response.data[0],response.data[0]);

            }, function(error) {

            });

            var pie_data = [{value:12716,name:'0-4'},
                {value:14060,name:'5-9'},
                {value:13895,name:'10-14'},
                {value:13281,name:'15-19'},
                {value:11152,name:'20-24'},
                {value:11901,name:'25-29'},
                {value:12178,name:'30-34'},
                {value:12197,name:'35-39'},
                {value:13734,name:'40-44'},
                {value:15850,name:'45-49'},
                {value:15988,name:'50-54'}];

            var bar_data = [["a","b","c"],[1,2,3]];
            var line_data = 1;
            pie_initialize(pie_data);
            // bar_initialize(bar_data[0],bar_data[1],[12,13,14]);
            line_initialize(line_data);
        }

        var pie_initialize = function(data){
            var myChart = echarts.init(document.getElementById('piechart'));
            myChart.setOption(get_pieoption(data));
        }

        var bar_initialize = function(x,y,z){
            var myChart = echarts.init(document.getElementById('barchart'));
            myChart.setOption(get_baroption(x,y,z));
        }

        var line_initialize = function(data_list){
            var myChart = echarts.init(document.getElementById("linechart"));
            myChart.setOption(get_lineoption(data_list));
        }

        var get_pieoption = function(data){
            var option = {
                title: {
                    text: 'Age distribution of population '
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
        }

        var get_baroption = function(x,y,z){
            var option = {
                title: {
                    text: 'Tweets number and medium income of chosen states'
                },
                tooltip: {},
                legend: {
                    selectedMode: false,
                    data:['medium income','tweets number']
                },
                grid:{
                    left:100
                },
                xAxis: [
                    {
                        type:'category',
                        data:['VIC','NSW','NA','TAS','QLD']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Medium income',
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
                            formatter: '{value} instances'
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: 'Medium income',
                        type: 'bar',
                        data:[3000,4000,1000,500,2500]

                    },
                    {
                        name: 'Tweet number',
                        type: 'line',
                        yAxisIndex:1,
                        data:[10000,15000,7000,36000,13000]

                    }]
            };
            return option;
        }

        var get_lineoption = function(data_list){
            var series = [];
            var xaixes = [];
            var option = {
                backgroundColor: '#FBFBFB',
                title: {
                    text: 'Distribution of people educational level'
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
                    data: ["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80-84","85-plus"]
                }],
                yAxis: [{

                    type: 'value'
                }],
                series: [{
                    name: 'Victoria',
                    type: 'line',
                    data: [800, 300, 500, 800, 300, 600, 500, 600,800, 300, 500,400,800, 300, 600, 500, 600]
                }, {
                    name: 'NSW',
                    type: 'line',
                    data: [600, 300, 400, 200, 300, 300, 200, 400,300, 400, 200, 300, 300, 200, 400,700,200]
                },{
                    name: 'Queensland',
                    type: 'line',
                    data: [900, 200,300, 500, 200, 300, 700,  300, 200, 400,300,  600, 300, 200,700,200, 400]
                }]
            };
            return option;
        }

        return chart;



    });