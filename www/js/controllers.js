angular.module('starter.controllers', ['WifiServices'])

////////////////////////////////////////////////////////////////////////////////////////////////////////
//数据
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $ionicPopover, $state, $timeout,$http,$ionicPopup) {
    var timer;
    $scope.global = { cust_id : 0 };

    $scope.UsingDeviceViewModel = { device: null };
    //当前使用主机的节点
    $scope.UsingNodesViewModel = {
        nodeTypeId:null,
        nodeType: null,
        nodes: null,
        nodeList: [
                        { id: '1', name: '电子钥匙', icon: 'ion-locked', nodeType: '1' },
                        { id: '2', name: '门磁', icon: 'ion-magnet', nodeType: '2' },
                        { id: '3', name: '红外感应 ', icon: 'ion-wifi', nodeType: '3' },
                        { id: '4', name: '烟雾报警器', icon: 'ion-flame', nodeType: '4' },
                        { id: '5', name: '温度传感器', icon: 'ion-bonfire', nodeType: '5' }
        ]
    };
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
    //该账号所有主机
    $scope.DevicesViewModel = {
        devices:null
    };
    //当前使用主机的节点(与上重复？)
    $scope.NodesViewModel ={
        nodeType:"",
        nodes:null,
        nodeList:[
                    { id: '1', name: '电子钥匙', icon: 'ion-locked',  nodeType: '1'},
                    { id: '2', name: '门磁', icon: 'ion-magnet', nodeType: '2'},
                    { id: '3', name: '红外感应 ', icon: 'ion-wifi', nodeType: '3'},
                    { id: '4', name: '烟雾报警器', icon: 'ion-flame',  nodeType: '4'},
                    { id: '5', name: '温度传感器', icon: 'ion-bonfire',  nodeType: '5'}
        ]
    
    }
    //所有节点
    $scope.AllAlarmsViewModel = { 
        alarms: null,
        rows:null,
        enableMore:true
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
        notifyVib: 0,
        notifyPush :0
    };
    //正在编辑用户类
    $scope.UserViewModel = { user: null };
    $scope.LoginUserViewModel = {loginuser:null};
    //支付类
    $scope.PurchasingDevice = {device:{}};

    //操作记录条数
    $scope.StackViewModel = {
        manustack:null,
        options:10,
        enableMore:true
    };
    //套餐list
    $scope.MenuViewModel ={
      menu:null,
      usingmenu:null  
    };
    //验证码
    $scope.ValidInfoViewModel ={
        PhoneNum: null, ValidCode: null, newPW: null
    };
    //smartconfig
    $scope.NetConfigViewModel = {
      SSID:null,password:null,GatewayIP:null  
    };
    
    $scope.AdvertiseViewModel = {
      ADs:null  
    };
    $scope.NewDeviceViewModel = {
      deviceId:null    
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

    // var timespaned = 0;
    //更新device信息
    $scope.updateDeviceData = function () {
        //timespaned++;
        var devicelisturl = '/device/list';
        var devicelistreqd = { "cust_id": $scope.global.cust_id };
        var devicelistreq = httpReqGen(devicelisturl, devicelistreqd);

        $http(devicelistreq).success(function (data) {
            //取返回值有效data
            var resdata = resResult(data);
            //DevicesViewModel.devices 用户下所有主机
            $scope.DevicesViewModel.devices = null;
            $scope.DevicesViewModel.devices = resdata;
            var sResData = null;
            if($scope.UsingDeviceViewModel.device == null){
                $scope.UsingDeviceViewModel.device = resdata[0];
                sResData = resdata[0];
            }
            else{
                var queryResult = Enumerable.From(resdata)
                    .Where(function (x) { return x.device_id == $scope.UsingDeviceViewModel.device.device_id })
                    .ToArray();
                    if(queryResult == null)
                        $scope.showAlert("服务器故障","Main-updateDeviceData-主机列表被恶意改动");
                sResData = queryResult[0];
                // console.log(queryResult[0].device_id);
                // console.log(queryResult[0].device_name);
            }
            //UsingDeviceViewModel.device 当前使用主机
            if (sResData)
            {
                $scope.UsingDeviceViewModel.device = sResData;
                //布防状态alert_status 1布防 0撤防
                if (sResData.alert_status == 0) {
                    $scope.UsingDeviceViewModel.device.alert_status = false;
                    $scope.UsingDeviceViewModel.device.titleText = "撤防";
                }
                else {
                    $scope.UsingDeviceViewModel.device.alert_status = true;
                    $scope.UsingDeviceViewModel.device.titleText = "布防";
                }
                //状态status 1在线 0掉线
                if (sResData.status == 1) {
                  $scope.UsingDeviceViewModel.device.status = true;    
                  $scope.OverViewViewModel.Status = "您当前的主机正在正常运行";
                  $scope.UsingDeviceViewModel.device.icon = "ion-link";
                }

                else {
                    $scope.UsingDeviceViewModel.device.status = false;    
                    $scope.OverViewViewModel.Status = "您当前的主机已经失联";
                    $scope.UsingDeviceViewModel.device.icon = "ion-alert-circled";
                }
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
                if(nodesdata.length != 0){
                    for(var i = 0; i < nodesdata.length; i++){
                        nodesdata[i].alert_status = (nodesdata[i].alert_status == 0) ? false : true;
                    }
                }
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
                    
                    // //模拟数据
                    // alarmsdata = [{ "device_id": "7CEC793924B8", "node_type": 4, "node_id": 1, "alert_type": 1, "alert_time": "2011-03-09 12:23:31", "device_name": "fakename" }
                    //                          , { "device_id": "7CEC793924B8", "node_type": 3, "node_id": 2, "alert_type": 2, "alert_time": "2012-03-09 12:23:31", "device_name": "fakename" },
                    //                          { "device_id": "7CEC793924B8", "node_type": 1, "node_id": 3, "alert_type": 3, "alert_time": "2013-03-09 12:23:31", "device_name": "fakename" },
                    //                          { "device_id": "7CEC793924B8", "node_type": 1, "node_id": 4, "alert_type": 4, "alert_time": "2013-03-09 12:23:31", "device_name": "fakename" }];
                     //if (timespaned > 2)
                     //   alarmsdata = [];
                    //报警数据map
                    alarmDataMap(alarmsdata);
                    //AlarmsViewModel.nodes 当前主机下所有报警节点
                    $scope.AlarmingViewModel.alarms = alarmsdata;

                    //首页设备报警颜色
                    alarmCoreJudge(alarmsdata);

                    // //报警概要
                    // alarmDescGen(alarmsdata, $scope);

                }).error(function () {
                    $scope.showAlert("frame-error","overview-updateDeviceData-alarmlist");
                });
            }).error(function () {
                $scope.showAlert("frame-error","overview-updateDeviceData-nodelist");
            });
        }).error(function () {
            $scope.showAlert("frame-error","overview-updateDeviceData-devicelist");
        });
    };
    // An alert dialog
    $scope.showAlert = function(alertMain,alertSub) {
       var alertPopup = $ionicPopup.alert({
         title: alertMain,
         template: alertSub,
         okText: '确定'
       });

       alertPopup.then(function(res) {
         console.log('an alert called');
       });
    };    
    
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////


