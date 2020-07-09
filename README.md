# 手机需要root！

脚本基于很多大佬开源的作品，先说声感谢。


我写的这个脚本只适用于我自己的手机，我不打算兼容其他手机。如果你要用，可以自己再二次修改，原理都是一样。我的博客放到[这里](https://meethigher.top/blog/2020/auto-antforest)，欢迎访问！

# 一、初版本

先放张截图

![](https://meethigher.top/blog/2020/auto-antforest/1.png)

功能：

1. 定时解锁
2. 自动刷步数
3. 自动收能量
4. 自动偷能量
5. 锁屏

全自动蚂蚁森林.js

然后，我将上述代码打包成了app。如下图。

![](https://meethigher.top/blog/2020/auto-antforest/2.png)


# 二、Bug

短时间后台运行，autojs是可以自动解锁完成一系列功能的。

长时间后台运行，就不行了。即使你给了所有权限、自启动、电源无限制，也是没用的。这应该是高版本android对后台app的一些限制。

我看网上说，用tasker，我也试了，跟autojs同样的问题。

# 三、改进

通过xposed edge pro添加定时任务，定时启动上述脚本app。然后脚本app再执行解锁、刷步数、收能量、锁屏一系列操作。

![](https://meethigher.top/blog/2020/auto-antforest/3.png)


# 四、致谢

1. [蚂蚁森林自动收取能量](https://github.com/kwu130/Alipay)
2. [云养鸡种树](https://www.52pojie.cn/thread-1105058-1-1.html)

感谢以上大佬！
