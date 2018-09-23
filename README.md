# springmvc-demo

## 介绍
**springmvc-demo** 是一个基于springmvc搭建的快速开发脚手架，支持dao级多数据源负载均衡。

#### 组成
##### 主要框架
* **Spring4.2**: 不多说，貌似J2EE离不开他了。
* **Springmvc4.2**: 与Spring无缝集成，简单灵活，支持Restful风格。
* **Mybatis3.3.0** :个人认为比Hibernate好控制，毕竟是自己写的Sql语句。
* **Shiro**: Apache的权限管理框架，扩展性好，使用简单，个人认为比`Spring-Security`框架容易入手。
* **tomcat连接池** : 稳定，性能好。
* **sf4j** ：支持多种日志系统，使用的是log4j。
* **spring-fox**: 自动生成rest api文档
* **asccidoctor**: 将rest api转换成html5和pdf格式的硬文档

##### 工具框架
* **Spring-Test** :包括了常用单元测试、集成测试、Web测试，`Src/Test/Java`下有几个简单的测试类。使用测试框架的好处就是节省时间，无需启动Server就能测试程序。
* **Mybatis-Pagehelper** :Mybatis的分页排序插件，由国人开发，用起来非常方便，[Mybatis-Pagehelperp][2] 项目主页。
* **Mybatis通用Mapper3** 也是有上面作者开发，极其方便的使用Mybatis单表的增删改查，如果是单表操作，基本不用写Mapper文件,[Mybatis通用Mapper3][3] 项目主页。
* **Spring-Mail**： 可修改`/src/main/resource/mail-config.properties`配置文件，这个配置文件配置的是主邮箱。
* **commons fileupload**:`spring mvc`中集成了`appache-commons-fileupload`上传组件。上传处理更便捷。

#### 开发工具
##### 依赖管理工具
`Maven`可能更容易上手，但我更喜欢`Gradle`的简洁

## 使用
### 下载
`Download Zip`或者`git clone`
``` shell
	git clone https://github.com/luoyuzhisha/springmvc-demo.git
```
