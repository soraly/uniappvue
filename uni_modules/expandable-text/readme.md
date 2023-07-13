# expandable-text

## 简介

前端开发中，当文本多行展示时需要隐藏一部分，但同时也需要能够展开/收起，网上未找到称心如意的方法，就自己写一个了

## 功能

1. 自动计算单行高、所有行总高，动态控制
2. 展开/收起 按钮可实现，实际行数小于等于指定的行数时，操作按钮自动隐藏
3. 两种传值方式：slot传值，longText参数传值。区别：slot需要自己处理空判断，longText方式会内部处理

## 特别注意：

1. 当文本实际行数小于或等于指定行数（line）时，‘展开’或‘收起’按钮自动隐藏，是该插件的特性，不是bug

2. 该插件兼容微信小程序（亲测），其他平台不确定

   ## 用法

   #### 参数说明

   |  **属性名**   | **类型** | **默认值** |          **描述**          |                           **备注**                           |
   | :-----------: | :------: | :--------: | :------------------------: | :----------------------------------------------------------: |
   |     line      |  Number  |     1      |  最多展示line行，超过隐藏  |       当实际行数小于或等于指定line时，操作按钮自动隐藏       |
   |   longText    |  String  |            |          实际文本          |                                                              |
   | useExpandSlot | Boolean  |   false    | 是否自定义‘展开’‘收起’布局 | 值为false时，显示expandText和foldText，为true可替换为其他布局 |
   |  expandText   |  String  |    展开    |         展开 文字          |                                                              |
   |   foldText    |  String  |    收起    |         收起 文字          |                                                              |
   |  lineHeight   |  Number  |    32      |         行高，rpx单位      |                                                              |

#### 代码示例

```javascript
// 路径自行修改  
import ExpandableText from "@/components/expandable-text/expandable-text.vue"

components: {
    ExpandableText
}
```

**方式一：slot方式传值**

```vue
// expandText和foldText有默认值，可不写。line默认为1
<expandable-text :line="3" expandText="展开" foldText="收起">
      文本内容
</expandable-text>
```

**方式二：longText参数传值**

```vue
// expandText和foldText有默认值，可以不写。line默认为1
<expandable-text :longText="文本内容" :line="3" expandText="展开" foldText="收起"/>
```
