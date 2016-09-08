angular.module('starter.controllers', ['WifiServices'])

////////////////////////////////////////////////////////////////////////////////////////////////////////
//数据
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout,$http) {

    $scope.global = { cust_id : 0 };
    $scope.user = { Id: 1, Name: 'Admin', Email: 'admin@test.domain', Phone: '13609876543', Tel: '02129807893', 
        EmergMan1: 'AdminEmerg1', EmergMan1Phone: '13609876542',EmergMan2: 'AdminEmerg2', 
        EmergMan2Phone: '13609876541', address: '浦东新区耀华路120弄121号102' };


    //当前使用主机
    //var usdvm = {
    //    "alert_status": 1,
    //    "device_name": "一个主机",
    //    "device_id": "7CEC793924C3",
    //    "last_hearbeat": null,
    //    "expire_time": "2016-10-11",
    //    "device_addr": null,
    //    "id": "598735761148997633",
    //    "status": 1
    //};
    $scope.UsingDeviceViewModel = { device: null };
    //当前使用主机的节点
    $scope.UsingNodesViewModel = {
        nodeTypeId:null,
        nodeType: null,
        nodes: null,
        nodeList: [
                        { id: '0', name: '电子钥匙', icon: 'ion-locked', nodeType: '0' },
                        { id: '1', name: '门磁', icon: 'ion-magnet', nodeType: '1' },
                        { id: '2', name: '红外感应 ', icon: 'ion-wifi', nodeType: '2' },
                        { id: '3', name: '烟雾报警器', icon: 'ion-flame', nodeType: '3' },
                        { id: '4', name: '温度传感器', icon: 'ion-bonfire', nodeType: '4' }
        ]
    };
    
    //$scope.nodeViewModel = {
    //  node:""
    // };
    //OverView帮助用VM
    $scope.OverViewViewModel = {
        OverStatus:"normal",
        JustLogin: false,
        Status:""
    };
    $scope.cssHelpViewModel = {
        corecubicClass:null,
        corecubicTxt:null
    };
    //$scope.ArmViewModel = { checked: true };

    //该账号所有主机
    $scope.DevicesViewModel = {
        devices:null
    };
    //当前使用主机的节点(与上重复？)
    $scope.NodesViewModel ={
        nodeType:"",
        nodes:null,
        nodeList:[
                        { id: '0', name: '电子钥匙', icon: 'ion-locked',  nodeType: '0'},
                        { id: '1', name: '门磁', icon: 'ion-magnet', nodeType: '1'},
                        { id: '2', name: '红外感应 ', icon: 'ion-wifi', nodeType: '2'},
                        { id: '3', name: '烟雾报警器', icon: 'ion-flame',  nodeType: '3'},
                        { id: '4', name: '温度传感器', icon: 'ion-bonfire',  nodeType: '4'}
        ]
    
    }

    //所有节点
    $scope.AllAlarmsViewModel = {
        alarms: null,
        rows:null
    };
    //正在报警
    $scope.AlarmingViewModel = {
        alarms:null
    };
    //正在编辑主机、节点类
    $scope.Temp = {
        EditingDevice: null,
        EditingNode:null
    };
    //提醒toggle
    $scope.TempToggle = {
        notifyVersion: false,
        notifyVib: false,
        notifyPush :false
    };
    //正在编辑用户类
    $scope.UserViewModel = { user: null };
    //支付类
    $scope.PurchasingDevice = {device:{}};

    //操作记录条数
    $scope.StackViewModel = {
        manustack:null,
        options:null
    };
    //套餐list
    $scope.MenuViewModel ={
      menu:null,
      usingmenu:null  
    };
    
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.deviceTap = function(route, device) {
        $scope.device = device;
        $state.go(route);
    };
    $scope.pageJump = function(route) {
        $state.go(route);
    };    
    $ionicPopover.fromTemplateUrl('templates/alerts.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openAlerts = function($event) {
        $scope.popover.show($event);
    };
    $scope.closeAlerts = function() {
        $scope.popover.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    $timeout(function () {
        ionic.EventController.trigger("resize", "", true, false);
    }, 1500);
    var timespaned = 0;
    //更新device信息
    $scope.updateDeviceData = function () {
        timespaned++;
        var devicelisturl = '/device/list';
        var devicelistreqd = { "cust_id": $scope.global.cust_id };
        var devicelistreq = httpReqGen(devicelisturl, devicelistreqd);

        $http(devicelistreq).success(function (data) {
            //取返回值有效data
            var resdata = resResult(data);
            //DevicesViewModel.devices 用户下所有主机
            $scope.DevicesViewModel.devices = null;
            $scope.DevicesViewModel.devices = resdata;
            //UsingDeviceViewModel.device 当前使用主机
            $scope.UsingDeviceViewModel.device = resdata[0];
            //布防状态alert_status 1布防 0撤防
            if (resdata[0].alert_status == 0) {
                $scope.UsingDeviceViewModel.device.alert_status = false;
                $scope.UsingDeviceViewModel.device.titleText = "撤防";
                $scope.UsingDeviceViewModel.device.icon = "ion-unlocked";
            }
            else {
                $scope.UsingDeviceViewModel.device.alert_status = true;
                $scope.UsingDeviceViewModel.device.titleText = "布防";
                $scope.UsingDeviceViewModel.device.icon = "ion-locked";
            }

            //状态status 1在线 0掉线
            if (resdata[0].status == 1) {
                $scope.OverViewViewModel.Status = "您当前的主机正在正常运行";
                $scope.UsingDeviceViewModel.device.status = true;
            }
            else {
                $scope.OverViewViewModel.Status = "您当前的主机已掉线";
                $scope.UsingDeviceViewModel.device.status = false;
            }


            //主机信息返回后请求节点信息
            var nodelisturl = '/node/list';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
            var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

            $http(nodelistreq).success(function (data) {
                //取返回值有效data
                var nodesdata = resResult(data);
                //NodesViewModel.nodes 当前主机下所有节点
                $scope.NodesViewModel.nodes = nodesdata;
                //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                $scope.UsingNodesViewModel.nodes = nodesdata;


                //节点信息返回后请求正在报警信息
                var alarmurl = '/device/alert';
                var dvid = $scope.UsingDeviceViewModel.device.device_id;
                var alarmreqd = { "cust_id": $scope.global.cust_id, "device_id": dvid };
                var alarmreq = httpReqGen(alarmurl, alarmreqd);

                $http(alarmreq).success(function (data) {
                    //取返回值有效data
                    var alarmsdata = resResult(data);
                    
                    //模拟数据
                    alarmsdata = [{ "device_id": "7CEC793924C3", "node_type": 4, "node_id": 1, "alert_type": 1, "alert_time": "2011-03-09 12:23:31", "device_name": "fakename" }
                                            , { "device_id": "7CEC793924C3", "node_type": 3, "node_id": 2, "alert_type": 2, "alert_time": "2012-03-09 12:23:31", "device_name": "fakename" },
                                            { "device_id": "7CEC793924C3", "node_type": 1, "node_id": 3, "alert_type": 3, "alert_time": "2013-03-09 12:23:31", "device_name": "fakename" },
                                            { "device_id": "7CEC793924C2", "node_type": 1, "node_id": 4, "alert_type": 4, "alert_time": "2013-03-09 12:23:31", "device_name": "fakename" }];
                    if (timespaned > 2)
                       alarmsdata = [];
                    //报警数据map
                    alarmDataMap(alarmsdata);
                    //AlarmsViewModel.nodes 当前主机下所有报警节点
                    $scope.AlarmingViewModel.alarms = alarmsdata;

                    //根据alarm更新overview页面blcok
                    if (alarmsdata.length != 0) {
                        $scope.cssHelpViewModel.corecubicClass = "item blockLine-middle cubicAlarm";
                        $scope.cssHelpViewModel.corecubicTxt = "blockLine-Desc fontBlack coretxtadd";
                    }
                    else{
                        $scope.cssHelpViewModel.corecubicClass = "item blockLine-middle cubicNormal";
                        $scope.cssHelpViewModel.corecubicTxt = "blockLine-Desc fontBlack coretxtadd";
                    }
                        

                    //首页设备报警颜色
                    alarmCoreJudge(alarmsdata);

                    //报警概要
                    alarmDescGen(alarmsdata, $scope);

                }).error(function () {
                    alert("节点报警信息Error，服务器请求故障");
                });
            }).error(function () {
                alert("服务器请求故障");
            });
        }).error(function () {
            alert("服务器请求故障");
        });
    };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////


//首页 app.overview overview.html
.controller('OverViewCtrl', function ($q, $scope, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover, $state, $timeout,$interval, $http, $ionicLoading, locals) {

    //页面初始化方法
    $scope.DataReq = function () {
        startLoading($ionicLoading);
        console.log(locals.get("cust_id","0"));
        if (locals.get("cust_id","0") == "0")
            $state.go("app.login"); 
       
        $ionicSideMenuDelegate.canDragContent(true);

        //更新device node alarm
        $scope.updateDeviceData();


            //加载TempToggle配置文件
            var n_versionStr = locals.get("n_version", "false");
            if (n_versionStr == "false")
                $scope.TempToggle.notifyVersion = false;
            else
                $scope.TempToggle.notifyVersion = true;

            var n_vibStr = locals.get("n_vib", "false");
            if (n_vibStr == "false")
                $scope.TempToggle.notifyVib = false;
            else
                $scope.TempToggle.notifyVib = true;

            var n_pushStr = locals.get("n_push", "false");
            if (n_pushStr == "false")
                $scope.TempToggle.notifyPush = false;
            else
                $scope.TempToggle.notifyPush = true;
            //
            $scope.OverViewViewModel.JustLogin = false;

    

        //九宫格css
        //circleCss();
        //DataReq end
    }
    $timeout(function () {
        $ionicLoading.hide();
    }, 1000);

    //刷新data
    $interval($scope.updateDeviceData, 5000);
    //布防撤防方法
    $scope.armStatusBtnChange = function () {
        //若当前撤防状态则布防
        if (!$scope.UsingDeviceViewModel.device.alert_status) {
            var armurl = '/device/arming';
            var armreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id };
            var armreq = httpReqGen(armurl, armreqd);

            $http(armreq).success(function (data) {
                //返回0000
                if (data.result.code == "0000") {
                    //更新device node alarm
                    $scope.updateDeviceData();
                }
                    //布防失败
                else {
                    alert("布防请求失败");
                }
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.alert_status ? "布防" : "撤防";
                $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.alert_status ? "ion-locked" : "ion-unlocked";
            }).error(function () {
                alert("布防撤防服务器请求故障");
            });
        }
            //若当前布防状态则撤防
        else {
            var armurl = '/device/unarming';
            var armreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id };
            var armreq = httpReqGen(armurl, armreqd);

            $http(armreq).success(function (data) {
                //返回0000
                if (data.result.code == "0000") {
                    //更新device node alarm
                    $scope.updateDeviceData();
                }
                    //布防失败
                else {
                    alert("布防请求失败");
                }
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.alert_status ? "布防" : "撤防";
                $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.alert_status ? "ion-locked" : "ion-unlocked";
            }).error(function () {
                alert("服务器请求故障");
            });
        }
    };

    $scope.Emergency = function () {
        ////紧急报警api
        //var armurl = '';
        //var armreqd = {};
        //var armreq = httpReqGen(armurl, armreqd);

        //$http(armreq).success(function (data) {
        //    if (data.result.code == "0000") {
        //    }
        //    else {
        //        alert("");
        //    }
        //}).error(function () {
        //    alert("紧急报警服务器请求故障");
        //});
    }
    //说明modal
    $scope.openModal = function () {
        startModal($ionicLoading);

        $timeout(function () {
            $ionicLoading.hide();
        }, 2000);
    }
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.nodeTypeTap = function(route, detType,detTypeId) {
        //$scope.UsingNodesViewModel.nodes = nodes;
        $scope.UsingNodesViewModel.nodeType = detType;
        $scope.UsingNodesViewModel.nodeTypeId = detTypeId;
        
        $state.go(route);
    };
    $scope.nodeTap = function(route, node) {
        $scope.nodeViewModel.node = node;
        $state.go(route);
    };  
    $scope.pageJump = function(route) {
        $state.go(route);
    };    
    $ionicPopover.fromTemplateUrl('templates/alerts.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openAlerts = function($event) {
        $scope.popover.show($event);
    };
    $scope.closeAlerts = function() {
        $scope.popover.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    $timeout(function () {
        ionic.EventController.trigger("resize", "", true, false);
    }, 1500);
})
//布防 app.arm arm.html
.controller('ArmCtrl', function($scope, $state, locals) {
    if (!locals.get("cust_id",""))
        $state.go("app.login"); 
})

//摄像头 app.camera camera.html
.controller('CameraCtrl', function($scope, $http, $state, locals){ 
    if (!locals.get("cust_id",""))
        $state.go("app.login"); 

    $scope.init = function() {
        alert("尚未提供添加摄像头接口");
    };
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
    //节点配对
.controller('NodesCtrl', function ($scope,$http, locals,$ionicLoading, $timeout, $state) {
        if (!locals.get("cust_id",""))
            $state.go("app.login"); 

        $scope.init = function () {
            var nodelisturl = '/node/list';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
            var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

            $http(nodelistreq).success(function (data) {
                //取返回值有效data
                var nodesdata = resResult(data);
                //NodesViewModel.nodes 当前主机下所有节点
                $scope.NodesViewModel.nodes = nodesdata;
                //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                $scope.UsingNodesViewModel.nodes = nodesdata;
            }).error(function () {
                alert("服务器请求故障");
            });
        }
        $scope.startPairing = function(){
            startLoading($ionicLoading);

            $timeout(function () {
                var nodelisturl = '/node/list';
                var dvcid = $scope.UsingDeviceViewModel.device.device_id;
                var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
                var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

                $http(nodelistreq).success(function (data) {
                    //取返回值有效data
                    var nodesdata = resResult(data);
                    //NodesViewModel.nodes 当前主机下所有节点
                    $scope.NodesViewModel.nodes = nodesdata;
                    //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                    $scope.UsingNodesViewModel.nodes = nodesdata;
                }).error(function () {
                    alert("服务器请求故障");
                });

                $ionicLoading.hide();
            }, 10000);
        }

        $scope.nodeEdit = function (node) {
            $scope.Temp.EditingNode = node;
            $state.go("app.nodeedit")
        }
        $scope.removeNode = function (editingNode) {
            //修改节点名字
            var url = '/node/delete';
            var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "node_id": editingNode.node_id };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                //取返回值有效data
                if (data.result.code == "0000") {
                    alert(data.result.msg);
                    $state.go("app.nodes");
                }
                else
                    alert(data.result.msg);
            }).error(function () {
                alert("服务器请求故障");
            });
            
            
        }

    })