//首页 app.overview overview.html
.controller('OverViewCtrl', function ($q, $scope, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover, $state, $timeout, $interval, $http, $ionicLoading, locals, $ionicNavBarDelegate) {

    //页面初始化方法
    $scope.DataReq = function () {     
        if (!locals.get("cust_id",""))
            $state.go("app.login"); 

        //预处理主机过期信息以及主机绑定信息
        //该方法不做更新VM
        var armurl = '/device/list';
        var armreqd = { "cust_id": $scope.global.cust_id};
        var armreq = httpReqGen(armurl, armreqd);

        $http(armreq).success(function (data) {
            console.log(data.result);
            //返回0000
            if (data.result.code == "0000") {
                //首次登入(UsingDeviceViewModel == null)
                if($scope.UsingDeviceViewModel.device == null){
                    //deviceList为空 没有绑定主机
                    if(data.result.data.length == 0){
                        $scope.showAlert("系统提示","您的用户未绑定任何主机，请先绑定一台主机");
                        $state.go('app.devicemanage');
                    }
                    //只有1台主机
                    else if(data.result.data.length == 1){
                        var expdate = new Date(data.result.data[0].expire_time);
                        var today = new Date();
                        if(expdate < today){
                            $scope.showAlert("系统提示","当前的主机套餐已经过期，请购买套餐以保证继续使用");
                            $state.go("app.purchaseinfo");
                        }
                    }
                    else{
                        var expdate = new Date(data.result.data[0].expire_time);
                        var today = new Date();
                        if(expdate < today){
                            $scope.showAlert("系统提示","当前的主机套餐已经过期，请切换其他主机或购买套餐");
                            $state.go("app.devicemanage");
                        }
                    }                        
                }
                //再次进入(UsingDeviceViewModel != null)
                else{
                    //deviceList为空 没有绑定主机
                    if(data.result.data.length == 0){
                        $scope.showAlert("系统提示","您的用户未绑定任何主机，请先绑定一台主机");
                        $state.go('app.devicemanage');
                    }
                    //只有1台主机
                    else if(data.result.data.length == 1){
                        var queryResult = Enumerable.From(data.result.data)
                            .Where(function (x) { return x.device_id == $scope.UsingDeviceViewModel.device.device_id })
                            .ToArray();
                            if(queryResult == null) 
                                $scope.showAlert("系统提示","切换主机信息请求失败");
                        var sResData = queryResult[0];

                        var expdate = new Date(sResData.expire_time);
                        var today = new Date();
                        if(expdate < today){
                            $scope.showAlert("系统提示","当前的主机套餐已经过期，请购买套餐以保证继续使用");
                            $state.go("app.purchaseinfo");
                        }
                    }
                    else{
                        var queryResult = Enumerable.From(data.result.data)
                            .Where(function (x) { return x.device_id == $scope.UsingDeviceViewModel.device.device_id })
                            .ToArray();
                            if(queryResult == null) 
                                $scope.showAlert("系统提示","切换主机信息请求失败");
                        var sResData = queryResult[0];

                        var expdate = new Date(sResData.expire_time);
                        var today = new Date();
                        if(expdate < today){
                            $scope.showAlert("系统提示","当前的主机套餐已经过期，请切换其他主机或购买套餐");
                            $state.go("app.devicemanage");
                        }
                    }  
                }
            }
            else {
                $state.go("app.login"); 
                //$scope.showAlert("服务器故障",data.result.msg);
            }
        }).error(function () {
            $scope.showAlert("frame-error","OverViewCtrl-DataReq-device-expaire-time-request-error");
        });       

        ////初始化cubiccore 九宫格布局组件
        //$('#cubicCore').addClass("blockLine-middle").addClass("item").addClass("cubicNormal");  

        //刷新data
        timer = $interval($scope.updateDeviceData, 5000);

        ////取消刷新
        //$timeout(function () { $interval.cancel(timer) }, 15000);

        startLoading($ionicLoading);
        console.log(locals.get("cust_id","0"));
        if (locals.get("cust_id","0") == "0")
            $state.go("app.login"); 
       
        $ionicSideMenuDelegate.canDragContent(true);

        //更新device node alarm
        $scope.updateDeviceData();

        $scope.OverViewViewModel.JustLogin = false;
    }
    $timeout(function () {
        $ionicLoading.hide();
    }, 1000);

    
    //InAppBrowser
    $scope.openUrl=function(url){
        if (!cordova.InAppBrowser) {
            return;
        }
        // toolbar=yes 仅iOS有效,提供关闭、返回、前进三个按钮
        // toolbarposition=top/bottom 仅iOS有效,决定toolbar的位置
        // closebuttoncaption=关闭 仅iOS有效
        cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
        }
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
                    $scope.showAlert("服务器故障",data.result.msg);
                }
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.alert_status ? "布防" : "撤防";
                $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.alert_status ? "ion-locked" : "ion-unlocked";
            }).error(function () {
                $scope.showAlert("服务器故障",data.result.msg);
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
                else
                    $scope.showAlert("用户信息",data.result.msg);

                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.alert_status ? "布防" : "撤防";
                $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.alert_status ? "ion-locked" : "ion-unlocked";
            }).error(function () {
                $scope.showAlert("frame-error","OverViewCtrl-armStatusBtnChange-request-error");
            });
        }
    };
    $scope.armStatusToggleChanged = function () {
        // $scope.UsingDeviceViewModel.device.alert_status = !$scope.UsingDeviceViewModel.device.alert_status;
        //若当前撤防状态则布防
        if ($scope.UsingDeviceViewModel.device.alert_status) {
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
                else
                    $scope.showAlert("用户信息",data.result.msg);
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.alert_status ? "布防" : "撤防";
            }).error(function () {
                $scope.showAlert("frame-error","OverViewCtrl-armStatusBtnChange-request-error");
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
                else
                    $scope.showAlert("用户信息",data.result.msg);
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.alert_status ? "布防" : "撤防";
            }).error(function () {
                $scope.showAlert("frame-error","OverViewCtrl-armStatusBtnChange-request-error");
            });
        }
    };

    $scope.Emergency = function (idx,alertMain,alertSub) {
        var xsel = "#item-" + idx + " .sector";
        $(xsel).css("fill","#fff");
           var confirmPopup = $ionicPopup.confirm({
             title: alertMain,
             template: alertSub,
             cancelText: '取消',
             okText: '确定'
           });

           confirmPopup.then(function(res) {
             if(res) {
               console.log('yep');
             } else {
               console.log('nope');
             }
           });
    };
    $scope.logandalert = function(){
        $scope.showAlert("nothing","for show");
    }
    $scope.touchEv = function(idx){
        var xsel = "#item-" + idx + " .sector";
        $(xsel).css("fill","#c5c3c3");
        console.log("just touch");
    }
    $scope.releaseEv = function(idx){
        var xsel = "#item-" + idx + " .sector";
        $(xsel).css("fill","#fff");
        console.log("released");
    }
    $scope.clickEv = function(idx){
        var xsel = "#item-" + idx + " .sector";
        $(xsel).css("fill","#fff");
        console.log("clicked");
    }


    $scope.intBrowser = function(url){
        window.open(url, '_blank', 'location=yes');
    };     
    //说明modal
    $scope.openModal = function () {
        startModal($ionicLoading);

        $timeout(function () {
            $ionicLoading.hide();
        }, 2000);
    }
    $scope.myGoBack = function () {
        $ionicNavBarDelegate.back();
    };
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    //圆盘按钮controller
    $scope.nodeTypeTap = function(idx,route, detType,detTypeId) {
        //$scope.UsingNodesViewModel.nodes = nodes;
        var xsel = "#item-" + idx + " .sector";
        $(xsel).css("fill","#c5c3c3");
        $scope.UsingNodesViewModel.nodeType = detType;
        $scope.UsingNodesViewModel.nodeTypeId = detTypeId;
        
        $state.go(route);
    };
    $scope.nodeTypeTapAll = function(idx,route) {
        //$scope.UsingNodesViewModel.nodes = nodes;
        var xsel = "#item-" + idx + " .sector";
        $(xsel).css("fill","#c5c3c3");     
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
                $scope.showAlert("frame-error","NodesCtrl-init-request-error");
            });
        }
        $scope.startPairing = function(){
            //获取当前节点list
            var beforeLength = $scope.NodesViewModel.nodes.length;

            startNodePairing($ionicLoading);

            //xw需求，刚进入是也调一次？
            $timeout(function () {
                var nodelisturl = '/node/list';
                var dvcid = $scope.UsingDeviceViewModel.device.device_id;
                var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
                var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

                $http(nodelistreq).success(function (data) {
                    //取返回值有效data
                    var nodesdata = resResult(data);
                    //新节点list
                    var afterLength = nodesdata.length;
                    //NodesViewModel.nodes 当前主机下所有节点
                    $scope.NodesViewModel.nodes = nodesdata;
                    //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                    $scope.UsingNodesViewModel.nodes = nodesdata;

                    if (beforeLength == afterLength)
                        $scope.showAlert("用户信息","无节点更新");
                    else
                        $scope.showAlert("用户信息","节点信息已更新");
                }).error(function () {
                    $scope.showAlert("frame-error","NodesCtrl-startPairing-request-error");
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
                    
                    $state.go("app.nodes");
                }
                else
                    $scope.showAlert("用户信息",data.result.msg);
            }).error(function () {
                $scope.showAlert("frame-error","NodesCtrl-removeNode-request-error");
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
                $scope.showAlert("用户信息","节点名称已更改");
                $state.go("app.nodes");
          }
          else
            $scope.showAlert("用户信息",data.result.msg);
      }).error(function () {
          $scope.showAlert("frame-error","NodesCtrl-submitEdit-request-error");
      });
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//用户 app.usersetting usersetting.html
.controller('usersettingCtrl', function ($scope, $state, locals, $ionicSideMenuDelegate, $interval, $ionicPopup) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.logout = function () {
    ////取消刷新
        if("undefined" != typeof(timer)){
            $interval.cancel(timer);
        }
    //alert(locals.get("cust_id",""));
    //存储数据
    //locals.set("username","0");
    locals.set("cust_id", "0");
    console.log('cust_id: ' + locals.get("cust_id", ""));
    $ionicSideMenuDelegate.canDragContent(false);

    var confirmPopup = $ionicPopup.confirm({
          title: '退出',
          template: "确定退出登录吗？", 
          cancelText: '取消',
          okText: '确定'
      });
    confirmPopup.then(function (res) {
          if (res) {
            $state.go('app.login');
          } else {
            // 取消退出
          }
      });
  }
})
.controller('MaintananceCtrl', function ($scope, $state, locals,$http) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");

    $scope.GuestSevice = { Maintanance: null };

    $scope.maintananceSubmit = function () {
        //alert(locals.get("cust_id", ""));
        //报修申请
        var url = '/device/repairs';
        var reqd = {cust_id:$scope.global.cust_id, device_id:$scope.UsingDeviceViewModel.device.device_id,
            contact:$scope.GuestSevice.Maintanance.phone,
            describe:$scope.GuestSevice.Maintanance.deviceAddress,
            visiting_time:$scope.GuestSevice.Maintanance.time};
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {
           //取返回值有效data
           if (data.result.code == "0000") {
               $scope.showAlert("用户信息","报修已提交");
               $state.go("app.settings");
           }
           else
               $scope.showAlert("用户信息",data.result.msg);
        }).error(function () {
           $scope.showAlert("frame-error","NodesCtrl-maintananceSubmit-request-error");
        });

    }
})

