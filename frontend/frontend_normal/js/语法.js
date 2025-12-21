let num=胡阌祺;       1// 附值
console.log(num);     2// 在控制台中
alert(num);           3// 弹出警示框
document.write('<h1>huwenqi</h1>');4// html标题
prompt('your name');5// 提示输入框

let b=prompt('something');document.write(b)
let array=[1, 2, 3 ,4, 5];//数组 字面量
console.log(array[1,2],array.length)//使用数组 数组长度 
const changliang=num//常量须在申明时赋值 另

document.write(`你好${num}岁`)//必须用反引号

typeof num              // 检测数据类型 
let tranNum1=Number(prompt());let tranNum2=+prompt()//强制转换数据类型 
parseInt(tranNum1);parseFloat(tranNum2)//从头开始  只取整数  浮点数
// 逻辑运算符 &&(与)  ||(或)  !(非)
//优先级:  ! > && > ||
// 逻辑中断(终断执行后面的语句)---->
&& 左边为false就短路     //取从左往右第一个false    全为true时,取最右边的true
|| 左边为true就短路      //取从左往右第一个true     全为false时,取最右边的false

// '(空字符串)'、0、undefined、null、false、NaN转换为布尔值后都是false,其余则为true

if(条件){       // 分支语句 (true)执行  (flase)不执行
    语句        // (数字,字符)——除了<0><空字符>——都为true
}else if(条件){ // 分支语句,依次判断,执行一次
    语句        
}else{}         

条件 ? 语句1 :语句2//三元运算符 条件(true——>语句1)(flase——>语句2)
// ====>  if(条件){语句1}else{语句2}

switch (key) {case value:语句1 // key===value时  执行语句1
    break;             //break防止穿透
    default:语句2}     //否则执行语句2  

while(循环条件){循环体}
for(起始;终止;变化){}

let arr1=[0,1,2,3,4,5,6,7]//arr1.length-->arr元素个数
for(let i=0;i< arr1.length;i++){document.write(`${arr[i]}\n`)} 
arr1.push()//增加在数组末尾    返回值：增加后[数组arr]的长度
arr1.unshift()//增加在数组开头    返回值：增加后[数组arr]的长度
arr1.pop()//删除在数组末尾    返回值：所删除的值(一次删除一个)
arr1.shift()//删除在数组开头    返回值：所删除的值(一次删除一个)
arr1.splice(start, deleteCount, item1, item2, /* …, */ itemN)
//从start开始，删除deleteCount个元素，并增加item元素    

function 函数名(形参=默认值){函数体}    //申明函数
函数名(实参)                           //调用函数    调用 具名函数 可在任何位置
// return    变量/数组                  使用返回值
let 变量名=function(){}                //匿名函数   
// 函数表达式[变量名-->函数名]    调用 函数表达式 必须在申明后
(function 函数名(形参=默认值){函数体}(实参));// 直接执行函数  末尾需加;
(function 函数名(形参=默认值){函数体})(实参);// 直接执行函数  末尾需加;

let 对象名1={属性名:属性值,方法:函数}//声明对象
let 对象名2=new Object()
//对象名.属性名   --->属性值
//对象名['属性名']--->属性值    (属性名需加'')
//增:对象名.新属性名=新值    改:对象名.属性名=新值      删:delete 对象名.属性名
//方法:function(){}        对象名.新方法:function(){}
//对象名.方法()--->函数

for(let k in arr){}//  针对   属性名/值  的遍历 

// Math函数

(参数) => {return 参数} //表达式体
(参数) => (返回值)      //块体