//添加设备 app.addNode add-node.html
.controller('NodeEditCtrl', function ($scope, $state, locals,$http) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.submitEdit = function () {
      var sss = $scope.Temp.EditingNode;
      var nodeid = $scope.Temp.EditingNode;
      //修改节点名字
      var url = '/node/name/update';
      var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "node_id": $scope.Temp.EditingNode.node_id, "name": $scope.Temp.EditingNode.name };
      var req = httpReqGen(url, reqd);

      $http(req).success(function (data) {
          //取返回值有效data
          if (data.result.code == "0000") {
              alert("节点名称已更改");
              $state.go("app.nodes");
          }
          else
              alert(data.result.msg);
      }).error(function () {
          alert("服务器请求故障");
      });
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//用户 app.usersetting usersetting.html
.controller('usersettingCtrl', function ($scope, $state, locals, $ionicSideMenuDelegate) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.logout = function() {
    alert(locals.get("cust_id",""));
    //存储数据
    locals.set("username","0");
    locals.set("cust_id", "0");
    console.log('cust_id: ' + locals.get("cust_id", ""));
    $ionicSideMenuDelegate.canDragContent(false);
    $state.go('app.login');
  }
})
.controller('MaintananceCtrl', function ($scope, $state, locals) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");

    $scope.init = function () {
        alert("报修借口未实现");
    }
    $scope.GuestSevice = { Maintanance: null };

    $scope.maintananceSubmit = function () {
        alert(locals.get("cust_id", ""));
        //报修申请

        //var url = '';
        //var reqd = { };
        //var req = httpReqGen(url, reqd);

        //$http(req).success(function (data) {
        //    //取返回值有效data
        //    if (data.result.code == "0000") {
        //        alert("报修已提交");
        //        $state.go("app.nodes");
        //    }
        //    else
        //        alert(data.result.msg);
        //}).error(function () {
        //    alert("服务器请求故障");
        //});

    }
})