.controller('AlarmsCtrl', function ($scope, $state, locals, $http,$ionicActionSheet, $ionicPopup, $timeout) {
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
               totalPages = validData.totalPage;
               data = validData.dataList;
                $scope.AllAlarmsViewModel.alarms = data;
                $scope.AllAlarmsViewModel.enableMore = (validData.totalCount > validData.page * validData.pageSize);
           }
           else
            $scope.showAlert("用户信息","data.result.msg");
        }).error(function () {
            $scope.showAlert("frame-error","AlarmsCtrl-alarmInit-request-error");
        });

    }

    $scope.loadMoreAlarms = function () {
        currentPage ++;
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
               data = validData;
                $scope.AlarmingViewModel.alarms = data;
           }
           else
               $scope.showAlert("用户信息","data.result.msg");
        }).error(function () {
           $scope.showAlert("frame-error","AlarmsCtrl-alarmInit-request-error");
        });

    }    
    $scope.sendAck = function(alarm){

       var confirmPopup = $ionicPopup.confirm({
         title: "确定知悉此条报警",
         template: "发送确认",
         cancelText: '取消',
         okText: '确定'
       });

       confirmPopup.then(function(res) {
         if(res) {
             var url = '/device/alert/handle';
            var reqd = {"alert_id": alarm.alert_id,"node_id":alarm.node_id};
            
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                alarm.opt_result = 1;
               //取返回值有效data
               if(data.result.code == "0000")
                    $scope.showAlert("用户信息","报警已获悉");
               else
                   alert(data.result.msg);
            }).error(function () {
               $scope.showAlert("frame-error","AlarmsCtrl-sendAck-request-error");
            });
           console.log('yep');

           // //再次获取alarm list
            //获取所有报警记录
            var url = '/device/alert';
            var reqd = {"cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id};
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                    //获取所有报警记录
                    var url = '/device/alert/record';
                    var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, 
                    "page": currentPage, "rows": $scope.AllAlarmsViewModel.rows };
                    var req = httpReqGen(url, reqd);

                    $http(req).success(function (data) {
                    //取返回值有效data
                    var validData = resResult(data);
                    if (validData) {
                        //simul
                        totalPages = validData.totalPage;
                        data = validData.dataList;
                            $scope.AllAlarmsViewModel.alarms = data;
                    }
                    else
                        alert(data.result.msg);
                    }).error(function () {
                    alert("服务器请求故障");
                    });
            }).error(function () {
            alert("服务器请求故障");

            });
         } else {
           console.log('nope');
         }
       });
       
       
       
       
        // var hideSheet = $ionicActionSheet.show({
        //             buttons: [
        //                 { text: 'Send Ack' }
        //             ],
        //             titleText: 'operations',
        //             cancelText: 'Cancel',
        //             cancel: function() {
        //             },
        //             buttonClicked: function(index) {
        //                          var url = '/device/alert/handle';
        //                         var reqd = {"alert_id": alarm.alert_id};
                                
        //                         var req = httpReqGen(url, reqd);

        //                         $http(req).success(function (data) {
        //                             alarm.opt_result = 1;
        //                            //取返回值有效data
        //                            if(data.result.code == "0000")
        //                                 $scope.showAlert("用户信息","报警已获悉");
        //                            else
        //                                alert(data.result.msg);
        //                         }).error(function () {
        //                            $scope.showAlert("frame-error","AlarmsCtrl-sendAck-request-error");
        //                         });
                        
        //                     // //再次获取alarm list
        //                     // //获取所有报警记录
        //                     // var url = '/device/alert';
        //                     // var reqd = {"cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id};
        //                     // var req = httpReqGen(url, reqd);

        //                     // $http(req).success(function (data) {
        //                     //         //获取所有报警记录
        //                     //         var url = '/device/alert/record';
        //                     //         var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, 
        //                     //         "page": currentPage, "rows": $scope.AllAlarmsViewModel.rows };
        //                     //         var req = httpReqGen(url, reqd);

        //                     //         $http(req).success(function (data) {
        //                     //         //取返回值有效data
        //                     //         var validData = resResult(data);
        //                     //         if (validData) {
        //                     //             //simul
        //                     //             totalPages = validData.totalPage;
        //                     //             data = validData.dataList;
        //                     //                 $scope.AllAlarmsViewModel.alarms = data;
        //                     //         }
        //                     //         else
        //                     //             alert(data.result.msg);
        //                     //         }).error(function () {
        //                     //         alert("服务器请求故障");
        //                     //         });
        //                     // }).error(function () {
        //                     // alert("服务器请求故障");
        //                     // });
                            
        //                 return true;
        //             }
        //         });
        // $state.go("app.alarms");
    }
    $scope.acknowledgeTypeAlarms = function(nodetypeid){
       var confirmPopup = $ionicPopup.confirm({
         title: "确定知悉此条报警",
         template: "发送确认",
         cancelText: '取消',
         okText: '确定'
       });

       confirmPopup.then(function(res) {
         if(res) {
             var url = 'asdasdsadasdasdsa';
            var reqd = {"type_id": nodetypeid,"device_id":$scope.UsingDeviceViewModel.device.device_id};
            
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                alarm.opt_result = 1;
               //取返回值有效data
               if(data.result.code == "0000")
                    $scope.showAlert("用户信息","报警已获悉");
               else
                   alert(data.result.msg);
            }).error(function () {
               $scope.showAlert("frame-error","AlarmsCtrl-acknowledgeTypeAlarms-request-error");
            });

            $scope.updateDeviceData();
         } else {
           console.log('nope');
         }
       });
    }
    $scope.acknowledgeAllAlarms = function(){
        var confirmPopup = $ionicPopup.confirm({
         title: "确定知悉此条报警",
         template: "发送确认",
         cancelText: '取消',
         okText: '确定'
       });

       confirmPopup.then(function(res) {
         if(res) {
             var url = 'asdasdsadasdasdsa';
            var reqd = {"device_id":$scope.UsingDeviceViewModel.device.device_id};
            
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                alarm.opt_result = 1;
               //取返回值有效data
               if(data.result.code == "0000")
                    $scope.showAlert("用户信息","报警已获悉");
               else
                   alert(data.result.msg);
            }).error(function () {
               $scope.showAlert("frame-error","AlarmsCtrl-acknowledgeTypeAlarms-request-error");
            });

            $scope.updateDeviceData();
         } else {
           console.log('nope');
         }
       });
    }
    $scope.doRefresh = function() {  
        $timeout( function() {  
                //获取所有报警记录
            var url = '/device/alert/record';
            var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": 1, "rows": $scope.AllAlarmsViewModel.rows };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
            //取返回值有效data
            var validData = resResult(data);
            if (validData) {
                //simul
                totalPages = validData.totalPage;
                data = validData.dataList;
                    $scope.AllAlarmsViewModel.alarms = data;
                    $scope.AllAlarmsViewModel.enableMore = (validData.totalCount > validData.page * validData.pageSize);
            }
            else
                $scope.showAlert("用户信息",data.result.msg);
            }).error(function () {
                $scope.showAlert("frame-error","AlarmsCtrl-doRefresh-request-error");
            });
            $scope.$broadcast('scroll.refreshComplete');  
        
        }, 3000);  
            
    };  
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
      var reqd = { "cust_id": $scope.global.cust_id, "tel": $scope.UserViewModel.user.phone, "email": $scope.UserViewModel.user.email, "address": $scope.UserViewModel.user.address };
      var req = httpReqGen(url, reqd);
      $http(req).success(function (data) {
          var validData = resResult(data);
          if (validData) {
            $scope.showAlert("用户信息","用户信息已更改");
            $state.go("app.dashboard.usersetting");
          }
          else {
              $scope.showAlert("用户信息",data.result.msg);
          }
      }).error(function () {
          $scope.showAlert("frame-error","AlarmsCtrl-userSubmit-request-error");
      });
  };
})
/////////////////////////////////////////////////
///
.controller('findPasswordCtrl', function ($scope, $q, $http, $state, locals, $ionicNavBarDelegate) {
    
  $scope.changePW2 = function () {
      if (!$scope.ValidInfoViewModel.newPW) {
        $scope.showAlert("用户信息","请输入新密码");
      return;
    }
      if (!$scope.ValidInfoViewModel.ValidCode) {
            $scope.showAlert("用户信息","请输入验证码");
            return;
        }
        var url = '/account/findpwd';
        var reqd = {
            "phone": $scope.ValidInfoViewModel.PhoneNum,
            "login_pwd": hex_md5($scope.ValidInfoViewModel.newPW).toUpperCase() ,
            "sms_captcha": $scope.ValidInfoViewModel.ValidCode
        };
        var req = httpReqGen(url, reqd);
        $http(req).success(function (data) {
            var validData = resResult(data);
            if (validData) {
                $scope.showAlert("用户信息","用户信息已修改");
                $state.go("app.login");
            }
            else {
                $scope.showAlert("用户信息",data.result.msg);
            }
        }).error(function () {
            $scope.showAlert("frame-error","findPasswordCtrl-changePW2-request-error");
        });




  };

  $scope.sendValid = function () {
      var apibranch = 'sms/captcha/findpwd';
      var requestObject = {
          phone: $scope.ValidInfoViewModel.PhoneNum
      };
      var req = httpReqGen(apibranch, requestObject);

      $http(req).then(function (response) {
          console.log(response);
          var result = response.data.result;
          if (result.code == 0000) {
              
          } else {
            $scope.showAlert("用户信息",result.msg);
          }
      }, function (error) {
          $scope.showAlert("frame-error","findPasswordCtrl-sendValid-request-error");
      });
  };

  $scope.pageJump = function (url) {
      $state.go(url);
  };

  $scope.myGoBack = function () {
      $ionicNavBarDelegate.back();
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
        $scope.showAlert("用户信息","请填写");
        return;
    }
    if($scope.codeform.newPW != $scope.codeform.confirmPW) {
        $scope.showAlert("用户信息","新密码输入不一致");
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
            $scope.showAlert("用户信息","密码已修改");
            $state.go("app.usersetting");           
        }
        else{
            $scope.showAlert("用户信息",response.data.msg);
        }
      }
      else
        $scope.showAlert("用户信息","PasswordCtrl-changePW-request-error");
      deferred.resolve();
    }, function(error) {
        $scope.showAlert("frame-error","PasswordCtrl-changePW-request-error");
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

      }).error(function () {
        $scope.showAlert("frame-error","VersionCtrl-init-request-error");
       });

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
    ///account/setting push vib
  if (!locals.get("cust_id",""))
      $state.go("app.login");

  $scope.versionToggleChanged = function () {
      var result = ($scope.TempToggle.notifyVersion) ? true : false;
      locals.set("n_version", result);
      $scope.showAlert("用户信息",$scope.TempToggle.notifyVersion);
  }

})
.controller('MessageSettingCtrl', function ($scope, $state, locals,$http) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");
    $scope.vibToggleChanged = function () {
        var pushr = ($scope.TempToggle.notifyPush) ? 1 : 0;
        var vibr = ($scope.TempToggle.notifyVib) ? 1 : 0;
        
        var url = '/account/setting';
        var reqd = {"cust_id":$scope.global.cust_id , "push": pushr, "vib": vibr };
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {
            if(data.result.code == '0000'){
                $scope.showAlert("用户信息","震动设置已保存");
            }
            else{
                $scope.showAlert("用户信息",data.result.msg);
                $scope.TempToggle.notifyVib = !$scope.TempToggle.notifyVib;
            }

        }).error(function () { 
            $scope.showAlert("frame-error","MessageSettingCtrl-vibToggleChanged-request-error");
            $scope.TempToggle.notifyVib = !$scope.TempToggle.notifyVib;
        });
    }
    $scope.pushToggleChanged = function () {
        var pushr = ($scope.TempToggle.notifyPush) ? 1 : 0;
        var vibr = ($scope.TempToggle.notifyVib) ? 1 : 0;
        
        var url = '/account/setting';
        var reqd = {"cust_id":$scope.global.cust_id , "push": pushr, "vib": vibr };
        var req = httpReqGen(url, reqd);

        $http(req).success(function (data) {

            if(data.result.code == '0000'){
                $scope.showAlert("用户信息","震动设置已保存");
            }
            else{
                $scope.showAlert("用户信息",data.result.msg);
                $scope.TempToggle.notifyPush = !$scope.TempToggle.notifyPush;
            }

        }).error(function () { 
            $scope.showAlert("frame-error","MessageSettingCtrl-pushToggleChanged-request-error");
            $scope.TempToggle.notifyPush = !$scope.TempToggle.notifyPush;
        });
    }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////

