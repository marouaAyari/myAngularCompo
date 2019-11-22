import { Injectable } from '@angular/core';

@Injectable()
export class ChartsService {
  
    xAxisData = [];

    data1 = [];
    data2 = [];
    constructor() {
    }
    public fillData(data) {
        data.forEach((elt) => { 
            this.xAxisData.push(/*'Job: '+*/  elt.offerTitle);//jobname
            this.data1.push(elt.applyedUsrPercentage)
            //     this.data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            //     this.data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        });
    }
    PieOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['Example1', 'Example2', 'Example3']
        },
        roseType: 'angle',
        series: [
            {
                name: 'PieChart',
                type: 'pie',
                radius: [0, '50%'],
                data: [
                    { value: 235, name: 'Example1' },
                    { value: 210, name: 'Example2' },
                    { value: 162, name: 'Example3' }
                ]
            }
        ]
    }

    LineOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],//NO
            type: 'line',
            smooth: true
        }]
    };

    BarOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'         //：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'name',
                type: 'bar',
                barWidth: '60%',
                data: [10, 52, 200, 334, 390, 330, 220]//NO
            }
        ]
    };

    AnimationBarOption = {// this one is used now
        legend: {
            data: ['% Applications'/*, 'Example data2'*/],
            align: 'left'
        },
        /* toolbox: {
            // y: 'bottom',
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: {},
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        }, */
        tooltip: {},
        xAxis: {
            data: this.xAxisData,
            silent: false,
            splitLine: {
                show: false
            }
        },
        yAxis: {///here in case iwanna change Y
        },
        series: [{
            name: '% Applications',
            type: 'bar',
            data: this.data1,
            animationDelay: function (idx) {
                return idx * 10;//NO
            }
        }, {
            name: 'Example data2',
            type: 'bar',
            data: this.data2,
            animationDelay: function (idx) {
                return idx * 10 + 100;//NO
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;//NO
        }, 
        events: ['click'],
        onClick:function (evt){
            return evt
        }
    };

    getBarOption() {
        return this.BarOption;
    }
    getLineOption() {
        return this.LineOption;
    }
    getPieOption() {
        return this.PieOption;
    }
    getAnimationBarOption(data?) {
        if(data)
            this.fillData(data);//mymagic <3
        return this.AnimationBarOption;
    }

    reset() {//mine 
        
    this.xAxisData.splice(0,this.xAxisData.length);
    this.data1.splice(0,this.data1.length);
    this.data2.splice(0,this.data2.length);
    }
}
