/**
 * Created by 小小云 on 2016/9/29.
 * 试卷模块
 */

angular.module("app.paperModule", ['ng', 'app.subjectModule'])
/*2. paperAdd.html的控制器*/
    .controller('paperAddController', ['$scope', 'commentService', 'paperModel', '$routeParams','paperService', function ($scope, commentService, paperModel, $routeParams, paperService) {
        /*3. "所属方向"。将查询到的所有方向数据绑定到作用域中*/
        commentService.getAllDepartment(function (data) {
            $scope.departments = data;
        });
        //数据绑定
        $scope.model = paperModel.model;
        var id = $routeParams.id;
        if (id != 0) {
            paperModel.addSubjectId(id);
            paperModel.addSubject(angular.copy($routeParams));
        }
        $scope.savePaper = function () {
            paperService.savePaper($scope.model, function (data) {
                alert(data);
            });
        };
    }])
    /*1. paperList.html的控制器*/
    .controller('paperListController', ['$scope', function ($scope) {

    }])
    .factory('paperService',['$http','$httpParamSerializer',function ($http,$httpParamSerializer) {
        return {
            savePaper: function (model, handler) {
                var obj = {};
                for (var key in model) {
                    var val = model[key];
                    switch (key) {
                        case "dpId":
                            obj['paper.department.id'] = val;
                            break;
                        case "title":
                            obj['paper.title'] = val;
                            break;
                        case "description":
                            obj['paper.description'] = val;
                            break;
                        case "totalPoints":
                            obj['paper.totalPoints'] = val;
                            break;
                        case "answerQuestionTime":
                            obj['paper.answerQuestionTime'] = val;
                            break;
                        case "scores":
                            obj['scores'] = val;
                            break;
                        case "subjectIds":
                            obj['subjectIds'] = val;
                            break;
                    }
                }
                //表单格式序列化
                obj = $httpParamSerializer(obj);
                // 因为传入model中的数据都是JSON数据，所以在通过URL保存到后台时先要转换数据
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action", obj, {headers: {"Content-Type": "application/x-www-form-urlencoded"}}).success(function (data) {
                    handler(data);
                });
            }
        };
    }])
    .factory("paperModel", function () {
        return {
            model: {
                dpId: 1,
                title: "",
                description: "",
                totalPoints: "",
                answerQuestionTime: "",
                scores: [],
                subjectIds: [],
                subjects: []
            },
            //往model中添加题目
            addSubjectId: function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject: function (subject) {
                this.model.subjects.push(subject);
            },
            addScore: function (index, score) {
                this.model.scores[index] = score;
            }
        }
    });
