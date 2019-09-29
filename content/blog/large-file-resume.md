---
modified_time: 2019-09-11 17:45
title: Web 大文件上传浅析
---

## 普通方式上传大文件的痛点

上传大文件耗时比较久，普通的ajax、表单文件经常会遇到网络不稳定，不小心关掉浏览器等情况，再次上传时用户只能从头开始上传。如果有些需要上传几分钟甚至几小时的超大文件，用户将难以成功上传。第二点是后端一般都会有一些上传单个文件的大小限制，经典的例如 nginx 的 `client_max_body_size`，要上传大文件的话只能把这些值设置的很大，会带来一定的安全隐患

## 解决思路

在前端场景下，一些耗费性能的 js 任务可以使用 Event Loop 分片成子任务执行的方式解决，从而避免造成渲染阻塞。要上传大文件，可以采用相似的思路，把大文件拆分成数个小文件依次上传，后端把上传过来的这些小文件（`chunk`）按序拼接即可还原为源文件，这就引入了几个问题：

1. 如何将大文件拆分成 chunk
2. 如何保证 chunk 的顺序
3. 如何知道哪些 chunk 属于哪个源文件

### 文件拆分

利用 HTML5 的 Blob.slice API 可以实现文件拆分，文件对象 File 是 Blob 的子类，继承了 Blob 类的所有方法，该方法兼容IE10+的现代浏览器 

MDN：https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/slice

兼容性：https://caniuse.com/#search=slice
```js
var chunk = file.slice(startByte, endByte, file.type);
```

假设我们设置 chunk 的最大大小为 1MB，要上传一个 100.5 MB 的大文件就可以按字节顺序把文件拆分成 101 个 chunk，并记录每个 chunk 的序号，比如第 10 个 chunk 的序号就是 10，0 - 100 序号的 chunk 大小都为 1MB，101 序号的 chunk 大小为 0.5 MB。通过 101 个 ajax post 请求上传每个 chunk，并将 chunk 的序号作为请求参数。后端每收到一个 chunk，就检查该 chunk 的序号是否是上一个 chunk 的序号 + 1，如果是则把该 chunk 拼接到当前文件中，如果不是则继续监听请求。

### 文件 ID


到目前为止，后端还不知道当前 chunk 是属于哪一个源文件的，一旦有多个文件上传的请求就会出现混乱。因此需要给每个源文件定义一个文件 ID，作为 chunk 的请求参数传给后端。生成文件 ID 一个比较好的方案是 `md5(fileSize + fileName + userid)`，userid 可确保不同用户上传同名的文件不会混淆。

## 断点续传

有了文件分片，就可以实现断点续传。断点续传的意思就是传文件时出于各种原因中断传输，下次传相同的文件还可以从上次中断的地方继续传输，而不需要从头开始上传。实现方案是在每次上传 chunk 之前先发一个查询请求，查询准备上传的这个 chunk 的文件 id 和序号是否在后端的上传缓存中已存在，如果后端返回已存在，则跳过该 chunk 的 post 上传请求，进行下一个 chunk 的查询，依次如此。当然，当文件完全上传完毕后后端需要清除该文件的所有上传缓存。

## Resumable.js

Resumable.js 是一个实现了大文件上传的很方便的库，支持断点续传、获取上传进度

```js
import Resumable from 'resumable.js'

function uploadFile(url, file){
    var r = new Resumable({
        target: url,
    });
    r.addFile(file);
    r.on("fileAdded", (file, message) => {
        r.upload();
    });
}
```

https://github.com/23/resumable.js