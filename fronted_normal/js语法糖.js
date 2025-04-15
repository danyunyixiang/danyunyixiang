// 展开运算符与解构
// 1. 解构赋值
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 对象解构
const { uname, age } = { uname: '张三', age: 25 };
console.log(uname, age); // 张三 25

// 带默认值的解构
const [x = 0, y = 0] = [5];
console.log(x, y); // 5 0

// 嵌套解构
const [first, [second, third]] = [1, [2, 3]];
console.log(first, second, third); // 1 2 3

// 2.合并数组
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [...arr1, ...arr2];
console.log(arr3); // [1, 2, 3, 4, 5, 6]

// 3.对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const obj3 = { ...obj1, ...obj2 };
console.log(obj3); // { a: 1, b: 2, c: 3, d: 4 }

// 4.函数参数
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// 5.可选链操作符
const user = {
  name: '李四',
  address: {
    city: '北京'
  }
};
console.log(user?.address?.street); // undefined (不会报错)

// const temp = obj.first;
// const nestedProp =
//   temp === null || temp === undefined ? undefined : temp.second;
// 等同于
// const nestedProp = obj.first?.second;


// 6.空值合并操作符
const value = null;
const defaultValue = value ?? '默认值';
console.log(defaultValue); // '默认值'

// 用三元代替 
// const defaultValue = value === null || value === undefined ? '默认值' : value;

// 7.逻辑赋值操作符
let x1 = null;
x1 ||= 10; // 等同于: x = x || 10
console.log(x1); // 10

let y1 = 5;
y1 &&= 20; // 等同于: y = y && 20
console.log(y1); // 20

let z1 = null;
z1 ??= 30; // 等同于: z = z ?? 30
console.log(z1); // 30

// 8.模板字符串
const username = '王五';
const greeting = `你好，${username}！`;
console.log(greeting); // 你好，王五！

// 9.箭头函数
const double = x => x * 2;
console.log(double(5)); // 10

// 10.对象属性简写
const firstName = '小';
const lastName = '明';
const person = { firstName, lastName };
console.log(person); // { firstName: '小', lastName: '明' }

// 11.动态属性名
const propName = 'dynamicProp';
const dynamicObj = {
  [propName]: '动态属性值'
};
console.log(dynamicObj.dynamicProp); // 动态属性值

// 12.Promise链和async/await
const fetchData = () => Promise.resolve('数据');

// Promise链
fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/await
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

// 13.类和继承
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name}发出声音`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name}汪汪叫`;
  }
}

const dog = new Dog('小黑');
console.log(dog.speak()); // 小黑汪汪叫