.controller('AlarmsCtrl', function ($scope, $state, locals, $http,$ionicActionSheet) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");
    var simuldata = {
        "totalPage": "3",
        "dataList": [{
            "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 0, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
        },
                {
                    "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 1, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
                },
                {
                    "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 0, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
                },
                {
                    "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 1, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
                }],
        "pageSize": 1,
        "page": 1,
        "totalCount":12
    };

    var totalPages = 0, currentPage = 1;
    $scope.MessageViewModel = { messages: null };

    $scope.alarmInit = function () {

        //获取所有报警记录
        var url = '/device/alert/record';
        var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": 1, "rows": $scope.AllAlarmsViewModel.rows };
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {
           //取返回值有效data
           var validData = resResult(data);
           if (validData) {
               //simul
               totalPages = simuldata.totalPage;
               data = simuldata.dataList;
                $scope.AllAlarmsViewModel.alarms = data;
           }
           else
               alert(data.result.msg);
        }).error(function () {
           alert("服务器请求故障");
        });

    }

    $scope.loadMoreAlarms = function () {
        currentPage++;
        if (currentPage > totalPages)
            alert("No more alarms");
        else
            loadMoreAlarms(currentPage, $scope, $http);
    }

    $scope.alarmingData = function () {
        //获取所有报警记录
        var url = '/device/alert';
        var reqd = {"cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id};
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {
           //取返回值有效data
           var validData = resResult(data);
           if(validData){
               //simul
               data = simuldata;
               
                $scope.AlarmingViewModel.alarms = data;
           }
           else
               alert(data.result.msg);
        }).error(function () {
           alert("服务器请求故障");
        });

    }    
    $scope.sendAck = function(alarm){
        var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: 'Send Ack' }
                    ],
                    titleText: 'operations',
                    cancelText: 'Cancel',
                    cancel: function() {
                    },
                    buttonClicked: function(index) {
                                 var url = '/device/alert/handle';
                                var reqd = {"alert_id": alarm.alert_id};
                                var req = httpReqGen(url, reqd);

                                $http(req).success(function (data) {
                                   //取返回值有效data
                                   if(data.result.code == "0000")
                                    alert("acknowledged");
                                   else
                                       alert(data.result.msg);
                                }).error(function () {
                                   alert("服务器请求故障");
                                });
                        
                            //再次获取alarm list
                            //获取所有报警记录
                            var url = '/device/alert';
                            var reqd = {"cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id};
                            var req = httpReqGen(url, reqd);

                            $http(req).success(function (data) {
                            //取返回值有效data
                            var validData = resResult(data);
                            if(validData){
                                //simul
                                data = simuldata;
                                
                                    $scope.AlarmingViewModel.alarms = data;
                            }
                            else
                                alert(data.result.msg);
                            }).error(function () {
                            alert("服务器请求故障");
                            });
                            
                        return true;
                    }
                });
        //$state.go("app.alarms");
    }

})

