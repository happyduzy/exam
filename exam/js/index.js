/**
 * Created by 小小云 on 2016/9/22.
 * 项目的核心 JavaScript
 */

/**
 *  一、左侧导航栏动画  jQuery
 *  */
$(function () {
/*1. 收缩全部列表*/
    $(".baseUI>li>ul").slideUp("fast");

/*2. 点击收缩动画*/
  // 方法一：
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click", function () {
        // console.log($(this).next());
        $(".baseUI>li>ul").slideUp("fast"); // 每次点击之前先全部收缩
        $(this).next().slideDown();
    });
   //方法二：

/*3. 默认让第一个展开*/
    $(".baseUI>li>a").eq("0").trigger("click")

/*4. 背景改变*/
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click", function () {
        // alert(1)
        if (!$(this).hasClass("current")) {
            $(".baseUI ul>li").removeClass("current");// 每次点击之前清除样式
            $(this).addClass("current");
        }
    });

/*5. 给列表第一个a标签添加click事件。*/
    // 页面加载后，首先执行一次点击a标签事件。相当于加载默认页面。
    $(".baseUI ul>li").eq(0).find("a").trigger("click");

});


/**
 * 二、项目核心模块  AngularJS
 * */
/**
 * js打包，写好的js代码用打包工具打包后，格式会做改变，将一些形参之类的值替换，目的是让他人不易看懂
 * 如将$scope被换为其它参数后，函数内的属性则全部调用不到，所以要将controller中的第二个参数用[]括起来，
 * 防止打包是，参数被替换。
 * */
 /*
 * .controller的官方标准写法
 * .controller("控制器名称",["要注入的内容","",function(){}])
 */
angular.module("app", ["ng", "ngRoute", "app.subjectModule","app.paperModule"])
    .controller("mainController", ["$scope", function ($scope) {

    }])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId", {
            templateUrl: "tpl/subject/subjectList.html",
            controller: "subjectController"
        }).when("/SubjectAdd", {
            templateUrl: "tpl/subject/subjectAdd.html",
            controller: "subjectController"
        }).when("/SubjectDel/id/:id", {
            templateUrl: "tpl/subject/subjectList.html",
            controller: "subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state", {
            templateUrl: "tpl/subject/subjectList.html",
            controller: "subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperAddSubject",{
            templateUrl:"tpl/paper/PaperAddSubject.html",
            controller:"subjectController"
        });
    }])