# node_bike
node_vue_mongo开发摩托车交易
##安装步骤
  1.cnpm i 本项目包较多请静心等待
  2.node app.js/nodemon/supervisor跑项目，热更新最佳采取nodemon
 ##项目重点
    1.采取cms架构，前台views/default/index  
    2.数据库采取nosql的mongoDB
    3.后台实现了内容的控制以及人员的增删改查
    4.鉴权模块再login进行多重判断达到仅登录且登录正确才能正常访问后台
 ##mongodb数据配置
 谨记修改自己的mongo配置，show dbs查看数据库   show collections查看表/集合
 db.表名.find()查看json数据
 项目同时采取了nonjs一些现有包搭建
 界面采取ejs+bootstrap