/////////////////////////////////////////////////       
//个人信息 app.userinfo userinfo.html
.controller('updateUser', function($scope, $q, $http, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 


  var url = '/account/detail';
  var reqd = { "cust_id": $scope.global.cust_id};
  var req = httpReqGen(url, reqd);
  $http(req).success(function (data) {
      var validData = resResult(data);
      if (validData) {
          $scope.UserViewModel.user = validData;
      }
  }).error(function () { });


  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }

  //$scope.newuser = $scope.user;
  $scope.userSubmit = function() {
      var url = '/account/upgrade';
      var reqd = { "cust_id": $scope.global.cust_id,"tel":$scope.UserViewModel.user.tel, "email":$scope.UserViewModel.user.email,"address":$scope.UserViewModel.user.address };
      var req = httpReqGen(url, reqd);
      $http(req).success(function (data) {
          var validData = resResult(data);
          if (validData) {
              $state.go("app.usersetting");
          }
      }).error(function () { });
      $scope.UserViewModel.user

  };
})
//子账号 app.subusers subusers.html
.controller('subUserCtrl', function($scope, $state, $http) {

  $scope.delete = function(item){
    //删除子账号业务
  }
  $scope.edit = function(item){
    //编辑子账号业务
  }  

  $scope.pageJump = function(route) {
    $state.go(route);
  };  
})
//子账号 app.subuserinfo subuserinfo.html
.controller('addSubUser', function($scope, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newuser = {};
  $scope.userSubmit = function() {
    alert("尚未提供添加子账户接口");
  };
})
/////////////////////////////////////////////////
///
.controller('findPasswordCtrl', function($scope, $q, $http, $state, locals){
  $scope.findData = {};
  $scope.findPassword = function() {
    if(!$scope.findData.mobileNo || !$scope.findData.password || !$scope.findData.passwordConfirm
      || !$scope.findData.code) {
      alert("请填写");
      return;
    }
    if($scope.findData.password != $scope.findData.passwordConfirm) {
      alert('新密码输入不一致');
      return;
    }    

    var apibranch = '/account/findpwd';
    var newpw = hex_md5($scope.findData.password).toUpperCase();
    var requestObject = {
        phone: $scope.findData.mobileNo,
        login_pwd: newpw,
        sms_captcha: $scope.findData.code
    };
    var req = httpReqGen(apibranch,requestObject);

    $http(req).then(function(response) {
      console.log(response);     
      var result = $.parseJSON(response.data.result);
      if (result.code == 0000){
        $state.go('app.login');
      } else {
        alert(result.msg);
      }
    }, function(error) {    
      console.log(error);
    });
  };
})
/////////////////////////////////////////////////
//更改密码 app.changepassword changepassword.html
.controller('PasswordCtrl', function($scope,$q,$http,$state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 
  
  $scope.setFormScope = function(scope){
    this.formScope = scope;

  }
  $scope.codeform = {};
  $scope.changePW = function() {
    if(!$scope.codeform.oldPW || !$scope.codeform.newPW || !$scope.codeform.confirmPW) {
      alert('请填写');
      return;
    }
    if($scope.codeform.newPW != $scope.codeform.confirmPW) {
      alert('新密码输入不一致');
      return;
    }    
    var apibranch = '/account/updatepwd';

    var oldpw = hex_md5($scope.codeform.oldPW).toUpperCase();
    var newpw = hex_md5($scope.codeform.newPW).toUpperCase();
    var id = $scope.global.cust_id;
    var reqobj = {
      "cust_id":id,
      "old_pwd":oldpw,
      "new_pwd":newpw
    };
    var req = httpReqGen(apibranch,reqobj);

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var resData = "";
      if(response.status == 200){
        var resData = $.parseJSON(response.data.result);
        if(resData.code == "0000"){
          alert('密码已修改');
          $state.go("app.usersetting");           
        }
        else{
          alert('密码修改失败');
        }
      }
      else
        alert('密码修改失败');
      deferred.resolve();
    }, function(error) {
        deferred.reject();
    });
  };
})  
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//版本控制 app.version version.html
.controller('VersionCtrl', function($scope,$http,$q, locals){
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 
   
  $scope.VersionViewModel = { version: null, currentVersion: {"version":"2.0.0"} };
  $scope.init = function () {
      var url = '/app/upgrade';
      var platform = "Android";
      var version = $scope.VersionViewModel.currentVersion.version;
      var reqd = { "platform": platform, "app_version": version };
      var req = httpReqGen(url, reqd);

      $http(req).success(function (data) {
          //取返回值有效data
          var versiondata = resResult(data);
          //version vm
          if (data.result.msg == "已经是最新版!!!" && data.result.code == "1002") {
              $scope.VersionViewModel.version = {"version_no":"3.0.2","is_update":0,"update_content":"已是最新版本","cer_type":"app","id":"728430815610302464","public_time":"2016-05-06 11:46:33","down_addr":"http://www.baidu.com","file_size":"10","platform":"Android"};
          }
          else
              $scope.VersionViewModel.version = versiondata;

      }).error(function () { });

  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//帮助 app.help help.html
.controller('HelpCtrl', function($scope){ 
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//设置 app.settings settings.html
.controller('settingsCtrl', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
      $state.go("app.login");

  $scope.versionToggleChanged = function () {
      var result = ($scope.TempToggle.notifyVersion) ? true : false;
      locals.set("n_version", result);
      alert($scope.TempToggle.notifyVersion);
  }

})
.controller('MessageSettingCtrl', function ($scope, $state, locals) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");
    $scope.vibToggleChanged = function () {
        var result = ($scope.TempToggle.notifyVib) ? true : false;
        locals.set("n_vib", result);
    }
    $scope.pushToggleChanged = function () {
        var result = ($scope.TempToggle.notifyPush) ? true : false;
        locals.set("n_push", result);
    }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////

////////////////////
//选择主机 app.deviceselect deviceselect.html
.controller('DeviceSelectCtrl', function($scope, $state) {
  $scope.data = {};
  //console.log($scope.UsingDeviceViewModel.name);
  $scope.init = function(){
    
  }
  $scope.currentDeviceChange = function (device) {
      $scope.UsingDeviceViewModel.device = device;
  };
})
//主机管理 app.devicemanage devicemanage.html
.controller('DeviceMangeCtrl', function ($scope, $state,$http) {
    $scope.data = {};
    //console.log($scope.UsingDeviceViewModel.name);
    $scope.init = function () {

    }
    $scope.deviceTap = function (route, device) {
        $scope.Temp.EditingDevice = device;
        $state.go(route);
    };

    //通过二维码添加主机
    $scope.addDevicebyBarcode = function () {

        $cordovaBarcodeScanner.scan().then(function (imageData) {

            var deviceId = imageData.text;
            var devicename = ""
            var customerId = $scope.global.cust_id;
            //添加主机
            var url = '/device/binding';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var reqd = { "cust_id": customerId, "device_id": deviceId, "device_name": devicename };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                var validData = resResult(data);
                if (validData) {
                    //更新device node alarm
                    $scope.updateDeviceData();
                }
            }).error(function () { });


            console.log("Barcode Format -> " + imageData.format);

            console.log("Cancelled -> d" + imageData.cancelled);

        }, function (error) {
            console.log("An error happened -> " + error);
        });
    };
})
.controller('DeviceDetailsCtrl', function ($scope, $state) {
    $scope.temp = { name: $scope.Temp.EditingDevice.device_name, id: $scope.Temp.EditingDevice.device_id };
    $scope.updateDeviceInfo = function () {
        var datata = $scope.temp;
    }
})
//添加主机 app.deviceinfo deviceinfo.html
.controller('addDevice', function($scope) {
  $scope.init = function(){
    alert("添加主机接口尚未提供");
  }
})

//编辑主机 app.deviceedit deviceedit.html
.controller('DeviceEditCtrl', function ($scope, $state, locals, $http) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");
    $scope.thidEditModel = { device: null };
    $scope.submitEdit = function () {
        //修改主机名字
        var url = '/device/name/update';
        var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.Temp.EditingDevice.device_id, "device_name": $scope.thidEditModel.device.name };
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {
            //取返回值有效data
            if (data.result.code == "0000") {
                alert("节点名称已更改");

                $scope.updateDeviceData();
                $state.go("app.devicemanage");
            }
            else
                alert(data.result.msg);
        }).error(function () {
            alert("服务器请求故障");
        });
    }
    $scope.disbinddevice = function () {
        //主机解绑
        var url = '/device/unbinding';
        var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.Temp.EditingDevice.device_id };
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {
            //取返回值有效data
            if (data.result.code == "0000") {
                alert("该主机已解绑");

                $scope.updateDeviceData();
                $state.go("app.devicemanage");
            }
            else
                alert(data.result.msg);
        }).error(function () {
            alert("服务器请求故障");
        });
    }
})
////////////////////
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主机网络连接管理 app.devicenetwork devicenetwork.html
.controller('DeviceNetworkCtrl', function($scope){ 
  $scope.init = function(){
  }
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//通知 app.notifies notifies.html
.controller('NotificationCtrl', function($scope, $state, $ionicPopup, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.deviceSelect = function() {

  };     
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//支付 app.purchaseinfo purchaseinfo.html
.controller('PurchaseDevicesCtrl', function($scope,$state) {
  $scope.init = function(){
    // alert("支付接口尚未提供");
  }
  $scope.next = function(device){
    //$scope.PurchasingDevice.device = device;
    $scope.PurchasingDevice.device.accountId = device.account.accountId;
    $scope.PurchasingDevice.device.createAt = device.createAt;
    $scope.PurchasingDevice.device.deviceId = device.deviceId;
    $scope.PurchasingDevice.device.isDeleted = device.isDeleted;
    $scope.PurchasingDevice.device.name = device.name;
    $state.go('app.purchaseinfo');
  }
})
//支付 app.purchaseinfo purchaseinfo.html
.controller('PurchaseCtrl', function($scope,$state,$ionicActionSheet,$ionicLoading) {
  $scope.init = function(){
                var simuloptiondata = [{"name":"套餐1", "desc":"ionicActionSheet state account","account":"Linda Smith","licencetime":"2015-04-09", "time":"2014-04-10 12:23:23","payment":"99.99"},
                {"name":"套餐2", "desc":"ionicActionSheet state account","account":"Linda Smith","licencetime":"2015-04-09", "time":"2014-04-10 12:23:23","payment":"99.99"},
                {"name":"套餐3", "desc":"ionicActionSheet state account","account":"Linda Smith","licencetime":"2015-04-09", "time":"2014-04-10 12:23:23","payment":"99.99"}];
            // //套餐api
            // var url = '';
            // var reqd = { };
            // var req = httpReqGen(url, reqd);

            // $http(req).success(function (data) {
            //     var validData = resResult(data);
            //     if (validData) {
            //     }
            // }).error(function () { });
            
            $scope.MenuViewModel.menu = simuloptiondata;
  }
    
  $scope.intoPurchase = function(menu){
      $scope.MenuViewModel.usingmenu = menu;
        var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: '立即支付' }
                    ],
                    titleText: '操作',
                    cancelText: '取消',
                    cancel: function() {
                    },
                    buttonClicked: function(index) {
                        $state.go('app.purchasemethod')
                        // return true;
                    }
                });
     };
     
       $scope.purchase = function(){
    alert("alipay demo");
    var myDate = new Date();
    var tradeNo = myDate.getTime();
    var alipayClass = navigator.alipay;

    //支付宝公钥
    var pubRsa = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnxj/9qwVfgoUh/y2W89L6BkRAFljhNhgPdyPuBV64bfQNN1PjbCzkIM6qRdKBoLPXmKKMiFYnkd6rAoprih3/PrQEB/VsW8OoM8fxn67UDYuyBTqA23MML9q1+ilIZwBC2AQ2UBVOrFXfFl75p6/B5KsiNG9zpgmLCUYuLkxpLQIDAQAB";
    var rsa = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMrmQGgiRA56RA60TAoOO16gFTHIXPyNElcuMLlBQ0TzIGI83RC9vgWLmOmrN5r34VzWM7DIdyHf8u16B32T0LDKr/veUXkrwzXeNAPycqqRasodxE9BU4bSRdKxzc2/T+eraLsXhCcROi4pG/02PUwBht2HA3gOmYbUcUoxHQ91AgMBAAECgYApz5LcIpuFpDpcEVlOBSrE0BYuAQzwWh26a2FM+57iGXvF4qbnaUI8IE0tccPuokAFgnp6ZoTuLRkBSNE8VnZ9acCdUfbV5qiD4AZYVALlR3iI+QOEHMd3YZZ4iitcsTQqaS8RttG+6Cu2ma+GsWtXggvBBUE4QAr7b8lLr9p37QJBAPZLZebBZE8tGfLgrUow3SVpsp3aOsHZ2tZPYfzNMGhyVVApdqBtwjBrQeKETCBqT+VTAaRX1wwDKLPDHhZUUosCQQDS5RY2RCCpb3Kh565XN1VPYmJdgATpGxQgjOj9Q6oWAD/aghunuD69idoSC1WzHrI7RDKb09gIwzoxC16jamX/AkEAhFpMLk7qqqmf8ibOuLm9fWdpdu5Y+OcrdFNAYuuZAee+9M7zUo7o9cANrb5OcnTu7ltG3JvfkjL4YnGN743stQJAfyXO9nismHqwyhw8aCjcLjhKxcRhMYk54UYTUl5xNUKBPOQkeEIE0ZFDAI4E5TEkk8bSHFDkdqP9eYQ5UpzbUQJBAKKIEZg7zxnMI4BFPGUT7P4SrEe8NgScjZpySvZAhQeTzTEPBmy702c1A7QFy7TzxDf/7gG9KHVBiMemfyDMyIw=";
    alipayClass.pay({
                    "partner":"2088421286292033",    //商户ID
                    "rsa_private":rsa,               //私钥
                    "rsa_public":pubRsa,                //公钥
                    "seller":"2088421286292033",    //收款支付宝账号或对应的支付宝唯一用户号
                    "subject":"测试文件",             //商品名称
                    "body":"支付宝支付",        //商品详情
                    "price":"0.01",                  //金额
                    "tradeNo":tradeNo,             
                    "timeout":"30m",                 //超时设置
                    "notifyUrl":"http://www.baidu.com"
    },function(resultStatus){
      alert(resultStatus);
      $ionicLoading.show({
        template:"支付宝测试返回结果＝" + resultStatus,
        noBackdrop: true,
        duration: 500
      });
    },function(message){
      alert(message);
      $ionicLoading.show({
        template:"支付宝支付失败＝" + message,
        noBackdrop: true,
        duration: 500
      });
    });
  };
})

