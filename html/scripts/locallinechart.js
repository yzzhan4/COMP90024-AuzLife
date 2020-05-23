

var myChart = echarts.init(document.getElementById("linechart"));

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

myChart.setOption(option);