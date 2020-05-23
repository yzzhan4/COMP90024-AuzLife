var myChart = echarts.init(document.getElementById('piechart'));
var option = {
    title: {
        text: 'pie chart of population'
    },
    tooltip: {},
    series: [{
        name: 'population',
        type: 'pie',
        radius:'55%',
        data:[
            {value:12716,name:'0-4'},
            {value:14060,name:'5-9'},
            {value:13895,name:'10-14'},
            {value:13281,name:'15-19'},
            {value:11152,name:'20-24'},
            {value:11901,name:'25-29'},
            {value:12178,name:'30-34'},
            {value:12197,name:'35-39'},
            {value:13734,name:'40-44'},
            {value:15850,name:'45-49'},
            {value:15988,name:'50-54'},
            {value:17076,name:'55-59'},
            {value:16025,name:'60-64'},
            {value:15061,name:'65-69'},
            {value:11910,name:'70-74'},
            {value:8225,name:'75-79'},
            {value:5228,name:'80-84'},
            {value:5180,name:'85-plus'}
        ]
    }]
};
myChart.setOption(option);
