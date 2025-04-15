// import { barOption, pieOption } from './Option';
//Echarts Enhanced Completion 插件，导入配置
// 非必要  只要有export ...  即可
// 1.  /** @type EChartsOption */
// 2. export const option = {}
// 临时使用不好用: 需要import , export. 要有前端打包工具
// 对于2中export,编写时带上,预览时删去


const charts = document.querySelectorAll('.chart')

const pie = echarts.init( charts[0] )
const bar = echarts.init( charts[1] )
// 可以使用立即执行函数 防止变量污染
// (function(){
//     const myChart = echarts.init( document.querySelectorAll('.chart')[0] )
//     const option = {}
//     myChart.setOption(option)
// }()) 

/** @type EChartsOption */
const pieOption = {
    title: {
        text: '饼形图',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical', // 图例垂直排列
        left: 'left', // 图例位于左侧
        data: ['one', 'two', 'three']
    },
    grid: {
        left: '0%',
        right: '0%',
        top: '2%',
        bottom: '2%',
    },
    series: [
        {
            // name: 'example',
            type: 'pie',
            data: [
                { value: 10, name: 'one' },
                { value: 15, name: 'two' },
                { value: 12, name: 'three' }
            ],
        }
    ]
};


const barOption = {

};



pie.setOption(pieOption);
bar.setOption(barOption);

window.addEventListener("resize", function(){
    pie.resize();
    bar.resize();
})
// document.querySelectorAll('.chart').forEach(item => {
//     item.addEventListener("resize", function(){
//         pie.resize();
//         bar.resize();
//     })    
// });  //问问其意义
 