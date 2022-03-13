const express = require("express");
const FocusModel = require("../model/focusModel");
const NavModel = require("../model/navModel");
const ArticleModel = require("../model/articleModel");
const ArticleCateModel = require("../model/articleCateModel");
const SettingModel = require("../model/settingModel");

const url = require("url");
const mongoose = require("../model/core");
const { formatTime,unixToDay,unixToYearAndMonth } = require("../model/tools");
const articleModel = require("../model/articleModel");
var router = express.Router()


router.use(async (req, res, next) => {
   var pathname = url.parse(req.url).pathname;
   //获取公共的数据
   var navResult = await NavModel.find({ "position": 2 }).sort({ "sort": -1 });
   req.app.locals.navList = navResult;
   // console.log(navResult);
   req.app.locals.pathname = pathname;
   //全局模板函数
   req.app.locals.formatTime = formatTime;

   req.app.locals.unixToDay = unixToDay;

   req.app.locals.unixToYearAndMonth = unixToYearAndMonth;

   req.app.locals.title="二手摩托车交易";
   req.app.locals.keywords="2022杭州展览交易";
   req.app.locals.description="2022杭州展览交易展览会（Auto China 2022）将在杭州中国国际展览中心新馆和中国国际展览中心老馆举行。";

   console.log(pathname);

   next()
})


router.get("/", async (req, res) => {
   //1、轮播图
   var focusResult = await FocusModel.find({ "type": 1 }).sort({ "sort": -1 });

   //2、展会新闻
   var topNewsList = await articleModel.find({ "cid": mongoose.Types.ObjectId("6229b8d27527d43c485c8fe3") }, "title").limit(4).sort({ "sort": -1 });

   //3、推荐新闻
   var bestNewsList = await articleModel.find({ "is_best": 1 }).limit(4).sort({ "sort": -1 });

   //4、获取系统信息
   var settingResult = await SettingModel.find({})
   console.log(settingResult);

   res.render("default/index.html", {
      focusList: focusResult,
      topNewsList: topNewsList,
      bestNewsList: bestNewsList,
      title:settingResult[0].site_title,
      keywords:settingResult[0].site_keywords,
      description:settingResult[0].site_description
      

   })
})

router.get("/overview.html", (req, res) => {
   res.render("default/overview.html",{
      title:"二手摩托车交易",
      keywords:"2022杭州展览交易",
      description:"2022杭州展览交易展览会（Auto China 2022）将在杭州中国国际展览中心新馆和中国国际展览中心老馆举行。"
   
   })
})

router.get("/news.html", async (req, res) => {
   //获取新闻数据
   var page = req.query.page || 1;
   var cid = req.query.cid || "";
   var pageSize = 3;
   var json = {};  //条件

   // var result =await ArticleModel.find({}).skip((page-1)*pageSize).limit(pageSize);

   //获取新闻中心的子分类   5f561dae10fc462a0c265ec0
   if (cid) {
      json = Object.assign(json, {
         "cid": mongoose.Types.ObjectId(cid)
      })
   } else {
      var cateResult = await ArticleCateModel.find({ "pid": mongoose.Types.ObjectId("622851b0ae7cb31a40faca3d") });
      var tempArr = [];
      cateResult.forEach((value) => {
         tempArr.push(value._id);
      })
      json = Object.assign(json, {
         "cid": { $in: tempArr }
      })
   }

   var result = await ArticleModel.aggregate([
      {
         $lookup: {
            from: "article_cate",
            localField: "cid",
            foreignField: "_id",
            as: "cate"
         }
      },
      {
         $match: json
      },
      {
         $sort: { "add_time": -1 }
      },
      {
         $skip: (page - 1) * pageSize
      },
      {
         $limit: pageSize
      }

   ])

   var count = await ArticleModel.count(json)

   res.render("default/news.html", {
      newsList: result,
      totalPages: Math.ceil(count / pageSize),
      page: page,
      cid: cid
   })

})

router.get("/services.html", async (req, res) => {


   //1、资料下载
   var list1 = await articleModel.find({ "cid": mongoose.Types.ObjectId("5f5633dcc0848423a8344dce") }, "title link")

   //2、票务信息 5f57022b5aeb0720f8201dfa
   var list2 = await ArticleModel.find({ cid: mongoose.Types.ObjectId("5f57022b5aeb0720f8201dfa") }, "title link");
   //3、交通信息  5f71965a1dc45e2698739df6
   var list3 = await ArticleModel.find({ cid: mongoose.Types.ObjectId("5f71965a1dc45e2698739df6") }, "title link");
   //4、平面图 5f71964c1dc45e2698739df5
   var list4 = await ArticleModel.find({ cid: mongoose.Types.ObjectId("5f71964c1dc45e2698739df5") }, "title link");

   //5、同期活动 5f8e48fadcfe8721ecea0450
   var list5 = await ArticleModel.find({ cid: mongoose.Types.ObjectId("5f8e48fadcfe8721ecea0450") }, "title link");
   //6、周边服务 5f7196621dc45e2698739df7
   var list6 = await ArticleModel.find({ cid: mongoose.Types.ObjectId("5f7196621dc45e2698739df7") }, "title link");

   res.render("default/services.html", {
      list1,
      list2,
      list3,
      list4,
      list5,
      list6
   })
})
router.get("/contact.html", (req, res) => {
   res.render("default/contact.html")
})
router.get("/content_:id.html", async (req, res) => {

   var id = req.params.id;
   var result = await ArticleModel.find({ "_id": id });
   console.log(result);
   res.render("default/news_content.html", {
      list: result[0],
       title: result[0].title,
      keywords:result[0].keywords,
      description:result[0].description
   
   })
})




module.exports = router