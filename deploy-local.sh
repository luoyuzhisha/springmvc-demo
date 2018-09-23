#!/bin/bash

warPath="/build/libs/pringmvc.war"
workPath=`pwd`
gradle cE e --parallel war
#gradle cE e --parallel --refresh-dependencies war
#gradle war
cd /usr/local/tomcat/
if [ "$1" ];then
ps -ef|grep "tomcat/"|grep -v grep|cut -c 9-15|xargs kill -9
echo "终止tomcat进程"
sleep 2
fi
echo "拷贝代码"
rm -rf work/Catalina/localhost/springmvc
rm -rf ./webapps/springmvc
rm -rf ./webapps/springmvc.war
cp -r "$workPath""$warPath" ./webapps/
if [ "$1" ];then
cat /dev/null > logs/catalina.out
echo "启动tomcat"
sleep 2
sh bin/startup.sh
echo "输出log信息"
fi
tail -f logs/catalina.out
