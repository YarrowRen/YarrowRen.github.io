---
author: Boyu Ren
pubDatetime: &id001 2021-09-03 19:06:44
modDatetime: *id001
title: 2-本地应用：Vue指令
slug: 2-本地应用：Vue指令
featured: false
draft: false
tags:
- Vue
description: v-text指令用于设置标签的文本值，有两种设置标签文本值的方式，方式一就是通过v-text指令向标签传入值，但这种传入方式会整个替换掉标签内的全部文本信息，如果我们需要特殊化的修改某一部分文本值，就需要用到第二个方式，使用插值表达式传入值
---

# Vue指令

## v-text指令
v-text指令用于设置标签的文本值，有两种设置标签文本值的方式，方式一就是通过v-text指令向标签传入值，但这种传入方式会整个替换掉标签内的全部文本信息，如果我们需要特殊化的修改某一部分文本值，就需要用到第二个方式，使用插值表达式传入值

```html
<body>
    <div id="app">
        <!--使用v-text指令-->
        <p v-text="message"></p>
        <!--使用插值表达式-->
        <p>{{message}}--使用插值表达式</p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                message:"Hello Vue!"
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210711224316.png)

## v-html指令 
v-html指令用于设置标签的innerHtml属性，如果传入的是普通值，则其结果与v-text指令没有区别，若其传入的是html结构，则会将相应html解析出来

```html
<body>
    <div id="app">
        <!--传入的是普通文本值，效果与v-text一样-->
        <p v-html="content1"></p>
        <!--传入的值为html结构，则按照html进行解析-->
        <p v-html="content2"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                content1:"Ywrby",
                content2:"<a href='#'>Ywrby-blog</a>"
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712020905.png)

## v-on指令
v-on指令用于为元素绑定事件

```html
<body>
    <div id="app">
        <!--利用v-on指令与单击事件绑定，在发生单击事件时调用clickFunc方法-->
        <input type="button" value="事件绑定1" v-on:click="clickFunc">
        <!--与双击事件绑定并调用doubleClickFunc方法-->
        <input type="button" value="事件绑定3" v-on:dblclick="doubleClickFunc">
        <!--vue中绑定事件的简化写法，省略固有的“v-on:”简写为“@”即可-->
        <input type="button" value="事件绑定4" @dblclick="doubleClickFunc">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            methods:{
                clickFunc:function(){
                    alert("执行点击事件...")
                },
                doubleClickFunc:function(){
                    alert("执行双击事件...")
                }
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712022812.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712022819.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712022825.png)

可以直观看到我们在vue实例中定义方法，只需要将其写入methods属性中即可，同时我们可以在方法中获取到Vue实例中的相关数据，只需要利用this关键字即可
```html
<body>
    <div id="app">
        <p v-on:click="changeName" v-text="username"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                username:"Ywrby"
            },
            methods:{
                changeName:function(){
                    this.username="Leslie"
                }
            }
        })
    </script>
</body>
```

需要在方法中传入参数只需要在方法名后利用括号传入参数即可
```html
<body>
    <div id="app">
        <p v-on:click="changeName('Leslie')" v-text="username"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                username:"Ywrby"
            },
            methods:{
                changeName:function(name){
                    this.username=name
                }
            }
        })
    </script>
</body>
```

捕捉按键相应只需要在方法后指定按键即可，例如：
```html
    <div id="app">
        <input v-on:keyup.enter="sayHi" v-text="username">
    </div>
```



### 简单计数器实现
```html
<body>
    <div id="app" class="input-num">
        <button @click="sub">-</button>
        <span v-text="num"></span>
        <button @click="add">+</button>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                num:0
            },
            methods:{
                sub:function(){
                    if(this.num>0){
                        this.num-=1
                    }else{
                        alert("到达最小值，不可以继续减少")
                    }
                },
                add:function(){
                    this.num+=1
                }
                
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712171902.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712171920.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712171931.png)


