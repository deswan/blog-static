---
modified_time: 2019-09-11 17:45
title: Web 大文件上传浅析
---

#### 普通方式上传大文件的痛点

上传大文件耗时比较久，普通的ajax、表单文件经常会遇到网络不稳定，不小心关掉浏览器等情况，再次上传时用户只能从头开始上传。如果有些需要上传几分钟甚至几小时的超大文件，用户将难以成功上传