---
modified_time: 2019-01-13 22:09
title: canvas的一些概念
type: post
----


canvas接触了挺久了，发现很多概念还是很模糊，比如路径、状态等等，经常搞混，因此现在总结和梳理一下。

## 路径

了解canvas的都知道，canvas上下文中的moveTo、lineTo、rect等方法可以创建路径，但什么是路径呢？

就我理解，一条路径就是一系列点和这些点按一定顺序相连的一种抽象描述，和ps里的钢笔工具画出来的路径概念是一样的。

canvas 里又有子路径的概念，每条子路径是一个单独的路径，不与其它路径相连接。一个路径中可以含有多个子路径。

moveTo 的作用就是在当前路径下新建一条子路径，将指定的点作为子路径的起点

lineTo 则是新建一个点，将这个点与当前的子路径相连。如果当前没有子路径，则作用与 moveTo 方法相同。

注意，有些绘制路径的方法会主动新建子路径，比如 rect 方法，而有些则会像 lineTo 那样尽可能衔接已有的子路径，比如 arc 方法。

至于 beginPath，这个方法的作用是在当前canvas上下文中创建一个新路径，把已存在的路径清除。路径的清除不会影响到已经使用fill、stroke等方法绘制上去的像素，只是内存中的路径抽象被销毁了，后续任何对路径的操作，比如使用fill、stroke进行渲染，都不会涉及到被清除的路径。

closePath 这个方法，看上去似乎和 beginPath 异曲同工。其实它和 beginPath 的区别非常大，作用也不同，很容易搞混。它的作用是将当前子路径的末端点至首端点创建一条连线，此外没有任何其他作用，也并没有语义上的那种结束路径的作用。

fill 填充、stroke 描边：对当前 canvas 上下文中的，即未被 beginPath 清除的路径和所有子路径进行填充渲染或描边渲染

clip：作用是利用当前路径和所有子路径的填充区域生成裁剪区域，调用后所有的绘制操作只能在该区域中渲染出来。调用该方法不会对路径产生影响。

### 代码案例

#### 案例1
```js
c.strokeStyle = 'black'

c.moveTo(0, 0);
c.lineTo(10, 10)
c.lineTo(20, 20);
c.lineTo(50, 30)
c.lineTo(50, 50)

c.stroke()
```
![代码](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-01-13%2021.45.55.png)

只有一条子路径，调用stroke方法描边

#### 案例2
```js
c.strokeStyle = 'black'

c.moveTo(0, 0);
c.lineTo(10, 10)

c.moveTo(20, 20);
c.lineTo(50, 30)
c.lineTo(50, 50)

c.stroke()
```
![代码](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-01-13%2021.41.11.png)

创建了两条子路径，子路径间不相连，调用stroke方法能将两条子路径都描边

#### 案例3
```js
c.strokeStyle = 'black'

c.moveTo(0, 0);
c.lineTo(10, 10)
c.beginPath();
c.lineTo(20, 20);
c.lineTo(50, 30)
c.lineTo(50, 50)

c.stroke()
```
![代码](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-01-13%2021.50.15.png)

创建一条子路径后，beginPath清除路径，lineTo调用时发现不存在任何子路径，因此新建一条子路径。调用stroke方法只影响到存在的路径。

#### 案例4
```js
c.strokeStyle = 'black'

c.moveTo(0, 0);
c.lineTo(10, 10)

c.moveTo(20, 20);
c.lineTo(50, 30)
c.lineTo(50, 50)
c.closePath();
c.lineTo(20, 60);

c.stroke()
```
![代码](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-01-13%2021.56.39.png)

closePath使得第二条子路径首尾相连，然后在20,60调用lineTo，发现路径仍然连着，调用closePath并不会结束和清除路径。



## 绘图状态

一个canvas上下文的绘图状态包含如下：

- 变换矩阵：translate、rotate、scale、transform
- 剪切区域：clip
- 虚线列表
- 渲染属性 
    - 描边、填充样式：strokeStyle、fillStyle 
    - 线条设置：lineWidth、lineCap、lineJoin、miterLimit、lineDashOffset 
    - 阴影设置：shadowOffsetX、shadowOffsetY、shadowBlur、shadowColor 
    - 文本设置：font、textAlign、textBaseline、direction
    - 其它：globalAlpha、globalCompositeOperation、imageSmoothingEnabled

需要注意的是，路径不属于绘图状态的一部分。

可以使用 save 和 restore 方法对绘图状态进行存取，canvas 内部实现了一个栈，调用 save 即把当前上下文的绘图状态对象 push 入栈，调用 restore 即是 pop 一个绘图状态对象出栈，然后将当前上下文的绘图状态替换为该绘图状态。

使用save/restore能很方便地进行绘图状态的局部更新，而不会影响到全局。

#### 案例
```js
c.strokeStyle = 'black'
c.lineWidth = 2
/**
 * 绘图状态1: {
 *    strokeStyle: 'black',
 *    lineWidth: 2,
 * }
 **/    
c.beginPath();
c.moveTo(0, 0);
c.lineTo(10, 10)
c.stroke()
    
c.save();   //保存绘图状态1

c.strokeStyle = 'red'
/**
 * 绘图状态2: {
 *    strokeStyle: 'red',
 *    lineWidth: 2,
 * }
 **/  
c.beginPath();
c.moveTo(20, 20);
c.lineTo(50, 30)
c.lineTo(50, 50)
c.stroke()

c.restore();   //恢复成绘图状态1

c.beginPath();
c.moveTo(20, 20);
c.lineTo(20, 50)
c.lineTo(50, 50)
c.stroke()
```
![代码](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-01-13%2022.09.12.png)
