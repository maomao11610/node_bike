/*
 * @Author: your name
 * @Date: 2022-03-07 15:35:41
 * @LastEditTime: 2022-03-10 15:21:00
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE，
 * @FilePath: \nodebikepractice\nodebikepractice\config\config.js
 */
var app={
    "dbUrl":"mongodb://admin:123456@127.0.0.1:27017/express_cms?authSource=admin",
    adminPath:"admin_express"   //此处修改完毕以后还需要修改static/admin/js/base.js
}

module.exports=app;
