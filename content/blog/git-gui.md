---
modified_time: 2020-07-21 18:10
title: Fork 与 GitKraken
type: post
---

## 界面
#### GitKraken
GitKraken的界面元素比较多，功能也比较丰富

![images/20200721183537_dee252049f4ca2cc3b43efaaff067d70.png](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/images/20200721183537_dee252049f4ca2cc3b43efaaff067d70.png)


#### Fork
Fork的界面清爽一些

![images/20200721184008_ed6fbcdc2551cb4b22c6ed824d3311f4.png](https://blog-1253663928.cos.ap-guangzhou.myqcloud.com/images/20200721184008_ed6fbcdc2551cb4b22c6ed824d3311f4.png)

#### GitKraken的优点

1. 不会卡顿，很流畅，让我pull/commit/push的体验好了不少，这应该对比Fork来说是最重要的优点了。
2. UI美观，配色深得我心，和Fork那类简洁的界面不是一个类型。而且按钮比较大因此好按一点，不会有费心去点的感觉。Fork的按钮就都是用mac原生的，感觉按起来不是很爽，尤其是commit按钮。借助快捷键会比较好一点，但是好像有bug，按了没有反应.。并且GitKraken按钮的色彩也更丰富，比如commit按钮用的是绿色，回滚操作比如reset、unstaged用的是红色，更好一眼分辨。
3. 复制分支名称方便。工作中要复制分支名称还挺频繁的，比如提测等等，但是在Fork中怎么也找不到可以直接复制的地方。需要在左侧分支右键点击`Rename xxx`然后点复制才可以，不了解很难找的到。但是在GitKraken中只需要在左侧分支右键点击`Copy branch name xxx`就可以了。
4. 有stage全部更改的功能，在Fork里只能将各个文件全选然后点stage。
5. 查看diff的界面很美观，只分为左右两块区域，左侧一大块区域都是编辑器很舒服，不自觉地就想停下来慢慢看有没有地方写错了，相比Fork界面的局促来说好很多。操作方面有完善的按文件stage、按块stage、按行stage的功能，跟Fork不分伯仲。虽然按行stage需要右键，有点隐蔽。GitKraken里还有内置编辑文件的功能，不过感觉对我来说意义不大，要改代码都是在自己的编辑器里改比较舒服和安心。


#### Fork的优点

1. 清楚的看到某个分支包含哪些commit，没有包含到的commit是灰色的，这点要大大的赞。因为如果同时有很多个人在开发，很多个分支，是很难一眼看出我的分支包含了哪些commit的，而且合来合去的话不知道会不会有遗漏，总是很担心的感觉。用了Fork之后再也不担心啦。
2. 交互式rebase好用，有Pick/Edit/Reword/Squash/Fixup/Drop六种模式，而GitKraken只有Pick/Reword/Squash/Drop四种，真的不知道为什么要这样设计。然而我又是Fixup的老用户了，要用GitKraken的话就只能改成Squash，挺不习惯的。





