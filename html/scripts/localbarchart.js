var myChart = echarts.init(document.getElementById('barchart1'));

// 指定图表的配置项和数据
var option = {
    title: {
        text: 'bar chart of population'
    },
    tooltip: {},
    legend: {
        data:['population']
    },
    xAxis: {
        data: ["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80-84","85-plus"]
    },
    yAxis: {},
    series: [{
        name: 'population',
        type: 'bar',
        data: [12716, 14060, 13895, 13281, 11152, 11901,12178,12197,13734,15850,15988,17076,16025,15061,11910,8225,5228,5180]
    }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);