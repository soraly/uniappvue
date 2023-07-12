# H5 49 切换拆分项目脚本 
## 用于拆分项目 分别打包所有、论坛项目或六合项目

<font color= "red">注意！！！注意！！！注意！！！</font><br/>
<font color= "red">添加新页面的时候 一定要在/config/pagesJson目录里对应项目的文件添加新页面的page</font><br/>
<font color= "red">否则在后续切换打包内容的时候找不到对应页面</font><br/>

```
cd config/pagesJson
node script.js liuhe // 切换打包六合
node script.js luntan // 切换打包论坛
node script.js all // 所有页面
```