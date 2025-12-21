## 1 引入 ECharts

通过cdn链接引入，或下载echarts.js文件，本地使用。

**npm包需在node.js后端环境使用**

通过 npm 安装：

```bash
npm install echarts --save
```

在 HTML 文件中引入 ECharts 文件：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ECharts 快速上手</title>
    <!-- 引入 ECharts 文件 -->
    <script src="js/echarts.min.js"></script> <!-- 或者使用 CDN 地址 -->
</head>
<body>
    <!-- 准备一个具备大小 (宽高) 的 DOM 容器 -->
    <div id="main" style="width: 600px;height:400px;"></div>
    <script type="text/javascript">

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar', // 指定图表类型为柱状图
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    </script>
</body>
</html>
```

### 1.1 核心步骤

1.  **创建容器：** 在 HTML 中创建一个具有明确宽度和高度的 DOM 元素，作为 ECharts 图表的容器。
2.  **初始化实例：** 调用 `echarts.init()` 方法，传入 DOM 容器，初始化一个 ECharts 实例。
3.  **配置选项：** 创建一个 JavaScript 对象 (`option`)，用于定义图表的各种配置，如标题、图例、坐标轴、数据系列等。
4.  **设置选项：** 调用 ECharts 实例的 `setOption()` 方法，将配置项应用到图表上，从而绘制出图表。

## 2. 核心组件 (Option 配置详解)

ECharts 的配置项 (`option`) 是一个庞大而灵活的对象，包含了绘制图表所需的所有信息。以下是一些最常用的核心组件：

### 2.1 `title` - 标题组件

用于设置图表的标题和副标题。

```javascript
option = {
    title: {
        text: '主标题',
        subtext: '副标题',
        left: 'center', // 标题位置
        textStyle: { // 标题文字样式
            color: '#333',
            fontSize: 18
        }
    }
    // ... 其他配置
};
```

### 2.2 `legend` - 图例组件

用于展示不同系列的标记(symbol)，颜色和名字。可以通过点击图例来控制哪些系列不显示。

```javascript
option = {
    legend: {
        data: ['系列1', '系列2'], // 与 series 中的 name 对应
        top: 'bottom', // 图例位置
        orient: 'horizontal' // 图例布局朝向
    },
    series: [
        { name: '系列1', type: 'line', data: [...] },
        { name: '系列2', type: 'bar', data: [...] }
    ]
    // ... 其他配置
};
```

### 2.3 `grid` - 网格组件

定义了直角坐标系内绘图网格的位置和大小，可以控制图表主体区域的位置。

```javascript
option = {
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true // grid 区域是否包含坐标轴的刻度标签
    }
    // ... 其他配置
};
```

### 2.4 `xAxis` / `yAxis` - 坐标轴组件

用于定义直角坐标系的 X 轴和 Y 轴。

*   `type`: 坐标轴类型。
    *   `'value'`: 数值轴，适用于连续数据。
    *   `'category'`: 类目轴，适用于离散的类目数据。
    *   `'time'`: 时间轴，适用于连续的时序数据。
    *   `'log'`: 对数轴。适用于对数数据。
*   `data`: 类目轴的数据。
*   `name`: 坐标轴名称。
*   `axisLabel`: 刻度标签配置。
*   `axisLine`: 坐标轴线配置。
*   `splitLine`: 分隔线配置。

```javascript
option = {
    xAxis: {
        type: 'category', // 类目轴
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        name: '星期'
    },
    yAxis: {
        type: 'value', // 数值轴
        name: '访问量'
    }
    // ... 其他配置
};
```

### 2.5 `tooltip` - 提示框组件

用于在鼠标悬浮到图表元素上时显示相关信息。

*   `trigger`: 触发类型。
    *   `'item'`: 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
    *   `'axis'`: 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
    *   `'none'`: 什么都不触发。
*   `formatter`: 提示框内容格式器，支持字符串模板和回调函数。

```javascript
option = {
    tooltip: {
        trigger: 'axis', // 坐标轴触发
        axisPointer: { // 坐标轴指示器配置
            type: 'cross' // 十字准星指示器
        },
        formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}' // 字符串模板
    }
    // ... 其他配置
};
```

### 2.6 `toolbox` - 工具栏组件

提供导出图片、数据视图、动态类型切换、数据区域缩放、重置等工具。

```javascript
option = {
    toolbox: {
        feature: {
            saveAsImage: {}, // 导出图片
            dataView: {}, // 数据视图
            magicType: { // 动态类型切换
                type: ['line', 'bar']
            },
            restore: {}, // 配置项还原
            dataZoom: {} // 数据区域缩放 (需要配合 dataZoom 组件)
        }
    }
    // ... 其他配置
};
```

### 2.7 `series` - 系列列表

这是 ECharts 配置的核心部分，定义了图表的类型和数据。`series` 是一个数组，可以包含多个系列对象，每个对象代表一种图表类型或一组数据。

*   `type`: 图表类型，如 `'line'`, `'bar'`, `'pie'`, `'scatter'`, `'map'`, `'graph'`, `'tree'` 等。
*   `name`: 系列名称，用于 `tooltip` 的显示，`legend` 的图例筛选。
*   `data`: 系列中的数据内容。数据格式根据图表类型的不同而不同。
    *   对于柱状图、折线图等，通常是一维数组 `[value1, value2, ...]` 或二维数组 `[[x1, y1], [x2, y2], ...]`。
    *   对于饼图，通常是包含 `name` 和 `value` 的对象数组 `[{value: 335, name: '直接访问'}, ...]`。
    *   对于散点图，通常是二维数组 `[[x1, y1, size1], [x2, y2, size2], ...]`。
*   `label`: 图形上的文本标签。
*   `itemStyle`: 图形的样式（颜色、边框等）。
*   `lineStyle`: 线条的样式（仅对线图有效）。
*   `areaStyle`: 区域填充样式（仅对线图有效）。
*   `symbol`: 标记的图形。
*   `symbolSize`: 标记的大小。
*   `stack`: 数据堆叠，同个类目轴上系列配置相同的 `stack` 值后，后一个系列的值会在前一个系列的值上相加。
*   `coordinateSystem`: 系列使用的坐标系，可选 `'cartesian2d'` (二维笛卡尔坐标系), `'polar'` (极坐标系), `'geo'` (地理坐标系) 等。

```javascript
option = {
    xAxis: { data: ['A', 'B', 'C'] },
    yAxis: {},
    series: [
        {
            name: '系列1',
            type: 'bar', // 柱状图
            data: [10, 20, 30],
            itemStyle: {
                color: 'blue'
            }
        },
        {
            name: '系列2',
            type: 'line', // 折线图
            data: [15, 25, 35],
            lineStyle: {
                color: 'red',
                width: 2
            }
        },
        {
            name: '系列3',
            type: 'pie', // 饼图
            radius: '50%', // 饼图半径
            center: ['75%', '50%'], // 饼图中心位置
            data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'}
            ],
            emphasis: { // 高亮状态样式
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
    // ... 其他配置
};
```

### 2.8 `dataset` - 数据集组件 (推荐的数据管理方式)

ECharts 4 开始引入了 `dataset` 组件，用于更方便地管理和映射数据。它可以将数据与具体的系列配置分离，使得配置更清晰，并且方便实现数据的多维度映射。

*   `source`: 原始数据源，通常是二维数组或对象数组。
*   `dimensions`: 指定维度（列）的名称，方便后续在 `series` 中通过名称引用。

```javascript
option = {
    legend: {},
    tooltip: {},
    dataset: {
        // 提供一份数据。
        source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
        ]
        // 也可以指定 dimensions
        // dimensions: ['product', '2015', '2016', '2017'],
        // source: [
        //     {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
        //     {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
        //     // ...
        // ]
    },
    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
    xAxis: {type: 'category'},
    // 声明一个 Y 轴，数值轴。
    yAxis: {},
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [
        {type: 'bar'},
        {type: 'bar'},
        {type: 'bar'}
    ]
    // 在 series 中可以通过 encode 指定映射关系
    // series: [
    //    { type: 'bar', encode: { x: 'product', y: '2015' } },
    //    { type: 'bar', encode: { x: 'product', y: '2016' } },
    //    { type: 'bar', encode: { x: 'product', y: '2017' } }
    // ]
};
```

## 3. 事件处理

ECharts 支持丰富的鼠标事件，如 `click`, `dblclick`, `mouseover`, `mouseout` 等。可以通过 ECharts 实例的 `on` 方法来监听这些事件。

```javascript
myChart.on('click', function (params) {
    // 控制台打印数据的名称
    console.log('点击的元素信息:', params);
    console.log('名称:', params.name);
    console.log('数值:', params.value);
    console.log('系列名称:', params.seriesName);
    // 可以在这里执行点击后的交互逻辑，例如跳转页面、显示详情等
});

// 鼠标悬浮事件
myChart.on('mouseover', function (params) {
    console.log('鼠标悬浮:', params.name);
});
```

`params` 对象包含了触发事件的组件或数据项的相关信息。

## 4. 响应式设计

ECharts 图表默认是响应式的。当容器大小改变时，图表会自动调整尺寸。你也可以手动调用 `myChart.resize()` 方法来强制图表重新计算和绘制。

```javascript
// 监听窗口大小变化
window.addEventListener('resize', function () {
    myChart.resize();
});
```

## 5. 定制化与主题

ECharts 提供了强大的定制能力：

*   **丰富的配置项：** 通过修改 `option` 中的各项配置，可以精细地控制图表的每一个元素。
*   **主题（Theme）：** ECharts 内置了 `'light'` 和 `'dark'` 两套主题。可以通过 `echarts.init(dom, theme)` 的第二个参数来指定主题。也可以使用在线主题编辑器创建和下载自定义主题文件，然后在初始化时引入。
*   **图形元素和动画：** 可以自定义图形元素的样式、颜色、动画效果等。
*   **富文本：** 支持在标签、标题等文本中使用富文本，实现更复杂的文本样式。

```javascript
// 初始化时使用 'dark' 主题
var myChart = echarts.init(document.getElementById('main'), 'dark');

// 或者注册自定义主题
// var theme = { ... }; // 自定义主题对象
// echarts.registerTheme('myTheme', theme);
// var myChart = echarts.init(document.getElementById('main'), 'myTheme');
```

## 总结

ECharts 是一个功能全面且易于上手的可视化库。掌握其核心概念，特别是 `option` 的配置结构和常用组件，是使用 ECharts 的关键。通过灵活运用 `series` 来定义图表类型和数据，结合 `dataset` 进行数据管理，并利用事件处理、响应式设计和定制化功能，可以创建出满足各种需求的、交互丰富的数据可视化图表。建议多查阅官方文档和示例，不断实践和探索。
```

I will now write this content to the `echarts_introduction.md` file in the specified directory.