## v-show指令

v-show指令用于根据给定值切换元素的显示状态（显示/隐藏），其可以直接接收布尔值对象，也可以接收给定的数据对象，还可以接收逻辑判断语句，无论接收哪种，最终一定是解析为布尔值后进行元素的显示与隐藏

```html
<body>
    <div id="app" class="input-num">
        <!--直接传入布尔值-->
        <p v-show="true">允许显示</p>
        <p v-show="false">不允许显示</p>
        <!--获取到data中的布尔值数据-->
        <p v-show="showPart">通过data获取布尔值：允许显示</p>
        <!--利用洛基判断获取布尔值数据并判断是否展示-->
        <p v-show="age>=18">通过逻辑判断获取布尔值：允许显示</p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                showPart:true,
                age:29
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712181356.png)


## v-if指令
v-if指令根据表达式的真假切换元素的显示状态，与v-show有所不同，v-show是通过为对应元素添加不可显示属性保证元素的隐藏，而v-if指令则是直接操作DOM元素直接删除对应元素保证其不会显示

```html
    <div id="app">
        <!--直接传入布尔值-->
        <p v-show="false">v-show:不允许显示</p>
        <p v-if="false">v-if:不允许显示</p>
    </div>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210712181823.png)

通过浏览器可以看到，两个元素分别利用v-show与v-if指令禁止显示，v-show指令为元素添加了`style="display: none;"`保证元素不被显示，而v-if直接操作DOM消除了对应元素，这就是二者的区别

## v-bind指令 
v-bind指令用于设置元素的属性（例如src,title,class），使用方法就是在v-bind指令后面跟上要设置的属性名称，通过等号为其赋值，也可以省略"v-bind"部分为":"
```html
<body>
    <div id="app">
        <!--不省略-->
        <img v-bind:src="imgClass" v-bind:title="imgTitle">
        <!--省略-->
        <img :src="imgClass2" :title="imgTitle2">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                imgTitle:"测试图片1",
                imgClass:"https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ截图20210712180853.png",
                imgTitle2:"测试图片2",
                imgClass2:"https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/67052833_p0.jpg"

            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210713004003.png)

## v-for指令
v-for指令可以根据数据生成列表结构

```html
<body>
    <div id="app">
        <ul>
            <li v-for="item in arr" :title="item">{{item}}</li>
        </ul>

        <br>

        <ul>
            <li v-for="(item,index) in objArr" :title="item">ID：{{index}}，用户名：{{item.usr}}，密码：{{item.pwd}}</li>
        </ul>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                arr:["张三","李四","王五","赵六"],
                objArr:[
                    {
                        usr:"Leslie",
                        pwd:"123456"
                    },
                    {
                        usr:"Ywrby",
                        pwd:"67890"
                    },
                    {
                        usr:"Ywryn",
                        pwd:"123456"
                    }
                ]
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210713005625.png)

通过上面的实例可以看出v-for指令可以接收普通数组以及对象数组等特殊数据结构进行遍历，同时在使用过程中有两个默认参数item和index，item本质就是遍历数组的对象，类似于for i in range结构中的i，通过item可以获取到数组对应的元素对象，同样的，item是可以随意命名的，index即为该对象在数组中的索引值

## v-model指令
v-model指令用于设置和获取表单元素中的值(双向数据绑定)，即将数据绑定到对应元素后，随元素对数据的更改，原数据中的值也发生改变

```html
<body>
    <div id="app">
        <input type="text" v-model="message">
        <p v-text="message"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script>
        var app=new Vue({
            el:"#app",
            data:{
                message:"test message"
            }
        })
    </script>
</body>
```
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210713064904.png)


可以看到将上面示例中将输入框元素与message数据绑定，因此初始状态下输入框显示message数据，当我们对输入框进行改变时，message中的数据也同步发生改变导致下方P标签内数据变化