////////////////////
//选择主机 app.deviceselect deviceselect.html
// .controller('DeviceSelectCtrl', function($scope, $state) {
//   $scope.data = {};
//   //console.log($scope.UsingDeviceViewModel.name);
//   $scope.init = function(){
    
//   }
//   $scope.currentDeviceChange = function (device) {
//     //对主机信息进行判断
//     var expdate = new Date(device.expire_time);
//     var today = new Date();
//     if(expdate < today){
//         $scope.showAlert("用户信息","您所选的主机套餐已经过期，请购买套餐或更换其它主机");
//     }

//       $scope.UsingDeviceViewModel.device = device;
//       console.log(device.device_id);
//       //var desc = "当前主机切换至  " + device.device_name;
//       //alert(desc);
//   };
//   $scope.stateJump = function (route) {
//       $state.go(route);
//   };
// })

//主机管理 app.devicemanage devicemanage.html
.controller('DeviceMangeCtrl', function ($scope, $state, $http, $cordovaBarcodeScanner) {
    $scope.data = {};
    //console.log($scope.UsingDeviceViewModel.name);
    $scope.init = function () {
        if (!locals.get("cust_id", ""))
            $state.go("app.login");
    }

    $scope.deviceTap = function (route, device) {
        $scope.Temp.EditingDevice = device;
        $state.go(route);
    };

    //通过二维码添加主机
    $scope.addDevicebyBarcode = function () {

        $cordovaBarcodeScanner.scan().then(function (imageData) {

            var deviceId = imageData.text;
            //$state.go("app.deviceBind");
            // $scope.NewDeviceViewModel.deviceId = deviceId;

            var devicename = ""
            //添加主机
            var url = '/device/binding';
            var reqd = { "cust_id": $scope.global.cust_id, "device_id": deviceId, "device_name": devicename };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                var validData = resResult(data);
                if (data.result.code == "0000") {
                    //更新device node alarm
                    $scope.updateDeviceData();
                    $scope.showAlert("用户信息","主机添加并绑定成功");
                }
                else{
                    $scope.showAlert("用户信息","主机添加并绑定失败"+data.result.msg);
                }
            }).error(function () {
                $scope.showAlert("frame-error","DeviceMangeCtrl-addDevicebyBarcode-request-error");
            });


            console.log("Barcode Format -> " + imageData.format);

            console.log("Cancelled -> d" + imageData.cancelled);

        }, function (error) {
            $scope.showAlert("用户信息","主机添加并绑定失败，扫描错误");
            console.log("An error happened -> " + error);
        });
    };

    //选择当前主机
    $scope.currentDeviceChange = function (device) {
        //对主机信息进行判断
        var expdate = new Date(device.expire_time);
        var today = new Date();
        if(expdate < today){
            $scope.showAlert("用户信息","您所选的主机套餐已经过期，请购买套餐或更换其它主机");
        } else {
            $scope.showAlert("用户信息","切换成功!");
        }

        $scope.UsingDeviceViewModel.device = device;
        console.log(device.device_id);
        //var desc = "当前主机切换至  " + device.device_name;
        //alert(desc);
    };
      $scope.stateJump = function (route) {
         $state.go(route);
         };
})

