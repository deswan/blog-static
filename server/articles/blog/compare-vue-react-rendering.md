---
modified_time: 2018-12-15 20:06
title: Vue和React的重渲染（re-render）机制对比
---

Vue和React的其中一个最重要的区别是它们对于数据更新的管理方式不同，Vue基本上是一套基于getter/setter实现的依赖收集/依赖更新的订阅式机制，而React则是通过显式的触发函数调用来更新数据，比如setState。相比来说Vue的实现方式更细粒度一些， 通过依赖收集，Vue是能够知道一些数据的更新导致了哪些地方需要重新计算的，通过这种机制，Vue能够优雅地实现计算属性、watch，包括视图渲染。而React由于缺少这种细粒度的机制，则更多时候需要一些其它方案来提高性能，于是产生了如PureComponent、ImmutableJS、shouldComponentUpdate钩子等等。
 
### 如何触发组件重渲染？

- Vue：赋值data，如`this.value = 3`

- React：`this.setState({value: 3})`

其中的区别在于，Vue知道是组件数据中的value字段发生更新了， 而React只知道是组件的State发生了变化，并不知道是什么数据发生了变化。

### Vue的重渲染
Vue的订阅式机制决定了它不仅知道哪些数据发生了更新，也知道这个数据更新了之后当前组件以及子组件的视图需不需要重新渲染。这是通过“依赖收集”实现的，Vue的视图template会编译成render函数，在数据（data/props/computed）中定义了getter，每次调用各个组件的render函数时，通过getter，就能知道哪些数据被哪些组件的视图所依赖，下一次对这些数据赋值时，也就是调用setter，相应的视图就能触发重渲染，而无关的组件则不需要再次调用render函数，节省了开销。借用Vue作者做的图：（他称之为push式渲染）

![vue-push-rendering](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/vue-push-rendering.png)

举个例子：子组件Child使用了props`value`进行渲染，父组件Parent将data`value`作为props传递给了子组件Child，一秒后更新data。
```
// Child.vue
<script>
export default {
  name: "Child",
  props: ["value"],
  render(h) {
    console.log("Child render");
    return h("div", this.value);
  }
};
</script>

// Parent.vue
import Child from "./components/Child";

export default {
  data() {
    return {
      value: 1
    };
  },
  components: { Child },
  created() {
    setTimeout(() => this.value = 2, 1000);
  },
  render(h) {
    console.log("Parent render");
    return h("div", [
      h(Child, {
        props: { value: this.value }
      })
    ]);
  }
};
</script>
```

控制台打印：
```
Parent render
Parent render
//after 1000ms
Child render
Child render
```

由于Parent组件和Child组件的视图都使用了Parent的data`value`，因此改变`value`的值，父子组件都会进行重渲染。

情况二：
不将`value`作为props传给子组件Child，只用于组件自身视图：
```
<script>
// Child.vue
<script>
export default {
  name: "Child",
  props: ["value"],
  render(h) {
    console.log("Child render");
    return h("div", this.value);
  }
};
</script>

// Parent.vue
import Child from "./components/Child";

export default {
  data() {
    return {
      value: 1
    };
  },
  components: { Child },
  created() {
    setTimeout(() => this.value = 2, 1000);
  },
  render(h) {
    console.log("Parent render");
    return h("div", [
      h(Child),
      this.value + ""
    ]);
  }
};
</script>
```

控制台打印：
```
Parent render
Child render
//after 1000ms
Parent render 
```

改变value后，父组件重渲染了，而子组件没有重渲染，因为子组件的render函数没有收集到Parent组件的数据`value`的依赖。

### React的重渲染

当调用了`setState`，React并不在乎有什么数据发生了改变，接着触发组件的`shouldComponentUpdate`，如果返回true则调用`render`，然后以同样的办法依次更新所有子组件，如果返回`false`则阻止`render`方法调用及子组件更新。换句话说，更新视图的控制权由`shouldComponentUpdate`掌握，而默认情况下该方法返回`true`。（Vue作者称为pull式渲染）：

![react-pull-rendering](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/react-pull-rendering.png)

看个例子：
```
function Child(props) {
  console.log("Child render");
  return <div />;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: 2
      });
    }, 1000);
  }
  render() {
    console.log("Parent render");
    return (
      <div className="App">
        <Child />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

控制台打印：
```
Parent render
Child render
Parent render
Child render
```

甚至视图什么数据都没使用，调用`setState`的组件及其子组件就都重渲染了。当组件或节点比较多的时候，更新数据可能会造成很多不必要的虚拟DOM的构建，庞大的节点树也拖慢了diff的速度，这时就需要引入一些优化方案，比如PureComponent配合ImutableJS， PureComponent利用`props`和`state`属性的浅对比来决定要不要重渲染，如果浅对比结果是相等，则组件及其子组件不参与重渲染。