/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
////报警 app.alarm alarm.html
//.controller('AlarmCtrl', function ($scope, $state, $http) {
//    $scope.AlarmViewModel = { alarms: null };
//    $scope.init = function(){
//        alert("报警数据结构尚未提供");

//        //接口未实现
//        var alarmlisturl = '/device/alert/record';
//        var alarmreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": 1, "rows": 1, };
//        var alarmreq = httpReqGen(alarmlisturl, alarmreqd);

//        $http(alarmreq).success(function (data) {
//            //取返回值有效data
//            var alarmdata = resResult(data);
//            //更新内存的报警记录
//            $scope.AlarmViewModel.alarms = alarmdata;
//        }).error(function () {
//            alert("服务器请求故障");
//        });
//  }
//})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主板电池信息 app.battery battery.html
.controller('BatteryCtrl', function($scope,$state) {
    $scope.BatteryViewModel = { battery: null };
    $scope.init = function () {
        alert("节点电量接口尚未提供");

        ////接口未实现
        //var manulisturl = '/电量/电量list';
        //var manulistreqd = {};
        //var manulistreq = httpReqGen(manulisturl, manulistreqd);

        //$http(manulistreq).success(function (data) {
        //    //取返回值有效data
        //    var batterydata = resResult(data);
        //    //更新内存的操作记录
        //    $scope.BatteryViewModel.battery = batterydata;
        //}).error(function () { });

    }
})
/////////////////////////////////////////////////
///
///
/////////////////////////////////////////////////
//操作栈 app.manustack manustack.html
.controller('ManuStackCtrl', function ($scope, $state,$http) {
    var simuloptiondata = [{"opt_id":"Ac8749Ids", "opt_time":"2015-04-09 12:23:23","opt_desc":"my device"},
    {"opt_id":"Ac8749Ids", "opt_time":"2015-04-09 12:23:23","opt_desc":"my device"},
    {"opt_id":"Ac8749Ids", "opt_time":"2015-04-09 12:23:23","opt_desc":"my device"},
    {"opt_id":"Ac8749Ids", "opt_time":"2015-04-09 12:23:23","opt_desc":"my device"},
    {"opt_id":"Ac8749Ids", "opt_time":"2015-04-09 12:23:23","opt_desc":"my device"},
    {"opt_id":"Ac8749Ids", "opt_time":"2015-04-09 12:23:23","opt_desc":"my device"}];
    $scope.pageJump = function(route) {
        $state.go(route);
    };
    var totalPage = 1;
    var pageCount = 1;  
    $scope.loadMore = function(){
        pageCount ++;
    };
    $scope.selectUpdated = function(selValue){
        $scope.StackViewModel.options = selValue;
    };
    $scope.init = function(){
            alert("操作记录数据结构尚未提供");

            var manulisturl = '/device/opt/record';
            var manulistreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, 
            "page": pageCount, "rows": $scope.StackViewModel.options};
            var manulistreq = httpReqGen(manulisturl, manulistreqd);

            // $http(manulistreq).success(function (data) {
            //     //取返回值有效data
            //     var manudata = resResult(data);
            //     //更新内存的操作记录
            //     $scope.StackViewModel.manustack = manudata;
            // }).error(function () {
            //     alert("服务器请求故障");
            // });
            $scope.StackViewModel.manustack = simuloptiondata;
        };    
})
/////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//测试用功能 app.vib vib.html
.controller('VibrationCtrl', function($scope, $cordovaVibration, $cordovaBarcodeScanner, $state, locals, $ionicLoading){ 
 if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.startVib=function(){ 
    // 震动 1000ms 
    $cordovaVibration.vibrate(1000); 
  };


  $scope.scanBarcode = function() {

      $cordovaBarcodeScanner.scan().then(function(imageData) {

      alert(imageData.text);

      console.log("Barcode Format -> " + imageData.format);

      console.log("Cancelled -> d" + imageData.cancelled);

      }, function(error) {

      console.log("An error happened -> " + error);

      });

  };


  $scope.sendNetInfo = function(){
        alert("smartconfig demo");
        var myDate = new Date();
        var tradeNo = myDate.getTime();
        var scClass = navigator.smartconfig;
        if(scClass){
          alert("success");

          var data = {"ssid":"Xiaomi_C3AD", "password":"12345678", "gateway":"192.168.31.1"};
          scClass.startSending(
            data,
            function(resultMsg){
            alert(resultMsg);
            $ionicLoading.show({
              template:"成功",
              noBackdrop: true,
              duration: 500
            });
          },function(resultMsg){
            alert(resultMsg);
            $ionicLoading.show({
              template:"失败",
              noBackdrop: true,
              duration: 500
            });
          });       
        }

        else{
          alert("fail");
        }
  };



  $scope.gIP = function(){
      alert("gIP demo");
      var myDate = new Date();
      var tradeNo = myDate.getTime();
      var scClass = navigator.smartconfig;
      if(scClass){
        alert("success");

        var data = {};
        scClass.gateWayIp(
          data,
          function(resultMsg){
          alert(resultMsg);
          $ionicLoading.show({
            template:"成功",
            noBackdrop: true,
            duration: 500
          });
        },function(resultMsg){
          alert(resultMsg);
          $ionicLoading.show({
            template:"失败",
            noBackdrop: true,
            duration: 500
          });
        });       
      }

      else{
        alert("fail");
      }
  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
//注册
.controller('register', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $http, locals) {

  //$scope.setFormScope = function(scope){
  //  this.formScope = scope;
  //}
  $scope.registerData = {};
  $scope.sendSMS = function (phoneNum) {
      var url = '/sms/captcha/register';
      var reqd = { "phone": phoneNum };
      var req = httpReqGen(url, reqd);
      $http(req).success(function (data) {
          //发送成功0000
          if (data.result.code == "0000")
              alert("手机验证码发送成功");
              //手机号码已经注册1002
          else
              alert("该手机号码已经注册");
      }).error(function () {
          alert("服务器请求故障");
      });
  }
  $scope.submit = function() {
    if(!$scope.registerData.mobileNo) {
      alert('mobileNo required');
      return;
    }
    if(!$scope.registerData.password) {
      alert('password required');
      return;
    }
    if(!$scope.registerData.code) {
      alert('code required');
      return;
    }

    var requestData = {
      phone: $scope.registerData.mobileNo,
      login_pwd: hex_md5($scope.registerData.password).toLocaleUpperCase(),
      sms_captcha: $scope.registerData.code,
    };

    var apibranch = '/account/register';
    var request = httpReqGen(apibranch,requestData);

    $http(request).then(function(response) {
        //取返回值有效data
        var nodesdata = resResult(response.data);
        $scope.global.cust_id = nodesdata;
        $state.go('app.userinfo');

    }, function(error) {
    });
  }
  $scope.pageJump = function (route) {
      $state.go(route);
  }
  $scope.check = function (scope) {
      if ($scope.registerData.unchecked)
          $scope.registerData.unchecked = false;
      else
          $scope.registerData.unchecked = true;
  }
})

//本地存储数据===================================
.factory('locals',['$window',function($window){
      return{        //存储单个属性
        set :function(key,value){
          $window.localStorage[key]=value;
        },        //读取单个属性
        get:function(key,defaultValue){
          return  $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject:function(key,value){
          $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
      }
  }])

//极光推送===========================================
.factory('jpushService',['$http','$window','$document',function($http,$window,$document){
    var jpushServiceFactory={};

    //var jpushapi=$window.plugins.jPushPlugin;

    //启动极光推送
    var _init=function(config){
        $window.plugins.jPushPlugin.init();
        //设置tag和Alias触发事件处理
        document.addEventListener('jpush.setTagsWithAlias',config.stac,false);
        //打开推送消息事件处理
        $window.plugins.jPushPlugin.openNotificationInAndroidCallback = config.oniac;

        $window.plugins.jPushPlugin.setDebugMode(true);
    }
    //获取状态
    var _isPushStopped=function(fun){
        $window.plugins.jPushPlugin.isPushStopped(fun)
    }
    //停止极光推送
    var _stopPush=function(){
        $window.plugins.jPushPlugin.stopPush();
    }

    //重启极光推送
    var _resumePush=function(){
        $window.plugins.jPushPlugin.resumePush();
    }

    //设置标签和别名
    var _setTagsWithAlias=function(tags,alias){
        $window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
    }

    //设置标签
    var _setTags=function(tags){
        $window.plugins.jPushPlugin.setTags(tags);
    }

    //设置别名
    var _setAlias=function(alias){
        $window.plugins.jPushPlugin.setAlias(alias);
    }

    jpushServiceFactory.init=_init;
    jpushServiceFactory.isPushStopped=_isPushStopped;
    jpushServiceFactory.stopPush=_stopPush;
    jpushServiceFactory.resumePush=_resumePush;

    jpushServiceFactory.setTagsWithAlias=_setTagsWithAlias;
    jpushServiceFactory.setTags=_setTags;
    jpushServiceFactory.setAlias=_setAlias;

    return jpushServiceFactory;
}])

//登录
.controller('login', function ($scope, $ionicSlideBoxDelegate, $ionicPopup, $http, $state, locals, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);
  $scope.loginData = {};
  $scope.login = function () {
      if (!$scope.loginData.username) {
          alert('请输入用户名。');
          return;
      }
      if (!$scope.loginData.password) {
          alert('请输入密码。');
          return;
      }
      var requestData = {
          phone: $scope.loginData.username,
          login_pwd: hex_md5($scope.loginData.password).toLocaleUpperCase(),
      };

      var apibranch = '/account/login';
      var request = httpReqGen(apibranch, requestData);

      $http(request).then(function (response) {
          console.log(response);
          var result = response.data.result;
          if (result.code == 0000) {
              $scope.global.cust_id = result.data.cust_id;

              //存储数据
              locals.set("username", requestData.phone);
              locals.set("cust_id", result.data.cust_id);
              //读取数据
              console.log(locals.get("username", ""));
              console.log(locals.get("cust_id", ""));
              $scope.OverViewViewModel.JustLogin = true;
              $state.go('app.dashboard.overview');
          } else {
              alert(result.msg);
          }
      }, function (error) {
          console.log(error);
      });
  }
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
  $scope.prevSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
})
;

function getReqNo(){
    var newuuid = UUID.prototype.createUUID();
    var aesKey = "XinLaiWitHome___";
    var newAesKey = null;
    var aesEncrypt = function(data, keyStr, ivStr) {
                var sendData = CryptoJS.enc.Utf8.parse(data);
                var key = CryptoJS.enc.Utf8.parse(keyStr);
                var iv  = CryptoJS.enc.Utf8.parse(ivStr);
                var encrypted = CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Iso10126});
                return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    };
    var aesDecrypt = function(data, keyStr, ivStr) {
      var key = CryptoJS.enc.Utf8.parse(keyStr);
      var iv  = CryptoJS.enc.Utf8.parse(ivStr);
      var decrypted = CryptoJS.AES.decrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126});
      return decrypted.toString(CryptoJS.enc.Utf8);
    };
    var code = aesEncrypt(newuuid, aesKey, aesKey);   
    return code;
}
function httpReqGen(apibranch,reqData){
    var code = getReqNo();
    var url = 'http://t.xinlaihome.cn:8081/xinlai/' + apibranch + '?req_no=' + code;
    return req = {
      headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*'
                  },
      method: 'POST',
      url: url,
      data: reqData
    };  
}
function httpReqGETGen(apibranch){
    var code = getReqNo();
    var url = 'http://t.xinlaihome.cn:8081/xinlai/' + apibranch + '?req_no=' + code;
    return req = {
      headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Accept': '*/*'
               },       
      method: 'GET',
      url: url
    };  
}
function httpTESTGen(url,head){
    return req = {
      headers: head,     
      method: 'GET',
      url: url
    };  
}


function circleCss() {
    var cWidth = parseFloat($('.cn-wrapper li a').css('width').split('p')[0]);
    var rate = cWidth / 366;

    var ss = [-70, 14, 40];
    var m1 = [-140, 152, 179];
    var m2 = [-100, 55, 80];
    var m3 = [0, 15, 45];
    var m4 = [100, 57, 83];
    var m5 = [146, 154, 181];
    var m6 = [97, 254, 282];
    var m7 = [0, 293, 323];
    var m8 = [-101, 257, 285];
    var mm = [m1,m2,m3,m4,m5,m6,m7,m8]

    ss[0] = Math.floor(ss[0] * rate) + "px";
    ss[1] = Math.ceil(ss[1] * rate) + "px";
    ss[2] = Math.ceil(ss[2] * rate) + "px";
    for (var i = 0; i < mm.length; i++) {
        for (var j = 0; j < m1.length; j++) {
            mm[i][j] = Math.floor(mm[i][j] * rate) + "px";
        }
    }


    var eicon = $('.cn-wrapper li a i');
    for (var i = 0; i < eicon.length; i++) {
        eicon.eq(i).css("left", mm[i][0]);
        eicon.eq(i).css("top", mm[i][1]);
        eicon.eq(i).css("font-size", ss[2]);
    }
    var espan = $('.cn-wrapper li a span');
    for (var i = 0; i < espan.length; i++) {
        espan.eq(i).css("left", mm[i][0]);
        espan.eq(i).css("top", mm[i][2]);
        espan.eq(i).css("margin-top", ss[0]);
        espan.eq(i).css("font-size", ss[1]);
    }

}

function resResult(data) {
    if (data.result.code == "0000")
        return data.result.data;
    else
        return false;
}
function startLoading($ionicLoading) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html",
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
}
function startModal($ionicLoading) {
    $ionicLoading.show({
        templateUrl: "templates/modal.html",
        content: '为了您的只能居家，我们正在拼命研发中，敬请期待 !',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
}

//首页报警颜色显示
function alarmCoreJudge(alarmdata) {
    if (alarmdata.length != 0) {
        $.each(alarmdata, function () {
            switch (this.node_type) {
                case 0:
                    $('#eKeyDevices').removeClass("cubicWhite").addClass("cubicAlarm");
                    $('#eKeyCore').removeClass("fontNormal").addClass("fontAlarm");
                    $('#eKeytxt').removeClass("fontBlack").addClass("fontWhite");
                    break;
                case 1:
                    $('#megnetDevices').removeClass("cubicWhite").addClass("cubicAlarm");
                    $('#megnetCore').removeClass("fontNormal").addClass("fontAlarm");
                    $('#megnettxt').removeClass("fontBlack").addClass("fontWhite");
                    break;
                case 2:
                    $('#infraDevices').removeClass("cubicWhite").addClass("cubicAlarm");
                    $('#infraCore').removeClass("fontNormal").addClass("fontAlarm");
                    $('#infratxt').removeClass("fontBlack").addClass("fontWhite");
                    break;
                case 3:
                    $('#smokeDevices').removeClass("cubicWhite").addClass("cubicAlarm");
                    $('#smokeCore').removeClass("fontNormal").addClass("fontAlarm");
                    $('#smoketxt').removeClass("fontBlack").addClass("fontWhite");
                    break;
                case 4:
                    $('#tempDevices').removeClass("cubicWhite").addClass("cubicAlarm");
                    $('#tempCore').removeClass("fontNormal").addClass("fontAlarm");
                    $('#temptxt').removeClass("fontBlack").addClass("fontWhite");
                    break;

                default:
                    break;
            }
        });
    }
    else {
        $('#eKeyDevices').removeClass("cubicAlarm").addClass("cubicWhite");
        $('#eKeyCore').removeClass("fontAlarm").addClass("fontNormal");
        $('#eKeytxt').removeClass("fontWhite").addClass("fontBlack");         
                  
        $('#megnetDevices').removeClass("cubicAlarm").addClass("cubicWhite");
        $('#megnetCore').removeClass("fontAlarm").addClass("fontNormal");
        $('#megnettxt').removeClass("fontWhite").addClass("fontBlack");    
        
        $('#infraDevices').removeClass("cubicAlarm").addClass("cubicWhite");
        $('#infraCore').removeClass("fontAlarm").addClass("fontNormal");
        $('#infratxt').removeClass("fontWhite").addClass("fontBlack");   
                
        $('#smokeDevices').removeClass("cubicAlarm").addClass("cubicWhite");
        $('#smokeCore').removeClass("fontAlarm").addClass("fontNormal");
        $('#smoketxt').removeClass("fontWhite").addClass("fontBlack");          
        
        $('#tempDevices').removeClass("cubicAlarm").addClass("cubicWhite");
        $('#tempCore').removeClass("fontAlarm").addClass("fontNormal");
        $('#temptxt').removeClass("fontWhite").addClass("fontBlack");          
    }
}

//首页报警概要
function alarmDescGen(alarmdata, $scope) {
    if (alarmdata.length != 0)
        $scope.OverViewViewModel.Status = "您的主机正在报警";
}







function alarmDataMap(alarmsdata) {
    $.each(alarmsdata, function () {
        switch (this.node_type) {
            case 0:
                this.node_type_cn = "电子钥匙";
                break;
            case 1:
                this.node_type_cn = "门磁";
                break;
            case 2:
                this.node_type_cn = "红外感应";
                break;
            case 3:
                this.node_type_cn = "烟雾报警器";
                break;
            case 4:
                this.node_type_cn = "温度传感器";
                break;
            default:
                break;
        }

        switch (this.alert_type) {
            case 1:
                this.alert_type_cn = "报警类型1";
                break;
            case 2:
                this.alert_type_cn = "报警类型2";
                break;
            case 3:
                this.alert_type_cn = "报警类型3";
                break;
            case 4:
                this.alert_type_cn = "报警类型4";
                break;
            case 5:
                this.alert_type_cn = "报警类型5";
                break;
            default:
                break;
        }

    });

}


function loadMoreAlarms(currentPage, $scope, $http) {
    //获取所有报警记录
    var url = '/device/alert/record';
    var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": currentPage, "rows": $scope.AllAlarmsViewModel.rows };
    var req = httpReqGen(url, reqd);
    var simuldata = {
        "totalPage": "3",
        "dataList": [{
            "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 0, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
        },
                {
                    "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 1, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
                },
                {
                    "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 0, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
                },
                {
                    "alert_id": "12122", "device_id": "Ac8749Ids", "device_name": "my device", "node_type": 2, "node_id": "237816Yhs"
                , "alert_type": 3, "alert_time": "2015-04-09 12:23:23", "opt_result": 1, "opt_time": "2015-04-09 12:23:23", "opt_user": "nope"
                }],
        "pageSize": 1,
        "page": 1,
        "totalCount": 12
    };
    $http(req).success(function (data) {
        //取返回值有效data
        var validData = resResult(data);
        if (validData) {
            //simul
            var datar = $scope.AllAlarmsViewModel.alarms;
            var datas = simuldata.dataList;

            $.each(datas, function () {
                datar.push(this);
            });
            $scope.AllAlarmsViewModel.alarms = datar;
        }
        else
            alert(data.result.msg);
    }).error(function () {
        alert("服务器请求故障");
    });
};