.controller('DeviceDetailsCtrl', function ($scope, $state) {
    $scope.temp = { name: $scope.Temp.EditingDevice.device_name, id: $scope.Temp.EditingDevice.device_id };
    $scope.updateDeviceInfo = function () {
        var datata = $scope.temp;
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
                $scope.showAlert("用户信息","主机名称已更改");
                $scope.updateDeviceData();
                $state.go("app.devicemanage");
            }
            else
                $scope.showAlert("用户信息",data.result.msg);
        }).error(function () {
            $scope.showAlert("frame-error","DeviceEditCtrl-submitEdit-request-error");
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
                $scope.showAlert("用户信息","该主机已解绑");
                $scope.updateDeviceData();
                $state.go("app.devicemanage");
            }
            else
                $scope.showAlert("用户信息",data.result.msg);
        }).error(function () {
            $scope.showAlert("frame-error","DeviceEditCtrl-disbinddevice-request-error");
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
.controller('PurchaseCtrl', function($scope,$state,$ionicActionSheet,$ionicLoading,$http) {
  $scope.init = function(){
                var simuloptiondata = [{"name":"套餐1", "desc":"ionicActionSheet state account","account":"Linda Smith","licencetime":"2015-04-09", "time":"2014-04-10 12:23:23","expenses":"99.99"},
                {"name":"套餐2", "desc":"ionicActionSheet state account","account":"Linda Smith","licencetime":"2015-04-09", "time":"2014-04-10 12:23:23","expenses":"99.99"},
                {"name":"套餐3", "desc":"ionicActionSheet state account","account":"Linda Smith","licencetime":"2015-04-09", "time":"2014-04-10 12:23:23","expenses":"99.99"}];
            //套餐api
            var url = '/trade/plan';
            var reqd = { };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                var validData = resResult(data);
                if (validData) {
                    $scope.MenuViewModel.menu = validData;
                }
            }).error(function () { 
                $scope.showAlert("frame-error","PurchaseCtrl-init-request-error");
            });
            
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
     
   //测试套餐ID: "736070745670844416", "736264452149002240"
    $scope.purchase = function(){
        //alert("alipay");
        var requestData = {
          cust_id: $scope.global.cust_id,
          pay_channel: 'alipay',
          plan_id: '736264452149002240'
        };

        var apibranch = '/trade/submit';
        var request = httpReqGen(apibranch,requestData);

        $http(request).then(function(response) {
            var purdata = response.data.result;
            console.log(purdata);
            var signStr = purdata.data.sign;
            console.log(signStr);

            //调用支付宝接口，传入payInfo = signStr.
            var alipayClass = navigator.alipay;

            alipayClass.pay({
                    "payInfo":signStr  
            },function(resultStatus){
                $scope.showAlert("用户信息",resultStatus);
              $ionicLoading.show({
                template:"支付宝测试返回结果＝" + resultStatus,
                noBackdrop: true,
                duration: 500
              });
            },function(message){
                $scope.showAlert("用户信息",message);
              $ionicLoading.show({
                template:"支付宝支付失败＝" + message,
                noBackdrop: true,
                duration: 500
              });
            });
        }, function(error) {
            $scope.showAlert("frame-error","PurchaseCtrl-purchase-request-error");
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
    $scope.selectUpdated = function(selValue){
        $scope.StackViewModel.options = selValue;
    };
    $scope.init = function(){
        var manulisturl = '/device/opt/record';
                        var manulistreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, 
                        "page": pageCount, "rows": $scope.StackViewModel.options};
                        var manulistreq = httpReqGen(manulisturl, manulistreqd);

                        $http(manulistreq).success(function (data) {
                            //取返回值有效data
                            var validData = resResult(data);
                                if (validData) {
                                    totalPage = validData.totalPage;
                                    data = validData.dataList;
                                    $scope.StackViewModel.manustack = data;
                                    $scope.StackViewModel.enableMore = (validData.totalCount > validData.page * validData.pageSize);
                                }
                                else
                                    $scope.showAlert("用户信息",data.result.msg);
                            //更新内存的操作记录

                            
                            
                        }).error(function () {
                            $scope.showAlert("frame-error","ManuStackCtrl-init-request-error");
                        });        
    };       

    $scope.loadMoreStackManus = function () {
                pageCount++;
                if (pageCount > totalPage)
                    $scope.showAlert("用户信息","无更多报警");
                else
                    loadMoreStackmanus(pageCount, $scope, $http);
            }
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
        alert(error);
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

          var data = {
              "ssid":$scope.NetConfigViewModel.SSID, 
          "password":$scope.NetConfigViewModel.password, 
          "gateway":$scope.NetConfigViewModel.GatewayIP};
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
            $scope.showAlert("用户信息","手机验证码发送成功");
          else
            $scope.showAlert("用户信息","该手机号码已经注册");
      }).error(function () {
          $scope.showAlert("frame-error","register-sendSMS-request-error");
      });
  }
  $scope.submit = function() {
    if(!$scope.registerData.mobileNo) {
      $scope.showAlert("用户信息","请填写手机号码");
      return;
    }
    if(!$scope.registerData.password) {
      $scope.showAlert("用户信息","请填写密码");
      return;
    }
    if(!$scope.registerData.code) {
      $scope.showAlert("用户信息","请填写验证码");
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
        if (response.data.result.code == "0000"){
            $scope.showAlert("用户信息","注册成功");
            $state.go('app.login');
        }
        else
            $scope.showAlert("用户信息",response.data.result.msg);
    }, function(error) {
        $scope.showAlert("frame-error","register-submit-request-error");
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
    var name = "";
    var pw = "";
    if(locals.get("username", "") != "")
        name = locals.get("username", "");
    if(locals.get("password", "") != "")
        pw = locals.get("password", "");

    $scope.loginData = { "username": name , "password":pw};
  $scope.login = function () {
      if (!$scope.loginData.username) {
          $scope.showAlert("用户信息","请输入用户名");
          return;
      }
      if (!$scope.loginData.password) {
          $scope.showAlert("用户信息","请输入密码");
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
              $scope.LoginUserViewModel.loginuser = result.data;
              //存储数据
              locals.set("username", requestData.phone);
              locals.set("password", $scope.loginData.password);
              locals.set("cust_id", result.data.cust_id);
              //读取数据
              //console.log(locals.get("username", ""));
              //console.log(locals.get("cust_id", ""));
              $scope.OverViewViewModel.JustLogin = true;
              
              
              $scope.TempToggle.notifyPush = (result.data.push == 1)? true:false;
              $scope.TempToggle.notifyVib = (result.data.vib == 1)? true:false;
              
              //判断是否有主机，主机是否过期

              $state.go('app.dashboard.overview');
          } else {
              $scope.showAlert("用户信息",result.msg);
          }
      }, function (error) {
          $scope.showAlert("frame-error","login-login-request-error");
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
  };
      //AD
    $scope.adRequire = function(){
                //广告image src
            var srcurl = '/app/launcher';
            var srcreqd = { "platform": "iOS"};
            var srcreq = httpReqGen(srcurl, srcreqd);
            var simulAd = [{ "ad_img":"http://i1.pixiv.net/c/600x600/img-master/img/2016/09/18/21/16/45/59049424_p0_master1200.jpg",
                                        "stop_time":3,
                                        "ad_href":"http://www.qq.com",
                                        "title":"test1"},
                                    { "ad_img":"http://i2.pixiv.net/c/600x600/img-master/img/2016/10/04/21/33/24/59307581_p0_master1200.jpg",
                                    "stop_time":3,
                                    "ad_href":"http://www.baidu.com",
                                    "title":"test2"},
                                    { "ad_img":"http://i4.pixiv.net/c/600x600/img-master/img/2016/09/22/20/37/19/59114807_p0_master1200.jpg",
                                    "stop_time":3,
                                    "ad_href":"http://www.sina.com",
                                    "title":"test3"}];

            $http(srcreq).success(function (data) {
                //返回0000
                if (data.result.code == "0000") {
                    //更新device node alarm
                    // AdvertiseViewModel.ADs = data.result.data;
                    $scope.AdvertiseViewModel.ADs = simulAd;
                }
                  
                else {
                    $scope.showAlert("用户信息",data.result.msg);
                }
            }).error(function () {
                $scope.showAlert("frame-error","login-adRequire-request-error");
            });
    };
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
    var url = 'http://t.xinlaihome.cn:8081/xinlai' + apibranch + '?req_no=' + code;
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
    var url = 'http://t.xinlaihome.cn:8081/xinlai' + apibranch + '?req_no=' + code;
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
function startNodePairing($ionicLoading) {
    $ionicLoading.show({
        templateUrl: "templates/nodepairing.html",
        content: '节点配对中。。。',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
}

//首页报警颜色显示
function alarmCoreJudge(alarmdata) {
    if (alarmdata.length != 0) {
        if($('#trigger').css("fill") != "rgb(204, 35, 17)"){
                        $('#trigger').css("fill","rgb(204, 35, 17)");
                    }
        $.each(alarmdata, function () {
            switch (this.node_type) {
                case 1:
                    break;
                case 2:
                    if($('#item-1 use').css("fill") != "rgb(204, 35, 17)"){
                        $('#item-1 use').css("fill","rgb(204, 35, 17)");
                    }
                    break;
                case 3:
                    if($('#item-2 use').css("fill") != "rgb(204, 35, 17)"){
                        $('#item-2 use').css("fill","rgb(204, 35, 17)");
                    }
                    break;
                case 4:
                     if($('#item-3 use').css("fill") != "rgb(204, 35, 17)"){
                        $('#item-3 use').css("fill","rgb(204, 35, 17)");
                    }
                    break;
                case 5:
                    if($('#item-8 use').css("fill") != "rgb(204, 35, 17)"){
                        $('#item-8 use').css("fill","rgb(204, 35, 17)");
                    }
                    break;

                default:
                    break;
            }
        });
    }
    else {
        $('#trigger').css("fill","rgb(87, 165, 149)");
        $('.citem use').css("fill","rgb(87, 165, 149)");        
    }
}

// //首页报警概要
// function alarmDescGen(alarmdata, $scope) {
//     if (alarmdata.length != 0)
//         $scope.OverViewViewModel.Status = "您的主机正在报警";
// }







function alarmDataMap(alarmsdata) {
    $.each(alarmsdata, function () {
        switch (this.node_type) {
            case 1:
                this.node_type_cn = "电子钥匙";
                break;
            case 2:
                this.node_type_cn = "门磁";
                break;
            case 3:
                this.node_type_cn = "红外感应";
                break;
            case 4:
                this.node_type_cn = "烟雾报警器";
                break;
            case 5:
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
            var datas = validData.dataList;

            $.each(datas, function () {
                datar.push(this);
            });
            $scope.AllAlarmsViewModel.alarms = datar;
            $scope.AllAlarmsViewModel.enableMore = (validData.totalCount > validData.page * validData.pageSize);
        }
        else
            $scope.showAlert("用户信息",data.result.msg);
    }).error(function () {
        $scope.showAlert("frame-error","AlarmsCtrl-loadMoreAlarms-request-error");
    });
};

function loadMoreStackmanus(currentPage, $scope, $http) {
    //获取所有操作记录
    var url = '/device/opt/record';
    var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": currentPage, "rows": $scope.StackViewModel.options };
    var req = httpReqGen(url, reqd);
    $http(req).success(function (data) {
        //取返回值有效data
        var validData = resResult(data);
        if (validData) {
            //simul
            var datar = $scope.StackViewModel.manustack;
            var datas = validData.dataList;

            $.each(datas, function () {
                datar.push(this);
            });
            $scope.StackViewModel.manustack = datar;
            $scope.StackViewModel.enableMore = (validData.totalCount > validData.page * validData.pageSize);
        }
        else
            $scope.showAlert("用户信息",data.result.msg);
    }).error(function () {
        $scope.showAlert("frame-error","StackMenuCtrl-loadMoreStackmanus-request-error");
    });
};

Date.prototype.format = function (format) {
     var date = {
         "M+": this.getMonth() + 1,
         "d+": this.getDate(),
         "h+": this.getHours(),
         "m+": this.getMinutes(),
         "s+": this.getSeconds(),
         "q+": Math.floor((this.getMonth() + 3) / 3),
         "S+": this.getMilliseconds()
     };
     if (/(y+)/i.test(format)) {
         format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
     }
     for (var k in date) {
         if (new RegExp("(" + k + ")").test(format)) {
             format = format.replace(RegExp.$1, RegExp.$1.length == 1
                             ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
         }
     }
     return format;
 };
