/**
 * Created by 小小云 on 2016/9/22.
 * 题库模块
 */

angular.module("app.subjectModule", ["ng"])
    .controller("subjectController", ["$scope", "commentService", "subjectService", "$filter", "$routeParams", "$location", function ($scope, commentService, subjectService, $filter, $routeParams, $location) {
// 以下是数据绑定：

        /*6. 给isShow设置初值，默认显示勾选checkbox，以便显示答案*/
        $scope.isShow = true;
        /*7. 封装筛选数据时用的模板对象（菜单栏中点击的a标签，获得相应的试题）*/
        // console.log($routeParams);  //当注入$routeParams后，测试获得地址":"后面的参数，以便将来做判断，从后台拿数据 Object { dpId="0",  tId="0",  levelId="0",  更多...}
        $scope.params = $routeParams;  //为了进一步测试，把$routeParams绑定到作用域中
        var subjectModel = (function () {
            var obj = [];
            if ($routeParams.typeId != 0) {
                obj['subject.subjectType.id'] = $routeParams.typeId;
            }
            if ($routeParams.dpId != 0) {
                obj['subject.department.id'] = $routeParams.dpId;
            }
            if ($routeParams.topicId != 0) {
                obj['subject.department.id'] = $routeParams.topicId;
            }
            if ($routeParams.levelId != 0) {
                obj['subject.subjectLevel.id'] = $routeParams.levelId;
            }
            // console.log('参数对象：', obj); //return后面不能写东西
            return obj;
        })();
        /*8. 封装对象，绑定一些初始数据值，给ng-model使用，以便加载subjectAdd.html中“题目属性”的内容*/
        $scope.model = {
            typeId: 1,
            departmentId: 1,
            topicId: 1,
            levelId: 1,
            stem: "",
            answer: "",
            analysis: "",
            choiceContent: [],
            choiceCorrect: [false, false, false, false]
        };
        /*11. 调用service方法实现"保存并继续"按钮 */
        $scope.saveAdd = function () {
            subjectService.saveSubject($scope.model, function (data) {
                alert(data);
            });
            //保存并继续后，重置model数据
            var model = {
                typeId: 1,
                departmentId: 1,
                topicId: 1,
                levelId: 1,
                stem: "",
                answer: "",
                analysis: "",
                choiceContent: [],
                choiceCorrect: [false, false, false, false]
            };
            angular.copy(model, $scope.model);
        };
        /*12. 调用service方法实现"保存并关闭"按钮 */
        $scope.saveClose = function () {
            subjectService.saveSubject($scope.model, function (data) {
                alert(data);
                $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
            });
        };
        /*14. "题目类型"的select的change方法方法，切换时重置按钮选中状态*/
        $scope.selectChange = function () {
            $scope.model.choiceCorrect = [false, false, false, false];
            //重置选中按钮的状态该如何设置？//一般关于局部更新或与jquery相关的，可以写到自定义指令中
        };
// 以下是服务调用：

        /*1. 调用服务方法加载题目属性信息，并且进行绑定*/
        /*2.1.1 获取题型数据*/
        commentService.getAllType(function (data) {
            // console.log(data);  //测试data信息
            $scope.types = data;
        });
        /*2.2.1 获取方向数据*/
        commentService.getAllDepartment(function (data) {
            $scope.departments = data;
        });
        /*2.3.1 获取知识点数据*/
        commentService.getAllTopics(function (data) {
            $scope.topics = data;
        });
        /*2.4.1 获取难度数据*/
        commentService.getAllLevel(function (data) {
            $scope.levels = data;
        });

        /*3.1.1 调用subjectService，获取所有题目信息*/
        /*7.1 函数内注入subjectModel参数。先传subjectModel，后传data*/
        subjectService.getAllSubjects(subjectModel, function (data) {
            $scope.subjects = data;
            // console.log(data); //测试有没有试题数据

            /*5. 遍历所有的题目，计算出选择题的答案，并且将答案赋给subject.answer。
             也就是判断choices里的correct，将为true的答案赋给answer*/
            data.forEach(function (subject) {
                /*5.1 获取正确答案*/
                if (subject.subjectType.id != 3) {//判断不是简答题。subjects.json中，单选、多选的id分别为1、2，简答题id为3。
                    var answer = [];//将遍历出的答案存到新数组中
                    //if判断是选择题、还是多选题。单选题时需要根据序号来算哪个是正确答案
                    //遍历所有选项
                    subject.choices.forEach(function (choice, index) {//将选项的序号index（0123）当作参数传入函数
                        if (choice.correct) {//if判断，correct的值本身就是true和false
                            //将索引index转换为ABCD // 需要将答案传给ABCD而不是index的数字，所以需要加以转换
                            var no = $filter('indexToNo')(index)
                            answer.push(no);//将正确的选项序号ABCD放入数组answer中
                        }
                    });
                    /*5.2 将计算出来的正确答案赋给subject.answer*/
                    //subject.json中subject.answer的数据为空，所以将正确答案赋给它
                    subject.answer = answer.toString();//answer数组转换为字符串后传入subject.aswer
                }
            });
        });
    }])
    /*15. “删除题目”按钮的控制器*/
    .controller("subjectDelController", ["$routeParams", "$location","subjectService", function ($routeParams, $location,subjectService) {
        // alert("删除");//测试控制器是否可用
        // 删除操作
        var flag = confirm("确认删除吗？");
        if (flag) {
            subjectService.delSubject($routeParams.id, function (data) {
                alert(data);//data的值是数据库中定义好的，“删除成功”/“删除失败”
            });
        }
        // 删除后，完成页面跳转
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    /*16. “通过审核”按钮的控制器*/
    .controller("subjectCheckController",["$routeParams", "$location","subjectService", function ($routeParams,$location,subjectService) {
        subjectService.checkSubject($routeParams.id, $routeParams.state, function (data) {
            alert(data);
        });
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    /*3. 题目服务，封装操作题目的函数*/
    .service("subjectService", ["$http", "$httpParamSerializer", function ($http, $httpParamSerializer) {
        //3.1 获取subject中的题的相关信息 //service中的方法格式，要加this
        /*7.2 给function传入params参数，给get传入参数{params:params}*/
        this.getAllSubjects = function (params, handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action", {params: params}).success(function (data) {
                // $http.get("data/subjects.json").success(function (data) {
                handler(data);
            });
        };

        /*10. “保存并继续”按钮的服务。设置subjectAdd.html中点击“保存并继续”按钮的服务，将数据传入后台*/
        this.saveSubject = function (params, handler) {
            //将参数转换为angular需要的数据格式//因为双向数据绑定后传入的值为json数据格式，如：{"typeId":1,"levelId":1,"topicId":1,"departmentId":1,"stem":"","answer":"","analysis":""} ，而后台要的要的是表单数据，所以需要进行转换
            var obj = {};//把params中的值拿出来，放入obj中
            for (var key in params) {
                var val = params[key];
                switch (key) {
                    case "typeId":
                        obj['subject.subjectType.id'] = val;
                        break;
                    case "departmentId":
                        obj['subject.department.id'] = val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id'] = val;
                        break;
                    case "topicId":
                        obj['subject.topic.id'] = val;
                        break;
                    case "stem":
                        obj['subject.stem'] = val;
                        break;
                    case "answer":
                        obj['subject.answer'] = val;
                        break;
                    case "analysis":
                        obj['subject.analysis'] = val;
                        break;
                    case "choiceContent":
                        obj['choiceContent'] = val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect'] = val;
                        break;
                }
            }
            ;
            // console.log(obj)//结果是json格式
            /*将对象数据(json)转换为表单编码样式的数据 : $httpParamSerializer(obj)*/
            obj = $httpParamSerializer(obj);
            // 因为传入model中的数据都是JSON数据，所以在通过URL保存到后台时先要转换数据
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action", obj, {headers: {"Content-Type": "application/x-www-form-urlencoded"}}).success(function (data) {
                handler(data);
            });
        };

        /*15.2 “删除题目”按钮的服务，将后台数据删除*/
        this.delSubject = function (id, handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action", {params: {'subject.id': id}}).success(function (data) {
                handler(data);
            });
        };
        
        /*16.2 “通过审核”按钮的控制器*/
        this.checkSubject=function (id,state,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function (data) {
                handler(data);
            })
        }
    }])
    /*2. 公共服务，用于获取“题型、方向、知识点、难度”菜单栏的相关信息*/
    .factory("commentService", ["$http", function ($http) {
        return {
            /*2.1 从后台数据库地址获取“type题型”数据*/
            getAllType: function (handler) {
                /*后台地址，当服务器正常是，可启用它。也可以用模拟的数据地址代替*/
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                $http.get("data/types.json").success(function (data) {
                    handler(data);
                });
            },
            /*2.2 从后台数据库地址获取“department方向”数据*/
            getAllDepartment: function (handler) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                $http.get("data/department.json").success(function (data) {
                    handler(data);
                })
            },
            /*2.3 从后台数据库地址获取“topics知识点”数据*/
            getAllTopics: function (handler) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                $http.get("data/topics.json").success(function (data) {
                    handler(data);
                })
            },
            /*2.4 从后台数据库地址获取“level难度”数据*/
            getAllLevel: function (handler) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                $http.get("data/level.json").success(function (data) {
                    handler(data);
                })
            }
        };
    }])
    /*4. 过滤器，给遍历出的题目选项添加ABCD序号（将$index的数字转换为字母）*/
    .filter("indexToNo", function () {
        return function (input) {
            // alert(typeof input); //测试  input为number类型

            /*A、B、C、D序号的————写法 1 ：用三目运算符实现*/
            // return input == 0 ? 'A' : (input == 1 ? 'B' : (input == 2 ? 'C' : (input == 3 ? 'D' : (input == 4 ? 'E' : (input == 5 ? 'F' : 'G')))));

            /*A、B、C、D序号的————写法 2 ：*/
            var result;
            switch (input) {
                case 0:
                    result = 'A';
                    break;
                case 1:
                    result = 'B';
                    break;
                case 2:
                    result = 'C';
                    break;
                case 3:
                    result = 'D';
                    break;
                case 4:
                    result = 'E';
                    break;
                default:
                    result = 'F';
            }
            return result;
        }
    })
    /*9. select过滤器。当选择相应的department方向，便显示相应的知识点。然后向标签中插入filter*/
    .filter("selectTopic", function () {
        return function (input, id) {
            //input：代表要过滤的内容，也就是“|”前面的内容，是个数组，这里input为topic数组。id：department的id，也就是过滤器冒号后面的第一个参数
            //console.log(input,id);
            if (input) {
                //过滤器可能要调用两次，其中一次可能为空，所以要if判断一下
                //通过array中过滤器函数过滤满足条件的topic
                var arr = input.filter(function (item) {
                    return item.department.id == id;
                    //如果为true，则返回//topic里的department.id与department的id比较
                });
                return arr;
            }
        };
    })
    /*13. 自定义指令。subjectAdd.html中单选、多选按钮的值，以及正确选项的获取*/
    .directive("selectOption", function () {
        return {
            restrict: "A",
            link: function (scope, element) {
                // console.log(element);
                // console.log(scope)
                element.on("change", function () {
                    //2.获取选择按钮的属性，是redio还是checkbox
                    var type = element.attr("type");
                    var isCheck = element.prop("checked");
                    // alert(type);
                    if (type == "radio") {
                        scope.model.choiceCorrect = [false, false, false, false];//在改变其中的true之前先进行重置
                        //alert(angular.element(this).val());//验证是否绑定//angular.element(),相当于$()
                        var index = angular.element(this).val();
                        // console.log(scope.model.choiceCorrect);//测试是否获取到[false,false,false,false]
                        scope.model.choiceCorrect[index] = true;
                        // console.log(scope.model.choiceCorrect);
                    } else if (type == "checkbox" && isCheck) {
                        var index = angular.element(this).val();
                        // alert(index);
                        scope.model.choiceCorrect[index] = true;
                    }
                    //强制将scope更新，变相实现双向数据绑定
                    scope.$digest();
                });
            }
        };
    });